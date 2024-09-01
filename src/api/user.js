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

// user role
export function getUserRoles(uuid) {
  return request({
    url: userApi + '/get-user-roles/' + uuid,
    method: 'get'
  })
}

export function setUserRole(userUuid, roleUuid) {
  return request({
    url: userApi + '/set-user-role',
    method: 'post',
    data: { userUuid: userUuid, roleUuid: roleUuid }
  })
}

export function removeUserRole(id) {
  return request({
    url: userApi + '/remove-user-role',
    method: 'post',
    data: { id: id }
  })
}
