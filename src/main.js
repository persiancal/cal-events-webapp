import Vue from 'vue';
import Framevuerk from 'framevuerk/dist/framevuerk-custom';
import 'framevuerk/dist/framevuerk-custom.min.css';
import App from './App.vue';
import router from './router';

Vue.use(Framevuerk);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
