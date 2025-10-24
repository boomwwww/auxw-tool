import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      redirect: '/info'
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/InfoView.vue')
    },
    {
      path: '/files',
      name: 'files',
      component: () => import('./views/FilesView.vue')
    },
    {
      path: '/temp1',
      name: 'temp1',
      component: () => import('./views/Temp1View.vue')
    },
    {
      path: '/temp2',
      name: 'temp2',
      component: () => import('./views/Temp2View.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  console.log('router.beforeEach')
  console.log('from', from)
  console.log('to', to)
  return true
})

export default router
