import request from '@/utils/request'

const nodeApi = {
  node: '/v1/node',
  group: '/v1/nodeGroup'
}

function getApi(obj) {
  return nodeApi[obj]
}

export function listByGroup(data) {
  var api = getApi('node')
  return request({
    url: api + '/list-group-node',
    method: 'get',
    params: data
  })
}

export function updateNodeStatus(id) {
  var api = getApi('node')
  return request({
    url: api + '/update-status',
    method: 'post',
    data: {id: id}
  })
}

export function listGroup() {
  var api = getApi('group')
  return request({
    url: api + '/get-list',
    method: 'get'
  })
}

export function insert(obj, data) {
  var api = getApi(obj)
  return request({
    url: api + '/insert',
    method: 'post',
    data
  })
}

export function update(obj, data) {
  var api = getApi(obj)
  return request({
    url: api + '/update',
    method: 'post',
    data
  })
}

export function remove(obj, data) {
  var api = getApi(obj)
  return request({
    url: api + '/remove',
    method: 'post',
    data
  })
}

export function getData(obj, id) {
  var api = getApi(obj)
  return request({
    url: api + '/get/' + id,
    method: 'get'
  })
}
