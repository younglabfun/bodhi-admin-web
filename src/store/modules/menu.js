import { getAdminMenus } from '@/api/menu'
import { formartPath, toCase } from '@/utils'
import constantRoutes from '@/router'
import Layout from '@/layout'

const setDefault = () => {
  routers: constantRoutes
}

const state = setDefault()

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.routers = constantRoutes.concat(routers)
  }
}

const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => Promise.resolve(require(`@/views/${view}`).default, resolve);
  } else {
    return (resolve) => Promise.resolve(import(`@/views/${view}`))
  }
}

const actions = {
  initRoute({ commit }) {
    return new Promise((resolve, reject) => {
      getAdminMenus().then(response => {
        const { data } = response
        const list = data.tree
        // console.log('get admin ', list)
        var routers = []
        for (const i in list) {
          // console.log('index ' + i)
          var item = list[i]
          const path = (item.route.toLowerCase() !== 'dashboard') ? item.route.toLowerCase() : ''
          var router = {
            path: '/' + path,
            redirect: item.href,
            component: Layout,
            meta: { title: item.title, icon: item.icon },
            children: []
          }

          routers.push(router)
          break
          // console.log('router ', router, item.children)
          if (item.children === null) {
            const children = {
              path: formartPath(item.href),
              name: item.route.toLowerCase(), // router name
              component: loadView(item.component),
              meta: { title: item.title, icon: item.icon }
            }
            // console.log('router ', router)
            router.children.push(children)
          } else {
            const keys = Object.keys(item.children)
            router.name = toCase(item.route) // router name
            router.redirect = item.children[keys[0]].href
            for (const j in item.children) {
              var childItem = item.children[j]
              var newChild = {
                path: formartPath(childItem.href),
                name: childItem.route, // router name
                component: loadView(childItem.component),
                meta: { title: childItem.title, icon: childItem.icon, activeMenu: childItem.remark }
              }
              if (childItem.isHidden === 1) {
                Object.defineProperty(newChild, 'hidden', {
                  value: true
                })
              }
              router.children.push(newChild)
            }
          }
          routers.push(router)
        }
        routers.push({ path: '*', redirect: '/404', hidden: true })
        // console.log('router  ', routers)
        commit('SET_ROUTERS', routers)
        resolve(routers)
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

