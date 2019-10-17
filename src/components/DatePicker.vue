<template>
  <div class="calendar-month-days">
    <div class="header">
      <div class="fv-input-group header-buttons">
        <fv-button class="fv-size-sm" @click.prevent="moveValue('year', -1)" tabindex="-1">
          سال قبل
        </fv-button>
        <fv-button class="fv-size-sm" @click.prevent="moveValue('month', -1)" tabindex="-1">
          ماه قبل
        </fv-button>
      </div>
      <div class="fv-grow fv-text-center">
        <b v-text="monthNames[visualProps.month - 1]"/> <span v-text="visualProps.year"/>
      </div>
      <div class="fv-input-group header-buttons">
        <fv-button class="fv-size-sm" @click.prevent="moveValue('month', 1)" tabindex="-1">
          ماه بعد
        </fv-button>
        <fv-button class="fv-size-sm" @click.prevent="moveValue('year', 1)" tabindex="-1">
          سال بعد
        </fv-button>
      </div>
    </div>
    <div class="content" tabindex="-1">
      <table>
        <thead>
          <tr>
            <td v-for="weekDay in weekDayNames" :key="weekDay + 'wd'" v-html="weekDay"></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dp in 6" :key="dp + 'dp'">
            <td
              v-for="d in dpRow(dp, editingValue.getMonth(), editingValue.getFullYear())"
              :key="d + 'd' + dp"
              :disabled="d.disabled"
              @click="selectDate(d.date, $event)"
              :class="{highlighted: d.highlighted, selected: d.selected, hidden: d.hidden}"
              v-html="d.realDate" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import IDate from 'idate';

export default {
  name: 'CalendarMonthDays',
  props: {
    value: {
      default: undefined,
    },
    defaultValue: {
      default: Date.now(),
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
      Date: IDate || Date,
      editingValue: undefined,
      visualProps: {},
      weekDayNames: [],
      monthNames: [],
      searchQuery: undefined,
    };
  },
  created() {
    this.setEditingValue(true);
    const dt = new this.Date();
    dt.setDate(dt.getDate() - (dt.getDay()));
    for (let i = 0; i < 7; i += 1) {
      this.weekDayNames.push(dt.toString().split(' ')[0]);
      dt.setDate(dt.getDate() + 1);
    }
    dt.setDate(1);
    dt.setMonth(0);
    for (let i = 0; i < 12; i += 1) {
      this.monthNames.push(dt.toString().replace(/[0-9,۰-۹]/g, '').split(' ').filter(p => !!p)[1]);
      dt.setMonth(dt.getMonth() + 1);
    }
  },
  computed: {
    fvValidate() {
      if (this.required === true) {
        if (!this.value) {
          return false;
        }
        return true;
      } if (typeof this.required === 'function') {
        return this.required(this.value);
      }
      return true;
    },
    defaultFormattedValue() {
      if (this.value) {
        const value = new this.Date(this.value);
        return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`;
      }
      return '';
    },
  },
  methods: {
    onTyping(value) {
      const text = value.toString();
      const digits = value.replace(/[^0-9]/g, '');
      // if use type a seprator
      if (digits.length !== text.length) {
        this.searchQuery = '';
        const editingValue = new this.Date(this.editingValue);
        const number = Number(digits);
        if (number.toString().length === 4) {
          editingValue.setFullYear(number);
        } else if (number.toString().length <= 2 && number <= 12 && this.searchQuery !== ' ') {
          editingValue.setMonth(number - 1);
        }
        this.$set(this, 'editingValue', editingValue);
        this.calcVisualProps();
      }
    },
    onOpen() {
      this.searchQuery = '';
      this.setEditingValue(true);
    },
    deleteValue() {
      this.searchQuery = '';
      this.$emit('input', undefined);
    },
    setEditingValue(force = false) {
      if (!this.editingValue || force) {
        this.editingValue = new this.Date(this.value || this.defaultValue);
        this.calcVisualProps();
      }
    },
    monthFirstDay(month, year) {
      return new this.Date(year, month, 1).getDay();
    },
    daysInMonth(month, year) {
      return new this.Date(year, month + 1, 0).getDate();
    },
    calcVisualProps() {
      const visualProps = {
        year: this.editingValue.getFullYear(),
        month: this.editingValue.getMonth() + 1,
        date: this.editingValue.getDate(),
        monthFirstDay: this.monthFirstDay(
          this.editingValue.getMonth(),
          this.editingValue.getFullYear(),
        ),
        daysInMonth: this.daysInMonth(
          this.editingValue.getMonth(),
          this.editingValue.getFullYear(),
        ),
      };
      this.$set(this, 'visualProps', visualProps);
      return visualProps;
    },
    focus() {
      this.$refs.inputBox.focus();
    },
    dpRow(dp, month, year) {
      const calc = (d, dpp) => {
        const date = (d + ((dpp - 1) * 7)) - this.visualProps.monthFirstDay;
        const hidden = !(date > 0 && date <= this.visualProps.daysInMonth);
        let realDate = date;
        let realMonth = month;
        let realYear = year;
        if (date < 1 || date > this.visualProps.daysInMonth) {
          const dt = new this.Date(year, month, date);
          realDate = dt.getDate();
          realMonth = dt.getMonth();
          realYear = dt.getFullYear();
        }
        return {
          date,
          realDate,
          realMonth,
          realYear,
          hidden,
          highlighted: this.isHighlighted(realDate, realMonth, realYear),
          selected: this.isSelected(realDate, realMonth, realYear),
          disabled: this.isDateDisabled(realDate, realMonth, realYear),
        };
      };
      const ret = [];
      for (let d = 1; d <= 7; d += 1) {
        ret.push(calc(d, dp));
      }
      return ret;
    },
    isSelected(date, month, year) {
      if (!this.value) {
        return false;
      }
      const value = new this.Date(this.value);
      return value.getDate() === date && value.getMonth() === month && value.getFullYear() === year;
    },
    isHighlighted(date, month, year) {
      if (!this.editingValue) {
        return false;
      }
      return this.editingValue.getDate() === date
        && this.editingValue.getMonth() === month
        && this.editingValue.getFullYear() === year;
    },
    moveValue(unit, value) {
      const editingValue = new this.Date(this.editingValue);
      switch (unit) {
        case 'year':
          editingValue.setFullYear(editingValue.getFullYear() + value);
          break;
        case 'month':
          editingValue.setMonth(editingValue.getMonth() + value);
          break;
        default:
        case 'date':
          editingValue.setDate(editingValue.getDate() + value);
          break;
      }
      this.$set(this, 'editingValue', editingValue);
      this.calcVisualProps();
    },
    selectDate(value, event) {
      this.setDate(value);
      if (event.target.getAttribute('disabled')) {
        return;
      }
      this.searchQuery = '';
      const ret = new this.Date(this.editingValue);
      this.$emit('input', ret);
    },
    setDate(value) {
      if (value !== null) {
        this.editingValue.setDate(value);
      }
    },
    onKeydown(event) {
      switch (event.which) {
        case 38: // up
          event.preventDefault();
          this.moveValue('date', -7);
          break;
        case 40: // down
          event.preventDefault();
          this.moveValue('date', 7);
          break;
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          event.preventDefault();
          this.moveValue('date', -1);
          break;
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          event.preventDefault();
          this.moveValue('date', 1);
          break;
        case 13: // enter
          event.preventDefault();
          this.selectDate(Number(this.searchQuery) || null, event);
          break;
        case 8: // backspace
          if (this.searchQuery.length === 0 && this.deleteButton) {
            this.deleteValue();
          }
          break;
        case 46: // delete
          this.searchQuery = '';
          if (this.deleteButton) {
            this.deleteValue();
          }
          break;
        default:
          return false;
      }
      return false;
    },
    checkFvValidity(day, month, year) {
      if (typeof this.required === 'function') {
        const dt = new this.Date(year, month, day);
        return this.required(dt);
      }
      return true;
    },
    isDateDisabled(day, month, year) {
      return !this.checkFvValidity(day, month, year);
    },
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.$refs.inputBox.close();
      });
    },
  },
};
</script>
