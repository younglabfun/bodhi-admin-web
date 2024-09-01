import request from '@/utils/request'

const roleApi = '/v1/role'


export function listRole(data) {
  return request({
    url: roleApi + '/list',
    method: 'get',
    params: data
  })
}


export function insertRole(data) {
  return request({
    url: roleApi + '/insert',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: roleApi + '/update',
    method: 'post',
    data
  })
}

export function setRoleStatus(uuid) {
  return request({
    url: roleApi + '/update-status',
    method: 'post',
    data: { uuid: uuid, status: 'IsEnabled' }
  })
}

export function removeRole(uuid) {
  return request({
    url: roleApi + '/remove',
    method: 'post',
    data: { uuid: uuid }
  })
}

export function getRole(uuid) {
  return request({
    url: roleApi + '/get/' + uuid,
    method: 'get'
  })
}
