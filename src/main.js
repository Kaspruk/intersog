import Vue from 'vue'
import './plugins/vuetify'
import './assets/style/style.scss'
import 'lodash'
import Backendless from 'backendless';
import App from './App.vue'
import router from './router'
import store from './store'

const APP_ID = 'CD88CF3B-9D75-B074-FFFC-9774F0382F00';
const API_KEY = '5228BD99-62FC-292A-FF66-468E89FE7200';
Backendless.initApp(APP_ID, API_KEY);
Object.defineProperty(Vue.prototype, 'API', { value: Backendless });
Object.defineProperty(Vue.prototype, 'dataQueryBuilderSort', { value: Backendless.DataQueryBuilder.create() });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
