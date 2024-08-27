<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs v-model="activeTab" tab-position="left" stretch addable @edit="handleAddGroup" @tab-click="handleTabClick">
          <el-tab-pane v-for="item in groups" :key="item.id" :label="item.title" :name="item.name">
            <span slot="label">{{ item.title }}</span>
            <div class="filter-container">
              <div class="filter-left">
                <h2>{{ item.title }}</h2>
                <el-button v-if="item.id != 0" type="text" icon="el-icon-edit" @click="handleEditGroup(item.id)">编辑</el-button>
                <el-button v-if="item.id != 0" type="text" icon="el-icon-delete" @click="handleRemoveGroup(item.id)">删除</el-button>
              </div>
              <div class="filter-right">
              <el-button type="success" size="small" class="filter-item" icon="el-icon-edit" style="margin-left:5px" @click="handleCreate">
                添加
              </el-button>
              <el-button type="primary" size="small" class="filter-item" icon="el-icon-receiving" style="margin-left:5px" @click="handleMove">
                移动分组
              </el-button>
              <el-button type="danger" size="small" class="filter-item" icon="el-icon-delete" style="margin-left:5px" @click="handleBatchRemove">
                批量删除
              </el-button>
              </div>
            </div>
            <el-table
              v-loading="loading"
              :data="list"
              highlight-current-row
              tripe fit @selection-change="handlerSelectionChange"
            >
              <el-table-column align="center" type="selection" width="45" />
              <el-table-column align="center" label="ID" width="95">
                <template slot-scope="{row}">
                  {{ row.id }}
                </template>
              </el-table-column>
              <el-table-column label="名称" width="150">
                <template slot-scope="{row}">
                  {{ row.name }} <el-tag size="mini">{{ row.funcCode }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="简介">
                <template slot-scope="{row}">
                  <span>{{ row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80" align="center">
                <template slot-scope="{row}">
                  <el-switch v-if="actions.setStatus" v-model="row.isEnabled" active-value="1" inactive-value="0"
                    @change="handleSetStatus(row)" />
                  <el-tag v-if="!actions.setStatus" :type="row.isEnabled | statusStyleFilter" size="small">
                    {{ row.isEnabled | statusFilter }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="created_at"
                label="添加时间"
                width="160"
              >
                <template slot-scope="{row}">
                  <span>{{ row.createdAt }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="actionColWidth != 0" label="操作" fixed="right" align="center" :width="actionColWidth">
                <template slot-scope="{row,$index}">
                  <el-button v-if="actions.edit" type="primary" size="mini" @click="handleEdit(row)">
                    编辑
                  </el-button>
                  <el-button v-if="actions.remove" type="danger" size="mini" @click="handleRemove(row, $index)">
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
              @pagination="fetchGroupNode"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <group-form ref="groupForm" @update="initData" />
    <node-form ref="nodeForm" @update="initData" />
    <move-form ref="moveForm" @move="handleChangeGroup" />
  </div>
</template>

<script>
import * as page from '@/utils/pagination'
import { listGroup, remove, listByGroup, updateNodeStatus } from '@/api/node'
import { batchRemove } from '@/api/node'
import pagination from '@/components/Pagination'
import groupForm from './components/group-form.vue'
import nodeForm from './components/node-form.vue';
import moveForm from './components/move-form.vue'

export default {
  name: 'NodeList',
  components: { pagination, groupForm, nodeForm, moveForm },
  filters: {
    statusFilter(status) {
      return page.statusFilter(status)
    },
    statusStyleFilter(status) {
      return page.statusStyleFilter(status)
    }
  },
  data() {
    return {
      obj: 'node',
      actions: {
        create: true,
        edit: true,
        remove: true,
        setStatus: true
      },
      outColAction: ['create', 'setStatus'],
      actionColWidth: 0,

      groups: [],
      groupId: 0,
      activeTab: 'none',

      list: [],
      total: 0,
      listReq: {},
      loading: true,
      selected: []
    }
  },
  created() {
    this.listReq = page.getDefaultParams()
    this.listReq.field = "group_id"
    this.listReq.value = this.groupId
    this.actions = page.checkPermission(this.obj, this.actions)
    this.actionColWidth = page.getActionColWidth(this.actions, this.outColAction)
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      await this.fetchGroup()
      await this.fetchGroupNode()
    },
    async fetchGroup() {
      this.groups = []
      this.groups.push({ id: 0, title: '未分组', name: 'none'})
      this.activeTab = 'none'
      await listGroup().then(resp => {
        var list = resp.data.list
        for (var i in list) {
          this.groups.push(list[i])
          if (list[i].id === this.groupId) {
            this.activeTab = list[i].name
          }
        }
      })
    },
    handleAddGroup() {
      this.$refs['groupForm'].showDialog('create')
    },
    handleEditGroup(id) {
      this.$refs['groupForm'].showDialog('update', id)
    },
    handleRemoveGroup(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        var params = {id: id}
        await remove('group', params).then(resp => {
          var {message, data} = resp
          var notifyType = 'error'
          if (data.affected) {
            notifyType =  'success'
            this.groupId = 0
          }
          this.$notify({
            message: message,
            type: notifyType
          })
          this.initData()
        })
      })
    },
    handleTabClick(){
      for (var i in this.groups) {
        if (this.activeTab === this.groups[i].name) {
          this.groupId = this.groups[i].id
          break
        }
      }
      this.fetchGroupNode()
    },
    async fetchGroupNode() {
      this.loading = true
      this.list = []
      this.listReq.value = this.groupId
      await listByGroup(this.listReq).then((resp) => {
        this.total = resp.data.total
        var list = resp.data.list
        for (var i in list) {
          var item = list[i]
          item.isEnabled = list[i].isEnabled.toString()
          this.list.push(item)
        }
        this.loading = false
      })
    },

    handleCreate() {
      this.$refs['nodeForm'].showDialog('create')
    },
    handleEdit(row) {
      this.$refs['nodeForm'].showDialog('update', row.id)
    },
    handleRemove(row) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        var params = {id: row.id}
        await remove('node', params).then(resp => {
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
    handleSetStatus(row) {
      updateNodeStatus(row.id).then( (resp) => {
        var {message, data} = resp
        var notifyType = 'error'
        if (data.affected) {
          notifyType =  'success'
        }
        this.$notify({
          message: message,
          type: notifyType
        })
      })
    },
    handlerSelectionChange(selection) {
      this.selected = selection
    },
    handleMove(){
      if (this.selected.length === 0){
        this.$notify.warning("请选择需要移动分组的数据！")
        return false
      }
      var ids = []
      this.selected.forEach( row => {
        ids.push(row.id)
      })
      this.$refs['moveForm'].showDialog(ids, this.groupId)
    },
    handleChangeGroup(targetGroup){
      this.groupId = targetGroup
      this.groups.forEach(group => {
        if (group.id == targetGroup) {
          this.activeTab = group.name
        }
      })

      this.fetchGroupNode()
    },
    handleBatchRemove(){
      if (this.selected.length === 0){
        this.$notify.warning("请选择需要删除的数据！")
        return false
      }
      this.$confirm('确认删除所选数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        var ids = []
        this.selected.forEach( row => {
          ids.push(row.id)
        })
        var idsJson = JSON.stringify(ids)
        await batchRemove(idsJson).then(resp => {
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
    }
  }
}
</script>
