import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { INVITE, InviteMessages } from 'src/app/modules/share/messages/messages';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiClientService } from 'src/app/services/api-client.service';
import { BonusRecord } from '../../models/view-models';
import { SIGNUP_PATH } from 'src/constants/path';
@Component({
  selector: 'ccex-my-bonus',
  templateUrl: './my-bonus.component.html',
  styleUrls: ['./my-bonus.component.less']
})
export class MyBonusComponent implements OnInit {
  @ViewChild("copyLink") copyRef: ElementRef<any>;
  referralId: string = undefined;
  bonusHistories: BonusRecord[] = [];
  bonusRecords: BonusRecord[] = [];
  isBonusHistoriesTableLoading: boolean = true;
  isBonusRecordTableLoading: boolean = true;
  historiesPageIndex: number = 1;
  historiesTotalDataVolume: number = 0;
  detailsTotalDataVolume: number = 0;
  isBonusDetailPopupVisible: boolean = false;
  detailObj = { pageIndex: 1, coin: '', createdAt: null };
  get ReferralLink() {
    return SIGNUP_PATH + `?ref=${this.referralId}`;
  }
  constructor(
    private modalService: NzModalService,
    private localize: LocalizationService,
    private apiClient: ApiClientService,
  ) { }

  ngOnInit() {
    this.showReferralId();
    this.fetchBonusProfitHistories();
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

  async fetchBonusProfitHistories(pageIndex:number = 1) {
    this.historiesPageIndex = pageIndex;
    try {
      let histories = await this.apiClient.fetchBonusProfitHistories(this.historiesPageIndex);
      let bonusRecords = histories.docs.sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      this.bonusHistories = [];
      for (let record of bonusRecords) {
        this.bonusHistories = [...this.bonusHistories, new BonusRecord(
          record.coin,
          record.amount,
          record.createdAt
        )];
      }
      this.historiesTotalDataVolume = histories.total;
    }
    catch (e) {
      console.error(e);
    }
    this.isBonusHistoriesTableLoading = false;
  }

  openDetailWindow(coin: string, createdAt: number) {
    this.detailObj.coin = coin;
    this.detailObj.createdAt = createdAt;
    this.isBonusDetailPopupVisible = true;
    this.fetchBonusProfitsDetail();
  }

  async fetchBonusProfitsDetail(pageIndex: number = 1) {
    this.detailObj.pageIndex = pageIndex;
    try {
      let details = await this.apiClient.fetchBonusProfitDetail(this.detailObj.pageIndex, this.detailObj.coin, this.detailObj.createdAt);
      let detailRecords = details.docs.sort((a, b) => { return Number(b.amount) - Number(a.amount) });
      this.bonusRecords = [];
      for (let record of detailRecords) {
        this.bonusRecords = [...this.bonusRecords, new BonusRecord(
          record.coin,
          record.amount,
          record.createdAt,
          record.fromUserDisplayName,
          record.fromUserInvitedAt,
          record.fromUserGeneration
        )];
      }
      this.detailsTotalDataVolume = details.total;
    }
    catch (e) {
      console.error(e);
    }
    this.isBonusRecordTableLoading = false;
  }

  private async showReferralId() {
    let response = await this.apiClient.fetchReferralInfo();
    this.referralId = response.referralCode;
  }

  sortBonusHistories(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.bonusHistories.filter(_ => true);
    this.bonusHistories = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

  sortBonusRecords(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.bonusRecords.filter(_ => true);
    this.bonusRecords = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

}
