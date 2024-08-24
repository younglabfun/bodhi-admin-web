<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menus" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import store from '@/store'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'routes',
      'sidebar'
    ]),
    routes() {
      // return this.$router.options.routes
      // 使用动态路由数据
      return store.getters.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      menus: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    sleep(time) {
      return new Promise(resolve => {
        setTimeout(resolve, time)
      })
    },
    async initData() {
      var routes = store.getters.routes
      for (var i in routes) {
        await this.sleep(50)
        this.menus.push(routes[i])
      }
    }
  }
}
</script>
