export class PrecisionUtility {
  static truncate(value: number, precision: number, returnType: 'number' | 'string'): number | string {
    if (precision <= 0) return returnType === 'number' ? Math.floor(value) : `${Math.floor(value)}`;
    let str = value.toFixed(precision + 1);
    let arr = str.split('.');
    let decimalPart = `${arr[1]}${'0'.repeat(precision)}`.slice(0, precision);
    return returnType === 'number' ? parseFloat(`${arr[0]}.${decimalPart}`) : `${arr[0]}.${decimalPart}`;
  }

  static force(float: string, precision: number): string {
    let value = parseFloat(float);
    if (isNaN(value)) return float;
    if (precision <= 0) return `${Math.floor(value)}`;
    let arr = float.split('.');
    if (arr.length < 2 || arr[1].length <= precision) return float;
    let decimalPart = `${arr[1]}${'0'.repeat(precision)}`.slice(0, precision);
    return `${arr[0]}.${decimalPart}`;
  }
}