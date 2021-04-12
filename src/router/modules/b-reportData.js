import Layout from '@/views/layout/Layout'

const routes = {
  path: '/reportData',
  name: 'ReportData',
  component: Layout,
  redirect: '/reportData',
  meta: {
    title: 'Post统计',
    icon: 'report'
  },
  children: [
    {
      path: 'terminalOther',
      name: 'OtherReportSales',
      component: () => import('@/views/reportData/terminalOther'),
      redirect: '/reportData/terminalOther',
      meta: {
        title: 'Other分析',
        noCache: true
      },
      children: [
        {
          path: 'data',
          name: 'OtherReportQuery',
          component: () => import('@/views/reportData/terminalOther/data'),
          meta: {
            title: '报表数据查询',
            noCache: true
          }
        },
        {
          path: 'brand',
          name: 'OtherReportBrandSaleCount',
          component: () => import('@/views/reportData/terminalOther/brand'),
          meta: {
            title: '品牌数据统计',
            noCache: true
          }
        },
        {
          path: 'sku',
          name: 'OtherReportSkuSaleCount',
          component: () => import('@/views/reportData/terminalOther/sku'),
          meta: {
            title: 'sku数据统计',
            noCache: true
          }
        }
      ]
    },
    {
      path: 'terminalQcs',
      name: 'ReportCustomer',
      component: () => import('@/views/reportData/terminalQcs'),
      redirect: '/reportData/terminalQcs',
      meta: {
        title: '屈臣氏分析',
        noCache: true
      },
      children: [
        {
          path: 'terminalQcs',
          name: 'JKReportSales',
          component: () => import('@/views/reportData/terminalOther'),
          meta: {
            title: 'JK&彩妆类报表查询',
            noCache: true
          },
          children: [
            {
              path: 'data',
              name: 'ReportCustomerChannel',
              component: () => import('@/views/reportData/terminalQcs/data'),
              meta: {
                title: '报表数据查询',
                noCache: true
              }
            },
            {
              path: 'brand',
              name: 'ReportCustomerConsume',
              component: () => import('@/views/reportData/terminalQcs/brand'),
              meta: {
                title: '品牌数据统计',
                noCache: true
              }
            },
            {
              path: 'sku',
              name: 'ReportCustomerRingGrowth',
              component: () => import('@/views/reportData/terminalQcs/sku'),
              meta: {
                title: 'Sku数据统计',
                noCache: true
              }
            }
          ]
        },
        {
          path: 'pc',
          name: 'PcReportSales',
          component: () => import('@/views/reportData/terminalQcs/pc'),
          meta: {
            title: 'PC类报表查询',
            noCache: true
          },
          children: [
            {
              path: 'data',
              name: 'PcReportQuery',
              component: () => import('@/views/reportData/terminalQcs/pc/data'),
              meta: {
                title: '报表数据查询',
                noCache: true
              }
            },
            {
              path: 'brand',
              name: 'PcReportBrandSaleCount',
              component: () => import('@/views/reportData/terminalQcs/pc/brand'),
              meta: {
                title: '品牌数据统计',
                noCache: true
              }
            },
            {
              path: 'sku',
              name: 'PcReportSkuSaleCount',
              component: () => import('@/views/reportData/terminalQcs/pc/sku'),
              meta: {
                title: 'sku统计',
                noCache: true
              }
            }
          ]
        }
      ]
    }
  ]
}
export default routes
