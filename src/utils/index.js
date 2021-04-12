export function formatDate(number, format) { // formatDate('Y/M/D h:m:s')
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr  = ['Y','M','D','h','m','s']
  var returnArr   = []
  
  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))
  
  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))
  
  for (var i in returnArr)  
  {  
    format = format.replace(formateArr[i], returnArr[i])
  }  
  return format
} 

export function uniqueArrByKey(arr, key) {
  let obj = {}
  let result = []
  result = arr.reduce((cur, next) => {
    obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next)
    return cur
  }, [])
  return result
}

export function generateCategoryCascader(cateList, key) {
  let list = cateList
  let oneArr = [] 
  let twoArr = []
  let threeArr = []
  let result = []
  list.forEach(item => {
    // value: 'yizhi',
    // label: '一致'
    if (key === 'cateCode') {
      item['value'] = item.code
    } else if (key === 'cateId') {
      item['value'] = item.id
    }
    item['label'] = item.name
    if (item.cateLevel === '1') {
      oneArr.push(item)
    }
    if (item.cateLevel === '2') {
      twoArr.push(item)
    }
    if (item.cateLevel === '3') {
      threeArr.push(item)
    }
  })
  // 生成二级
  let generateSecond = (one, two) => {
    for (let i = 0; i < one.length; i++) {
      let child = []
      for (let j = 0; j < two.length; j++) {
        if (two[j].code.split('-')[0] === one[i].code) {
          child.push(two[j])
        }
      }
      if (child.length > 0) one[i].children = child
    }
    return one
  }

  let secondData = generateSecond(oneArr, twoArr)

  let generateThree = (data, threeArr) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].children) {
        for (let j = 0; j < data[i].children.length; j++) {
          let child = []
          for (let k = 0; k < threeArr.length; k++) {
            if (threeArr[k].code.split('-')[1] === data[i].children[j].code.split('-')[1]) {
              child.push(threeArr[k])
            }
          }
          if (child.length > 0) data[i].children[j].children = child
        }
      }
    }
    return data
  }
  result = generateThree(secondData, threeArr)
  // console.log(result)
  return result
}

export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

export function getUrlParam(url, key) {
  return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
}

export function checkEmail(email) {
  let reg = /^([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(email)
}

export function checkMobile(mobile) { // 1开头，11位
  let reg = /^1\d{10}$/
  return reg.test(mobile)
}

export function formatFileSize(fileSize) {
  if (fileSize < 1024) {
      return fileSize + 'B';
  } else if (fileSize < (1024*1024)) {
      var temp = fileSize / 1024;
      temp = temp.toFixed(2);
      return temp + 'KB';
  } else if (fileSize < (1024*1024*1024)) {
      var temp = fileSize / (1024*1024);
      temp = temp.toFixed(2);
      return temp + 'MB';
  } else {
      var temp = fileSize / (1024*1024*1024);
      temp = temp.toFixed(2);
      return temp + 'GB';
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function getMaxNumber() {
  return 2147483647
}


import lodash from 'lodash'
/**
 * 将有父子关系的数组转换成树形结构的数组
 * superIdKey： 父级ID的键名
 */
export function translateDataToTree(arr, superIdKey) {
  let data = lodash.clone(arr)
  //没有父节点的数据
  let parents = data.filter(value => !value[superIdKey])
 
  //有父节点的数据
  let children = data.filter(value => value[superIdKey])
 
  // 定义转换方法的具体实现
  let translator = (parents, children) => {
    // 遍历父节点数据
    parents.forEach((parent) => {
      //遍历子节点数据
      children.forEach((current, index) => {
        // 此时找到父节点对应的一个子节点
        if (current[superIdKey] === parent.id) {
          // 对子节点数据进行深复制
          let temp = lodash.cloneDeep(children)
          // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1)
          // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp)
          // 把找到子节点放入父节点的children属性中
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      })
    })
  }
 
  // 调用转换方法
  translator(parents, children)
 
  // 返回最终的结果
  return parents
}


/**
 * @description 判断传的数字参数是否为科学计数法格式，如是则转换为数字类型格式显示
 * @param {*} num  数字
 * @param {*} digits  小数点后保留位数
 */
export function toNumberStr (num,digits) {
  // 正则匹配小数科学记数法
  if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(num)) {
      // 正则匹配小数点最末尾的0
      var temp=/^(\d{1,}(?:,\d{3})*\.(?:0*[1-9]+)?)(0*)?$/.exec(num.toFixed(digits)) ;
      if(temp){
          return temp[1];
      }else{
          return num.toFixed(digits)
      }
  }else{
      return ""+num
  }
}

/**
  ** 加法函数，用来得到精确的加法结果
  ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  ** 调用：accAdd(arg1,arg2)
  ** 返回值：arg1加上arg2的精确结果
  **/
 export function accAdd(arg1, arg2) {
  var r1, r2, m, c, n;
  try {
      r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
      r1 = 0;
  }
  try {
      r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
      r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
          arg1 = Number(arg1.toString().replace(".", "")) * cm;
          arg2 = Number(arg2.toString().replace(".", ""));
      }
  } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
  }

 n = (r1 >= r2) ? r1 : r2;
  return ((arg1 + arg2) / m).toFixed(n);
}

/**
** 减法函数，用来得到精确的减法结果
** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
** 调用：accSub(arg1,arg2)
** 返回值：arg1减去arg2的精确结果
**/
export function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
      r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
      r1 = 0;
  }
  try {
      r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
      r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
** 乘法函数，用来得到精确的乘法结果
** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
** 调用：accMul(arg1,arg2)
** 返回值：arg1乘以 arg2的精确结果
**/
export function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
      m += s1.split(".")[1].length;
  }
  catch (e) {
  }
  try {
      m += s2.split(".")[1].length;
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
** 除法函数，用来得到精确的除法结果
** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
** 调用：accDiv(arg1,arg2)
** 返回值：arg1除以arg2的精确结果
**/
export function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
      t1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
  }
  try {
      t2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
  }
  
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * Math.pow(10, t2 - t1);
  
}