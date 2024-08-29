/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str, min=4, max=16) {
  if (str.trim().length === 0) {
    return '用户名必填'
  }
  if (str.length < min || str.length > max) {
    return '用户名最少' + min + '位，最多' + max + '位字符'
  }
  var pattern = new RegExp("[`~!@#$^&*()=|{}':; ',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  if (pattern.test(str)) {
    return '用户名称不可以包含特殊字符'
  }
  return true
}

export function validPassword(str, min = 8, max = 16, kindLevel = 3) {
  // null
  if (str.trim().length === 0) {
    return '密码必填'
  }
  // length
  if (str.trim().length < min || str.trim().length > max) {
    return '密码必须' + min + '至' + max + '位'
  }
  // only english chart and ...
  var pattern = new RegExp('^[a-zA-Z0-9.@$!%*#_~?&^]+$')
  if (!pattern.test(str)) {
    return '密码只可以使用数字、大小写字母、特殊字符（.@$!%*#_~?&^）'
  }
  // must user three kind of charts
  let level = 0
  var patternList = ['[0-9]+', '[a-z]+', '[A-Z]+', '[.@$!%*#_~?&^]+']
  for (var i in patternList) {
    var patternPart = new RegExp(patternList[i])
    var check = patternPart.test(str)
    if (check) {
      level++
    }
  }
  if (level < kindLevel) {
    return '密码必须使用数字、大小写字母、特殊字符其中最少三种'
  }

  return true
}


export function validConfirmPasswrod(str, originStr) {
  if (str.trim().length === 0) {
    return '确认密码必填'
  }
  if (str.trim() !== originStr) {
    return '两次输入密码不一致!'
  }
  return true
}

