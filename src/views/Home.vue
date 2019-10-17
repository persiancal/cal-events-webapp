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
          <router-link to="/jalali/months">
            <div class="cal-card fv-border fv-radius fv-shadow">
              <h3>جلالی | Jalali</h3>
            </div>
          </router-link>
        </div>
        <div class="fv-col">
          <router-link to="/gregorian/months">
            <div class="cal-card fv-border fv-radius fv-shadow">
              <h3>میلادی | Gregorian</h3>
            </div>
          </router-link>
        </div>
        <div class="fv-col">
          <div class="cal-card fv-border fv-shadow fv-radius fv-disabled">
            <h3>قمری | Hijri</h3>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script>
// @ is an alias to /src
import CalEvents from '@/utils/CalEvents';
import MainLayout from '@/components/MainLayout.vue';

export default {
  name: 'home',
  components: {
    MainLayout,
  },
  async mounted() {
    CalEvents.dateEvents(new Date(), 'jalali');
  },
};
</script>


<style lang="scss" scoped>
.cal-card {
  text-align: center;
  padding: 3em 1em;
}
</style>
