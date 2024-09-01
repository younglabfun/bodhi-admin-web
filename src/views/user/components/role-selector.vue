<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="60%">
    <el-table
      v-loading="listLoading"
      :data="list"
      tripe fit
      highlight-current-row
    >
      <el-table-column label="UUID" width="230px" fixed>
        <template slot-scope="{row}">
          <span class="uuid">{{ row.roleUuid }}</span>
          <copy-button :copy-data="row.roleUuid" />
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="{row}">
          <el-button
            :type="row.isAuth | authStyleFiler"
            size="mini"
            @click="row.isAuth ? handleRemoveAuth(row) : handleAuth(row)"
          >
            {{ row.isAuth | authFilter }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listReq.page"
      :limit.sync="listReq.size"
      @pagination="fetchRoleData"
    />
  </el-dialog>
</template>

<script>
import * as page from '@/utils/pagination'
import copyButton from '@/components/CopyButton'
import pagination from '@/components/Pagination'
import { listRole } from '@/api/role';
import { getUserRoles, removeUserRole, setUserRole, resetUserRole } from '@/api/user';

export default {
  name: 'RoleSelector',
  components: {
    pagination, copyButton
  },
  filters: {
    authFilter(status) {
      var authText = '授权'
      if (status) {
        authText = '取消'
      }
      return authText
    },
    authStyleFiler(status){
      var style = 'success'
      if (status) {
        style = 'warning'
      }
      return style
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '角色授权',

      userData: [],
      userRoles: [],
      list: [],
      total: 0,
      listReq: {},
      listLoading: true,
      actionColWidth: 0,
      page
    }
  },
  created() {
    this.listReq = page.getDefaultParams()
  },
  methods: {
    showDialog(userUuid) {
      this.userUuid = userUuid
      this.initData()
      this.dialogVisible = true
    },
    async initData(){
      await this.fetchUserRoleData()
      await this.fetchRoleData()
    },
    async fetchUserRoleData() {
      this.userData = []
      this.userRoles = []
      await getUserRoles(this.userUuid).then(resp => {
        var list = resp.data.list
        for (var i in list) {
          this.userData.push(list[i])
          this.userRoles.push(list[i].roleUuid)
        }
      })
    },
    async fetchRoleData() {
      this.listLoading = true
      this.list = []
      await listRole(this.listReq).then(resp => {
        var list = resp.data.list
        this.total = resp.data.total
        for (var i in list) {
          var item = list[i]
          item.isAuth = this.getAuthStatus(item.roleUuid)
          this.list.push(item)
        }
        this.listLoading = false
      })
    },
    getAuthStatus(roleUuid) {
      var auth = false
      if (this.userRoles.length != 0) {
        if (this.userRoles.indexOf(roleUuid) > -1){
          auth = true
        }
      }
      return auth
    },
    handleRemoveAuth(row) {
      this.$confirm('取消该角色授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        var index = this.userRoles.indexOf(row.roleUuid)
        if (index < 0) {
          this.$notify({
            message: '未找到授权数据，请刷新页面重试',
            type: 'error'
          })
        }
        var id = this.userData[index].id
        await removeUserRole(id).then(resp => {
          var {message, data} = resp
          var notifyType = 'error'
          if (data.affected) {
            notifyType =  'success'
          }
          this.$notify({
            message: message,
            type: notifyType
          })
          this.initData()
        })
      })
    },
    handleAuth(row) {
      this.setUserRole(row.roleUuid)
    },
    setUserRole(roleUuid) {
      setUserRole(this.userUuid, roleUuid).then(resp => {
        const {message, data} = resp
        if (data.affected) {
          this.$notify({
            message:message,
            type:'success'
          })
          this.initData()
        } else {
          this.$notify({
            message:message,
            type:'error'
          })
        }
      })
    }
  }
}
</script>
