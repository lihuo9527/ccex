import { Component, OnInit } from '@angular/core';
import { TradeHistoryRecordModel, OpenOrderRecordModel, DealtOrderRecordModel, OrderBookRecordModel } from '../../viewmodels';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../../../services/api-client.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ticker } from '../../../top/models/view-models';
import { OrderType } from '../../../order/models/view-models';
import { TickersService } from 'src/app/services/tickers.service';
import { TradingService } from 'src/app/services/trading.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalizationService } from 'src/app/services/localization.service';
import { NzModalService } from 'ng-zorro-antd';
import { TradeMessages, TRADE } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { LOGIN_PATH } from 'src/constants/path';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.less']
})
export class TradeComponent implements OnInit {
  balance = {
    market: {
      symbol: '',
      free: 0
    },
    target: {
      symbol: '',
      free: 0
    }
  };

  buyForm: FormGroup;
  sellForm: FormGroup;

  markets: { marketCoin: string, targetCoin: string, fee: number, precision: number, minVolume: number, minPrecision: number }[] = [];
  pairStr: string = undefined;

  candidatePairs: { pairStr: string, pairToDisplay: string, marketSort: number, targetSort: number }[] = [];

  symbol: string = undefined;
  symbolToDisplay: string = undefined;

  ticker: Ticker = undefined;
  tickers: Array<Ticker> = [];
  fee: number = undefined;
  precision: number = undefined;
  minVolume: number = undefined;
  minVolumePrecision: number = undefined;
  currentTabId = 0;
  openOrders: OpenOrderRecordModel[] = [];
  dealtOrders = [];

  buyOrders: Array<OrderBookRecordModel> = [];
  sellOrders: Array<OrderBookRecordModel> = [];

  tradeHistories: TradeHistoryRecordModel[] = undefined;
  isInfoBoxShow: boolean = false;
  isOverViewTwoLevelMenuOpen: boolean = false;
  deepMergeValue: number = null;
  deepMergeArr: Array<number> = [];
  keyword: string = '';
  currentMarket: string = 'ALL';
  isMenuVisible: boolean = false;
  get CoinInfoUrl() {
    let coinsId = {
      BTC: "28",
      LTC: "29",
      XRP: "30",
      ETH: "32",
      EOS: "33",
      GLB: "34"
    }
    return environment.supportArticlesUrl + coinsId[this.balance.target.symbol];
  }

  ratioformatter(value: number) {
    return (100 * value).toFixed(0) + '%';
  }

  get BuyPrice() {
    if (!this.buyForm.controls.buyPrice.value) {
      return 0;
    }
    let displayValue = Number(this.buyForm.controls.buyPrice.value);
    return displayValue > 0 ? displayValue : 0;
  }
  get BuyAmount() {
    if (!this.buyForm.controls.buyAmount.value) {
      return 0;
    }
    let value = Number(this.buyForm.controls.buyAmount.value);
    return value > 0 ? value : 0;
  }
  get MaxBuyAmount() {
    let price = this.BuyPrice;
    if (price === 0) return 0;
    return this.balance.market.free / price;
  }
  get BuyVolume() {
    return this.BuyPrice * this.BuyAmount;
  }
  onBuyRatioChanged(ratio: number) {
    this.buyForm.controls.buyAmount.setValue(PrecisionUtility.truncate((this.MaxBuyAmount * ratio), this.precision, 'number'));
  }

  get SellPrice() {
    if (!this.sellForm.controls.sellPrice.value) {
      return 0;
    }
    let value = Number(this.sellForm.controls.sellPrice.value);
    return value > 0 ? value : 0;
  }
  get SellAmount() {
    if (!this.sellForm.controls.sellAmount.value) {
      return 0;
    }
    let value = Number(this.sellForm.controls.sellAmount.value);
    return value > 0 ? value : 0;
  }
  get MaxSellAmount() {
    let price = this.SellPrice;
    if (price === 0) return 0;
    return this.balance.target.free;
  }
  get SellVolume() {
    return this.SellPrice * this.SellAmount;
  }
  onSellRatioChanged(ratio: number) {
    this.sellForm.controls.sellAmount.setValue(PrecisionUtility.truncate(this.MaxSellAmount * ratio, this.precision, 'number'));
  }

  isFetchingBalance = false;
  isMinBuyAmountTipVisible = false;
  isMinSellAmountTipVisible = false;
  private coins: any = [];
  private totalPricePrecision: number = 8;
  constructor(
    private router: Router,
    route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public apiClient: ApiClientService,
    private tickersService: TickersService,
    private tradingService: TradingService,
    public localize: LocalizationService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {
    this.pairStr = route.snapshot.params['pair'];
    let arr = this.pairStr.split('-');
    this.balance.market.symbol = arr[1];
    this.balance.target.symbol = arr[0];
    this.ticker = new Ticker(this.balance.market.symbol, this.balance.target.symbol);
    this.symbol = `${this.balance.target.symbol}/${this.balance.market.symbol}`;
    this.symbolToDisplay = `${this.balance.target.symbol} / ${this.balance.market.symbol}`;
    this.tradeHistories = [];
  }

  ngOnInit() {
    try {
      this.initialize();
      this.buyForm = this.formBuilder.group({
        buyPrice: [undefined, [Validators.required]],
        buyAmount: [undefined, [Validators.required]]
      });
      this.sellForm = this.formBuilder.group({
        sellPrice: [undefined, [Validators.required]],
        sellAmount: [undefined, [Validators.required]]
      });
    } catch (e) {
      console.error(e);
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = undefined;
    }
    this.tradingService.disconnect();
    this.tickersService.disconnect();
  }

  private refreshSubscription = undefined;
  private async initialize() {
    await this.setMeta();
    await this.fetchBalance();
    this.fetchMarketData();

    if (!this.apiClient.currentUser) return;
    await this.fetchOrders();
    this.refreshSubscription = interval(5000)
      .subscribe(
        () => this.fetchOrders().then(_ => {
          if (_[1]) {
            this.fetchBalance();
          }
        }).catch(e => console.error(e)),
        e => console.warn(e)
      );
  }

  private async setMeta() {
    this.coins = await this.apiClient.fetchCoins();
    this.markets = await this.apiClient.fetchMarkets();
    for (let ele of this.markets) {
      let ticker = new Ticker(
        ele.marketCoin,
        ele.targetCoin
      );
      ticker.precision = ele.precision;
      ticker.marketSort = this.getSortOrder(ele.marketCoin);
      ticker.targetSort = this.getSortOrder(ele.targetCoin);
      this.tickers.push(ticker);
      if (ele.targetCoin === this.balance.target.symbol && ele.marketCoin === this.balance.market.symbol) {
        this.fee = ele.fee;
        this.precision = ele.precision;
        this.ticker.precision = ele.precision;
        this.setMergePrecision(ele.minPrecision, ele.precision);
        this.minVolume = ele.minVolume;
        this.minVolumePrecision = ele.minVolume < 1 ? Math.log10(1 / ele.minVolume) : 0;
      } else {
        this.candidatePairs.push({
          pairStr: `${ele.targetCoin}-${ele.marketCoin}`,
          pairToDisplay: `${ele.targetCoin} / ${ele.marketCoin}`,
          marketSort: this.getSortOrder(ele.marketCoin),
          targetSort: this.getSortOrder(ele.targetCoin)
        });
      }
    }
    this.tickers.sort((a, b) => {
      let x = a.marketSort - b.marketSort;
      if (x !== 0) return x;
      return a.targetSort - b.targetSort;
    });
    this.candidatePairs.sort((a, b) => {
      let x = a.marketSort - b.marketSort;
      if (x !== 0) return x;
      return a.targetSort - b.targetSort;
    });
    if (this.fee === undefined || this.precision === undefined || this.minVolume === undefined)
      throw Error();
  }

  private getSortOrder(coin: string) {
    for (let element of this.coins) {
      if (element._id === coin) return element.sortOrder;
    }
  }

  private async fetchOrders() {
    if (!this.apiClient.currentUser) return;
    return Promise.all([
      this.fetchOpenOrders(),
      this.fetchDealtOrders()
    ]);
  }

  private async fetchBalance() {
    if (!this.apiClient.currentUser) return;
    this.isFetchingBalance = true;
    try {
      let balances = await this.apiClient.fetchBalances();
      for (let balance of balances) {
        if (balance.coin === this.balance.market.symbol) {
          this.balance.market.free = balance.free;
        }
        if (balance.coin === this.balance.target.symbol) {
          this.balance.target.free = balance.free;
        }
      }
    } catch (e) {
      this.apiClient.clearCurrentUser();
      console.error(e);
    }
    this.isFetchingBalance = false;
  }

  private fetchMarketData() {
    this.tickersService.OnTickerAsObservable.subscribe(() => {
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
        ticker.isFavorite = localStorage.getItem(ticker.pairStr) === 'true' ? true : false;
        if (this.pairStr === ticker.pairStr) this.ticker = ticker;
      }
    });
    this.tickersService.reconnect();

    this.tradingService.OnUpdatedAsObservable.subscribe(data => {
      this.tradeHistories = [];
      for (let i = 0; i < data.histories.length; i++) {
        let ele = data.histories[i];
        this.tradeHistories.push(new TradeHistoryRecordModel(
          ele.createdAt,
          ele.price,
          ele.amount,
          ele.type
        ));
      }
      for (let openOrder of this.openOrders) {
        let orders = openOrder.type === TradeType.BUY ? data.buys : data.sells;
        for (let order of orders) {
          if (order.createdAt === openOrder.timestamp && order.price === openOrder.price && order.amount === openOrder.amount) order.mark = true;
        }
      }
      this.setOrdersData(data.buys, this.deepMergeValue, TradeType.BUY);
      this.setOrdersData(data.sells, this.deepMergeValue, TradeType.SELL);
    });
    this.tradingService.OnUpdatedAsObservable.pipe(take(1)).subscribe(data => {
      if (data.buys && data.buys.length > 0) {
        this.sellForm.controls.sellPrice.setValue(data.buys[0].price);
      }
      if (data.sells && data.sells.length > 0) {
        this.buyForm.controls.buyPrice.setValue(data.sells[0].price);
      }
    });
    this.tradingService.OnUpdatedAsObservable.subscribe(data => {
      if (data.buys && data.buys.length > 0) {
        this.bestBuy = data.buys[0].price;
      }
      if (data.sells && data.sells.length > 0) {
        this.bestSell = data.sells[0].price;
      }
    });
    this.tradingService.reconnect(this.pairStr);
  }
  private bestBuy: number;
  private bestSell: number;

  setOptimalPrice(type: 'buy' | 'sell') {
    if (type === TradeType.BUY) this.buyForm.controls.buyPrice.setValue(this.bestSell);
    if (type === TradeType.SELL) this.sellForm.controls.sellPrice.setValue(this.bestBuy);
  }

  private async fetchOpenOrders() {
    let items: any[] = (await this.apiClient.fetchOpenOrders(this.pairStr)) || [];
    this.openOrders = [];
    for (let item of items) {
      this.openOrders.push(new OpenOrderRecordModel(
        item.orderId,
        Number(item.createdAt),
        item.type,
        item.price,
        item.amount,
        item.filled
      ));
    }
  }

  private async fetchDealtOrders() {
    let previousCount = !this.dealtOrders ? 0 : this.dealtOrders.length;
    let items: any[] = (await this.apiClient.fetchDealtOrders(this.pairStr)).docs || [];
    items = items.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
    this.dealtOrders = [];
    for (let item of items) {
      this.dealtOrders.push(new DealtOrderRecordModel(
        Number(item.createdAt),
        item.type,
        item.price,
        item.amount,
      ));
    }
    return previousCount !== items.length;
  }

  onTab(index: number) {
    this.currentTabId = index;
    switch (this.currentTabId) {
      case MenuTabId.ALL:
        this.currentMarket = 'ALL';
        break;
      case MenuTabId.BTC:
        this.currentMarket = 'BTC';
        break;
      case MenuTabId.ETH:
        this.currentMarket = 'ETH';
        break;
      case MenuTabId.USDT:
        this.currentMarket = 'USDT';
        break;
      case MenuTabId.GLB:
        this.currentMarket = 'GLB';
        break;
      case MenuTabId.FAVORITES:
        this.currentMarket = 'FAVORITES';
        break;
      default:
        throw new Error('unknown market tab id: ' + this.currentTabId);
    }
    this.filterPairs();
  }

  filter(event: any) {
    let token: string = event.target.value;
    this.keyword = token.toLowerCase().trim();
    this.filterPairs();
  }

  private filterPairs() {
    let items: any[] = this.tickers;
    for (let item of items) {
      let belongsToThisMarket = this.currentMarket === 'ALL' ? true : item.marketCoin === this.currentMarket;
      let containsKeyword = this.keyword.length === 0 || item.targetCoin.toLowerCase().includes(this.keyword);
      item.isVisible = belongsToThisMarket && containsKeyword || this.currentMarket === 'FAVORITES' && item.isFavorite && containsKeyword;
    }
  }

  onFavorite(pairStr: string, event: Event) {
    event.stopPropagation();
    let index = this.tickers.findIndex(ticker => ticker.pairStr === pairStr);
    if (index >= 0) {
      this.tickers[index].isFavorite = !this.tickers[index].isFavorite;
      if (this.currentMarket === 'FAVORITES' && !this.tickers[index].isFavorite) this.tickers[index].isVisible = false;
      localStorage.setItem(pairStr, this.tickers[index].isFavorite.toString());
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

  onChangePair(pairStr: string) {
    window.location.href = '/trade/' + pairStr;
  }

  async onCancel(orderId: string, type: OrderType) {
    this.isFetchingBalance = true;
    let tmp = this.openOrders;
    try {
      let index = -1;
      for (let openOrder of this.openOrders) {
        if (openOrder.orderId === orderId) {
          index = this.openOrders.indexOf(openOrder);
          break;
        }
      }
      this.openOrders.splice(index, 1);
      await this.apiClient.cancelOrder(this.pairStr, orderId, type);
      await Promise.all([
        this.fetchBalance(),
        this.fetchOpenOrders(),
      ]);
    } catch (e) {
      this.openOrders = tmp;
      console.error(e);
    }
    this.isFetchingBalance = false;
  }

  async trySell() {
    this.isMinSellAmountTipVisible = this.minVolume > Number(this.sellForm.controls.sellAmount.value) ? true : false;
    if (this.isMinSellAmountTipVisible) setTimeout(() => this.isMinSellAmountTipVisible = false, 1000);
    for (const i in this.sellForm.controls) {
      this.sellForm.controls[i].markAsDirty();
      this.sellForm.controls[i].updateValueAndValidity();
    }
    if (this.sellForm.invalid) return;
    if (Number(this.sellForm.controls.sellPrice.value) < this.ticker.price * 0.9) {
      let msgObj = new TradeMessages(this.localize.currentLanguage.id).getMessage(TRADE.SELL_WARNING);
      this.modalService.confirm({
        nzTitle: msgObj.title,
        nzContent: msgObj.text,
        nzOkText: msgObj.confirm,
        nzCancelText: msgObj.cancel,
        nzOnOk: () => this.submitSell()
      });
      return;
    }
    this.submitSell();
  }

  async submitSell() {
    let price = Number(this.sellForm.controls.sellPrice.value);
    let amount = Number(this.sellForm.controls.sellAmount.value);
    if (amount > this.balance.target.free) {
      this.showPopup(TRADE.INSUFFICIENT_AVAILABLE, MessagePopupType.WARNING);
      return;
    }
    if (isNaN(price) || isNaN(amount) || price <= Math.pow(10, -this.precision) || amount < this.minVolume) {
      return;
    }
    this.isFetchingBalance = true;
    try {
      await this.apiClient.makeOrder(this.pairStr, TradeType.SELL, PrecisionUtility.truncate(price, this.precision, 'string'), PrecisionUtility.truncate(amount, this.minVolumePrecision, 'string'));
      this.toastSuccess();
      this.sellForm.controls.sellPrice.setValue(null);
      this.sellForm.controls.sellAmount.setValue(null);
      await Promise.all([
        this.fetchBalance(),
        this.fetchOpenOrders()
      ]);
    } catch (e) {
      console.error(e);
    }
    this.isFetchingBalance = false;
  }

  async tryBuy() {
    this.isMinBuyAmountTipVisible = this.minVolume > Number(this.buyForm.controls.buyAmount.value) ? true : false;
    if (this.isMinBuyAmountTipVisible) setTimeout(() => this.isMinBuyAmountTipVisible = false, 1000);
    for (const i in this.buyForm.controls) {
      this.buyForm.controls[i].markAsDirty();
      this.buyForm.controls[i].updateValueAndValidity();
    }
    if (this.buyForm.invalid) return;
    if (Number(this.buyForm.controls.buyPrice.value) > this.ticker.price * 1.1) {
      let msgObj = new TradeMessages(this.localize.currentLanguage.id).getMessage(TRADE.BUY_WARNING);
      this.modalService.confirm({
        nzTitle: msgObj.title,
        nzContent: msgObj.text,
        nzOkText: msgObj.confirm,
        nzCancelText: msgObj.cancel,
        nzOnOk: () => this.submitBuy()
      })
      return;
    }
    this.submitBuy();
  }

  async submitBuy() {
    let price = Number(this.buyForm.controls.buyPrice.value);
    let amount = Number(this.buyForm.controls.buyAmount.value);
    if (price * amount > this.balance.market.free) {
      this.showPopup(TRADE.INSUFFICIENT_AVAILABLE, MessagePopupType.WARNING);
      return;
    }
    if (isNaN(price) || isNaN(amount) || price <= Math.pow(10, -this.precision) || amount < this.minVolume) {
      return;
    }
    this.isFetchingBalance = true;
    try {
      await this.apiClient.makeOrder(this.pairStr, TradeType.BUY, PrecisionUtility.truncate(price, this.precision, 'string'), PrecisionUtility.truncate(amount, this.minVolumePrecision, 'string'));
      this.toastSuccess();
      this.buyForm.controls.buyPrice.setValue(null);
      this.buyForm.controls.buyAmount.setValue(null);
      await Promise.all([
        this.fetchBalance(),
        this.fetchOpenOrders()
      ]);
    } catch (e) {
      console.error(e);
    }
    this.isFetchingBalance = false;
  }

  login() {
    this.router.navigate([LOGIN_PATH, { returnUrl: this.router.url }]);
  }

  signup() {
    this.router.navigate(['/account/signup']);
  }

  logout() {
    this.apiClient.logout();
  }

  showDealt() {
    this.router.navigate(['/order/dealt'], { queryParams: { pair: this.pairStr } });
  }

  onClickOrderRecord(price: number) {
    this.buyForm.controls.buyPrice.setValue(price);
    this.sellForm.controls.sellPrice.setValue(price);
  }

  forcePricePrecision(type: 'buy' | 'sell') {
    let control = type === TradeType.BUY ? this.buyForm.controls.buyPrice : this.sellForm.controls.sellPrice;
    control.setValue(PrecisionUtility.force(control.value, this.precision));
  }

  forceAmountPrecision(type: 'buy' | 'sell') {
    let control = type === TradeType.BUY ? this.buyForm.controls.buyAmount : this.sellForm.controls.sellAmount;
    control.setValue(PrecisionUtility.force(control.value, this.minVolumePrecision));
  }

  private toastSuccess() {
    this.message.create(
      'success',
      this.localize.currentLanguage.id === 'zh_CN' ? "挂单成功！" : "Order accepted!"
    );
  }

  showPopup(code: number, type: MessagePopupType) {
    let msgObj = new TradeMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm);
    setTimeout(() => MessagePopup.hide(null, showTime), 5000);
  }

  private setMergePrecision(minPrecision: number, maxPrecision: number) {
    for (let i = minPrecision; i <= maxPrecision; i++) {
      this.deepMergeArr.push(i);
    }
    this.deepMergeValue = this.deepMergeArr[this.deepMergeArr.length - 1];
  }

  private setOrdersData(orders, mergePrecision: number, type: TradeType) {
    let deepMergeData = [];
    for (let i = 0; i < this.deepMergeArr.length; i++) {
      for (let item of orders) {
        let data = new OrderBookRecordModel(
          PrecisionUtility.truncate(item.price, this.deepMergeArr[i], 'string'),
          item.amount,
          PrecisionUtility.truncate(item.price * item.amount, this.totalPricePrecision, 'string')
        );
        data.precision = this.deepMergeArr[i];
        if (data.precision != mergePrecision) data.isVisible = false;
        let isDiff = true;
        let index = deepMergeData.findIndex(el => el.price === data.price);
        if (index >= 0) {
          deepMergeData[index].amount = Number(deepMergeData[index].amount) + Number(data.amount);
          deepMergeData[index].total = PrecisionUtility.truncate(Number(deepMergeData[index].total) + Number(data.total), this.totalPricePrecision, 'string');
          isDiff = false;
        }
        if (isDiff) deepMergeData.push(data);
      }
    }
    for (let i = 0; i < 50; i++) {
      deepMergeData.push(new OrderBookRecordModel());
    }
    if (type === TradeType.BUY) {
      this.buyOrders = deepMergeData;
      this.setAmountRatio(this.buyOrders);
    } else {
      this.sellOrders = deepMergeData;
      this.setAmountRatio(this.sellOrders);
    }
  }

  private setAmountRatio(orders: OrderBookRecordModel[]) {
    let maxDict = {};
    for (let order of orders) {
      let key = `${order.precision}`;
      if (!maxDict[key]) maxDict[key] = [];
      maxDict[key].push(order.amount);
    }
    orders.forEach(order => order.amountRatio = Math.floor(order.amount / Math.max(...maxDict[`${order.precision}`]) * 100));
  }

  filterOrders() {
    this.buyOrders.filter(el => el.amount > 0).forEach(el => el.isVisible = el.precision === Number(this.deepMergeValue))
    this.sellOrders.filter(el => el.amount > 0).forEach(el => el.isVisible = el.precision === Number(this.deepMergeValue))
  }

}

enum TradeType {
  BUY = 'buy',
  SELL = 'sell'
}

enum MenuTabId {
  ALL = 0,
  USDT = 1,
  BTC = 2,
  ETH = 3,
  GLB = 4,
  FAVORITES = 5
};