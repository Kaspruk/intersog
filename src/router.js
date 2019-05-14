import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './views/DashboardPage.vue'
import Details from './views/DetailsPage.vue'

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard-page',
      component: Dashboard
    },
    {
      path: '/campaigns/:objectId',
      name: 'details-page',
      component: Details
    },
    {
      path: '*',
      redirect: '/dashboard'
    },
  ]
});
export default router
