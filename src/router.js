import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/createnewgroup',
      name: 'createnewgroup',
      component: () => { return import('./components/create-new-group.vue') }
    },
    {
      path: '/grouplist',
      name: 'grouplist',
      component: () => { return import('./components/group-list.vue') }
    },
    {
      path: '/createcard',
      name: 'createcard',
      component: () => { return import('./views/create-new-card.vue') }
    },
    {
      path: '/cardlist',
      name: 'cardlist',
      component: () => { return import('./views/card-list.vue') }
    },
    {
      path: '/carddetail/:cardId',
      name: 'carddetail',
      component: () => { return import('./views/card-detail.vue') }
    }
  ]
})

export default router
