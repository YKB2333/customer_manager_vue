
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/userlist',
  name: 'userlist',
  component: Layout,
  redirect: '/userlist/index',
  meta: {
    title: '客户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'index',
      name: 'userlist',
      component: () => import('@/views/userlist'),
      meta: {
        title: '客户管理',
        noCache: false
      }
    },
    {
      path: 'cooperation',
      name: 'cooperation',
      component: () => import('@/views/userList/cooperation'),
      meta: {
        title: '客戶合作商品',
        noCache: false
      }
    },
    {
      path: 'lagUserList',
      name: 'lagUserList',
      component: () => import('@/views/userlist/lagUserList.vue'),
      meta: {
        title: '交易滞后客户',
        noCache: false
      }
    },
    {
      path: 'add',
      name: 'maintainingAddUser',
      component: () => import('@/views/userlist/maintaining/addUser'),
      hidden: true,
      meta: {
        title: '新增客户信息',
        noCache: false,
        hideInTagsView: true
      }
    },
    {
      path: 'edit',
      name: 'maintainingEditUser',
      component: () => import('@/views/userlist/maintaining/editUser'),
      hidden: true,
      meta: {
        title: '修改客户信息',
        noCache: true,
        hideInTagsView: true
      }
    }
  ]
}
export default routes
