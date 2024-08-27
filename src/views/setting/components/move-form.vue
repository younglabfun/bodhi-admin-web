<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form
      ref="dataForm"
      :model="form"
      label-width="100px"
      width="40%"
    >
      <el-form-item label="选择分组">
        <el-select
          v-model="form.targetGroup"
          placeholder="请选择功能分组"
        >
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button type="primary" @click="handleMove">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listGroup, batchMoveGroup } from '@/api/node'

export default {
  name: 'NodeGroupForm',
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "移动功能分组",

      groups: [],
      sourceGroup: undefined,
      form: {},
      ids: undefined
    }
  },
  methods: {
    showDialog(ids, sourceGroup) {
      this.setDefault()
      this.ids = ids
      this.sourceGroup = sourceGroup
      this.initGroup()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogVisible = true
    },
    setDefault() {
      this.form = Object.assign({}, {
        targetGroup: undefined
      })
    },
    initGroup() {
      this.groups = []
      listGroup().then(resp => {
        var list = resp.data.list
        for (var i in list) {
          this.groups.push(list[i])
        }
      })
    },
    handleMove(){
      if (this.form.targetGroup === this.sourceGroup) {
        this.$notify.warning('所选分组与原分组相同，请重新选择')
        return false
      }
      var idsJson = JSON.stringify(this.ids)
      batchMoveGroup(this.form.targetGroup, idsJson).then( resp => {
          var {message, data} = resp
          var notifyType = 'error'
          if (data.affected) {
            notifyType =  'success'
            this.dialogVisible = false
            this.$emit('move', this.form.targetGroup)
          }
          this.$notify({
            message: message,
            type: notifyType
          })
        }
      )
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
