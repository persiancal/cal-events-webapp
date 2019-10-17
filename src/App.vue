<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: Vazir;
  src: url('../node_modules/vazir-font/dist/Vazir.eot');
  src: url('../node_modules/vazir-font/dist/Vazir.eot?#iefix') format('embedded-opentype'),
       url('../node_modules/vazir-font/dist/Vazir.woff2') format('woff2'),
       url('../node_modules/vazir-font/dist/Vazir.woff') format('woff'),
       url('../node_modules/vazir-font/dist/Vazir.ttf') format('truetype');
  font-weight: normal;
}

#app {
  font-family: 'Vazir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
