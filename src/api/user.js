import request from '@/utils/request'

const userApi = '/v1/user'

export function listUser(data) {
  return request({
    url: userApi + '/list',
    method: 'get',
    params: data
  })
}


export function insertUser(data) {
  return request({
    url: userApi + '/insert',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: userApi + '/update',
    method: 'post',
    data
  })
}

export function updatePassword(uuid, password) {
  return request({
    url: userApi + '/update-password',
    method: 'post',
    data: { uuid: uuid, password: password }
  })
}

export function setUserStatus(uuid) {
  return request({
    url: userApi + '/update-status',
    method: 'post',
    data: { uuid: uuid }
  })
}

export function removeUser(uuid) {
  return request({
    url: userApi + '/remove',
    method: 'post',
    data: { uuid: uuid }
  })
}

export function getUser(uuid) {
  return request({
    url: userApi + '/get/' + uuid,
    method: 'get'
  })
}

