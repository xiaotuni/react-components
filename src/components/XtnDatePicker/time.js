/**
 * Created by admin on 2016-10-12.
 */
/**
 * @module time工具
 */


function throwIfInvalidDate(date) {
  if (Object.prototype.toString.call(date, null) !== '[object Date]') {
    throw new Error('参数类型不对');
  }
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * @param  {Date}       日期
 * @return {String}     字符串格式
 */
export function convertDate(date, format) {
  let str = format;
  const o_time = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  if (/(Y+)/.test(format)) {
    str = str.replace(RegExp.$1,
      (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
  }

  for (const k in o_time) { // eslint-disable-line
    if (new RegExp(`(${k})`).test(format)) {
      str = str.replace(RegExp.$1,
        (RegExp.$1.length === 1) ?
          o_time[k] : (`00${o_time[k]}`.substr((o_time[k].toString()).length)));
    }
  }

  return str;
}

/**
 * 获取相对日期的偏移日期
 * @param  {Date}       日期
 * @return {number}     相对的天数
 */
export function nextYear(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getFullYear() + index, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  return date;
}
/**
 * 获取月份
 * @param now
 * @param index
 * @returns {Date}
 */
export function nextMonth(now, index = 0) {
  throwIfInvalidDate(now);
  const year = now.getFullYear();
  const month = now.getMonth() + index;
  const dayOfMonth = Math.min(now.getDate(), daysInMonth(year, month));
  const date = new Date(year, month, dayOfMonth, now.getHours(), now.getMinutes());
  return date;
}
/**
 * 获取天
 * @param now
 * @param index
 * @returns {Date}
 */
export function nextDate(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index, now.getHours(), now.getMinutes());
  return date;
}