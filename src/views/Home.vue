<template>
  <div />
</template>
<script>
import IDate from 'idate';

export default {
  name: 'home',
  created() {
    const today = new IDate();
    this.$router.push({
      path: `/calendar/${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
    });
  },
};
</script>
