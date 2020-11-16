import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from 'src/app/services/api-client.service';
import { FINANCING, FinancingMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { fetchAnnualInterestRateChartOption } from '../../chart-option/chart-option';
import { ProductDetails } from '../../models/view-models';
import { LOGIN_PATH } from 'src/constants/path';
import { ErrorType } from 'src/app/models/error';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'ccex-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
  coin: string;
  productId: string;
  balance: number = 0;
  purchaseAmount: string;
  product: ProductDetails;
  chartOption = {};
  isPurchaseBtnLoading: boolean = false;
  isReady: boolean = false;
  precision: number = 0;
  isTransferPopupVisible: boolean = false;
  walletBalance: number;

  get Balance() {
    return this.isReady ? PrecisionUtility.truncate(this.balance, this.precision, 'number') : "--.--";
  }

  get BalanceAfterPurchase() {
    let purchaseAmount = this.purchaseAmount ? this.purchaseAmount : 0;
    return this.isReady ? PrecisionUtility.truncate((this.balance - Number(purchaseAmount)), this.precision, 'number') : "--.--";
  }

  constructor(
    public localize: LocalizationService,
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    this.productId = this.route.snapshot.paramMap.get("id");
    this.coin = this.route.snapshot.paramMap.get("coin");
    this.precision = this.coin === 'USDT' ? 4 : 8;
    if (this.apiClient.currentUser) {
      await this.fetchFinancingBalances();
      let walletBalances = await this.apiClient.fetchBalances();
      this.walletBalance = this.fetchMaxTransferInAmount(walletBalances, this.coin);
    }
    await this.fetchProductDetails();
  }

  fetchMaxTransferInAmount(walletBalances, coin: string): number {
    for (let item of walletBalances) {
      if (item.coin === coin) return item.free;
    }
    return 0;
  }

  async fetchFinancingBalances() {
    try {
      let balances = await this.apiClient.fetchFinancingBalances(this.coin);
      this.balance = balances.free;
    } catch (e) {
      console.error(e);
    }
  }

  async fetchProductDetails() {
    try {
      let data = await this.apiClient.fetchProductDetails(this.productId);
      this.product = new ProductDetails(
        data.product._id,
        data.product.name,
        data.product.name_zh,
        data.product.coin,
        data.product.endsAt,
        data.product.minPurchase,
        data.product.lengthInDay,
        data.product.displayAnnualInterestRate,
        data.filled.quantity,
        data.riskLevel,
        data.filled.type,
        data.product.precision,
        this.sanitizer.bypassSecurityTrustHtml(data.product.description),
        this.sanitizer.bypassSecurityTrustHtml(data.product.description_zh),
      );
      this.setAnnualInterestRateChartOption(this.product.displayAnnualInterestRate);
    } catch (e) {
      if (e.code === ErrorType.PRODUCT_UNFOUND) {
        this.router.navigate(['/financing/products_on_sale'])
      }
      console.error(e);
    }
    this.isReady = true;
  }

  setAnnualInterestRateChartOption(AnnualInterestRate: string) {
    this.chartOption = fetchAnnualInterestRateChartOption(
      AnnualInterestRate,
      this.localize.currentLanguage.id === 'zh_CN' ? "年化收益率" : "Annualized Return",
      ['70', '30']
    );
  }

  async purchase() {
    if (!this.apiClient.currentUser) {
      this.router.navigate([LOGIN_PATH, { returnUrl: this.router.url }]);
      return;
    };
    if (!this.purchaseAmount || isNaN(Number(this.purchaseAmount))) {
      this.showPopup(FINANCING.PURCHASE_AMOUNT_INVALID, MessagePopupType.WARNING);
      return;
    }
    if (Number(this.purchaseAmount) < this.product.minPurchaseAmount) {
      this.showPopup(ErrorType.PURCHASE_LIMIT_UNSATISFIED, MessagePopupType.WARNING);
      return;
    }
    if (!this.balance) {
      this.showPopup(ErrorType.INSUFFICIENT_AVAILABLE_TO_PURCHASE, MessagePopupType.WARNING);
      return;
    }
    this.isPurchaseBtnLoading = true;
    try {
      await this.apiClient.financingProductPurchase(this.productId, this.purchaseAmount);
      this.showPopup(FINANCING.PURCHASE_SUCCESS, MessagePopupType.SUCCESS, () => this.router.navigate(['/financing/my_subscription']));
      this.purchaseAmount = null;
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isPurchaseBtnLoading = false;
  }

  tryTransfer() {
    if (!this.apiClient.currentUser) {
      this.router.navigate([LOGIN_PATH, { returnUrl: this.router.url }]);
      return;
    };
    this.isTransferPopupVisible = true;
  }

  forceAmountPrecision() {
    this.purchaseAmount = PrecisionUtility.force(this.purchaseAmount, this.product.precision);
  }

  transferWindowOnCancel(event) {
    this.isTransferPopupVisible = event.isVisible;
    if (event.status === 'success') window.location.reload();
  }

  showPopup(code: number, type: MessagePopupType, callBack?: any) {
    let msgObj = new FinancingMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm, '', callBack);
    setTimeout(() => MessagePopup.hide(callBack, showTime), 5000);
  }

}
