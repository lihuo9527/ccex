import { Injectable } from '@angular/core';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd'; // NOTE: DO NOT forget to import locales here!!!
import { TranslateService } from '@ngx-translate/core';
import { HttpClientService } from './http-client.service';
import { COUNTRIES_PATH } from 'src/constants/path';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private readonly kLocalStorageKey = 'LANG';
  currentLanguage: Language = new Language();
  availableLanguages: Language[] = [];
  countryCodes = [];
  constructor(
    private translateService: TranslateService,
    private nzI18nService: NzI18nService,
    private http: HttpClientService,
  ) {
    this.initialize();
  }

  get LanguageId() {
    let browserLanguage = navigator.language.startsWith('zh') ? 'zh_CN' : 'en_US';
    return localStorage.getItem(this.kLocalStorageKey) || browserLanguage;
  }

  async initialize() {
    let id = this.LanguageId;
    I18nLoading.show(id);
    let countries = (await this.http.get(COUNTRIES_PATH)).sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1);
    for (let country of countries) {
      this.countryCodes.push(country.countryCode);

      let locale = LocaleDict[country.id];
      if (!locale) continue;
      let language = {
        id: country.id,
        locale: locale,
        displayName: country.language,
        iconUrl: country.iconUrl
      };
      this.availableLanguages.push(language);
      if (id === country.id) this.currentLanguage = language;
    }
    this.translateService.setDefaultLang('en_US');
    this.changeLanguage(this.currentLanguage);
  }

  changeLanguage(language: Language) {
    this.nzI18nService.setLocale(language.locale);
    this.translateService.use(language.id).toPromise()
      .then(_ => I18nLoading.hide())
      .catch(_ => I18nLoading.fail());
    this.currentLanguage = language;
    localStorage.setItem(this.kLocalStorageKey, language.id);
    document.title = language.id === 'zh_CN' ? '数字货币交易所 | 区块链资产理财平台 | 格林' : 'Cryptocurrency Exchange | Blockchain Financing Platform | GlenBit';
  }
}

class Language {
  id: string = undefined;
  locale: any = undefined;
  displayName: string = undefined;
  iconUrl: string = undefined;
}

// ATTENTION: Keys MUST match filenames of assets/i18n/*.json !!!
const LocaleDict = {
  zh_CN: zh_CN,
  en_US: en_US
};

class I18nLoading {
  static show(language: string) {
    let i18nText = I18nLoading.getI18nTextObj(language);
    let element = document.createElement("div");
    element.id = "i18nContainer";
    let css = `<style>
                  #i18nLoadingBox {
                  width: 100%;
                  height: 100%;
                  z-index: 5000;
                  background: #fff;
                  display: flex;
                  position: fixed;
                  top: 0;
                  left: 0;
                  }

                  #i18nFailureBox {
                    width: 100%;
                    height: 100%;
                    z-index: 5000;
                    background: #fff;
                    position: fixed;
                    top: 0;
                    left: 0;
                    display: none;
                  }

                  .loadingIcon {
                    width: 24px;
                    height: 24px;
                    animation: 0.9s linear infinite loadingCircle;
                    border-radius: 50%;
                    border-left: 1px solid #eee;
                    border-bottom: 1px solid #666;
                  }

                  @keyframes loadingCircle {
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                </style>`
    let template = `<div id="i18nLoadingBox">
                      <div style="display:flex;flex-flow: wrap;width: 100%;justify-content:center;align-items:center;">
                        <i class="loadingIcon"></i>
                        <span style="padding-left:16px;font-size:18px;color:#888;">${i18nText.loading}</span>
                      </div>
                    </div>
                    <div id="i18nFailureBox">
                      <div style="display:flex;flex-flow: wrap;width: 100%;justify-content:center;align-items:center;">
                        <span style="font-size:18px;color:#888;">${i18nText.failure}</span>
                        <a id="reLoadBtn" style="font-size:18px;color:#00ACDC;padding-left:10px;" >${i18nText.retry} </a>
                      </div>
                    </div>
                    `;
    element.innerHTML = css + template;
    document.body.appendChild(element);
    document.body.style.overflow = "hidden";
    document.getElementById("reLoadBtn").onclick = () => { window.location.reload(); };
  }

  static fail() {
    document.getElementById("i18nLoadingBox").style.display = "none";
    document.getElementById("i18nFailureBox").style.display = "flex";
  }

  private static getI18nTextObj(id: string) {
    return id === 'zh_CN' ? { loading: "加载中.....", retry: "重试", failure: "加载失败!" }
                          : { loading: "Loading.....", retry: "Retry", failure: "Loading Failure!" };
  }

  static hide() {
    let element = document.getElementById('i18nContainer');
    if (element) {
      element.parentNode.removeChild(element);
      document.body.style.overflow = "auto";
    }
  }
}