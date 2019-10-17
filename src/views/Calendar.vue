<template>
  <MainLayout>
    <template slot="header">
      <h2>
        سلام
      </h2>
    </template>
    <template slot="content">
      <div v-if="currentView === 'none'">
        <div class="fv-row">
          <div class="fv-col" v-for="calendar in calendars" :key="calendar.key">
            <router-link :to="'/' + calendar.key + '/months'">
              <SelectableCard>
                <h3>{{ calendar.title }}</h3>
              </SelectableCard>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else-if="currentView === 'year'">
        انتخاب ماه
      </div>
      <div v-else-if="currentView === 'month'">
        <DatePicker />
        Day list goes here
        انتخاب روز
      </div>
    </template>
  </MainLayout>
</template>

<script>
import IDate from 'idate';
import CalEvents from '@/utils/CalEvents';
import MainLayout from '@/components/MainLayout.vue';
import SelectableCard from '@/components/SelectableCard.vue';
import DatePicker from '@/components/DatePicker.vue';

export default {
  name: 'home',
  components: {
    MainLayout,
    SelectableCard,
    DatePicker,
  },
  data() {
    return {
      calendars: [],
    };
  },
  computed: {
    selectedDate() {
      let [year, month, day] = this.$route.params.date.split('-');
      year = year ? Number(year) : undefined;
      month = month ? Number(month) - 1 : undefined;
      day = day ? Number(day) : undefined;
      return {
        year,
        month,
        day,
        dateObj: new IDate(year, month, day),
      };
    },
    currentView() {
      const { year, month } = this.selectedDate;
      if (typeof month !== 'undefined') {
        return 'month';
      }
      if (typeof year !== 'undefined') {
        return 'year';
      }
      return 'none';
    },
  },
  async mounted() {
    this.calendars = await CalEvents.getCalendars();
  },
};
</script>
