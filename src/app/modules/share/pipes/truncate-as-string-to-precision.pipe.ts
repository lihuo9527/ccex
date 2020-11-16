import { Pipe, PipeTransform } from '@angular/core';
import { PrecisionUtility } from '../classes/precision-utility';
@Pipe({
  name: 'truncateAsStringToPrecision'
})
export class TruncateAsStringToPrecisionPipe implements PipeTransform {
  transform(value: number, precision: number = 8): any {
    return PrecisionUtility.truncate(value, precision, 'string');
  }
}
