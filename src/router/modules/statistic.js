
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/statistic',
  name: 'Statistic',
  component: Layout,
  redirect: '/statistic/customerShipment',
  meta: {
    title: '数据统计',
    icon: 'report'
  },
  children: [
    {
      path: 'customerShipment',
      name: 'CustomerShipment',
      component: () => import('@/views/statistic/customerShipment'),
      meta: {
        title: '客户出货统计',
        noCache: true,
      },
    }
  ]
}
export default routes
