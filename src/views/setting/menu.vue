<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" class="filter-item" icon="el-icon-edit" @click="handlerCreate">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      tripe
      fit
      highlight-current-row
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="菜单">
        <template slot-scope="{row}">
          <i v-if="row.icon" :class="row.icon" class=“fa-fw” />
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column label="路由名" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.route }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标识" width="110" align="center">
        <template slot-scope="{row}">
          {{ row.funcCode }}
        </template>
      </el-table-column>
      <el-table-column label="显示" width="80" align="center">
        <template slot-scope="{row}">
          <el-switch v-if="actions.setShowStatus" v-model="row.isShow" active-value="1" inactive-value="0" @change="handlerSetShow(row)" />
          <el-tag v-if="!actions.setShowStatus" :type="row.isShow | statusStyleFilter" size="small">
            {{ row.isShow | showFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="{row}">
          <el-switch v-if="actions.setStatus" v-model="row.isEnabled" active-value="1" inactive-value="0"
            @change="handlerSetStatus(row)" />
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
          <el-button v-if="actions.edit" type="primary" size="mini" @click="handlerEdit(row)">
            编辑
          </el-button>
          <el-button v-if="actions.remove" type="danger" size="mini" @click="handlerRemove(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <MenuForm ref="menuForm" @update="fetchData" />
  </div>
</template>

<script>
import * as page from '@/utils/pagination'
import { getMenuTreeData, setStatus } from '@/api/menu'
import MenuForm from './components/menu-form.vue'

export default {
  name: 'MenuList',
  components: { MenuForm },
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
      obj: 'menu',
      actions: {
        create: true,
        edit: true,
        remove: true,
        setStatus: true,
        setShowStatus: true,
      },
      outColAction: ['create', 'setStatus', "setShowStatus"],

      pid: 0,
      menuType: 0,

      list: [],
      listLoading: true,
      actionColWidth: 0
    }
  },
  created() {
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
      getMenuTreeData(this.menuType).then(resp => {
        var list = resp.data.tree
        for (var i in list) {
          var item = list[i]
          item.isShow = list[i].isShow.toString()
          item.isEnabled = list[i].isEnabled.toString()
          for (var j in item.children) {
            item.children[j].isShow = item.children[j].isShow.toString()
            item.children[j].isEnabled = item.children[j].isEnabled.toString()
          }

          this.list.push(item)
        }
        this.listLoading = false
      })
    },
    handlerCreate() {
      this.$refs['menuForm'].showDialog('create')
    },
    handlerEdit(row) {
      this.$refs['menuForm'].showDialog('update', row.id)
    },
    handlerSetStatus(row) {
      this.updateStatus(row, 'IsEnabled')
    },
    handlerSetShow(row) {
      this.updateStatus(row, 'IsShow')
    },
    updateStatus(row, status) {
      setStatus(row.id, status).then( (resp) => {
        var {message, data} = resp.data
        var notifyType = 'error'
        if (data.affected) {
          notifyType =  'success'
          if (status === 'IsEnabled') {
            message = row.isEnabled === '1' ? '菜单已启用' : '菜单已禁用'
          } else if (status === 'IsShow') {
            message = row.isShow === '1' ? '已设置为可见' : '已设置为不可见'
          }
        }
        this.$notify({
          message: message,
          type: notifyType
        })

      })
    }
  }
}
</script>
