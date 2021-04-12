import axios from '@/utils/axios'
// 数据统计

export function salesSettle(data) {
  return axios.post('/customer/report-sales-data/salesSettle', data)
}

export function exportSalesSettle(data) {
  return axios.post('/customer/report-sales-data/exportSalesSettle', data, { responseType: 'blob' })
}


export function activityCalendar(data) { // 活动日历
  return axios.post('/customer/report-sales-data/activityCalendar', data)
}

export function exportActivityCalendar(data) { // 活动日历导出
  return axios.post('/customer/report-sales-data/exportActivityCalendar', data, { responseType: 'blob' })
}

export function goodsSalesSettle(data) { // 商品出货详情
  return axios.post('/customer/report-sales-data/goodsSalesSettle', data)
}

export function exportGoodsSalesSettle(data) { // 商品出货详情导出
  return axios.post('/customer/report-sales-data/exportGoodsSalesSettle', data, { responseType: 'blob' })
}

export function singleGoodsSalesSettle(data) { // 单商品出货详情
  return axios.post('/customer/report-sales-data/singleGoodsSalesSettle', data)
}
// /customer/report - sales - data / singleGoodsSalesSettle
// 客户管理中心 - 单商品出货详情