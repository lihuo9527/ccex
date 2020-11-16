import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ccex-daily-ranking',
  templateUrl: './daily-ranking.component.html',
  styleUrls: ['./daily-ranking.component.less']
})
export class DailyRankingComponent implements OnInit {
  eventId: string;
  catalogId: string;
  rankings = [];
  isRankingsTableLoading: boolean = false;
  constructor(
    private apiClient: ApiClientService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get("eventId");
    this.catalogId = this.route.snapshot.paramMap.get("catalogId");
    this.fetchEventDailyRanking();
  }

  async fetchEventDailyRanking() {
    try {
      this.rankings = (await this.apiClient.fetchEventDailyRanking(this.catalogId, this.eventId)).sort((a, b) => { return Number(a.rank) - Number(b.rank)});
    } catch (e) {
      console.error(e);
    }
  }

}
