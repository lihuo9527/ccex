import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { AirDropRecord } from '../../models/view-models';
@Component({
  selector: 'ccex-air-drop-commissions',
  templateUrl: './air-drop-commissions.component.html',
  styleUrls: ['./air-drop-commissions.component.less']
})
export class AirDropCommissionsComponent implements OnInit {

  constructor(
    private apiClient: ApiClientService,
    public localize: LocalizationService,
  ) { }
  commissionAirDrops: Array<AirDropRecord> = [];
  commissionAirDropDetails: Array<AirDropRecord> = [];
  pageIndex: number = 1;
  commissionAirDropsTotal: number = 0;
  isDetailsTableLoading: boolean = false;
  isCommissionAirDropsTableLoading: boolean = true;
  isCommissionDetailPopupVisible: boolean = false;
  currentCreatedAt;
  ngOnInit() {
    this.fetchDailyCommissionAirDrops();
  }

  async fetchDailyCommissionAirDrops(pageIndex: number = 1) {
    this.pageIndex = pageIndex;
    try {
      let result = await this.apiClient.fetchDailyCommissionsAirDrops(pageIndex);
      let docs = result.docs.sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) }) || [];
      this.commissionAirDrops = [];
      for (let data of docs) {
        this.commissionAirDrops = [...this.commissionAirDrops, new AirDropRecord(
          data.reason,
          data.coin,
          data.amount,
          data.createdAt
        )];
      }
      this.commissionAirDropsTotal = result.total;
    } catch (e) {
      console.log(e);
    }
    this.isCommissionAirDropsTableLoading = false;
  }

  sortCommissionAirDrops(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.commissionAirDrops.filter(_ => true);
    this.commissionAirDrops = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

  openDetailWindow(createdAt: number) {
    this.currentCreatedAt = createdAt;
    this.isCommissionDetailPopupVisible = true;
    this.fetchCommissionAirDropDetails(createdAt);
  }

  async fetchCommissionAirDropDetails(createdAt: number) {
    this.isDetailsTableLoading = true;
    try {
      let details = (await this.apiClient.fetchCommissionAirDropDetails(createdAt)).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) }) || [];
      this.commissionAirDropDetails = [];
      for (let data of details) {
        this.commissionAirDropDetails = [...this.commissionAirDropDetails, new AirDropRecord(
          data.reason,
          data.coin,
          data.amount,
          data.createdAt
        )];
      }
    } catch (e) {
      console.error(e);
    }
    this.isDetailsTableLoading = false;
  }

  sortCommissionDetails(sort: { key: string, value: string }) {
    if (sort.value === null) return;
    const data = this.commissionAirDropDetails.filter(_ => true);
    this.commissionAirDropDetails = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

}
