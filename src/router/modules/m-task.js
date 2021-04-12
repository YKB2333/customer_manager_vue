
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/myTask',
  name: 'myTask',
  component: Layout,
  redirect: '/myTask/VisitingPlan',
  meta: {
    title: '我的任务',
    icon: 'setting'
  },
  children: [
    {
      path: '/VisitingPlan',
      name: 'VisitingPlan',
      component: () => import('@/views/myTask'),
      hidden: false,
      meta: {
        title: '拜访计划',
        noCache: false
      }
    },
    {
      path: '/VisitTask',
      name: 'VisitTask',
      component: () => import('@/views/myTask/VisitTask'),
      hidden: true,
      meta: {
        title: '拜访任务',
        noCache: false
      }
    },
    {
      path: '/examine',
      name: 'examine',
      component: () => import('@/views/myTask/examine'),
      hidden: true,
      meta: {
        title: '拜访计划审批',
        noCache: false
      }
    },
    {
      path: '/check',
      name: 'check',
      component: () => import('@/views/myTask/check'),
      hidden: true,
      meta: {
        title: '查看/编辑/新增',
        noCache: false
      }
    },
    {
      path: '/lookover',
      name: 'lookover',
      component: () => import('@/views/myTask/lookover'),
      hidden: true,
      meta: {
        title: '查看',
        noCache: false
      }
    },
    {
      path: '/GoodsCategory',
      name: 'GoodsCategory',
      component: () => import('@/views/myTask/goodsCategory'),
      hidden: true,
      meta: {
        title: '商品分类管理',
        noCache: false
      }
    },
  ]
}
export default routes
