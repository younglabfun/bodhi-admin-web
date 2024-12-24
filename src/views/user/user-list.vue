<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listReq.value"
          size="small"
          placeholder="用户名称模糊查询"
          class="filter-item input"
          clearable
          @clear="refresh"
          @keyup.enter.native="handleFilter"
        />
        <el-button size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <div class="filter-right">
        <el-button v-if="actions.create" size="small" type="success" class="filter-item" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      tripe fit
      highlight-current-row
    >
      <el-table-column label="UUID" width="230px" fixed>
        <template slot-scope="{row}">
          <span class="uuid">{{ row.userUuid }}</span>
          <copy-button :copy-data="row.userUuid" />
        </template>
      </el-table-column>
      <el-table-column label="用户" width="280px">
        <template slot-scope="{row}">
          <span>{{ row.name || '-'}}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="username">
            {{ row.username }}
            <copy-button :copy-data="row.username" />
          </span>
          <el-tag v-if="row.userUuid === myUuid" size="mini" type="success" style="margin-left:5px;">
            me
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.email || '-'}}</span>
          <copy-button :copy-data="row.email" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="{row}">
          <el-switch v-if="actions.edit" :disabled="isDisabled(row)" v-model="row.isEnabled" active-value="1" inactive-value="0"
            @change="handleSetStatus(row)" />
          <el-tag v-if="!actions.edit" :type="row.isEnabled | statusStyleFilter" size="small">
            {{ row.isEnabled | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="230px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.remark || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="添加时间"
        width="160"
        sortable="custom"
        :class-name="page.getSortClassName('created_at', listReq.sort, listReq.order)"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="actionColWidth != 0" label="操作" fixed="right" align="center" :width="actionColWidth">
        <template slot-scope="{row}">
          <el-button v-if="actions.edit" :disabled="isDisabled(row)" type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button v-if="actions.setAuth" :disabled="isDisabled(row)" type="success" size="mini" @click="handleAuth(row)">
            授权
          </el-button>
          <el-button v-if="actions.setPwd" :disabled="isDisabled(row)" type="warning" size="mini" @click="handleSetPwd(row)">
            修改密码
          </el-button>
          <el-button v-if="actions.remove" :disabled="isDisabled(row)" type="danger" size="mini" @click="handleRemove(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listReq.page"
      :limit.sync="listReq.size"
      @pagination="fetchData"
    />
    <user-form ref="userForm" @update="fetchData" />
    <pwd-form ref="pwdForm" />
    <role-selector ref="roleSelector" />
  </div>
</template>

<script>
import store from '@/store'
import * as page from '@/utils/pagination'
import { listUser, setUserStatus, removeUser } from '@/api/user'
import copyButton from '@/components/CopyButton'
import pagination from '@/components/Pagination'
import userForm from './components/user-form.vue'
import pwdForm from './components/pwd-form.vue'
import roleSelector from './components/role-selector.vue'

export default {
  name: 'UserList',
  components: { pagination, copyButton, userForm, pwdForm, roleSelector },
  filters: {
    statusFilter(status) {
      return page.statusFilter(status)
    },
    statusStyleFilter(status) {
      return page.statusStyleFilter(status)
    },
    showFilter(status) {
      const showMap = {
        0: '不可见',
        1: '可见'
      }
      return showMap[status]
    }
  },
  data() {
    return {
      obj: 'user',
      actions: {
        create: true,
        edit: true,
        remove: true,
        setPwd: true,
        setAuth: true,
      },
      outColAction: ['create'],

      myUuid: undefined,

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
    this.actions = page.checkPermission(this.obj, this.actions)
    this.actionColWidth = page.getActionColWidth(this.actions, this.outColAction)
    this.myUuid = store.getters.uuid
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = []
      listUser(this.listReq).then(resp => {
        var list = resp.data.list
        this.total = resp.data.total
        for (var i in list) {
          var item = list[i]
          item.isEnabled = list[i].isEnabled.toString()

          this.list.push(item)
        }
        this.listLoading = false
      })
    },
    refresh() {
      this.listReq.page = 1
      this.listReq.value = ""
      this.fetchData()
    },
    handleFilter() {
      this.listReq.page = 1
      this.fetchData()
    },
    handleCreate() {
      this.$refs['userForm'].showDialog('create')
    },
    handleEdit(row) {
      if (this.isDisabled(row)) {
        this.$notify({
          message: '该用户禁止编辑',
          type: 'warning'
        })
        return false
      }
      this.$refs['userForm'].showDialog('update', row.userUuid)
    },
    handleAuth(row){
      this.$refs['roleSelector'].showDialog(row.userUuid)
    },
    handleSetStatus(row) {
      setUserStatus(row.userUuid).then( (resp) => {
        var {message, data} = resp
        var notifyType = 'error'
        if (data.affected === true) {
          notifyType =  'success'
          message = row.isEnabled === '1' ? '账号已启用' : '账号已禁用'
        }
        this.$notify({
          message: message,
          type: notifyType
        })

      })
    },
    handleSetPwd(row) {
      if (this.isDisabled(row)) {
        this.$notify({
          message: '该用户禁止进行操作',
          type: 'warning'
        })
        return false
      }
      this.$refs['pwdForm'].showDialog(row.userUuid)
    },
    handleRemove(row) {
      if (this.isDisabled(row)) {
        this.$notify({
          message: '该用户禁止进行操作',
          type: 'warning'
        })
        return false
      }
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        await removeUser(row.userUuid).then(resp => {
          var {message, data} = resp
          var notifyType = 'error'
          if (data.affected) {
            notifyType =  'success'
          }
          this.$notify({
            message: message,
            type: notifyType
          })
          this.fetchData()
        })
      })
    },
    isDisabled(row) {
      if (row.userUuid === store.getters.uuid || row.userUuid === process.env.VUE_APP_MASTER) {
        return true
      }
      return false
    }
  }
}
</script>
