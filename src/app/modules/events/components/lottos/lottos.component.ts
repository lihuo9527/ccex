import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiClientService } from 'src/app/services/api-client.service';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
import { LottoDetail, LottoRecord } from '../../models/view-models';
import { FiatPriceService } from 'src/app/services/fiat-price.service';
@Component({
  selector: 'ccex-lottos',
  templateUrl: './lottos.component.html',
  styleUrls: ['./lottos.component.less']
})
export class LottosComponent implements OnInit {
  isLottoHistoriesPopupVisible: boolean = false;
  isUnlockRecordPopupVisible: boolean = false;
  lottoHistories: Array<LottoRecord> = [];
  unlockRecords: Array<LottoRecord> = [];
  lottos: Array<LottoDetail> = [];
  isLottosLoading: boolean = true;
  totalBonus: number = 0;
  lockBonus: number = 0;
  unlockBonus: number = 0;
  isReady: boolean = false;
  readonly baseCoin = "USDT";
  precision = this.baseCoin === 'USDT' ? 4 : 8;
  get TotalBonus() {
    return this.isReady ? PrecisionUtility.truncate(this.totalBonus, this.precision, 'number') : "--.--";
  }

  get LockBonus() {
    return this.isReady ? PrecisionUtility.truncate(this.lockBonus, this.precision, 'number') : "--.--";
  }

  get UnlockBonus() {
    return this.isReady ? PrecisionUtility.truncate(this.unlockBonus, this.precision, 'number') : "--.--";
  }

  constructor(
    public localize: LocalizationService,
    private apiClient: ApiClientService,
    private fiatPrice: FiatPriceService,
  ) { }

  ngOnInit() {
    if (this.apiClient.currentUser) this.fetchLottoResults();
    this.fetchLottos();
  }

  async fetchLottos() {
    this.isLottosLoading = true;
    try {
      let lottos = await this.apiClient.fetchLottos();
      for (let catalog in lottos) {
        for (let lotto of lottos[catalog]) {
          this.lottos = [...this.lottos, new LottoDetail(
            lotto._id,
            lotto.name,
            lotto.name_zh,
            lotto.coin,
            lotto.endsAt,
            lotto.min,
            lotto.max,
            lotto.event,
            lotto.description,
            lotto.description_zh,
            catalog
          )]
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.isLottosLoading = false;
  }

  async fetchLottoResults() {
    try {
      let marketPrices = await this.fiatPrice.fetch();
      let results = await this.apiClient.fetchLottoResults();
      for (let result of results) {
        let amount = this.fiatPrice.calculate(marketPrices, [{ symbol: result.coin, amount: result.amount }], this.baseCoin);
        this.lottoHistories = [...this.lottoHistories, new LottoRecord(
          result.id,
          result.name,
          result.coin,
          result.amount,
          result.createdAt,
          result.consumedBy
        )];
        if (result.consumedBy) {
          this.unlockBonus += amount;
          this.unlockRecords = [...this.unlockRecords, new LottoRecord(
            result.id,
            result.name,
            result.coin,
            result.amount,
            result.createdAt
          )];
        } else {
          this.lockBonus += amount;
        }
        this.totalBonus += amount;
      }
    } catch (e) {
      console.error(e);
    }
    this.isReady = true;
  }

  tryOpenLottoHistoriesPopup() {
    if (!this.apiClient.verifyLogin()) return;
    this.isLottoHistoriesPopupVisible = true;
  }

  tryOpenUnlockRecordPopup() {
    if (!this.apiClient.verifyLogin()) return;
    this.isUnlockRecordPopupVisible = true;
  }


}
