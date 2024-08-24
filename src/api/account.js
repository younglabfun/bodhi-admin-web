import request from '@/utils/request'

const accountApi = '/v1/account'

export function login(data) {
  return request({
    url: accountApi + '/login',
    method: 'post',
    data
  })
}

export function getAccount() {
  return request({
    url: accountApi + '/info',
    method: 'get'
  })
}

export function getPermission() {
  return request({
    url: accountApi + '/get-permission',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
