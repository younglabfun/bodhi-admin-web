/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 合并去重数组
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
export function mergeArray(arr1, arr2) {
  var arr = arr1.concat(arr2);
  arr.sort((a, b) => a - b);
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) newArr.push(arr[i]);
  }
  return newArr;
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}


/**
 * 首字母大写
 * @param {string} str
 * @returns {string}
 */
export function toCase(str) {
  const newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
  return newStr
}

/**
 * 首字母小写
 * @param {string} str
 * @returns {string}
 */
export function toLower(str) {
  const newStr = str.replace(str[0], str[0].toLowerCase())
  return newStr
}
