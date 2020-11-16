import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { NzModalService } from 'ng-zorro-antd';
import { CommissionRecord, InviteRecord } from '../models/view-models';
import { LocalizationService } from 'src/app/services/localization.service';
import { INVITE, InviteMessages } from 'src/app/modules/share/messages/messages';
import { FiatPriceService } from 'src/app/services/fiat-price.service';
import { ErrorType } from 'src/app/models/error';
import { SIGNUP_PATH } from 'src/constants/path';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.less']
})
export class InviteComponent implements OnInit {
  @ViewChild("copyLink") copyRef: ElementRef<any>;
  referralId: string = undefined;
  invitations: InviteRecord[] = [];
  commissions: CommissionRecord[] = [];

  get ReferralLink() {
    return SIGNUP_PATH + `?ref=${this.referralId}`;
  }
  get TotalCommissions() {
    return PrecisionUtility.truncate(this.totalCommissions, 8, 'string');
  }
  get CommissionsUsdValue() {
    return PrecisionUtility.truncate(this.commissionsUsdValue, 2, 'string');
  }
  get CommissionRatio() {
    return !this.commissionRatio ? '-.-' : `${this.truncateToPrecision(this.commissionRatio * 100, 0)}`;
  }

  private totalCommissions: number = 0;
  private commissionsUsdValue: number = 0;
  private commissionRatio: number = undefined;

  constructor(
    private apiClient: ApiClientService,
    private modalService: NzModalService,
    public localize: LocalizationService,
    private fiatPrice: FiatPriceService,
  ) { }

  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    try {
      Promise.all([
        this.showReferralId(),
        this.fetchInvitations(),
        this.fetchCommissions(),
      ]);
    } catch (e) {
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
      // NOTE: refresh referral id if UnknownError
      if (e.code === ErrorType.UNKNOWN) {
        this.showReferralId();
      }
    }
  }

  private async showReferralId() {
    let response = await this.apiClient.fetchReferralInfo();
    this.referralId = response.referralCode;
    this.commissionRatio = response.commissionRatio;
  }

  private async fetchInvitations() {
    let invitations = (await this.apiClient.fetchInvitations())
                      .sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
    for (let invitation of invitations) {
      this.invitations = [...this.invitations, new InviteRecord(
        invitation.name,
        Number(invitation.createdAt),
      )];
    }
  }

  private async fetchCommissions() {
    let commissions = (await this.apiClient.fetchCommissions()).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
    if (commissions.length === 0) return;

    for (let commission of commissions) {
      this.commissions = [...this.commissions, new CommissionRecord(
        commission.fromUser,
        commission.coin,
        commission.amount,
        Number(commission.updatedAt)
      )];
    }
    let marketPrices = await this.fiatPrice.fetch();
    let coins = this.commissions.map(commission => { return { symbol: commission.coin, amount: commission.amount } });
    this.totalCommissions = this.fiatPrice.calculate(marketPrices, coins, 'BTC', 'USDT');
    let usdtValue = this.fiatPrice.calculate(marketPrices, [{symbol: 'BTC', amount: this.totalCommissions}], 'USDT');
    this.commissionsUsdValue = this.fiatPrice.calculate(marketPrices, [{symbol: 'USDT', amount: usdtValue}], 'USD');
  }

  private truncateToPrecision(value: number, precision: number) {
    let tmp = Math.pow(10, precision);
    return Math.floor(value * tmp) / tmp;
  }


  copyReferralLink() {
    this.copyRef.nativeElement.select();
    document.execCommand("Copy", true, null);
    let messageObj = new InviteMessages(this.localize.currentLanguage.id).getMessage(INVITE.COPY_SUCCESS);
    let modalRef = this.modalService.success({
      nzTitle: messageObj.title,
      nzContent: messageObj.text
    });
    setTimeout(() => {
      modalRef.close();
    }, 2000);
  }
}
