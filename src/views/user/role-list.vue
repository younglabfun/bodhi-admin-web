<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listReq.value"
          size="small"
          placeholder="角色名称模糊查询"
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
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="{row}">
          <el-switch v-if="actions.edit" v-model="row.isEnabled" active-value="1" inactive-value="0"
            @change="handleSetStatus(row)" />
          <el-tag v-if="!actions.edit" :type="row.isEnabled | statusStyleFilter" size="small">
            {{ row.isEnabled | statusFilter }}
          </el-tag>
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
          <el-button v-if="actions.edit" type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button v-if="actions.remove" type="danger" size="mini" @click="handleRemove(row)">
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
    <role-form ref="roleForm" @update="fetchData" />
  </div>
</template>

<script>
import * as page from '@/utils/pagination'
import copyButton from '@/components/CopyButton'
import pagination from '@/components/Pagination'
import { listRole, setRoleStatus, removeRole } from '@/api/role'
import roleForm from './components/role-form.vue'

export default {
  name: 'UserList',
  components: { pagination, copyButton, roleForm },
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
      obj: 'role',
      actions: {
        create: true,
        edit: true,
        remove: true
      },
      outColAction: ['create'],

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
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = []
      listRole(this.listReq).then(resp => {
        console.log('resp', resp)
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
      this.$refs['roleForm'].showDialog('create')
    },
    handleEdit(row) {
      this.$refs['roleForm'].showDialog('update', row.roleUuid)
    },
    handleSetStatus(row) {
      setRoleStatus(row.roleUuid).then( (resp) => {
        var {message, data} = resp
        var notifyType = 'error'
        if (data.affected === true) {
          notifyType =  'success'
          message = row.isEnabled === '1' ? '角色已启用' : '角色已禁用'
        }
        this.$notify({
          message: message,
          type: notifyType
        })

      })
    },
    handleRemove(row) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        await removeRole(row.roleUuid).then(resp => {
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
    }
  }
}
</script>
