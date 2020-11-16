import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private readonly websocketUrl = 'wss://streamer.cryptocompare.com';

  private isConnected: boolean = false;
  private socket: SocketIOClient.Socket = undefined;
  private eventSubject: Subject<EventType> = new Subject<EventType>();
  get OnDisconnectedAsObservable() {
    return this.eventSubject.asObservable()
                            .pipe(filter(eventType => eventType === EventType.OnDisconnected
                                                   || eventType === EventType.OnError));
  }
  private onMessageSubject: Subject<any> = new Subject<any>();
  get OnMessageAsObservable() {
    return this.onMessageSubject.asObservable();
  }

  constructor() { }

  async connect() {
    if (this.isConnected) return;
    this.socket = io(this.websocketUrl);

    this.socket.once('connect', () => {
      this.eventSubject.next(EventType.OnConnected);
      this.isConnected = true;
    });
    this.socket.once('disconnect', () => {
      this.eventSubject.next(EventType.OnDisconnected);
      this.isConnected = false;
    });
    this.socket.once('error', e => {
      this.eventSubject.next(EventType.OnError);
      this.isConnected = false;
    });
    this.socket.on('m', msg => this.onMessageSubject.next(msg));

    await this.awaitConnection();
  }

  private awaitConnection() {
    return new Promise(resolve => this.eventSubject
      .pipe(filter(eventType => eventType === EventType.OnConnected))
      .subscribe(_ => resolve())
    );
  }

  send(eventName: string, data: any) {
    if (!this.isConnected) return;
    this.socket.emit(eventName, data);
  }

  disconnect() {
    if (!this.isConnected) return;
    this.socket.disconnect();
  }
}

export enum EventType {
  OnConnected,
  OnDisconnected,
  OnError
};