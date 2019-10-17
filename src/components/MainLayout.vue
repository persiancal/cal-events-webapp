<template>
  <fvMain class="main">
    <fvContent>
      <fvHeader class="transparent">
        <slot name="header" />
      </fvHeader>
      <div class="content">
        <slot name="content" />
      </div>
    </fvContent>
  </fvMain>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Vazir;
  src: url('../../node_modules/vazir-font/dist/Vazir.eot');
  src: url('../../node_modules/vazir-font/dist/Vazir.eot?#iefix') format('embedded-opentype'),
       url('../../node_modules/vazir-font/dist/Vazir.woff2') format('woff2'),
       url('../../node_modules/vazir-font/dist/Vazir.woff') format('woff'),
       url('../../node_modules/vazir-font/dist/Vazir.ttf') format('truetype');
  font-weight: normal;
}

.main {
  font-family: 'Vazir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 960px;
  margin: 0 auto;
  box-shadow: 0 0 6px 2px rgba(0,0,0,.05);
  border-right: solid 1px #e0e0e0;
  border-left: solid 1px #e0e0e0;
}

@media (max-width: 960px) {
  .main {
    border-left: none;
    border-right: none;
    box-shadow: none;
  }
}
</style>
