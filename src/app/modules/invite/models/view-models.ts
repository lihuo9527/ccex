import { DatetimeFormater } from 'src/app/helpers/datetime-formater';

export class InviteRecord {
  get Datetime() {
    return DatetimeFormater.toFullDateTime(this.createdAt);
  }
  constructor(
    public name: string,
    public createdAt: number,
  ) { }
}

export class CommissionRecord {
  get Datetime() {
    return DatetimeFormater.toFullDateTime(this.updatedAt);
  }
  constructor(
    public user: string,
    public coin: string,
    public amount: number,
    public updatedAt: number,
  ) { }
}