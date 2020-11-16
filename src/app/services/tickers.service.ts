import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TickersService {
  isConnected = false;
  private tickersWs: WebSocket = undefined;
  private readonly kHeartBeatInterval = 30000;
  private readonly kHeartBeatPing = 'hb';
  private readonly kHeartBeatPong = 'k';

  private tickerSubject: Subject<string> = new Subject<string>();
  get OnTickerAsObservable() {
    return this.tickerSubject.asObservable();
  }

  tickers: { [pair: string]: Ticker } = {};

  private interval = undefined;

  constructor() { }

  disconnect() {
    if (this.isConnected && this.tickersWs) {
      this.tickersWs.close();
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  reconnect() {
    this.tickersWs = new WebSocket(environment.tickerWssUrl);
    this.tickersWs.onopen = event => {
      this.isConnected = true;
      this.interval = setInterval(() => {
        if (!this.isConnected) {
          this.tickersWs.close();
          clearInterval(this.interval);
          this.reconnect();
          return;
        }
        this.tickersWs.send(this.kHeartBeatPing);
        this.isConnected = false;
      }, this.kHeartBeatInterval);
    };
    this.tickersWs.onclose = errorEvent => {
      this.isConnected = false;
      console.warn('closed with code: ' + errorEvent.code + ', reason: ' + errorEvent.reason);
    };
    this.tickersWs.onerror = error => {
      this.isConnected = false;
      console.error(error);
    };

    this.tickersWs.onmessage = event => {
      this.isConnected = true;
      if (event.data === this.kHeartBeatPong) return;
      if (event.data === 'ping') {
        this.tickersWs.send('pong');
        return;
      }
      let data = JSON.parse(event.data);
      if (data.close) {
        this.tickers[data.pair] = data;
        this.tickerSubject.next(data.pair);
      } else {
        this.tickers = data;
        this.tickerSubject.next(undefined);
      }
    };
  }
}

class Ticker {
  pair: string;
  updatedAt: number;
  close: number;
  high: number;
  low: number;
  change: number;
  volume: number;
  volumeDiff: number;
}