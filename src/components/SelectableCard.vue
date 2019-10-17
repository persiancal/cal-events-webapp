<template>
  <div class="selectable-card fv-border fv-shadow fv-radius">
    <h3>
      <slot />
    </h3>
  </div>
</template>

<script>
export default {
  name: 'SelectableCard',
};
</script>

<style lang="scss" scoped>
.selectable-card {
  text-align: center;
  padding: 3em 1em;
}
</style>
