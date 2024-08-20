import Cookies from 'js-cookie'

const TokenKey = 'bodhi-token'
const RefreshKey = 'refresh-token'
const RefreshTimeKey = 'refresh-time-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function clearToken() {
  removeToken()
  removeRefresh()
}

export function getRefreshToken() {
  var token = Cookies.get(RefreshKey)
  var refreshTime = Cookies.get(RefreshTimeKey)
  return { token: token, refresh: refreshTime }
}

export function setRefreshToken(token, time) {
  Cookies.set(RefreshKey, token)
  Cookies.set(RefreshTimeKey, time)
  return 'ok'
}

export function removeRefresh() {
  Cookies.remove(TokenKey)
  Cookies.remove(RefreshTimeKey)
  return 'ok'
}
