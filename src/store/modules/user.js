import { login, logout, getAccount, getPermission } from '@/api/account'
import { getToken, setToken, getRefreshToken, setRefreshToken, clearToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  var refreshData = getRefreshToken()
  return {
    token: getToken(),
    refreshToken: refreshData.token,
    refreshTime: refreshData.refresh,
    name: '',
    avatar: '',

    permissions: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    state.refreshToken = token.refreshToken
    state.refreshTime = token.refreshAfter
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token.accessToken)
        setRefreshToken(data.token.refreshToken, data.token.refreshAfter)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getAccount({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAccount(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get permission
  getPermission({ commit }) {
    return new Promise(( resolve, reject) => {
      getPermission().then( resp => {
        // const permission = resp.data.permission
        const permission = ['all']
        commit('SET_PERMISSION', permission)
        resolve(permission)
      }).catch( error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // removeToken() // must remove  token  first
        clearToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      clearToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

