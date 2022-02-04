import Vue from 'vue';
import App from './App.vue';
import phaser from './phaser';
import { analytics } from './plugins/firebase';

Vue.config.productionTip = false;

new Vue({
  phaser,
  analytics,
  render: (h) => h(App),
}).$mount('#app');
