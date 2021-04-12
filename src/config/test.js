const apiAgent = 'customer'

module.exports = {
  // api请求地址前缀
  baseURL: 'http://khtest.yanmiya.com:8084/admin',
  apiAgent,
  // 是否显示访问页面标签栏
  showTagsView: true,
  // 饿了么尺寸：mini、small、medium
  elementSize: 'mini',
  ssoLogin: {
    cms: {
      title: 'CMS内容管理系统',
      href: 'http://192.168.0.226:7085/#/ssoLogin'
    }
  }
}
