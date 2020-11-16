import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiClientService } from 'src/app/services/api-client.service';
import { FiatPriceService } from 'src/app/services/fiat-price.service';
import { Balance, ProductDetails, TransferRecord, TransferObject } from '../../models/view-models';
import { fetchYesterdayProfitChartOption } from '../../chart-option/chart-option';
import { Router } from '@angular/router';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-products-on-sale',
  templateUrl: './products-on-sale.component.html',
  styleUrls: ['./products-on-sale.component.less']
})
export class ProductsOnSaleComponent implements OnInit {
  readonly BASE_COIN = 'USDT';
  isReady: boolean = false;
  isTransferPopupVisible: boolean = false;
  isTransferRecordPopupVisible: boolean = false;
  isChartLoading: boolean = true;
  isTransferObjectTableLoading: boolean = false;
  isProductsTableLoading: boolean = false;
  balance: Balance = new Balance();
  products: Array<{ coin: string, data: ProductDetails[], active: boolean }> = [];
  transferRecords: TransferRecord[] = [];
  transferCoin: string;
  chartI18n: any = {};
  yesterdayChartOption = {};
  transferObject: TransferObject[] = [];
  transferInAmount: number;
  transferOutAmount: number;
  walletBalance: number;
  financingBalance: number;
  private precision = this.BASE_COIN === 'USDT' ? 4 : 8;

  get BalanceTotal() {
    return this.isReady ? PrecisionUtility.truncate(this.balance.total, this.precision, 'number') : "--.--";
  }

  get BalanceFree() {
    return this.isReady ? PrecisionUtility.truncate(this.balance.free, this.precision, 'number') : "--.--";
  }
  constructor(
    public localize: LocalizationService,
    public apiClient: ApiClientService,
    private fiatPrice: FiatPriceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetchBalances();
    this.fetchAllProducts();
  }

  async fetchAllProducts() {
    this.isProductsTableLoading = true;
    try {
      let items = (await this.apiClient.fetchAllProducts()).sort((a, b) => a._id > b._id ? 1 : -1);
      for (let item of items) {
        let isDiff = true;
        let productDetails = new ProductDetails(
          item._id,
          item.name,
          item.name_zh,
          item.coin,
          item.endsAt,
          item.minPurchase,
          item.lengthInDay,
          item.displayAnnualInterestRate
        );
        this.products.forEach(el => {
          if (el.coin === item.coin) {
            el.data = [...el.data, productDetails];
            isDiff = false;
          }
        });
        if (isDiff || this.products.length === 0) {
          this.products = [...this.products, {
            coin: item.coin,
            data: [productDetails],
            active: item.coin === 'EOS'
          }];
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.isProductsTableLoading = false;
  }

  async fetchBalances() {
    this.isTransferObjectTableLoading = true;
    try {
      let marketPrices = await this.fiatPrice.fetch();
      let coins = await this.apiClient.fetchFinanceCoins();
      let walletBalances = await this.apiClient.fetchBalances();
      for (let _coin of coins) {
        let financingBalances = await this.apiClient.fetchFinancingBalances(_coin);
        let yesterdayProfit = await this.apiClient.fetchFinancingYesterdayProfits(_coin);
        this.balance.total += this.fiatPrice.calculate(marketPrices, [{ symbol: _coin, amount: financingBalances.total }], this.BASE_COIN);
        this.balance.free += this.fiatPrice.calculate(marketPrices, [{ symbol: _coin, amount: financingBalances.free }], this.BASE_COIN);
        this.balance.locked += this.fiatPrice.calculate(marketPrices, [{ symbol: _coin, amount: financingBalances.locked }], this.BASE_COIN);
        this.balance.interest += this.fiatPrice.calculate(marketPrices, [{ symbol: _coin, amount: financingBalances.interest }], this.BASE_COIN);
        this.balance.profit += this.fiatPrice.calculate(marketPrices, [{ symbol: _coin, amount: financingBalances.profit }], this.BASE_COIN);
        this.balance.yesterdayProfit += this.fiatPrice.calculate(marketPrices, [{ symbol: yesterdayProfit.coin, amount: yesterdayProfit.amount }], this.BASE_COIN);
        this.transferObject = [...this.transferObject, new TransferObject(
          _coin,
          this.fetchMaxTransferInAmount(walletBalances, _coin),
          financingBalances.free
        )];
      }
    } catch (e) {
      console.error(e);
    }
    this.ChartI18nInitialize();
    this.setYesterdayChartOption(this.balance.locked, this.balance.interest, this.balance.profit, this.balance.yesterdayProfit);
    this.isChartLoading = false;
    this.isTransferObjectTableLoading = false;
    this.isReady = true;
  }

  fetchMaxTransferInAmount(walletBalances, coin: string): number {
    for (let item of walletBalances) {
      if (item.coin === coin) return item.free;
    }
  }

  ChartI18nInitialize() {
    this.chartI18n = this.localize.LanguageId === 'zh_CN' ? { inSubscription: "认购中", basicInterest: "理财收益", bonus: "返利收益", dailyIncome: "昨日收益", tradingBalance: "交易中心余额", financingBalance: "理财中心余额" } : { inSubscription: "In Subscription", basicInterest: "Basic Interest", bonus: "Bonus", dailyIncome: "Daily Income", tradingBalance: "Trading Balance", financingBalance: "Financing Balance" };
  }

  setYesterdayChartOption(inSubscription: number, basicInterest: number, bonus: number, yesterdayProfit: number) {
    let locked = PrecisionUtility.truncate(inSubscription, this.precision, 'number');
    let interest = PrecisionUtility.truncate(basicInterest, this.precision, 'number');
    let profit = PrecisionUtility.truncate(bonus, this.precision, 'number');
    let YesterdayProfit = PrecisionUtility.truncate(yesterdayProfit, this.precision, 'number');
    this.yesterdayChartOption = fetchYesterdayProfitChartOption(
      this.chartI18n.dailyIncome,
      YesterdayProfit + ' ' + this.BASE_COIN,
      [
        this.chartI18n.inSubscription + " " + locked + " " + this.BASE_COIN,
        this.chartI18n.basicInterest + " " + interest + " " + this.BASE_COIN,
        this.chartI18n.bonus + " " + profit + " " + this.BASE_COIN
      ],
      ["#1890ff", "#e2d859", "#bd0812"],
      [
        { value: locked, name: this.chartI18n.inSubscription + " " + locked + " " + this.BASE_COIN },
        { value: interest, name: this.chartI18n.basicInterest + " " + interest + " " + this.BASE_COIN },
        { value: profit, name: this.chartI18n.bonus + " " + profit + " " + this.BASE_COIN }
      ]
    )
  }


  tryTransfer(coin: string, maxTransferInAmount: number, maxTransferOutAmount: number) {
    this.walletBalance = maxTransferInAmount;
    this.financingBalance = maxTransferOutAmount;
    this.transferCoin = coin;
    this.isTransferPopupVisible = true;
  }

  transferWindowOnCancel(event) {
    this.isTransferPopupVisible = event.isVisible;
    if (event.status === 'success') window.location.reload();
  }

  async fetchTransferRecords(coin: string) {
    this.transferCoin = coin;
    this.transferRecords = [];
    this.isTransferRecordPopupVisible = true;
    try {
      let records = (await this.apiClient.fetchTransferHistories(coin)).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      for (let record of records) {
        this.transferRecords = [...this.transferRecords, new TransferRecord(
          record.coin,
          record.amount,
          record.direction,
          record.createdAt
        )];
      }
    } catch (e) {
      console.error(e);
    }
  }

  enterProductDetailsPage(id: string, coin: string) {
    this.router.navigate(['/financing/product_details', { id: id, coin: coin }]);
  }

}
