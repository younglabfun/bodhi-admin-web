
/**
 * getActionColWidth
 * @param {*} actions 当前页所有操作，包含权限
 * @param {*} outColAction 不在操作的权限
 * @returns
 */
export function getActionColWidth(actions, outColAction = []) {
  var count = 0;
  var sizeUnit = 85;
  var actionArr = Object.entries(actions);
  for (var i = 0; i < actionArr.length; i++) {
    if (
      outColAction.length > 0 &&
      outColAction.indexOf(actionArr[i][0]) >= 0
    ) { continue }
    if (actionArr[i][1]) count++;
  }
  var actionColWidth = sizeUnit * count;
  return actionColWidth;
}

export function getDefaultParams() {
  return {
    page: 1,
    size: 20,
    field: '',
    value: '',
    sort: 'created_at',
    order: 'DESC'
  }
}

export function getSortClassName( col, sort, order) {
  if (typeof col !== 'string' || typeof sort !== 'string' || col !== sort) {
    return ''
  }
  return order == 'ASC' ? 'ascending' : 'descending'
}

export function statusFilter(status) {
  const statusMap = {
    0: '禁用',
    1: '启用'
  }
  return statusMap[status]
}

export function statusStyleFilter(status) {
  const styleMap = {
    0: 'danger',
    1: 'success'
  }
  return styleMap[status]
}

// todo check action permission
export function checkPermission(obj, actions) {
  return actions
}