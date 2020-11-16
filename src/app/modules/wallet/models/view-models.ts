import { IFilterable } from '../../../models/common-interfaces';
import { DatetimeFormater } from 'src/app/helpers/datetime-formater';

export class AssetPortfolioRecord implements IFilterable {
  isVisible: boolean = true;
  pairs = [];

  constructor(
    public canDeposit: boolean,
    public canWithdraw: boolean,
    public sortOrder: number,
    pairStrings: string[],
    public coinSymbol: string,
    public coinName: string,
    public amount: number,
    public free: number,
    public frozen: number,
    public totalValue: number
  ) {
    for (let pairStr of pairStrings) {
      this.pairs.push({
        raw: pairStr,
        display: pairStr.replace('-', ' / ')
      });
    }
  }
}

export class DepositRecord implements IFilterable {
  get Datetime() {
    return DatetimeFormater.toFullDateTime(!this.updatedAt ? this.createdAt : this.updatedAt);
  }

  isVisible: boolean = true;
  get IsDone() {
    return this.updatedAt > this.createdAt;
  }
  constructor(
    public txid: string,
    public coinSymbol: string,
    public coinName: string,
    public amount: number,
    public createdAt: number,
    public updatedAt: number = undefined
  ) { }
}

export class WithdrawRecord extends DepositRecord {
  get Datetime() {
    return DatetimeFormater.toFullDateTime(!this.updatedAt ? this.createdAt : this.updatedAt);
  }

  address: string;
  status: string;
  constructor(
    public txid: string,
    public coinSymbol: string,
    public coinName: string,
    address: string,
    public amount: number,
    public createdAt: number,
    public updatedAt: number = undefined
  ) {
    super(txid, coinSymbol, coinName, amount, createdAt, updatedAt);
    this.address = address;
  }
}

export class DepositObject {
  constructor(
    public url: string = null,
    public tag: string = null,
    public info: any = {}
  ) {
    this.initialize();
  }

  initialize(){
    this.url =  "Loading...";
    this.tag =  "Loading...";
    this.info = { id: null, first: null, last: null, minDeposit: null };
  }
}

export class WithdrawObject {
  constructor(
    public id: string = null,
    public address: string = null,
    public tag: string = null,
    public amount: number = null,
    public actualArrival: number = 0,
    public info: any = {}
  ) {
    this.initialize();
  }

  initialize(){
    this.id = null;
    this.address = null;
    this.tag = null;
    this.amount = null;
    this.actualArrival = 0;
    this.info = { minWithdraw: "--.--", fee: "--.--", dailyAvailable: 0, balance: "--.--", available: 0 };
  }
}