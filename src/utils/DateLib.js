import IDate from 'idate';
import HijriDate from './hijri';

export default {
  gregorian: Date,
  jalali: IDate,
  hijri: HijriDate,
};

global.hijri = HijriDate;

export const monthNames = {
  gregorian: ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  jalali: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
};

export const weekDayNames = {
  gregorian: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  jalali: ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
};
