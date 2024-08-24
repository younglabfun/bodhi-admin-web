import defaultSettings from '@/settings'
import { constantRoutes } from '@/router'
import { getAdminMenus } from '@/api/menu'
import Layout from '@/layout'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,

  routes: []
}


const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_ROUTERS: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}


const loadComponent = (component) => (resolve) => Promise.resolve(require('@/views/' + component), resolve)

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  initRoute({ commit }) {
    return new Promise((resolve, reject) => {
      getAdminMenus().then(response => {
        const { data } = response
        const list = data.tree
        var routes = []
        for (const i in list) {
          var item = list[i]

          var route = {
            path: '/' + item.route.toLowerCase(),
            component: Layout,
          }
          if (item.isShow === 0) {
            route.hidden = true
            routes.push(route)
            continue
          }

          route.children = []
          if (item.children === null) {
            route.path = '/' + item.route.toLowerCase()
            const children = {
              path: item.href,
              name: item.route,
              // component: (resolve) => Promise.resolve(require('@/views/' + item.component), resolve),
              component: loadComponent(item.component),
              meta: { title: item.title, icon: item.icon },
            }
            route.children.push(children)
          } else {
            route.name = item.route.toLowerCase()
            route.redirect = item.href
            route.meta = { title: item.title, icon: item.icon }

            for (var j in item.children) {
              var ci = item.children[j]
              var child = {
                path: ci.href,
                name: ci.route,
                // component: (resolve) => Promise.resolve(require('@/views/' + ci.component), resolve),
                component: loadComponent(ci.component),
                meta: { title: ci.title, icon: ci.icon }
              }
              if (ci.isShow === 0) {
                child.hidden = true
              }
              // console.log('child route', ci.route, child)
              route.children.push(child)
            }
          }
          // console.log('route', item.route, route)
          routes.push(route)
        }
        routes.push({ path: '*', redirect: '/404', hidden: true })
        // console.log('router  ', routes)
        commit('SET_ROUTERS', routes)
        // router.addRoutes(routes)
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

