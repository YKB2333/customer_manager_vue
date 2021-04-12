import Vue from 'vue'
import Element from 'element-ui'
Vue.use(Element, { size: config.elementSize })
import store from './store'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css
import router from './router'
import '@/assets/icons' // icon
import './router/permission' // permission control
import * as filters from './filters' // global filters
import config from './config'
Vue.config.productionTip = false
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import lodash from 'lodash'
import axios from '@/utils/axios'
import instantCompt from './utils/instantComponent'
import comp from './components'
import moment from 'moment'
import importDirective from '@/directives'
/**
 * 注册指令
 */
importDirective(Vue)
Vue.prototype.$store = store
Vue.prototype.$config = config
Vue.prototype.$instantCompt = instantCompt
Vue.prototype.$http = axios
Vue.prototype.$lodash = lodash
Vue.prototype.$moment = moment
const dayjs = require('dayjs')
Vue.prototype.$dayjs = dayjs
Vue.prototype.$formatDate = require('./utils').formatDate
Vue.prototype.$formatFileSize = require('./utils').formatFileSize
Vue.prototype.$maxNumber = 2147483647

/**
 * 全局 event bus
 */
Vue.prototype.$eventHub = new Vue();
// 事件名称对象
Vue.prototype.$eventName = require('./bus-event')

Vue.use(comp)

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
})
