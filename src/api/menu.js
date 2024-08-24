import request from '@/utils/request'

const menuApi = "/v1/menu"

export function getAdminMenus(id) {
  return request({
    url: menuApi + '/get-admin-menu',
    method: 'get',
    params: {id: id}
  })
}


export function getMenuList(pid, menuType) {
  return request({
    url: menuApi + '/get-menu-list',
    method: 'get',
    params: {pid: pid, type: menuType}
  })
}

export function getMenuTreeData(menuType) {
  return request({
    url: menuApi + '/get-menu-tree',
    method: 'get',
    params: {type: menuType}
  })
}

export function getMenu(id) {
  return request({
    url: menuApi + '/get/' + id,
    method: 'get'
  })
}


export function insertMenu(data) {
  return request({
    url: menuApi + '/insert',
    method: 'post',
    data
  })
}


export function updateMenu(data) {
  return request({
    url: menuApi + '/update',
    method: 'post',
    data
  })
}

export function setStatus(id, status) {
  return request({
    url: menuApi + '/update-status',
    method: 'post',
    data: {id: id, status: status}
  })
}

