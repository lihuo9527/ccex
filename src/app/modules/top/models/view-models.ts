import { IFilterable } from '../../../models/common-interfaces';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
export class Ticker implements IFilterable {
  isVisible: boolean = true;

  name: string = undefined;
  pairStr: string = undefined;
  isFavorite: boolean = false;
  private timeout = undefined;
  type: 'equal' | 'high' | 'low' = 'equal';
  set Type(type: 'equal' | 'high' | 'low') {
    if (type === 'equal') return;
    this.type = type;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.type = 'equal';
    }, 1000);
  }

  price: number = undefined;
  get priceStr() {
    return this.price !== undefined ? PrecisionUtility.truncate(this.price, this.precision || 8, 'string') : '-.-';
  }

  change: number = undefined;
  get changeStr() {
    return this.change !== undefined ? (this.change > 0 ? '+' : '') + PrecisionUtility.truncate((100 * this.change), 2, 'string') + '%' : '-.-%';
  }

  high: number = undefined;
  get highStr() {
    return this.high !== undefined ? PrecisionUtility.truncate(this.high, this.precision || 8, 'string') : '-.-';
  }

  low: number = undefined;
  get lowStr() {
    return this.low !== undefined ? PrecisionUtility.truncate(this.low, this.precision || 8, 'string') : '-.-';
  }

  volume: number = undefined;
  get volumeStr() {
    return this.volume !== undefined ? PrecisionUtility.truncate(this.volume, 8, 'string') : '-.-';
  }

  open: number = undefined;

  precision: number = undefined;
  marketSort: number = undefined;
  targetSort: number = undefined;
  
  constructor(
    public marketCoin: string,
    public targetCoin: string
   
  ) {
    this.pairStr = targetCoin + '-' + marketCoin;
    this.name = targetCoin + ' / ' + marketCoin;
  }
}