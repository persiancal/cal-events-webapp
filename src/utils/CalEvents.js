import IDate from 'idate';
import HttpClient from './HttpClient';

function sleep(time = 200) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

class DateEvents {
  savedData = {};

  isReady = false;

  calendarsKey = ['jalali', 'gregorian', 'hijri'];

  constructor() {
    const getAndSave = (calendar) => {
      const url = `https://raw.githubusercontent.com/persiancal/cal-events/gh-pages/${calendar}.json`;
      HttpClient('GET', url).then((resp) => {
        if (resp.ok) {
          this.savedData[calendar] = resp.data;
          if (Object.keys(this.savedData).length === this.calendarsKey.length) {
            this.isReady = true;
          }
        } else {
          setTimeout(() => {
            getAndSave(calendar);
          }, 500);
        }
      });
    };
    this.calendarsKey.forEach(getAndSave);
  }

  async ifReady() {
    if (this.isReady) {
      return true;
    }
    await sleep();
    await this.ifReady();
    return true;
  }

  async getCalendars() {
    await this.ifReady();
    const ret = [];
    const titles = {
      jalali: 'جلالی | Jalali',
      gregorian: 'میلادی | Gregorian',
      hijri: 'قمری | Hijri',
    };
    this.calendarsKey.forEach((calendar) => {
      ret.push({
        key: calendar,
        title: titles[calendar],
      });
    });
    return ret;
  }

  async getMonths(calendar) {
    await this.ifReady();
    const ret = [];
    return ret || this.calendarsKey || calendar;
  }

  async dateEvents(dateObj = new IDate()) {
    await this.ifReady();
    if (dateObj) {
      return [];
    }
    return false;
  }
}


export default new DateEvents();
