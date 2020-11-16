import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiClientService } from 'src/app/services/api-client.service';
import { PurchaseOrder, DefreezeRecord } from '../../models/view-models';
import { FINANCING, FinancingMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.less']
})
export class MySubscriptionComponent implements OnInit {
  isLoading: boolean = false;
  isShowExpiredSubscriptions: boolean = false;
  isUnlockIncomePopupVisible: boolean = false;
  isForcibleWithdrawPopupVisible: boolean = false;
  isWithdrawNowBtnDisabled: boolean = false;
  isUnlockLoading: boolean = false;
  isForcibleWithdrawLoading: boolean = false;
  isDefreezeRecordShow: boolean = false;
  isDefreezeWindowLoading: boolean = false;
  purchaseOrders: PurchaseOrder[] = [];
  availableUnlockAmount: number = 0;
  unlockAmount: string;
  forcibleWithdrawAmount: number;
  damageRatio: number;
  id: string;
  coin: string;
  precision: number;
  minUnlockAmount: number = 0;
  defreezeHistories: DefreezeRecord[] = [];

  get UnlockAmount() {
    return parseFloat(this.unlockAmount);
  }

  constructor(
    public localize: LocalizationService,
    private apiClient: ApiClientService,
  ) { }


  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    this.purchaseOrders = [];
    await this.fetchActivePurchases();
    await this.fetchCompletePurchases();
  }

  get BalanceAfterUnlock() {
    let unlockAmount = this.unlockAmount ? Number(this.unlockAmount) : 0;
    return this.isDefreezeWindowLoading ? '--.--' : PrecisionUtility.truncate(this.availableUnlockAmount - unlockAmount, this.precision, 'number');
  }

  get AvailableUnlockAmount() {
    return this.isDefreezeWindowLoading ? '--.--' : PrecisionUtility.truncate(this.availableUnlockAmount, this.precision, 'number');
  }

  get MinUnlockAmount() {
    return this.isDefreezeWindowLoading ? '--.--' : PrecisionUtility.truncate(this.minUnlockAmount, this.precision, 'number');
  }

  async fetchActivePurchases() {
    this.isLoading = true;
    try {
      let activePurchasesOrders = (await this.apiClient.fetchActivePurchases()).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      for (let order of activePurchasesOrders) {
        this.purchaseOrders = [...this.purchaseOrders, new PurchaseOrder(
          order._id,
          order.productId,
          order.productName,
          order.productCoin,
          order.amount,
          order.createdAt,
          order.startsAt,
          order.endsAt,
          order.interest,
          order.damageRatio
        )];
      }
    } catch (e) {
      console.error(e);
    }
    this.isLoading = false;
  }

  async fetchCompletePurchases() {
    try {
      let completePurchasesOrders = (await this.apiClient.fetchCompletePurchases()).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      for (let order of completePurchasesOrders) {
        let purchaseOrder = new PurchaseOrder(
          order._id,
          order.productId,
          order.productName,
          order.productCoin,
          order.amount,
          order.createdAt,
          order.startsAt,
          order.endsAt,
          order.interest
        );
        purchaseOrder.isOperationVisible = false;
        purchaseOrder.isVisible = this.isShowExpiredSubscriptions;
        this.purchaseOrders = [...this.purchaseOrders, purchaseOrder];
      }
    } catch (e) {
      console.error(e);
    }
  }

  sortPurchaseOrders(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.purchaseOrders.filter(_ => true);
    this.purchaseOrders = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

  tryUnlockInterest(id: string, coin: string) {
    this.id = id;
    this.coin = coin;
    this.precision = this.coin === 'USDT' ? 4 : 8;
    this.unlockAmount = null;
    this.isUnlockIncomePopupVisible = true;
    this.fetchUnlockInterestHistories();
  }

  async fetchUnlockInterestHistories() {
    this.isDefreezeWindowLoading = true;
    this.defreezeHistories = [];
    this.isDefreezeRecordShow = false;
    try {
      let histories = await this.apiClient.fetchUnlockInterestHistories(this.id);
      histories.unlocks.sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      this.availableUnlockAmount = histories.available;
      this.minUnlockAmount = histories.minUnlock;
      for (let record of histories.unlocks) {
        this.defreezeHistories = [...this.defreezeHistories, new DefreezeRecord(
          record.coin,
          record.amount,
          record.createdAt
        )];
      }
    } catch (e) {
      console.error(e);
    }
    this.isDefreezeWindowLoading = false;
  }

  forceAmountPrecision() {
    this.unlockAmount = PrecisionUtility.force(this.unlockAmount, this.precision);
  }

  async unlockInterest() {
    if (!this.unlockAmount) return;
    this.isUnlockLoading = true;
    try {
      await this.apiClient.unlockInterest(this.id, this.unlockAmount);
      this.showPopup(FINANCING.DEFREEZE_SUCCESS, MessagePopupType.SUCCESS);
      this.isUnlockIncomePopupVisible = false;
      this.initialize();
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isUnlockLoading = false;
  }

  tryForcibleWithdraw(id: string, coin: string, amount: number, damageRatio: number) {
    this.id = id;
    this.coin = coin;
    this.forcibleWithdrawAmount = amount;
    this.damageRatio = damageRatio;
    this.isForcibleWithdrawPopupVisible = true;
  }

  async forcibleWithdraw(cancelId?: string) {
    this.isForcibleWithdrawLoading = true;
    try {
      await this.apiClient.financingProductCancel(cancelId ? cancelId : this.id);
      this.showPopup(FINANCING.FORCIBLE_WITHDRAW_SUCCESS, MessagePopupType.SUCCESS);
      this.isForcibleWithdrawPopupVisible = false;
      this.initialize();
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isForcibleWithdrawLoading = false;
  }

  showPopup(code: number, type: MessagePopupType) {
    let msgObj = new FinancingMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm);
    setTimeout(() => MessagePopup.hide(null, showTime), 5000);
  }

  ordersCheckBoxOnChange(event: boolean) {
    for (let order of this.purchaseOrders) {
      if (!order.isOperationVisible) order.isVisible = event;
    }
  }

}
