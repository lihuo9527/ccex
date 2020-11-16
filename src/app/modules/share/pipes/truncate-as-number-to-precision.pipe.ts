import { Pipe, PipeTransform } from '@angular/core';
import { PrecisionUtility } from '../classes/precision-utility';
@Pipe({
  name: 'truncateToPrecision'
})
export class TruncateToPrecisionPipe implements PipeTransform {
  transform(value: number, precision: number = 8): any {
    return PrecisionUtility.truncate(value, precision, 'number');
  }
}
