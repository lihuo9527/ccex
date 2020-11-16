import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LottoDetail } from '../../models/view-models';
import { LocalizationService } from 'src/app/services/localization.service';
import { Events, EventsMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'ccex-lotto-detail',
  templateUrl: './lotto-detail.component.html',
  styleUrls: ['./lotto-detail.component.less']
})
export class LottoDetailComponent implements OnInit {
  lottoId: string = null;
  catalogId: string = null;
  lotto: LottoDetail = null;
  isReady: boolean = false;
  isExecuteLottoLoading: boolean = false;
  isLottoOpenPopupVisible: boolean = false;
  lottoAmount: number = 0;
  lottoCoin: string = null;
  constructor(
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
    public localize: LocalizationService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.lottoId = this.route.snapshot.paramMap.get("lottoId");
    this.catalogId = this.route.snapshot.paramMap.get("catalogId");
    this.fetchLottoDetail();
  }

  async fetchLottoDetail() {
    try {
      let lotto = await this.apiClient.fetchLottoDetail(this.catalogId, this.lottoId);
      this.lotto = new LottoDetail(
        this.lottoId,
        lotto.name,
        lotto.name_zh,
        lotto.coin,
        lotto.endsAt,
        lotto.min,
        lotto.max,
        lotto.event,
        this.sanitizer.bypassSecurityTrustHtml(lotto.description),
        this.sanitizer.bypassSecurityTrustHtml(lotto.description_zh),
      )
    } catch (e) {
      console.error(e);
    }
    this.isReady = true;
  }

  async executeLotto() {
    if (!this.apiClient.verifyLogin()) return;
    this.isExecuteLottoLoading = true;
    try {
      let result = await this.apiClient.executeLotto(this.catalogId, this.lottoId);
      this.lottoAmount = result.amount;
      this.lottoCoin = result.coin;
      this.isLottoOpenPopupVisible = true;
    } catch (e) {
      this.showPopup(Events.REPEAT_PARTICIPATION, MessagePopupType.WARNING);
      console.error(e);
    }
    this.isExecuteLottoLoading = false;
  }

  showPopup(code: number, type: MessagePopupType, callBack?: any) {
    let msgObj = new EventsMessages(this.localize.currentLanguage.id).getMessage(code);
    let showTime = MessagePopup.show(type, msgObj.title, msgObj.text, msgObj.confirm, '', callBack);
    setTimeout(() => MessagePopup.hide(callBack, showTime), 5000);
  }

  participationEvents() {
    this.router.navigate(['/events']);
  }
  
} 
