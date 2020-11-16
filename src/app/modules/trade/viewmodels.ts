import { DatetimeFormater } from "../../helpers/datetime-formater";
import { OrderType } from "../order/models/view-models";

export class TradeHistoryRecordModel {
  time: string = undefined;

  constructor(timestamp: number, public price: number, public amount: number, public type: 'buyer' | 'seller') {
    this.time = DatetimeFormater.toHourMinuteSecond(timestamp);
  }
}

export class OrderBookRecordModel {
  isVisible: boolean = true;
  precision: number = null;
  amountRatio: number = 0;
  constructor(
    public price: number | string = 0,
    public amount: number = 0,
    public total: number | string = 0,
    ) {
  }
}

export class OpenOrderRecordModel {
  datetime: string = undefined;
  get Type() {
    return `TRADE.${this.type}`;
  }

  constructor(
    public orderId: string,
    public timestamp: number,
    public type: OrderType,
    public price: number,
    public amount: number,
    public filled: number,
  ) {
    this.datetime = DatetimeFormater.toFullDateTime(timestamp);
  }
}

export class DealtOrderRecordModel {
  datetime: string = undefined;
  get Type() {
    return `TRADE.${this.type}`;
  }

  constructor(
    timestamp: number,
    public type: OrderType,
    public price: number,
    public amount: number
  ) {
    this.datetime = DatetimeFormater.toFullDateTime(timestamp);
  }
}