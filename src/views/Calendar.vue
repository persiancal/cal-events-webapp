<template>
  <MainLayout>
    <template slot="header">
      <h2>
        سلام
      </h2>
    </template>
    <template slot="content">
      <div v-if="currentView === 'none'">
        انتخاب سال
      </div>
      <div v-else-if="currentView === 'year'">
        انتخاب ماه
      </div>
      <div v-else-if="currentView === 'month'">
        <div class="fv-row">
          <div class="fv-col" v-for="calendar in calendars" :key="calendar.key">
            <router-link :to="'/' + calendar.key + '/months'">
              <SelectableCard>
                <h3>{{ calendar.title }}</h3>
              </SelectableCard>
            </router-link>
          </div>
        </div>
        Day list goes here
        انتخاب روز
      </div>
    </template>
  </MainLayout>
</template>

<script>
import CalEvents from '@/utils/CalEvents';
import MainLayout from '@/components/MainLayout.vue';
import SelectableCard from '@/components/SelectableCard.vue';

export default {
  name: 'home',
  data() {
    return {
      calendars: [],
    };
  },
  computed: {
    selectedDate() {
      const [year, month, day] = this.$route.params.date.split('-');
      return {
        year,
        month,
        day,
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
  components: {
    MainLayout,
    SelectableCard,
  },
  async mounted() {
    this.calendars = await CalEvents.getCalendars();
  },
};
</script>
