<template>
  <el-row>
    <el-col :span="24" class="grid-content bg-gray actionCount">
      <strong>全部功能 [ <em ref="actionTotal">{{ appActions.length }}</em> ] </strong>
      <strong>授权功能 [ <em ref="authorizeCount" class="authorizeCount">{{ selectedActionList.length }}</em> ]</strong>
      <span style="margin-left: 30px;">
        <el-checkbox v-model="checkAll" :disabled="checkAllDisabled" :indeterminate="isIndeterminate" @change="handlerCheckAll">
          全选
        </el-checkbox>
        <el-checkbox v-model="checkAllAction" :disabled="checkAllDisabled" :indeterminate="isAllIndeterminate" @change="handlerCheckAllActions">
          全选所有功能
        </el-checkbox>
      </span>
    </el-col>
    <el-col :span="24" style="margin-top:20px">
      <el-skeleton :animated="actionLoad" :loading="skeletonLoad" :rows="6" class="actionskeleton" />
      <el-tabs v-model="activeTab" tab-position="right" :stretch="true" @tab-click="handlerTabClick">
        <el-tab-pane
          v-for="item in actionGroups"
          :key="item.name"
          :name="item.name"
        >
          <span slot="label">{{ item.title }}
            <em class="tabCount">
              <strong v-show="item.selected !== 0">{{ item.selected }}</strong>
              <sub v-show="item.selected !== 0 && item.selected != item.actions.length" class="slash">/</sub>
              <em v-show="item.selected != item.actions.length">{{ item.actions.length }}</em>
            </em>
          </span>
          <el-checkbox-group v-model="selectedAction" @change="onSelectedChange">
            <el-row>
              <el-col v-for="action in item.actions" :key="action.id">
                <el-checkbox
                  :label="action.id"
                >
                  <div class="grid-content bg-gray-light action-content">
                    {{ action.name }}
                    <span v-if="action.description">( {{ action.description }} )</span>
                  </div>
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
import store from '@/store'
import { mergeArray } from '@/utils'

export default {
  name: 'ActionSelector',
  props: {
    // mode: {
    //   type: String,
    //   default: 'template'
    // },
    // appUuid: {
    //   type: String,
    //   default: ''
    // },
    authorize: { // 已经获取的授权
      type: String,
      default: ''
    },
    // orgAuthActions: { // 租户获得授权的应用
    //   type: Array,
    //   default: function(data) {
    //     return data
    //   }
    // }
  },
  data() {
    return {
      appActions: [], // 应用的所有功能
      appActionGroups: [], // 应用的所有分组
      actions: [], // 当前分组的功能
      actionGroups: [], // 筛选以后的应用分组
      actionIds: [], // 当前分组的功能的id
      selectedActionList: [], // 所有被选中功能
      selectedAction: [], // 当前分组被选中功能
      authorizeJson: '',
      activeTab: '', // action group name
      activeTabIndex: 0, // actionGroups index
      activeTabId: 0, // action group id

      checkAllDisabled: true, // 全选按钮disabled
      isIndeterminate: false, // 当前分组全选checkbox不确定状态
      isAllIndeterminate: false, // 所有功能全选checkbox不确定状态
      checkAll: false, // 当前分组选中状态
      checkAllAction: false, // 所有功能全选选中状态
      actionLoad: false, // 骨架屏加载动画
      skeletonLoad: true // 是否显示骨架屏
    }
  },
  watch: {
    // appUuid: function(val) {
    //   this.handlerAppChange(val)
    // },
    authorize: function(val) {
      this.initAuthorize(val)
    }
  },
  methods: {
    handlerAppChange(appUuid) {
      this.initActionData()
      this.getActionData(appUuid)
      // this.selectedActionList = []
      // this.handlerCheckAllActions(false)
    },
    initActionData() {
      // console.log('init action data')
      this.checkAllDisabled = true
      this.isIndeterminate = false
      this.isAllIndeterminate = false
      this.checkAll = false
      this.checkAllAction = false
      this.actionLoad = true
      this.skeletonLoad = true
      this.appActionGroups = []
      this.appActions = []
      this.actionGroups = []
    },
    async getActionData(appUuid) {
      if (appUuid === '') {
        this.actionLoad = false
        return false
      }
      // 获取该应用所有功能
      await this.getActions(appUuid)
      // 获取该应用所有功能分组
      await this.getActionGroup(appUuid)

      var skeletionShow = true
      if (this.appActions.length !== 0) {
        this.setActionData()
        this.setGroupActionData()
        skeletionShow = false
      }

      this.skeletonLoad = skeletionShow
      this.actionLoad = false
    },
    // 获取分组功能在所有被选中功能中的统计
    getSelectedCount(ids) {
      var count = 0
      if (this.selectedActionList.length !== 0) {
        for (const i in ids) {
          if (this.selectedActionList.indexOf(ids[i].id) > -1) count++
        }
      }
      return count
    },
    // 获取应用所有功能
    async getActions(appUuid) {
      this.appActions = await store.dispatch('action/getActionsByAppUuid', appUuid)
        .then((response) => {
          if (response === null) {
            this.$notify({
              message: '该应用尚未添加功能数据，无法进行授权操作',
              type: 'warning',
              duration: 2000
            })
            this.actionLoad = false
            return []
          }
          return response
        })
    },
    // 获取应用功能分组
    async getActionGroup(appUuid) {
      this.appActionGroups = await store.dispatch('action/getActionGroupsByAppUuid', appUuid)
    },
    // 从租户授权应用中筛选设置可以授权给角色的操作
    setActionData() {
      // console.log('set action')
      if (this.mode !== 'template') {
        if (typeof this.orgAuthActions !== 'undefined' && this.orgAuthActions.length !== 0) {
          var authActions = []
          for (const i in this.appActions) {
            var action = this.appActions[i]
            if (this.orgAuthActions.indexOf(action.id) < 0) continue
            authActions.push(action)
          }
          this.appActions = authActions
        }
      }
    },
    // 分组显示应用数据
    setGroupActionData() {
      // console.log('set group action')
      var actionCount = 0
      if (this.appActionGroups.length > 0) {
        for (const i in this.appActionGroups) {
          var group = this.appActionGroups[i]
          group.actions = []
          for (const j in this.appActions) {
            if (group.id !== this.appActions[j].groupId) continue
            group.actions.push(this.appActions[j])
            actionCount++
          }
          if (group.actions.length === 0) continue
          group.selected = this.getSelectedCount(group.actions)
          this.actionGroups.push(group)
        }
      }
      // 未分组应用合并为单独的分组
      // console.log('acount', actionCount, this.appActions.length)
      if (actionCount !== this.appActions.length) {
        var customeGroup = { id: 0, title: '未分组', name: 'unknown' }
        customeGroup.actions = []
        for (const m in this.appActions) {
          if (this.appActions[m].groupId !== customeGroup.id) continue
          customeGroup.actions.push(this.appActions[m])
        }
        customeGroup.selected = this.getSelectedCount(customeGroup.actions)
        this.actionGroups.push(customeGroup)
      }
      // 显示第一tab页数据
      if (this.actionGroups.length > 0) {
        this.initTabActionData()
      }
    },
    // tab页点击事件
    handlerTabClick(tab, event) {
      // console.log('tab click', tab)
      this.activeTabIndex = tab.index
      this.initTabActionData()
    },
    // 初始化tab数据
    initTabActionData() {
      // console.log('init tab data')
      this.activeTab = this.actionGroups[this.activeTabIndex].name
      this.activeTabId = this.actionGroups[this.activeTabIndex].id
      this.actions = this.actionGroups[this.activeTabIndex].actions
      this.actionIds = this.getActionIds(this.actions)

      // 所有选择功能和当前分组功能的交集 即为当前分组中被选中的功能
      this.selectedAction = this.getSelectedActions()
      this.onSelectedChange(this.selectedAction)
      this.checkAllDisabled = false
    },
    // 当前功能ID
    getActionIds(actionData) {
      var actions = []
      for (const i in actionData) {
        actions.push(actionData[i].id)
      }
      return actions
    },
    getSelectedActions() {
      var selected = []
      if (this.selectedActionList.length !== 0) {
        for (const i in this.actionIds) {
          var actionId = this.actionIds[i]
          if (this.selectedActionList.indexOf(actionId) > -1) {
            selected.push(actionId)
          }
        }
      }
      return selected
    },
    // 设置表单json
    setAuthorizeJson() {
      // 删掉当前分组的功能 再合并被选中的
      var allSelectedActionIds = this.selectedActionList
      var groupActionIds = this.actionIds
      var minus = allSelectedActionIds.filter(function(v) { return groupActionIds.indexOf(v) === -1 })
      this.selectedActionList = mergeArray(minus, this.selectedAction)
      this.authorizeJson = JSON.stringify(this.selectedActionList)
      // console.log('authorize: ', this.authorizeJson)
      this.$emit('authorizeChanged', this.authorizeJson)
    },
    initAuthorize(authJson) {
      var authActions = []
      if (authJson.length !== 0) {
        try {
          authActions = JSON.parse(authJson)
        } catch (d) {
          console.log('json parse error', authJson)
        }
      }
      this.authorizeJson = authJson
      this.selectedActionList = authActions
    },
    // 单选 checkboxgroup change
    onSelectedChange(value) {
      // console.log('on change', value)
      const checkedCount = value.length
      this.actionGroups[this.activeTabIndex].selected = checkedCount
      this.checkAll = checkedCount === this.actionIds.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.actionIds.length
      this.setAuthorizeJson()
      // console.log('check len ', this.selectedActionList.length, this.appActions.length)
      this.isAllIndeterminate = this.selectedActionList.length > 0 && this.selectedActionList.length < this.appActions.length
      this.checkAllAction = this.selectedActionList.length === this.appActions.length
    },
    // 全选当前分组的应用功能
    handlerCheckAll(checked) {
      this.selectedAction = checked ? this.actionIds : []
      this.actionGroups[this.activeTabIndex].selected = this.selectedAction.length
      this.isIndeterminate = false

      this.setAuthorizeJson()

      // 设置全选所有多选框状态
      // console.log('sal--', this.selectedActionList.length, this.appActions.length)
      this.isAllIndeterminate = this.selectedActionList.length > 0 && this.selectedActionList.length < this.appActions.length
      this.checkAllAction = this.selectedActionList.length === this.appActions.length
    },
    // 全选当前应用的所有功能
    handlerCheckAllActions(checked) {
      // console.log('check all actions ', checked)
      // 全选
      this.selectedAction = checked ? this.actionIds : []
      this.checkAll = checked
      this.isIndeterminate = false
      // 全选所有
      this.selectedActionList = checked ? this.getActionIds(this.appActions) : []
      this.checkAllAction = checked
      this.isAllIndeterminate = false
      this.setAuthorizeJson()
      this.setAllGroupSelected(checked)
    },
    setAllGroupSelected(status) {
      for (const i in this.actionGroups) {
        this.actionGroups[i].selected = status ? this.actionGroups[i].actions.length : 0
      }
    }
  }
}
</script>

<style>
.actionskeleton .el-skeleton {
  position: relative;
}
.grid-content {
  border-radius: 4px;
  padding-left: 20px;
  min-height: 36px;
}
.actionCount {
  color: #666666;
}
.actionCount strong {
  font-weight: 400;
  margin-right: 10px;
}
.authorizeCount {
  color: #009900;
}
.tabCount {
  margin-left: 10px;
  font-size: 10px;
  float:right;
}
.tabCount em {
  color: #999999;
}
.slash{
  color: #cccccc;
  padding: 0 2px;
}
.tabCount strong {
  font-weight: 100;
  color: #009900;
}
.action-content {
  line-height: 36px;
  padding: 0 10px;
  margin: 5px 0;
}

.action-content span {
  margin-left: 10px;
  color: #999999;
}

.bg-gray {
  background: #efefef;
}

.bg-gray-light {
  background: #f4f4f4;
}
.el-tab-pane {
  overflow: auto;
}
</style>
