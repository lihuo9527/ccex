import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class FiatPriceService {
  constructor(
    private apiClient: ApiClientService
  ) { }

  async fetch(): Promise<any[]> {
    return await this.apiClient.fetchMarketPrices();
  }

  calculate(marketPrices: any[], coins: { symbol: string, amount: number }[], baseSymbol: string, altSymbol: string = undefined) {
    let result = 0;
    for (let coin of coins) {
      let found = marketPrices.find(ele => ele.from === coin.symbol && ele.to === baseSymbol);
      if (!found) {
        found = marketPrices.find(ele => ele.from === coin.symbol && ele.to === altSymbol);
        if (!found) {
          console.warn(`unfound combination: ${coin.symbol} -> ${baseSymbol}`);
        } else {
          let tmp = marketPrices.find(ele => ele.from === baseSymbol && ele.to === altSymbol);
          if (!tmp) {
            console.warn(`unfound temporary combination: ${baseSymbol} -> ${altSymbol}`);
            continue;
          }
          result += coin.amount * (found.price / tmp.price);
        }
        continue;
      }
      result += coin.amount * found.price;
    }
    return result;
  }
}
