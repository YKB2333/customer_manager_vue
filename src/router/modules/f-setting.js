
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/setting',
  name: 'Setting',
  component: Layout,
  redirect: '/setting/cacheManager',
  meta: {
    title: '系统管理',
    icon: 'setting'
  },
  children: [
    {
      path: '/cacheManager',
      name: 'CacheManager',
      component: () => import('@/views/setting/cacheManager'),
      hidden: false,
      meta: {
        title: '缓存管理',
        noCache: false
      }
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/setting/business'),
      hidden: false,
      meta: {
        title: '业务板块',
        noCache: false
      }
    },
    {
      path: '/business/detail',
      name: 'businessDetail',
      component: () => import('@/views/setting/businessDetail'),
      hidden: true,
      meta: {
        title: '业务板块-详情',
        noCache: false
      }
    },
    {
      path: 'versionManager',
      name: 'VersionManager',
      component: () => import('@/views/setting/version-manager'),
      meta: {
        title: '版本管理',
      }
    }
  ]
}
export default routes
