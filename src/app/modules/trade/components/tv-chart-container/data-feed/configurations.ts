import { DatafeedConfiguration } from "../../../../../../assets/charting_library/datafeed-api";
import { LibrarySymbolInfo } from "../../../../../../assets/charting_library/charting_library.min";

export namespace TV_CONFIGS {
  export const OverridesStub = {
    "mainSeriesProperties.showCountdown": true,
    "paneProperties.background": "#182027",
    "paneProperties.vertGridProperties.color": "#363c4e",
    "paneProperties.horzGridProperties.color": "#363c4e",
    "symbolWatermarkProperties.transparency": 90,
    "scalesProperties.textColor" : "#AAA",
    "mainSeriesProperties.candleStyle.upColor": "#00ACDC",
    "mainSeriesProperties.candleStyle.downColor": "#F04A5D",
    "mainSeriesProperties.candleStyle.wickUpColor": 'rgba(0, 172, 220, 1)',
    "mainSeriesProperties.candleStyle.wickDownColor": 'rgba(240, 74, 93, 1)',
  };
  export const StudyOverridesStub = {
    "volume.volume.color.0": "#F04A5D",
    "volume.volume.color.1": "#00ACDC",
  };

  export const DatafeedCofigurationStub: DatafeedConfiguration = {
    // supported_resolutions: ['1', '5', '15', '30', '60', '720', '1D', '3D', '1W', '1M'],
    supported_resolutions: ['1', '5', '15', '30', '60', '180', '360', '720', '1440'],
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true
  };

  export const LibrarySymbolInfoStub: LibrarySymbolInfo = {
    name: '',
    full_name: '',
    description: '',
    type: 'crypto',
    session: '24x7',
    timezone: 'Asia/Shanghai',
    ticker: '',
    listed_exchange: '',
    exchange: '',
    minmov: 1,
    pricescale: 100000000,
    has_intraday: true,
    intraday_multipliers: ['1', '60'],
    supported_resolutions: DatafeedCofigurationStub.supported_resolutions,
    volume_precision: 8,
    data_status: 'streaming'
  };
}