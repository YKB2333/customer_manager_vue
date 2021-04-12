// set function parseTime,formatTime to filter
export { formatDate, formatFileSize } from '@/utils'

export function toThousandFilter(number) {
  if (number == null || number == undefined) {
    return '0.00';
  }
  let numbro = require("numbro")
  return numbro(number).format({
    thousandSeparated: true,
    mantissa: 2
  })
}

export function toOrdinalFilter(number) {
  if (number == null || number == undefined) {
    return null;
  }
  let numbro = require("numbro")
  return numbro(number).format({
    output: "ordinal"
  })
}

export function toPercentFilter(number) {
  if (number == null || number == undefined) {
    return null;
  }
  let numbro = require("numbro")
  return numbro(number).format({
    output: "percent",
    mantissa: 2
  })
}
