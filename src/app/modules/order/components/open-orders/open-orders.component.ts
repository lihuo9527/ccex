import { Component, OnInit } from '@angular/core';
import { OpenOrderRecord, OrderType } from '../../models/view-models';
import { Router } from '@angular/router';
import { ApiClientService } from '../../../../services/api-client.service';
import { pairs } from 'rxjs';
import { ErrorType } from 'src/app/models/error';

@Component({
  selector: 'ccex-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.less']
})

export class OpenOrdersComponent implements OnInit {
  isLoading = false;
  openOrders: OpenOrderRecord[] = [];

  private allPairs: { pairStr: string, pairToDisplay: string }[] = [];
  currentPair = { pairStr: undefined, pairToDisplay: '- / -'};
  candidatePairs: { pairStr: string, pairToDisplay: string }[] = [];

  currentOrderType = { raw: undefined, display: '- -'};
  otherOrderTypes = [
    { raw: 'buy', display: 'TRADE.buy' },
    { raw: 'sell', display: 'TRADE.sell' }
  ];

  constructor(private router: Router, private apiClient: ApiClientService) { }

  ngOnInit() {
    this.fetchPairs();
    this.fetchOpenOrders();
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

  private async fetchOpenOrders() {
    this.isLoading = true;
    try {
      let items: any[] = (await this.apiClient.fetchAllOpenOrders()) || [];
      items = items.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
      this.openOrders = [];
      for (let item of items) {
        this.openOrders.push(new OpenOrderRecord(
          Number(item.createdAt),
          item.orderId,
          item.pair,
          item.type,
          item.price,
          item.amount,
          item.filled
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
    this.router.navigate(['/order/dealt']);
  }

  async onCancel(pairStr: string, type: OrderType, orderId: string) {
    this.isLoading = true
    try {
      await this.apiClient.cancelOrder(pairStr, orderId, type);
      await this.fetchOpenOrders();
    } catch (e) {
      console.error(e);
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
    }
    this.isLoading = false;
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
    this.filterInternal();
  }

  onChangePair(pairStr: string) {
    if (pairStr === undefined) {
      this.currentPair = { pairStr: undefined, pairToDisplay: '- / -'};
      this.candidatePairs = this.allPairs;
    } else {
      this.candidatePairs = [];
      for (let ele of this.allPairs) {
        if (ele.pairStr !== pairStr) {
          this.candidatePairs.push(ele);
        } else {
          this.currentPair = { pairStr: pairStr, pairToDisplay: ele.pairToDisplay};
        }
      }
      this.candidatePairs.push({ pairStr: undefined, pairToDisplay: '- / -'});
    }
    this.filterInternal();
  }

  private filterInternal() {
    for (let openOrder of this.openOrders) {
      let isOrderTypeMatched = this.currentOrderType.raw === undefined || openOrder.type === this.currentOrderType.raw;
      let isPairMatched = this.currentPair.pairStr === undefined || openOrder.pairStr === this.currentPair.pairStr;
      openOrder.isVisible = isOrderTypeMatched && isPairMatched;
    }
  }

  onReset() {
    this.onChangePair(undefined);
    this.onChangeOrderType(undefined);
  }
}
