<template>
  <MainLayout>
    <template slot="header">
      <h2>
        سلام
      </h2>
    </template>
    <template slot="content">
      <DatePicker :calendar="calendar" :value="value" @input="updateValue($event)" />
      <hr />
      <div>
        <fvList>
          <fvListItem v-for="(event, index) in monthEvents" :key="'evt' + index">
            <span class="fv-text-danger">{{ event.day }}</span>
            <b v-if="event.day === value.getDate()">{{ event.title.fa_IR }}</b>
            <i v-else>{{ event.title.fa_IR }}</i>
          </fvListItem>
        </fvList>
      </div>
    </template>
  </MainLayout>
</template>

<script>
import DateLib from '@/utils/DateLib';
import MainLayout from '@/components/MainLayout.vue';
import DatePicker from '@/components/DatePicker.vue';
import CalEvents from '@/utils/CalEvents';

export default {
  name: 'home',
  components: {
    MainLayout,
    DatePicker,
  },
  data() {
    return {
      value: undefined,
      dateEvents: [],
      monthEvents: [],
    };
  },
  computed: {
    calendar() {
      return this.$route.params.calendar;
    },
  },
  methods: {
    async calcValue() {
      let [year, month, date] = this.$route.params.date.split('-');
      const today = new DateLib[this.calendar]();
      year = year ? Number(year) : today.getFullYear();
      month = month ? Number(month) - 1 : today.getMonth();
      date = date ? Number(date) : today.getDate();
      this.value = new DateLib[this.calendar](year, month, date);
    },
    async calcMonthEvents() {
      const dt = new DateLib[this.calendar](this.value);
      dt.setMonth(dt.getMonth() + 1);
      dt.setDate(0);
      const thisMonthDays = dt.getDate();
      const promises = [];
      for (let i = 1; i <= thisMonthDays; i += 1) {
        const date = new DateLib[this.calendar](this.value.getFullYear(), this.value.getMonth(), i);
        promises.push(CalEvents.dateEvents(date));
      }
      Promise.all(promises).then((data) => {
        this.monthEvents = data.flat();
      });
    },
    updateValue(value) {
      this.$router.push({
        path: `/calendars/${this.calendar}/${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
      });
    },
  },
  async created() {
    await this.calcValue();
    this.calcMonthEvents();
  },
  watch: {
    $route() {
      this.calcValue();
      this.calcMonthEvents();
    },
  },
};
</script>
