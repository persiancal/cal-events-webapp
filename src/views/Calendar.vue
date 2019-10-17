<template>
  <MainLayout>
    <template slot="header">
      <h2>
        سلام
      </h2>
    </template>
    <template slot="content">
      <DatePicker :value="value" @input="updateValue($event)" />
      <hr />
      <div>
        {{dateEvents}}
      </div>
    </template>
  </MainLayout>
</template>

<script>
import IDate from 'idate';
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
      dateEvents: ['آزاد سازی خرمشهر'],
    };
  },
  methods: {
    async calcValue() {
      let [year, month, date] = this.$route.params.date.split('-');
      const today = new Date();
      year = year ? Number(year) : today.getFullYear();
      month = month ? Number(month) - 1 : today.getMonth();
      date = date ? Number(date) : today.getDate();
      this.value = new IDate(year, month, date);
      this.dateEvents = await CalEvents.dateEvents(this.value);
    },
    updateValue(value) {
      this.$router.push({
        path: `/calendar/${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
      });
    },
  },
  async created() {
    await this.calcValue();
  },
};
</script>
