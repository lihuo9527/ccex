import { Component, Input, OnInit } from '@angular/core';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  Timezone,
} from '../../../../../assets/charting_library/charting_library.min';
import { HttpClientService } from '../../../../services/http-client.service';
import { Datafeed } from './data-feed/data-feed';
import { TV_CONFIGS } from './data-feed/configurations';
import { LocalizationService } from 'src/app/services/localization.service';
import { TickersService } from 'src/app/services/tickers.service';

@Component({
  selector: 'app-tv-chart-container',
  templateUrl: './tv-chart-container.component.html',
  styleUrls: ['./tv-chart-container.component.less']
})
export class TvChartContainerComponent implements OnInit {
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'ETH/BTC';
  private _interval: ChartingLibraryWidgetOptions['interval'] = '180';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';

  private _timezone: any = Intl.DateTimeFormat().resolvedOptions().timeZone;
  private _priceScale: number = 1000000;
  private _volumePrecision: number = 6;

  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set interval(interval: ChartingLibraryWidgetOptions['interval']) {
    this._interval = interval || this._interval;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
    this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
  }

  @Input()
  set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
    this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
  }

  @Input()
  set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
    this._clientId = clientId || this._clientId;
  }

  @Input()
  set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
    this._userId = userId || this._userId;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }

  @Input()
  set timezone(timezone: Timezone) {
    this._timezone = timezone || this._timezone;
  }

  @Input()
  set priceScale(priceScale: number) {
    this._priceScale = priceScale || this._priceScale;
  }

  @Input()
  set volumePrecision(volumePrecision: number) {
    this._volumePrecision = volumePrecision || this._volumePrecision;
  }

  constructor(
    private httpClient: HttpClientService,
    private localize: LocalizationService,
    private tickersService: TickersService
  ) { }

  private dataFeed: Datafeed = undefined;
  ngOnInit() {
    let locale: LanguageCode = 'zh';
    let browserLanguage = navigator.language.startsWith('zh') ? 'zh_CN' : 'en_US';
    let lang = localStorage.getItem('LANG') || browserLanguage;
    if (lang !== 'zh_CN') locale = 'en';

    this.dataFeed = new Datafeed(this._symbol.replace('/', '-'), this.httpClient, this.tickersService, this._timezone, this._priceScale, this._volumePrecision);
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol,
      datafeed: this.dataFeed,
      interval: this._interval,
      container_id: this._containerId,
      library_path: this._libraryPath,
      timezone: this._timezone,
      locale: locale,
      disabled_features: [
        "create_volume_indicator_by_default",
        // "volume_force_overlay",
        'use_localstorage_for_settings',
        'header_symbol_search',
        'symbol_search_hot_key',
        'legend_context_menu'
      ],
      enabled_features: [
        'hide_left_toolbar_by_default',
        'caption_buttons_text_if_possible',
      ],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      toolbar_bg: '#353B41',
      theme: 'Dark',
      overrides: TV_CONFIGS.OverridesStub,
      studies_overrides: TV_CONFIGS.StudyOverridesStub
    };

    let w = new widget(widgetOptions);
    w.onChartReady(() => {
      w.chart().createStudy('moving average', false, false, [7, 'close', 0], undefined, {"plot.color": "#f6ff5b", "plot.linewidth": 2});
      w.chart().createStudy('moving average', false, false, [30, 'close', 0], undefined, {"plot.color": "#ffffff", "plot.linewidth": 2});
      w.chart().createStudy('volume', false, false, [], undefined, {"show ma": true, "ma length": 5, "volume ma.plottype": "line", "volume ma.color": "#00ff00", "volume ma.linewidth": 3});
    });
  }

  ngOnDestroy() {
    this.dataFeed.clear();
    this.dataFeed = undefined;
  }

  private getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);

    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
  }

}
