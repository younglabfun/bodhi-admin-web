const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  uuid: state => state.user.uuid,
  permissions: state => state.user.permissions,

  // 动态路由数据
  routes: state => state.settings.routes
}
export default getters
