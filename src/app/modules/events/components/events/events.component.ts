import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { Event, ParticipationRecord, AirDropRecord } from '../../models/view-models';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
import { FiatPriceService } from 'src/app/services/fiat-price.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ccex-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {
  isAirDropCommissionPopupVisible: boolean = false;
  isMyParticipationPopupVisible: boolean = false;
  isEventsLoading: boolean = true;
  airDrops: Array<AirDropRecord> = [];
  events: Array<Event> = [];
  participations: Array<ParticipationRecord> = [];
  readonly baseCoin = "USDT";
  precision = this.baseCoin === 'USDT' ? 4 : 8;
  isReady: boolean = false;
  totalHoldings: number = 0;
  yesterdayEventAirDrops: number = 0;
  yesterdayCommissionAirDrops: number = 0;
  marketPrices = [];
  airDropsTotal: number = 0;
  airDropsPageIndex: number = 1;
  constructor(
    private apiClient: ApiClientService,
    public localize: LocalizationService,
    private fiatPrice: FiatPriceService,
    private router: Router,
  ) { }

  get TotalHoldings() {
    return this.isReady ? PrecisionUtility.truncate(this.totalHoldings, this.precision, 'number') : "--.--";
  }

  get YesterdayCommissionAirDrops() {
    return this.isReady ? PrecisionUtility.truncate(this.yesterdayCommissionAirDrops, this.precision, 'number') : "--.--";
  }

  get YesterdayEventAirDrops() {
    return this.isReady ? PrecisionUtility.truncate(this.yesterdayEventAirDrops, this.precision, 'number') : "--.--";
  }


  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    if (this.apiClient.currentUser) {
      await this.fetchMarketPrices();
      await Promise.all([
        this.fetchEventParticipations(),
        this.fetchYesterdayEventAirDrops(),
        this.fetchYesterdayCommissionAirDrops(),
        this.fetchEventAirDrops(),
        this.isReady = true
      ]);
    }
    await this.fetchEvents();
  }

  async fetchMarketPrices() {
    try {
      this.marketPrices = await this.fiatPrice.fetch();
    } catch (e) {
      console.error(e);
    }
  }

  async fetchEventParticipations() {
    try {
      let participations = await this.apiClient.fetchEventParticipations();
      for (let key in participations) {
        for (let record of participations[key]) {
          this.totalHoldings += this.fiatPrice.calculate(this.marketPrices, [{ symbol: record.eventCoin, amount: record.amount }], this.baseCoin);
          this.participations = [...this.participations, new ParticipationRecord(
            record._id,
            record.eventId,
            record.eventName,
            record.eventCoin,
            record.amount,
            record.createdAt,
            record.startsAt,
            record.endsAt,
            record.bonusCoin,
            record.isComplete,
            key
          )];
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async fetchYesterdayCommissionAirDrops() {
    try {
      let commissionAirDrops = await this.apiClient.fetchYesterdayCommissionAirDrops();
      for (let data of commissionAirDrops) {
        this.yesterdayCommissionAirDrops += this.fiatPrice.calculate(this.marketPrices, [{ symbol: data._id, amount: data.amount }], this.baseCoin);
      };
    } catch (e) {
      console.error(e);
    }
  }

  async fetchYesterdayEventAirDrops() {
    try {
      let airDrops = await this.apiClient.fetchYesterdayAirDrops();
      for (let data of airDrops) {
        this.yesterdayEventAirDrops += this.fiatPrice.calculate(this.marketPrices, [{ symbol: data._id, amount: data.amount }], this.baseCoin);
      };
    } catch (e) {
      console.error(e);
    }
  }

  async fetchEvents() {
    try {
      let events = await this.apiClient.fetchEvents();
      for (let key in events) {
        for (let event of events[key]) {
          this.events = [...this.events, new Event(
            event._id,
            event.name,
            event.name_zh,
            event.description,
            event.description_zh,
            event.coin,
            event.bonusCoin,
            event.fromPair,
            event.precision,
            event.bonusCoinPrecision,
            event.lengthInDay,
            event.minPurchase,
            event.delayInDay,
            event.startsAt,
            event.endsAt,
            key
          )];
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.isEventsLoading = false;
  }

  async fetchEventAirDrops(pageIndex: number = 1) {
    this.airDropsPageIndex = pageIndex;
    try {
      let result = await this.apiClient.fetchEventAirDrops(pageIndex);
      let docs = result.docs.sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) }) || [];
      this.airDrops = [];
      for (let data of docs) {
        this.airDrops = [...this.airDrops, new AirDropRecord(
          data.reason,
          data.coin,
          data.amount,
          data.createdAt
        )];
      }
      this.airDropsTotal = result.total;
    } catch (e) {
      console.error(e);
    }
  }

  onDetailClick(evnet: number) {
    if (!this.apiClient.verifyLogin()) return;
    switch (evnet) {
      case Events.MY_PARTICIPATION: 
        this.isMyParticipationPopupVisible = true;
        break;
      case Events.AIR_DROP_COMMISSION: 
        this.isAirDropCommissionPopupVisible = true;
        break;
      case Events.DAILY_COMMISSION_AIR_DROPS: 
        this.router.navigate(['/events/air_drop_commissions']);
        break
      default: throw new Error('unknown error');
    }
  }

}

enum Events {
  MY_PARTICIPATION = 1,
  AIR_DROP_COMMISSION = 2,
  DAILY_COMMISSION_AIR_DROPS = 3
}