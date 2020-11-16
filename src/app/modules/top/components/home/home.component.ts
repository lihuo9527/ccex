import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../../services/api-client.service';
import { Ticker } from '../../models/view-models';
import { Subscription } from 'rxjs';
import { LocalizationService } from 'src/app/services/localization.service';
import { Router } from '@angular/router';
import { TickersService } from 'src/app/services/tickers.service';
import { getBrowserDevice } from 'src/app/modules/share/methods/methods';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ccex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  private images_zh = [
    {
      icon: 'assets/images/top/newcomer_zh.png',
      url: '/lottos'
    },
    {
      icon: 'assets/images/top/holdglbgiftxrp_zh.png',
      url: '/events'
    },
    {
      icon: 'assets/images/top/usdt_financing_zh.jpg',
      url: '/financing/products_on_sale'
    },
    {
      icon: 'assets/images/top/financing_zh.jpg',
      url: '/financing/products_on_sale'
    },
    {
      icon: 'assets/images/top/referral-commission_zh.png',
      url: '/invite'
    },
  ];
  private images_en = [
    {
      icon: 'assets/images/top/newcomer_en.png',
      url: '/lottos'
    },
    {
      icon: 'assets/images/top/holdglbgiftxrp_en.png',
      url: '/events'
    },
    {
      icon: 'assets/images/top/usdt_financing_en.jpg',
      url: '/financing/products_on_sale'
    },
    {
      icon: 'assets/images/top/financing_en.jpg',
      url: '/financing/products_on_sale'
    },
    {
      icon: 'assets/images/top/referral-commission_en.png',
      url: '/invite'
    },
  ];

  get Images() {
    return this.localize.currentLanguage.id === 'zh_CN' ? this.images_zh : this.images_en;
  }

  currentTabId = 0;
  keyword: string = '';
  currentMarket: string = 'ALL';

  private marketDict: { [key: string]: string[] } = {};

  isLoading = false;

  tickers: Ticker[] = []
  private subscription: Subscription = undefined;
  private imageIndex = 0;
  private coins: any = [];
  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private localize: LocalizationService,
    public tickersService: TickersService
  ) {
  }

  onImageChanged() {
    this.imageIndex = (this.imageIndex + 1) % this.Images.length;
  }
  onClickCarousel() {
    let image = this.Images[this.imageIndex];
    if (!image.url) {
      this.router.navigate(['/settings/overview']);
      return;
    }
    window.open(image.url);
  }

  ngOnInit() {
    let device = getBrowserDevice();
    if (device.isMobile || device.isWechat) return window.location.href = environment.mobileSiteUrl;
    // if (device.isMobile || device.isWechat) {
      // let msgObj = this.localize.LanguageId === 'zh_CN' ? { title: "提示", content: "是否切换到手机版？", confirm: "是", cancel: "否" } : { title: "Tips", content: "Switch to Mobile version?", confirm: "Yes", cancel: "No" };
      // MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.content, msgObj.confirm, msgObj.cancel, () => window.location.href = environment.mobileSiteUrl);
    // }

    this.initialize();
  }

  private async initialize() {
    this.coins = await this.apiClient.fetchCoins();
    await this.fetchTickers();
    this.filterInternal();
    this.subscription = this.tickersService.OnTickerAsObservable.subscribe(() => {
      for (let ticker of this.tickers) {
        let ele = this.tickersService.tickers[ticker.pairStr];
        if (!ele) continue;
        if (ele.close > ticker.price) {
          ticker.Type = 'high';
        } else if (ele.close < ticker.price) {
          ticker.Type = 'low';
        } else {
          ticker.Type = 'equal';
        }
        ticker.price = ele.close;
        ticker.low = ele.low;
        ticker.high = ele.high;
        ticker.change = ele.change;
        ticker.volume = ele.volume;
      }
    });
    this.tickersService.reconnect();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
      this.tickersService.disconnect();
    }
  }

  private async fetchTickers() {
    this.isLoading = true;
    try {
      let markets = await this.apiClient.fetchMarkets();
      for (let market of markets) {
        if (!this.marketDict[market.marketCoin]) {
          this.marketDict[market.marketCoin] = [market.targetCoin];
        } else {
          this.marketDict[market.marketCoin].push(market.targetCoin);
        }
        let ticker = new Ticker(
          market.marketCoin,
          market.targetCoin
        );
        ticker.precision = market.precision;
        ticker.marketSort =  this.getSortOrder(market.marketCoin);
        ticker.targetSort =  this.getSortOrder(market.targetCoin);
        ticker.isFavorite = localStorage.getItem(ticker.pairStr) === 'true' ? true : false;
        this.tickers.push(ticker);
      }
      this.tickers.sort((a, b) => {
        let x = a.marketSort - b.marketSort;
        if (x !== 0) return x;
        return a.targetSort - b.targetSort;
      });
    } catch (e) {
      console.error(e);
    }
    this.isLoading = false;
  }

  getSortOrder(coin: string) {
    for (let element of this.coins){
      if (element._id === coin) return element.sortOrder;
    }
  }

  onTab(index: number) {
    this.keyword = '';
    this.currentTabId = index;
    switch (this.currentTabId) {
      case MarketTabId.ALL:
        this.currentMarket = 'ALL';
        break;
      case MarketTabId.BTC:
        this.currentMarket = 'BTC';
        break;
      case MarketTabId.ETH:
        this.currentMarket = 'ETH';
        break;
      case MarketTabId.USDT:
        this.currentMarket = 'USDT';
        break;
      case MarketTabId.GLB:
        this.currentMarket = 'GLB';
        break;
      case MarketTabId.FAVORITES:
        this.currentMarket = 'FAVORITES';
        break;
      default:
        throw new Error('unknown market tab id: ' + this.currentTabId);
    }
    this.filterInternal();
  }

  filter(event: any) {
    let token: string = event.target.value;
    this.keyword = token.toLowerCase().trim();
    this.filterInternal();
  }

  private filterInternal() {
    let items: any[] = this.tickers;
    for (let item of items) {
      let belongsToThisMarket = this.currentMarket === 'ALL' ? true : item.marketCoin === this.currentMarket;
      let containsKeyword = this.keyword.length === 0 || item.targetCoin.toLowerCase().includes(this.keyword);
      item.isVisible = belongsToThisMarket && containsKeyword || this.currentMarket === 'FAVORITES' && item.isFavorite && containsKeyword;;
    }
  }

  sortTickers(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.tickers.filter(item => true);
    this.tickers = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

  trade(pairStr: string) {
    window.location.href = '/trade/' + pairStr;
  }

  onFavorite(pairStr: string, event: Event) {
    event.stopPropagation();
    let index = this.tickers.findIndex(ticker => ticker.pairStr === pairStr);
    if (index >=0 ) {
      this.tickers[index].isFavorite = !this.tickers[index].isFavorite;
      if (this.currentMarket === 'FAVORITES' && !this.tickers[index].isFavorite) this.tickers[index].isVisible = false;
      localStorage.setItem(pairStr, this.tickers[index].isFavorite.toString());
    }
  }

}


enum MarketTabId {
  ALL = 0,
  BTC = 1,
  ETH = 2,
  USDT = 3,
  GLB = 4,
  FAVORITES = 5
};