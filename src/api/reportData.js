import axios from '@/utils/axios'

export function getReportList(data) { // post数据列表
  return axios.post('/customer/report-terminan-data/findReport', data)
}

export function upload(action, formData) {
  return axios.post(action, formData)
}

export function getReportBrandList(data) { // 品牌列表
  return axios.post('/customer/report-terminan-data/findBrandList', data)
}

export function getReportSkuList(data) { // Sku列表
  return axios.post('/customer/report-terminan-data/findSkuList', data)
}

export function getQcsReportList(data) { // 屈臣氏Post数据
  return axios.post('/customer/report-qcs-data/findReport', data)
}
export function getQcsReportBrandList(data) { // 屈臣氏Brand数据
  return axios.post('/customer/report-qcs-data/findBrandReport', data)
}
export function getQcsReportSkuList(data) { // 屈臣氏Sku数据
  return axios.post('/customer/report-qcs-data/findSkuReport', data)
}
export function getQcsPcReportList(data) { // 屈臣氏PcPost数据
  return axios.post('/customer/report-qcs-pc-data/findReport', data)
}
export function getQcsPcReportBrandList(data) { // 屈臣氏PcBrand数据
  return axios.post('/customer/report-qcs-pc-data/findBrandReport', data)
}
export function getQcsPcReportSkuList(data) { // 屈臣氏PcSku数据
  return axios.post('/customer/report-qcs-pc-data/findSkuReport', data)
}

