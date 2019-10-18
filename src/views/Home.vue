<template>
  <MainLayout>
    <template slot="header">
      <h2>
        انتخاب تقویم
      </h2>
    </template>
    <template slot="content">
      <div class="fv-row">
        <div class="fv-col">
          <router-link :to="calendarLink('jalali')">
            <SelectableCard>
              <h3>جلالی | Jalali</h3>
            </SelectableCard>
          </router-link>
        </div>
        <div class="fv-col">
          <router-link :to="calendarLink('gregorian')">
            <SelectableCard>
              <h3>میلادی | Gregorian</h3>
            </SelectableCard>
          </router-link>
        </div>
        <div class="fv-col">
          <SelectableCard class="fv-disabled">
            <h3>قمری | Hijri</h3>
          </SelectableCard>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script>
// @ is an alias to /src
import DateLib from '@/utils/DateLib';
// import CalEvents from '@/utils/CalEvents';
import MainLayout from '@/components/MainLayout.vue';
import SelectableCard from '@/components/SelectableCard.vue';

export default {
  name: 'home',
  components: {
    MainLayout,
    SelectableCard,
  },
  methods: {
    calendarLink(calendar) {
      const today = new DateLib[calendar]();
      return `/calendars/${calendar}/${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    },
  },
};
</script>
