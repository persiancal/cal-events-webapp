import DateLib from './DateLib';
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
      const url = `https://persiancal.github.io/cal-events/${calendar}.json`;
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

  async dateEvents(year, month, date, calendar) {
    await this.ifReady();
    const ret = [];
    const oneOf = (...args) => {
      for (let i = 0; i < args.length; i += 1) {
        if (typeof args[i] !== 'undefined') {
          return args[i];
        }
      }
      return false;
    };
    this.calendarsKey.forEach((cCalendar) => {
      this.savedData[cCalendar].events.forEach((event) => {
        const eventDateObj = new DateLib[cCalendar](
          oneOf(event.year),
          oneOf(event.month, 1) - 1,
          oneOf(event.day, 1),
        );
        const eventDateObjInInputCalendar = new DateLib[calendar](eventDateObj.toISOString());
        const eventYear = eventDateObjInInputCalendar.getFullYear();
        const eventMonth = eventDateObjInInputCalendar.getMonth();
        const eventDate = eventDateObjInInputCalendar.getDate();
        const checks = [];
        if (event.year && event.discuntinued) {
          checks.push(eventYear <= year);
        }
        if (event.month) {
          checks.push(eventMonth === month);
        }
        if (event.day) {
          checks.push(eventDate === date);
        }
        if (checks.filter(c => c === false).length === 0) {
          ret.push(Object.assign(event, {
            eventYear,
            eventMonth,
            eventDate,
          }));
        }
      });
    });
    ret.sort((a, b) => {
      if (a.eventDate > b.eventDate) {
        return -1;
      } if (a.eventDate < b.eventDate) {
        return 1;
      }
      return 0;
    });
    return ret;
  }
}


export default new DateEvents();
