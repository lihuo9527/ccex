import { DatetimeFormater } from "../../../helpers/datetime-formater";
import { IFilterable } from "../../../models/common-interfaces";
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
export type OrderType = 'sell' | 'buy';

export class OpenOrderRecord implements IFilterable {
  isVisible = true;
  datetime: string = undefined;
  get Pair() {
    return this.pairStr.replace('-', ' / ');
  }
  get Filled() {
    return PrecisionUtility.truncate(this.filled, 4, 'string');
  }
  get Amount() {
    return PrecisionUtility.truncate(this.amount, 4, 'string');
  }
  get Price() {
    return PrecisionUtility.truncate(this.price, 6, 'string');
  }
  get Type() {
    return `TRADE.${this.type}`;
  }
  constructor(
    timestamp: number,
    public orderId: string,
    public pairStr: string,
    public type: OrderType,
    private price: number,
    private amount: number,
    private filled: number
  ) {
    this.datetime = DatetimeFormater.toFullDateTime(timestamp);
  }
}

export class DealtOrderRecord implements IFilterable {
  isVisible = true;
  datetime: string = undefined;
  get Pair() {
    return this.pairStr.replace('-', ' / ');
  }
  get Amount() {
    return PrecisionUtility.truncate(this.amount, 6, 'string');
  }
  get Price() {
    return PrecisionUtility.truncate(this.price, 6, 'string');
  }
  get Type() {
    return `TRADE.${this.type}`;
  }
  constructor(
    timestamp: number,
    public pairStr: string,
    public type: OrderType,
    public price: number,
    public amount: number,
    // public fees: number,
    // public total: number
  ) {
    this.datetime = DatetimeFormater.toFullDateTime(timestamp);
  }
}