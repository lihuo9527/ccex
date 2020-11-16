import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizationService } from 'src/app/services/localization.service';
import { Events, EventsMessages } from 'src/app/modules/share/messages/messages';
import { Event } from '../../models/view-models';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
import { ErrorType } from 'src/app/models/error';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'ccex-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.less']
})
export class EventsDetailComponent implements OnInit {
  eventId: string;
  catalogId: string;
  event: Event = null;
  purchaseAmount: string;
  maxPurchasableAmount: string | number = 0;
  isReady: boolean = false;
  isParticipationButtonLoading: boolean = false;
  AirdopFactor: number | string = 0;
  readonly baseCoin = "USDT";
  constructor(
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
    public localize: LocalizationService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    this.eventId = this.route.snapshot.paramMap.get("eventId");
    this.catalogId = this.route.snapshot.paramMap.get("catalogId");
    await this.fetchEventDetail();
    if (this.apiClient.currentUser) await this.getMaxPurchasable();
  }

  async fetchEventDetail() {
    try {
      let event = await this.apiClient.fetchEventDetail(this.catalogId, this.eventId);
      this.event = new Event(
        this.eventId,
        event.name,
        event.name_zh,
        this.sanitizer.bypassSecurityTrustHtml(event.description),
        this.sanitizer.bypassSecurityTrustHtml(event.description_zh),
        event.coin,
        event.bonusCoin,
        event.fromPair,
        event.precision,
        event.bonusCoinPrecision,
        event.lengthInDay,
        event.minPurchase,
        event.delayInDay,
        event.startsAt,
        event.endsAt
      );
    } catch (e) {
      console.error(e);
    }
    this.isReady = true;
  }

  async getMaxPurchasable() {
    this.isParticipationButtonLoading = true;
    try {
      let result = await this.apiClient.getMaxPurchasable(this.catalogId, this.eventId);
      this.maxPurchasableAmount = PrecisionUtility.truncate(result.amount, this.event.precision, 'number');
    } catch (e) {
      console.error(e);
    }
    this.isParticipationButtonLoading = false;
  }

  forceAmountPrecision() {
    this.purchaseAmount = PrecisionUtility.force(this.purchaseAmount, this.event.precision);
    this.AirdopFactor = PrecisionUtility.truncate(Math.max(0.1, Math.min(0.2, (Number(this.purchaseAmount) + 980000) / 9900000)), 4, 'number');
  }

  async tryParticipation() {
    if (!this.apiClient.verifyLogin()) return;
    if (!this.purchaseAmount || isNaN(Number(this.purchaseAmount))) {
      this.showPopup(Events.PARTICIPATION_AMOUNT_INVALID, MessagePopupType.WARNING);
      return;
    }
    if (this.purchaseAmount > this.maxPurchasableAmount) {
      this.showPopup(ErrorType.INSUFFICIENT_BALANCE_TO_PARTICIPATE, MessagePopupType.WARNING);
      return;
    }
    if (this.event.minPurchase > Number(this.purchaseAmount)) {
      this.showPopup(ErrorType.MINIMUM_HOLD_UNSATISFIED, MessagePopupType.WARNING);
      return;
    }
    this.isParticipationButtonLoading = true;
    try {
      await this.apiClient.participateInEvent(this.catalogId, this.eventId, Number(this.purchaseAmount));
      this.showPopup(Events.SUCCESSFUL_PARTICIPATION, MessagePopupType.SUCCESS);
      this.purchaseAmount = null;
      await this.getMaxPurchasable();
    } catch (e) {
      this.showPopup(e.code, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isParticipationButtonLoading = false;
  }

  showPopup(code: number, type: MessagePopupType, callBack?: any) {
    let msgObj = new EventsMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm, '', callBack);
    setTimeout(() => MessagePopup.hide(callBack, showTime), 5000);
  }

}
