import { IBasicDataFeed, SearchSymbolsCallback, ResolutionString, ResolutionBackValues } from "../../../../../../assets/charting_library/charting_library.min";
import { HistoryDepth, OnReadyCallback, LibrarySymbolInfo, HistoryCallback, ErrorCallback, SubscribeBarsCallback, ResolveCallback, Bar, Timezone } from "../../../../../../assets/charting_library/datafeed-api";
import { HttpClientService } from "../../../../../services/http-client.service";
import { TV_CONFIGS } from "./configurations";
import { Subscription, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { TickersService } from "src/app/services/tickers.service";
import { DatetimeFormater } from "src/app/helpers/datetime-formater";

export class Datafeed implements IBasicDataFeed {
  private currentResolution: string = undefined;
  private currentLastBars: { [resolution: string]: Bar } = {};
  private onTick: SubscribeBarsCallback = undefined;

  constructor(
    private currentPair: string,
    private httpClient: HttpClientService,
    private tickersService: TickersService,
    private timezone: Timezone = 'Asia/Shanghai',
    private pricescale: number = 1000000,
    private volumePrecision: number = 6
  ) {
  }

  onReady(callback: OnReadyCallback) {
    Promise.resolve(TV_CONFIGS.DatafeedCofigurationStub).then(_ => callback(_));

  }

  getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, onResult: HistoryCallback, onError: ErrorCallback, isFirstCall: boolean) {
    // NOTE: rangeStartDate & rangeEndDate is in local timezone!!!
    this.getHistoryData(symbolInfo, resolution, rangeStartDate, rangeEndDate, isFirstCall)
      .then(bars => onResult(bars, { noData: bars.length < 1 }))
      .catch(e => onError(e));
  }

  clear() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
    this.tickerHeartBeatSubscription.unsubscribe();
  }

  private currentSubscription: Subscription = undefined;
  subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void) {
    this.currentResolution = resolution;
    this.onTick = onTick;
    if (this.currentSubscription === undefined) {
      this.currentSubscription = this.tickersService.OnTickerAsObservable.subscribe(pair => this.subscribeBarsInternal(pair));
    }
  }

  unsubscribeBars(listenerGuid: string) {
    this.tickerHeartBeatSubscription.unsubscribe();
  }

  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback) {
    let arr = symbolName.split('/');
    let symboInfo = TV_CONFIGS.LibrarySymbolInfoStub;
    symboInfo.name = symbolName;
    symboInfo.ticker = symbolName;
    symboInfo.description = symbolName;
    symboInfo.timezone = this.timezone;
    symboInfo.pricescale = this.pricescale;
    symboInfo.volume_precision = this.volumePrecision;
    if (arr[1].match(/^(USD|EUR|JPY|AUD|GBP|KRW|CNY)$/)) {
      symboInfo.pricescale = 100;
    }
    Promise.resolve(symboInfo)
      .then(_ => onResolve(_))
      .catch(e => onError(e));
  }

  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback) {

  }

  calculateHistoryDepth(resolution: ResolutionString, resolutionBack: ResolutionBackValues, intervalBack: number): HistoryDepth | undefined {
    return parseInt(resolution, 10) < 60 ? {resolutionBack: 'D', intervalBack: 1} : undefined
  }

  private tickerHeartBeatSubscription: Subscription = new Subscription();
  private async getHistoryData(symboInfo: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, isFirstCall: boolean) {
    if (!resolution.endsWith('D') && resolution !== this.currentResolution) {
      let frequency = parseInt(resolution);
      let interval = DatetimeFormater.OneMinute * frequency;
      let now = Date.now();
      let delay = frequency === 1 ? new Date(now + interval).setSeconds(0, 0) - now : new Date(now + interval).setMinutes(0, 0, 0) - now;
      this.tickerHeartBeatSubscription = timer(delay, interval)
        .subscribe(() => {
          let time = frequency === 1 ? new Date().setSeconds(0, 0) : new Date().setMinutes(0, 0, 0);
          let currentLastBar = this.currentLastBars[this.currentResolution]
          if (!currentLastBar) return;
          let lastbar = {
            time: time,
            open: currentLastBar.close,
            low: currentLastBar.close,
            high: currentLastBar.close,
            close: currentLastBar.close,
            volume: 0
          };
          this.onTick(lastbar);
          this.currentLastBars[this.currentResolution] = lastbar;
        });
    }

    this.currentResolution = resolution;
    let arr = symboInfo.name.split('/');
    let endpoint = resolution.endsWith('D') ? '/day' : parseInt(resolution, 10) >= 60 ? '/hour' : '/minute';
    let res = await this.httpClient.post(
      environment.tickersUrl + endpoint, ['pair', `${arr[0]}-${arr[1]}`, 'start', rangeStartDate, 'end', rangeEndDate]
    );

    if (res.length === 0) return [];
    let bars: Bar[] = res.map(el => {
      return {
        time: el._id,
        open: el.open,
        high: el.high,
        low: el.low,
        close: el.close,
        volume: el.volume
      };
    });

    if (isFirstCall) {
      this.currentLastBars[resolution] = bars[bars.length - 1];
    }
    return bars;
  }

  private subscribeBarsInternal(pair: string) {
    if (pair !== this.currentPair) return;
    let currentLastBar = this.currentLastBars[this.currentResolution];
    if (!currentLastBar) return;

    let ticker = this.tickersService.tickers[pair];
    if (!ticker.updatedAt) return;

    let time = ticker.updatedAt;
    if (this.currentResolution.endsWith('D')) {
      time = new Date(time).setHours(0, 0, 0, 0);
    } else if (parseInt(this.currentResolution, 10) >= 60) {
      time = new Date(time).setMinutes(0, 0, 0);
    } else {
      time = new Date(time).setSeconds(0, 0);
    }

    let isNew = time > currentLastBar.time;

    let lastbar = {
      time: time,
      open: isNew ? currentLastBar.close : currentLastBar.open,
      low: isNew ? ticker.close : Math.min(currentLastBar.low, ticker.close),
      high: isNew ? ticker.close :  Math.max(currentLastBar.high, ticker.close),
      close: ticker.close,
      volume: isNew ? ticker.volumeDiff : currentLastBar.volume + ticker.volumeDiff
    };

    this.onTick(lastbar);
    this.currentLastBars[this.currentResolution] = lastbar;
  }

}