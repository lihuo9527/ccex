import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiClientService } from 'src/app/services/api-client.service';
import { FINANCING, FinancingMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { fetchBalanceChartOption } from '../../chart-option/chart-option';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit {
  @Input() isTransferPopupVisible: boolean;
  @Input() transferCoin: string;
  @Input() walletBalance: number;
  @Input() financingBalance: number;
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  isTransferLoading: boolean = false;
  transferInAmount: string;
  transferOutAmount: string;
  balanceChartOption = {};
  chartI18n: any = {};
  private precision: number = this.transferCoin === 'USDT' ? 4 : 8;;
  constructor(
    public localize: LocalizationService,
    public apiClient: ApiClientService,
  ) { }

  ngOnInit() {
    this.ChartI18nInitialize();
    this.setBalanceChartOption();
  }

  async transferIn() {
    if (!this.transferInAmount || isNaN(Number(this.transferInAmount))) {
      this.showPopup(FINANCING.TRANSFER_AMOUNT_INVALID, MessagePopupType.WARNING);
      return;
    }
    if (Number(this.transferInAmount) > this.walletBalance) {
      this.showPopup(FINANCING.INSUFFICIENT_AVAILABLE_TO_TRANSFER, MessagePopupType.WARNING);
      return;
    }
    this.isTransferLoading = true;
    try {
      await this.apiClient.transferTofinance(this.transferCoin, this.transferInAmount);
      this.showPopup(FINANCING.TRANSFER_SUCCESS, MessagePopupType.SUCCESS, () => this.onCancel.emit({ isVisible: false, status: 'success' }));
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isTransferLoading = false;
  }

  async transferOut() {
    if (!this.transferOutAmount || isNaN(Number(this.transferOutAmount))) {
      this.showPopup(FINANCING.TRANSFER_AMOUNT_INVALID, MessagePopupType.WARNING);
      return;
    }
    if (Number(this.transferOutAmount) > this.financingBalance) {
      this.showPopup(FINANCING.INSUFFICIENT_AVAILABLE_TO_TRANSFER, MessagePopupType.WARNING);
      return;
    }
    this.isTransferLoading = true;
    try {
      await this.apiClient.transferToexchange(this.transferCoin, this.transferOutAmount);
      this.showPopup(FINANCING.TRANSFER_SUCCESS, MessagePopupType.SUCCESS, () => this.onCancel.emit({ isVisible: false, status: 'success' }));
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isTransferLoading = false;
  }

  forceTransferInAmountPrecision() {
    this.transferInAmount = PrecisionUtility.force(this.transferInAmount, this.precision);
  }

  forceTransferOutAmountPrecision() {
    this.transferOutAmount = PrecisionUtility.force(this.transferOutAmount, this.precision);
  }

  transferWindowOnCancel() {
    this.onCancel.emit({ isVisible: false });
  }

  ChartI18nInitialize() {
    this.chartI18n = this.localize.LanguageId === 'zh_CN' ? { tradingBalance: "交易中心余额", financingBalance: "理财中心余额" } : { tradingBalance: "Trading Balance", financingBalance: "Financing Balance" };
  }

  showPopup(code: number, type: MessagePopupType, callBack?: any) {
    let msgObj = new FinancingMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm, '', callBack);
    setTimeout(() => MessagePopup.hide(callBack, showTime), 5000);
  }

  setBalanceChartOption() {
    let walletBalance = PrecisionUtility.truncate(this.walletBalance, this.precision, 'number');
    let financingBalance = PrecisionUtility.truncate(this.financingBalance, this.precision, 'number');
    this.balanceChartOption = fetchBalanceChartOption(
      ["#e2d859", "#bd0812"],
      [
        { value: walletBalance, name: this.chartI18n.tradingBalance + " " + walletBalance + " " + this.transferCoin },
        { value: financingBalance, name: this.chartI18n.financingBalance + " " + financingBalance + " " + this.transferCoin }
      ]
    )
  }

}
