<template>
  <MainLayout>
    <template slot="header">
      <h2>
        تقویم {{calendar}}
      </h2>
      <fvButton @click="$router.push('/')"> بازگشت </fvButton>
    </template>
    <template slot="content">
      <div class="fv-padding-sm" />
      <DatePicker
        :calendar="calendar"
        :value="value"
        @input="updateValue($event)" />
      <hr class="fv-hr fv-shadow" />
      <div>
        <fvList v-if="!loading">
          <fvListItem
            v-for="(event, index) in monthEvents"
            :key="'evt' + index"
            @click="log(event)">
            <span class="fv-text-danger fv-margin-end">{{ event.eventDate }}</span>
            <b v-if="event.eventDate === value.getDate()">{{ event.title.fa_IR }}</b>
            <i v-else>{{ event.title.fa_IR }}</i>
          </fvListItem>
        </fvList>
        <div class="fv-padding fv-text-center" v-else>
          <fvLoading />
        </div>
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
      loading: true,
    };
  },
  computed: {
    calendar() {
      return this.$route.params.calendar;
    },
  },
  methods: {
    log(x) {
      console.log(x);
    },
    async calcValue() {
      let [year, month, date] = this.$route.params.date.split('-');
      const today = new DateLib[this.calendar]();
      year = year ? Number(year) : today.getFullYear();
      month = month ? Number(month) - 1 : today.getMonth();
      date = date ? Number(date) : today.getDate();
      this.value = new DateLib[this.calendar](year, month, date);
    },
    async calcMonthEvents() {
      this.loading = true;
      const dt = new DateLib[this.calendar](this.value);
      dt.setMonth(dt.getMonth() + 1);
      dt.setDate(0);
      const thisMonthDays = dt.getDate();
      const promises = [];
      for (let i = 1; i <= thisMonthDays; i += 1) {
        promises.push(
          CalEvents.dateEvents(
            this.value.getFullYear(),
            this.value.getMonth(),
            i,
            this.calendar,
          ),
        );
      }
      Promise.all(promises).then((data) => {
        this.monthEvents = data.flat();
        this.loading = false;
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
