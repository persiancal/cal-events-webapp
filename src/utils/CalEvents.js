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

  constructor() {
    const calendars = ['jalali', 'gregorian', 'hijri'];
    const getAndSave = (calendar) => {
      const url = `https://raw.githubusercontent.com/persiancal/cal-events/gh-pages/${calendar}.json`;
      HttpClient('GET', url).then((resp) => {
        if (resp.ok) {
          this.savedData[calendar] = resp.data;
          if (Object.keys(this.savedData).length === calendars.length) {
            this.isReady = true;
          }
        } else {
          setTimeout(() => {
            getAndSave(calendar);
          }, 500);
        }
      });
    };
    calendars.forEach(getAndSave);
  }

  async ifReady() {
    if (this.isReady) {
      return true;
    }
    await sleep();
    await this.ifReady();
    return true;
  }

  async dateEvents(date = new Date(), calendar = 'jalali') {
    await this.ifReady();
    console.log(this.savedData);
    const DateLib = calendar === 'jalali' ? IDate : Date;
    // we have to api call here. but for now i just parse static date
    const convertedDate = new DateLib(date);
    return convertedDate;
  }
}


export default new DateEvents();
