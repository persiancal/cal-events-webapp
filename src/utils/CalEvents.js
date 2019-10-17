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

  calendarsKey = ['jalali', 'gregorian'];

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

  async dateEvents(inputDate) {
    await this.ifReady();
    const ret = [];
    const DateLibs = {
      jalali: IDate,
      gregorian: Date,
    };
    const today = {
      jalali: new IDate(),
      gregorian: new Date(),
    };
    const oneOf = (...args) => {
      for (let i = 0; i < args.length; i += 1) {
        if (typeof args[i] !== 'undefined') {
          return args[i];
        }
      }
      return false;
    };
    this.calendarsKey.forEach((calendar) => {
      this.savedData[calendar].events.forEach((event) => {
        const eventDate = new DateLibs[calendar](
          oneOf(event.year, today[calendar].getFullYear()),
          oneOf(event.month, -1) + 1,
          oneOf(event.day, 1),
        );
        const checks = [];
        if (event.year && event.discuntinued) {
          checks.push(eventDate.getFullYear() <= inputDate.getFullYear());
        }
        if (event.month) {
          checks.push(eventDate.getMonth() === inputDate.getMonth());
        }
        if (event.day) {
          checks.push(eventDate.getDate() === inputDate.getDate());
        }
        if (checks.filter(c => c === false).length === 0) {
          ret.push(event);
        }
      });
    });
    return ret;
  }
}


export default new DateEvents();
