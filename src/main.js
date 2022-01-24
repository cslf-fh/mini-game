import Vue from 'vue';
import App from './App.vue';
import phaser from './phaser';

Vue.config.productionTip = false;

new Vue({
  phaser,
  render: (h) => h(App),
}).$mount('#app');
