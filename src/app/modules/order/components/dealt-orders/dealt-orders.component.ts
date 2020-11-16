import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiClientService } from '../../../../services/api-client.service';
import { DealtOrderRecord, OrderType } from '../../models/view-models';
import { ErrorType } from 'src/app/models/error';
import { LocalizationService } from 'src/app/services/localization.service';

@Component({
  selector: 'ccex-dealt-orders',
  templateUrl: './dealt-orders.component.html',
  styleUrls: ['./dealt-orders.component.less']
})
export class DealtOrdersComponent implements OnInit {
  isLoading = false;
  dealtOrders = [];
  pageIndex: number = 1;
  readonly pageSize: number = 10;
  totalDataVolume: number = 0;
  private allPairs: { pairStr: string, pairToDisplay: string }[] = [];
  currentPair = { pairStr: undefined, pairToDisplay: '- / -'};
  candidatePairs: { pairStr: string, pairToDisplay: string }[] = [];

  currentOrderType = { raw: undefined, display: '- -'};
  otherOrderTypes = [
    { raw: 'buy', display: 'TRADE.buy' },
    { raw: 'sell', display: 'TRADE.sell' }
  ];

  get NoDataText() {
    return this.localize.currentLanguage.id === 'zh_CN' ?
      !this.currentPair.pairStr ? '请先选择要查询的交易对' : '无记录' :
      !this.currentPair.pairStr ? 'Please select a pair' : 'No data';
  }

  constructor(private localize: LocalizationService, private router: Router, private apiClient: ApiClientService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchPairs()
      .then(() => this.onPair(this.route.snapshot.queryParams['pair']))
      .catch(e => console.error(e));
  }

  private async fetchPairs() {
    let markets = await this.apiClient.fetchMarkets();
    for (let ele of markets) {
      this.allPairs.push({
        pairStr: `${ele.targetCoin}-${ele.marketCoin}`,
        pairToDisplay: `${ele.targetCoin} / ${ele.marketCoin}`
      });
    }
    this.candidatePairs = this.allPairs;
  }

  private async onPair(pairStr: string) {
    if (pairStr === undefined) {
      this.currentPair = { pairStr: undefined, pairToDisplay: '- / -'};
      this.candidatePairs = this.allPairs;
      this.dealtOrders = [];
      return;
    }
    this.candidatePairs = [];
    for (let ele of this.allPairs) {
      if (ele.pairStr !== pairStr) {
        this.candidatePairs.push(ele);
      } else {
        this.currentPair = { pairStr: pairStr, pairToDisplay: ele.pairToDisplay };
      }
    }
    this.candidatePairs.push({ pairStr: undefined, pairToDisplay: '- / -' });
    await this.fetchDealtOrders(pairStr);
  }

  async fetchDealtOrders(pair: string, pageIndex: number = 1) {
    this.pageIndex = pageIndex;
    this.isLoading = true;
    try {
      let paginationResult: any = await this.apiClient.fetchDealtOrders(pair, this.currentOrderType.raw || '', this.pageIndex, this.pageSize);
      this.totalDataVolume = paginationResult.total;
      paginationResult.docs = paginationResult.docs.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
      this.dealtOrders = [];
      for (let item of paginationResult.docs) {
        this.dealtOrders.push(new DealtOrderRecord(
          Number(item.createdAt),
          pair,
          item.type,
          item.price,
          item.amount
        ));
      }
    } catch (e) {
      console.error(e);
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
    }
    this.isLoading = false;
  }

  onSwitchTab() {
    this.router.navigate(['/order/open']);
  }

  onChangeOrderType(type: OrderType) {
    this.currentOrderType.raw = type;
    switch (type) {
      case 'buy':
        this.otherOrderTypes = [
          { raw: 'sell', display: 'TRADE.sell' },
          { raw: undefined, display: '- -' }
        ];
        this.currentOrderType.display = 'TRADE.buy';
        break;
      case 'sell':
        this.otherOrderTypes = [
          { raw: 'buy', display: 'TRADE.buy' },
          { raw: undefined, display: '- -' }
        ];
        this.currentOrderType.display = 'TRADE.sell';
        break;
      default:
        this.otherOrderTypes = [
          { raw: 'buy', display: 'TRADE.buy' },
          { raw: 'sell', display: 'TRADE.sell' }
        ];
        this.currentOrderType.display = '- -';
    }
    if(!this.currentPair.pairStr) return;
    this.fetchDealtOrders(this.currentPair.pairStr);
  }

  onChangePair(pairStr: string) {
    !pairStr ? this.router.navigate(['/order/dealt']) : this.router.navigate(['/order/dealt'], {queryParams: { pair: pairStr } });
    this.onPair(pairStr).catch(e => console.error(e));
  }

  onChangeDateRange(dateRange: Date[]) {
    console.log(dateRange);
  }

  onReset() {
    this.onChangePair(undefined);
    this.onChangeOrderType(undefined);
  }

}
