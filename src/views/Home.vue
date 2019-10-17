<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import CalEvents from '@/utils/CalEvents';

export default {
  name: 'home',
  components: {
    HelloWorld,
  },
  async mounted() {
    CalEvents.dateEvents(new Date(), 'jalali');
  },
};
</script>
