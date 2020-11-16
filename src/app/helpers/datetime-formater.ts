export class DatetimeFormater {
  static OneMinute: number = 60000;
  static OneHour: number = 3600000;

  static toHourMinuteSecond(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour12: false });
  }

  static toYearMonthDay(timestamp: number) {
    return new Date(timestamp).toLocaleDateString('zh');
  }

  static toFullDateTime(timestamp: number) {
    let datetime = new Date(timestamp);
    return `${datetime.toLocaleDateString('zh')} ${datetime.toLocaleTimeString('en-US', { hour12: false })}`;
  }
}