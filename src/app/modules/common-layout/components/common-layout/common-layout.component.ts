import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../../services/api-client.service';
import { Router } from '@angular/router';
import { LocalizationService } from 'src/app/services/localization.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ccex-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.less']
})
export class CommonLayoutComponent implements OnInit {
  announcements: {id: number, zh: string, en: string, url: string}[] = [];
  isFinancingTwoLevelMenuOpen: boolean = false;
  isOverViewTwoLevelMenuOpen: boolean = false;
  isTradeTwoLevelMenuOpen: boolean = false;
  isEventCenterTwoLevelMenuOpen: boolean = false;
  constructor(
    private router: Router,
    public apiClient: ApiClientService,
    public localize: LocalizationService,
    private httpClient: HttpClientService,
  ) {
  }

  ngOnInit() {
    this.httpClient.get(`${environment.announcementsUrl}?t=${Date.now()}`)
      .then(results => this.announcements = results)
      .catch(e => console.error(e));
    let support: any = document.getElementById('ze-snippet');
    if (!support) {
      support = document.createElement('script');
      support.id = 'ze-snippet';
      support.src = 'https://static.zdassets.com/ekr/snippet.js?key=bd332cb7-f474-4100-932f-a04089fa08ab';
      support.acync = true;
      document.body.appendChild(support);
      support.onload = () => {
        //@ts-ignore
        window.zESettings = {
          color: {
            theme: '#00ACDC',
            launcherText: '#fff'
          },
          offset: {
            horizontal: '10px',
            vertical: '50px'
          }
        };
        this.localizeZendesk();
      }
    }
  }

  private localizeZendesk() {
    //@ts-ignore
    window.zE('webWidget', 'setLocale', this.localize.currentLanguage.id);

    //@ts-ignore
    window.zE('webWidget', 'updateSettings', {
      webWidget: {
        launcher: {
          label: {
            '*': this.localize.LanguageId === 'zh_CN' ? '联系我们' : 'Contact Us'
          },
        }
      }
    });
  }

  login() {
    this.router.navigate(['/account/login'])
  }

  signup() {
    this.router.navigate(['/account/signup'])
  }

  enterTradePage() {
    window.location.href = '/trade/BTC-USDT';
  }

  logout() {
    this.apiClient.logout();
  }

  changeLanguage(language) {
    this.localize.changeLanguage(language);
    this.localizeZendesk();
    let urlArr = ['financing/products_on_sale', 'financing/product_details'];
    urlArr.forEach(url => {
      if (window.location.href.indexOf(url) > -1) window.location.reload();
    });
  }
}