<template>
  <div class="date-picker">
    <div class="header">
      <h2
        class="fv-inline"
        v-text="monthNames[getValue().month]"
        @click="setView('months')"/>
      <h5
        class="fv-line fv-text-light"
        v-text="getValue().year"
        @click="setView('years')"/>
    </div>
    <div class="content" tabindex="-1" v-if="view === 'days'">
      <table>
        <thead>
          <tr>
            <td
              v-for="weekDay in weekDayNames"
              :key="weekDay + 'wd'">
              <div
                class="item fv-text-light"
                v-text="weekDay"/>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rIndex) in daysMatrix" :key="rIndex + 'row'">
            <td
              v-for="(col, cIndex) in row"
              :key="cIndex + 'col'">
              <div
                v-if="!!col"
                class="item clickable"
                v-text="col"
                :data-selected="!!col && isSelected(undefined, undefined, col)"
                :data-highlighted="highlightDays.has(col)"
                @click="setValue(undefined, undefined, col)"/>
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
              :key="cIndex + 'col'">
              <div
                class="item clickable"
                v-text="monthNames[col]"
                :date-selected="isSelected(undefined, col, undefined)"
                @click="setValue(undefined, col, undefined) && setView('days')"/>
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
              :key="cIndex + 'col'">
              <div
                class="item clickable"
                v-text="col"
                :date-selected="isSelected(col, undefined, undefined)"
                @click="setValue(col, undefined, undefined) && setView('months')" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DateLib, { weekDayNames, monthNames } from '@/utils/DateLib';

export default {
  name: 'DatePicker',
  props: {
    value: {
      default: undefined,
    },
    calendar: {
      default: 'gregorian',
    },
    highlightDays: {
      type: Set,
      default: () => new Set(),
    },
  },
  data() {
    return {
      currentValue: undefined,
      weekDayNames: weekDayNames[this.calendar],
      monthNames: monthNames[this.calendar],
      view: 'days',
    };
  },
  created() {
    this.currentValue = new DateLib[this.calendar](this.value.toISOString());
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
      return new DateLib[this.calendar](year, month, 1).getDay();
    },
    daysInMonth(year, month) {
      return new DateLib[this.calendar](year, month + 1, 0).getDate();
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
      }
      this.$nextTick(() => {
        if (this.view === 'days') {
          this.$emit('input', this.currentValue);
        }
      });
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
  .date-picker {
    max-width: 530px;
    margin: auto;
  }
  table {
    width: 100%;
    table-layout: fixed;

    td {
      text-align: center;
    }
  }
  .item {
    text-align: center;
    padding: 0.7em 0.1em;
    margin: auto;
    position: relative;

    &[data-selected] {
      color: #bf2b2b;
      font-weight: bold;
    }

    &[data-highlighted] {
      text-decoration : underline;
    }

    &.clickable{
      cursor: pointer;
      border-radius: 8px;

      &:hover {
        background: rgb(245, 245, 245);
      }
    }
  }
  .header {
    text-align: center;
    & > * {
      cursor: pointer;
    }
  }
</style>
