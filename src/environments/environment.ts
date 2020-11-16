// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
export const environment = {
  production: false,
  baseUrl: 'http://localhost:3000',
  tickersUrl: 'http://localhost:3003/history',
  tickerWssUrl: 'ws://localhost:8889/',
  wssUrl: 'ws://localhost:8888/',
};
*/

/* for development use */
export const environment = {
  production: false,
  supportArticlesUrl: 'https://support.glenbit.com/article/',
  announcementsUrl: './assets/dummy/announcements.json',
  mobileSiteUrl: 'https://m.glenbit.com',
  baseUrl: 'http://ec2-54-227-217-12.compute-1.amazonaws.com',
  tickersUrl: 'https://tv-feeder.glenbit.com/history',
  tickerWssUrl: 'wss://stream-tickers.glenbit.com/websocket',
  wssUrl: 'wss://stream-main.glenbit.com/',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
