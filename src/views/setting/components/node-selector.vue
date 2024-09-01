<template>
  <el-row>
    <el-col :span="24" class="count">
      <strong>全部功能 [ <em ref="nodeTotal">{{ nodes.length }}</em> ] </strong>
      <strong>授权功能 [ <em ref="authorizeCount" class="authCount">{{ authData.length }}</em> ]</strong>
      <span style="margin-left: 30px;">
        <el-checkbox v-model="groupStatus" :disabled="checkAllDisabled" :indeterminate="groupInStatus" @change="handleCheckGroupAll">
          全选
        </el-checkbox>
        <el-checkbox v-model="allStatus" :disabled="checkAllDisabled" :indeterminate="allInStatus" @change="handleCheckAll">
          全选所有功能
        </el-checkbox>
      </span>
    </el-col>
    <el-col :span="24" class="selector-content">
      <el-tabs v-model="activeGroup" tab-position="right" :stretch="true" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in nodeGroups"
          :key="item.name"
          :name="item.name"
        >
          <span slot="label">{{ item.title }}
            <em class="groupCount">
              <strong v-if="item.selected !== 0">{{ item.selected }}</strong>
              <sub v-if="item.selected !== 0 && item.selected != item.nodes.length" class="slash">/</sub>
              <em v-if="item.selected != item.nodes.length">{{ item.nodes.length }}</em>
            </em>
          </span>
          <el-checkbox-group v-model="selectedNodes" @change="handleSelectedChanged">
            <el-row :gutter="0" class="node-list">
              <el-col :span="22" v-for="node in item.nodes" :key="node.id">
                <el-checkbox :label="node.id"> {{ node.name }}
                <span v-if="node.description" class="node-desc">( {{ node.description }} )</span>
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import { mergeArray } from '@/utils'
import { listGroup, listNode } from '@/api/node';

export default {
  name: 'NodeSelector',
  props: {
    auth: { // 已经获取的授权
      type: String,
      default: ''
    },
  },
  data() {
    return {
      nodes:[],
      nodeGroups: [],

      authData: [], // 已被授权node
      selectedNodes: [], // 分组中被选中node

      activeGroup: '',
      activeIndex: undefined,
      groupNodes: [],
      groupNodeIds: [],

      checkAllDisabled: true, // 全选按钮disabled
      allStatus: false, // 所有功能全选选中状态
      allInStatus: false, // 所有功能全选checkbox不确定状态

      groupStatus: false, // 当前分组选中状态
      groupInStatus: false, // 当前分组全选checkbox不确定状态
    }
  },
  watch:{
    auth: function(val) {
      this.initAuthData(val)
    }
  },
  methods: {
    initSelector(){
      this.setDefault()
      this.initNodeData()
    },
    async initNodeData() {
      await this.fetchNode()
      await this.fetchNodeGroup()
      this.setNodeData()
    },
    setDefault(){
      // 数据
      this.selectedNodes = []

      // 页面状态
      this.checkAllDisabled = true
      this.allStatus = false
      this.groupStatus = false
    },
    initAuthData() {
      var authData = []
      if (this.auth.length != 0) {
        try {
          authData = JSON.parse(this.auth)
        } catch (e) {
          console.log('auth is invalid json data', this.auth)
        }
      }
      console.log('initAuthData',this.auth)
      this.authData = authData
    },
    setNodeData(){
      for (var i = 0; i < this.nodeGroups.length; i++) {
        if (i === 0){
          this.activeGroup = this.nodeGroups[i].name
          this.activeIndex = i
        }
        this.nodes.forEach(row => {
          if (row.isEnabled == 1 && row.groupId === this.nodeGroups[i].id) {
            this.nodeGroups[i].nodes.push(row)
          }
        })
        this.nodeGroups[i].selected = this.getSelectedCount(this.nodeGroups[i].nodes)
      }
      // console.log(this.activeIndex)
      if (this.activeIndex != undefined) {
        this.initGroupNodeData()
      }
    },
    getSelectedCount(nodes) {
      var count = 0
      var ids = this.getNodeIds(nodes)
      if (this.authData.length != 0) {
        ids.forEach(id => {
          if (this.authData.indexOf(id) > -1) {
            count++
          }
        })
      }
      return count
    },
    async fetchNode(){
      this.nodes = []
      await listNode().then(resp => {
        var list = resp.data.list
        this.nodes = list
      })
    },
    async fetchNodeGroup(){
      this.nodeGroups = []
      await listGroup().then(resp => {
        var list = resp.data.list
        for (var i = 0; i < list.length; i++){
          var item = list[i]
          item.nodes = []
          this.nodeGroups.push(item)
        }
      })
      this.nodeGroups.unshift({ id: 0, title: '未分组', name: 'none', nodes: [] })
    },
    // 切换tab
    handleTabClick(tab) {
      this.activeIndex = tab.index
      this.initGroupNodeData()
    },
    // 初始化当前分组的node数据
    initGroupNodeData(){
      // 当前分组的nodes
      this.groupNodes = this.nodeGroups[this.activeIndex].nodes
      // 获取当前分组被选中的node
      this.selectedNodes = this.getGroupSelectedNode()
      this.handleSelectedChanged(this.selectedNodes)
      // 释放禁用状态
      this.checkAllDisabled = false
    },
    getGroupSelectedNode() {
      var selected = []
      if (this.authData.length != 0) {
        var groupNodeIds = this.getNodeIds(this.groupNodes)
        groupNodeIds.forEach(id => {
          if (this.authData.indexOf(id) > -1) {
            selected.push(id)
          }
        })
      }
      return selected
    },
    getNodeIds(nodes){
      var ids = []
      nodes.forEach(row => {
        ids.push(row.id)
      })
      return ids
    },
    // 更新选择状态
    handleSelectedChanged(value){
      // 更新授权
      this.setAuthData()

      const checkedLen = value.length
      // 更新当前分组选中数量
      this.nodeGroups[this.activeIndex].selected = checkedLen
      // 分组全选按钮状态
      this.groupStatus = checkedLen === this.groupNodes.length
      this.groupInStatus = checkedLen > 0 && checkedLen < this.groupNodes.length
      // 全选按钮状态
      this.setCheckAllStatus()
    },
    setCheckAllStatus() {
      const authLen = this.authData.length
      this.allStatus = authLen === this.nodes.length
      this.allInStatus = authLen > 0 && authLen < this.nodes.length
    },
    setAuthData() {
      var groupNodeIds = this.getNodeIds(this.groupNodes)
      // 移除授权信息中该组所有nodes
      var diffSet = this.authData.filter(function(v) { return groupNodeIds.indexOf(v) === -1})
      // 将本组已选中的node加入授权信息
      this.authData = mergeArray(diffSet, this.selectedNodes)

      // console.log('set auth data ', this.authData)
      this.$emit('authChanged', JSON.stringify(this.authData))
    },
    handleCheckGroupAll(checked){
      // 本组数据全选状态
      this.selectedNodes = checked ? this.getNodeIds(this.groupNodes) : []
      this.nodeGroups[this.activeIndex].selected = this.selectedNodes.length
      this.groupInStatus = false

      // 更新授权
      this.setAuthData()
      this.setCheckAllStatus()
    },
    handleCheckAll(checked){
      // 当前组更新选择状态
      this.selectedNodes = checked ? this.getNodeIds(this.groupNodes) : []
      // 更新所有组的选择统计
      for (const i in this.nodeGroups){
        this.nodeGroups[i].selected = checked ? this.nodeGroups[i].nodes.length : 0
      }

      this.groupStatus = checked
      this.groupInStatus = false
      this.allStatus = checked
      this.allInStatus = false
      // 更新授权
      this.authData = checked ? this.getNodeIds(this.nodes) : []
      this.setAuthData()
    },
  }
}
</script>

<style lang="scss" scoped>
.count {
  border-radius: 4px;
  padding-left: 20px;
  min-height: 36px;
  color: #666666;
  background: #efefef;
  strong {
    font-weight: 400;
    margin-right: 10px;
  }
  .authCount {
    color: #009900;
  }
}
.selector-content {
  margin-top: 20px;
  height: 200px;
  overflow: auto;
}
.groupCount{
  font-size: 10px;
  position: absolute;
  right: 0;
  strong {
    font-weight: 100;
    color: #009900;
  }
  em {
    color: #808080;
  }
  .slash{
    color: #cccccc;
    padding: 0 2px;
  }
}
.node-list {
  line-height: 36px;
  padding: 0 10px;
  margin: 5px 0;
  .node-desc {
    margin-left: 10px;
    color: #999999;
  }
}

</style>
