
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/operatingIndex',
  name: 'OperatingIndex',
  component: Layout,
  redirect: '/operatingIndex/operatingModel',
  meta: {
    title: '运营管理',
    icon: 'opertating'
  },
  children: [
    {
      path: '/operatingModel',
      name: 'OperatingModel',
      component: () => import('@/views/operatingModel'),
      hidden: false,
      meta: {
        title: '运营方式',
        noCache: false
      }
    },
    /*{
      path: '/project',
      name: 'Project',
      component: () => import('@/views/operatingModel/project'),
      hidden: false,
      meta: {
        title: '项目管理',
        noCache: false
      }
    },*/
    {
      path: '/productNews',
      name: 'ProductNews',
      component: () => import('@/views/operatingModel/productNews'),
      hidden: false,
      meta: {
        title: '新品预告',
        noCache: false
      }
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/operatingModel/activity'),
      hidden: false,
      meta: {
        title: '活动预告',
        noCache: false
      }
    },
    {
      path: '/activity/add',
      name: 'addActivity',
      component: () => import('@/views/operatingModel/activity/edit'),
      hidden: true,
      meta: {
        title: '新增活动',
        noCache: true,
        hideInTagsView: true
      }
    },
    {
      path: '/activity/edit',
      name: 'editActivity',
      component: () => import('@/views/operatingModel/activity/edit'),
      hidden: true,
      meta: {
        title: '修改活动',
        noCache: true,
        hideInTagsView: true
      }
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: () => import('@/views/operatingModel/agreement'),
      hidden: false,
      meta: {
        title: '合同管理',
        noCache: false
      }
    },
    {
      path: '/proAnalyze',
      name: 'proAnalyze',
      component: () => import('@/views/operatingModel/proAnalyze'),
      hidden: false,
      meta: {
        title: '竞品分析',
        noCache: false
      }
    },
    {
      path: '/operatingStatus',
      name: 'operatingStatus',
      component: () => import('@/views/operatingModel/operatingStatus'),
      hidden: false,
      meta: {
        title: '经营状况',
        noCache: false
      }
    },
    {
      path: '/motion',
      name: 'motion',
      component: () => import('@/views/operatingModel/motion'),
      hidden: false,
      meta: {
        title: '提案与成功案例',
        noCache: false
      }
    },
    /*{
      path: '/strategic',
      name: 'strategic',
      component: () => import('@/views/operatingModel/strategic'),
      hidden: false,
      meta: {
        title: '客户合作战略管理',
        noCache: false
      }
    },*/
    {
      path: '/moving',
      name: 'moving',
      component: () => import('@/views/operatingModel/moving'),
      hidden: true,
      meta: {
        title: '行动计划管理',
        noCache: false
      }
    },
    // {
    //   path: '/acheivement',
    //   name: 'acheivement',
    //   component: () => import('@/views/operatingModel/acheivement'),
    //   hidden: false,
    //   meta: {
    //     title: '业绩目标',
    //     noCache: false
    //   }
    // },
    {
      path: 'cutomerManager',
      name: 'ReportSales',
      component: () => import('@/views/operatingModel/cutomerManager/index'),
      redirect: '/operatingModel/cutomerManager/index',
      meta: {
        title: '客户合作战略管理',
        noCache: true,
      },
      children:[
        {
          path: 'startegic',
          name: 'ReportSalesOrg',
          component: () => import('@/views/operatingModel/cutomerManager/strategic'),
          meta: {
            title: '年度合作战略管理',
            noCache: true,
          },
        },
       /* {
          path: 'project',
          name: 'ReportSalesBrandCategory',
          component: () => import('@/views/operatingModel/cutomerManager/project'),
          meta: {
            title: '项目管理',
            noCache: true,
          },
        },*/
      ]
    },
  ]
}
export default routes
