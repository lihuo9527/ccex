import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TradingService {
  isConnected = false;
  private ws: WebSocket = undefined;
  private readonly kHeartBeatInterval = 30000;
  private readonly kHeartBeatPing = 'hb';
  private readonly kHeartBeatPong = 'k';

  private currentPairStr: string = undefined;

  private onUpdateSubject: Subject<any> = new Subject<any>();
  get OnUpdatedAsObservable() {
    return this.onUpdateSubject.asObservable();
  }

  private interval = undefined;
  disconnect() {
    if (this.ws && this.isConnected) {
      this.ws.close();
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  reconnect(pairStr: string) {
    if (this.currentPairStr === pairStr) return;
    this.currentPairStr = pairStr;
    if (this.ws && this.isConnected) this.ws.close();

    this.ws = new WebSocket(environment.wssUrl + this.currentPairStr);
    this.ws.onopen = event => {
      this.isConnected = true;
      this.interval = setInterval(() => {
        if (!this.isConnected) {
          this.ws.close();
          clearInterval(this.interval);
          this.reconnect(this.currentPairStr);
          return;
        }
        this.ws.send(this.kHeartBeatPing);
        this.isConnected = false;
      }, this.kHeartBeatInterval);
    };
    this.ws.onclose = errorEvent => {
      this.isConnected = false;
      console.warn('closed with code: ' + errorEvent.code + ', reason: ' + errorEvent.reason);
    };
    this.ws.onerror = error => {
      this.isConnected = false;
      console.error(error);
    };

    this.ws.onmessage = event => {
      this.isConnected = true;
      if (event.data === this.kHeartBeatPong) return;
      if (event.data === 'ping') {
        this.ws.send('pong');
        return;
      }
      let data = JSON.parse(event.data);
      this.onUpdateSubject.next(data);
    };
  }
}
