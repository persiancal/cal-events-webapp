<template>
  <div class="date-picker">
    <div class="header">
      <div class="fv-grow fv-text-center">
        <span v-text="getValue().year" @click="setView('years')"/>
        <b v-text="monthNames[getValue().month]" @click="setView('months')"/>
      </div>
    </div>
    <div class="content" tabindex="-1" v-if="view === 'days'">
      <table>
        <thead>
          <tr>
            <td v-for="weekDay in weekDayNames" :key="weekDay + 'wd'">
              <div class="item" v-text="weekDay"/>
            </td>
          </tr>
        </thead>
        <tbody>
          <!-- <tr v-for="dp in 6" :key="dp + 'dp'">
            <td
              v-for="d in dpRow(dp, currentValue.getMonth(), currentValue.getFullYear())"
              :key="d.date + 'd'"
              :disabled="d.disabled"
              @click="selectDate(d.date, $event)"
              :class="{'highlighted': d.highlighted, selected: d.selected, hidden: d.hidden}"
              v-text="d.realDate" />
          </tr> -->
          <tr v-for="(row, rIndex) in daysMatrix" :key="rIndex + 'row'">
            <td
              v-for="(col, cIndex) in row"
              :key="cIndex + 'col'"
              :selected="isSelected(undefined, undefined, col)"
              @click="setValue(undefined, undefined, col)">
              {{ col }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="content" tabindex="-1" v-if="view === 'months'">
      <table>
        <tbody>
          <tr v-for="(row, rIndex) in monthsMatrix" :key="rIndex + 'row'">
            <td
              v-for="(col, cIndex) in row"
              :key="cIndex + 'col'"
              :selected="isSelected(undefined, col, undefined)"
              @click="setValue(undefined, col, undefined) && setView('days')">
              {{ monthNames[col] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="content" tabindex="-1" v-if="view === 'years'">
      <table>
        <tbody>
          <tr v-for="(row, rIndex) in yearsMatrix" :key="rIndex + 'row'">
            <td
              v-for="(col, cIndex) in row"
              :key="cIndex + 'col'"
              :selected="isSelected(col, undefined, undefined)"
              @click="setValue(col, undefined, undefined) && setView('months')">
              {{ col }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import IDate from 'idate';

global.IDate = IDate;

export default {
  name: 'DatePicker',
  props: {
    value: {
      default: undefined,
    },
    required: {
      type: [Boolean, Function],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    deleteButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      Date: IDate,
      currentValue: undefined,
      visualProps: {},
      weekDayNames: ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
      monthNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      searchQuery: undefined,
      view: 'days',
    };
  },
  created() {
    this.currentValue = new this.Date(this.value.toISOString());
  },
  computed: {
    daysMatrix() {
      const ret = [];
      const { year, month } = this.getValue();
      const monthFirstDay = this.monthFirstDay(year, month);
      const daysInMonth = this.daysInMonth(year, month);
      for (let i = 0; i < 6; i += 1) {
        const row = [];
        const dayStart = i * 7;
        for (let j = 0; j < 7; j += 1) {
          let day = (dayStart + j) - (monthFirstDay - 1);
          if (day < 1 || day > daysInMonth) {
            day = undefined;
          }
          row.push(day);
        }
        ret.push(row);
      }
      return ret;
    },
    monthsMatrix() {
      const ret = [];
      for (let i = 0; i < 4; i += 1) {
        const row = [];
        const monthStart = i * 3;
        for (let j = 0; j < 3; j += 1) {
          row.push(monthStart + j);
        }
        ret.push(row);
      }
      return ret;
    },
    yearsMatrix() {
      const ret = [];
      const { year } = this.getValue();
      for (let i = -13; i < 14; i += 1) {
        const row = [];
        const yearStart = (i * 7) - 3;
        for (let j = 0; j < 7; j += 1) {
          row.push((yearStart + j) + year);
        }
        ret.push(row);
      }
      return ret;
    },
  },
  methods: {
    getValue() {
      return {
        year: this.currentValue.getFullYear(),
        month: this.currentValue.getMonth(),
        date: this.currentValue.getDate(),
        day: this.currentValue.getDay(),
      };
    },
    monthFirstDay(year, month) {
      return new this.Date(year, month, 1).getDay();
    },
    daysInMonth(year, month) {
      return new this.Date(year, month + 1, 0).getDate();
    },
    isSelected(aYear = undefined, aMonth = undefined, aDate = undefined) {
      const { year, month, date } = this.getValue();
      const uYear = typeof aYear === 'undefined' ? year : aYear;
      const uMonth = typeof aMonth === 'undefined' ? month : aMonth;
      const uDate = typeof aDate === 'undefined' ? date : aDate;
      return (year - uYear) + (month - uMonth) + (date - uDate) === 0;
    },
    setValue(aYear = undefined, aMonth = undefined, aDate = undefined) {
      const { year } = this.getValue();
      if (typeof aYear !== 'undefined') {
        this.currentValue.setFullYear(aYear);
      }
      if (typeof aMonth !== 'undefined') {
        this.currentValue.setMonth(aMonth);
        // some times this will happens due to leap years.
        if (year !== this.getValue().year || aMonth !== this.getValue().month) {
          this.currentValue.setDate(1);
          this.currentValue.setMonth(aMonth);
          this.currentValue.setFullYear(year);
        }
      }
      if (typeof aDate !== 'undefined') {
        this.currentValue.setDate(aDate);
        this.$emit('input', this.currentValue);
      }
      return true;
    },
    setView(view) {
      this.view = view;
      return true;
    },
  },
};
</script>


<style lang="scss" scoped>
  table {
    width: 100%;
    table-layout: fixed;

    td {
      text-align: center;

      &[selected] {
        color: red;
      }
    }
  }
  .item {
    text-align: center;
  }
</style>
