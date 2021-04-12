const apiAgent = 'customer'

module.exports = {
  // api请求地址前缀
  baseURL: 'http://crm.yanmiya.com/admin',
  //oa地址
  oaURL: 'http://oa.gz-zhongshang.com:9688/wui/index.html',
  apiAgent,
  // 是否显示访问页面标签栏
  showTagsView: true,
  // 饿了么尺寸：mini、small、medium
  elementSize: 'mini',
  ssoLogin: {
    cms: {
      title: 'CMS内容管理系统',
      href: 'http://cms.yanmiya.com/#/ssoLogin'
    }
  }
}
