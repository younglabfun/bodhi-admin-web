<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle[dialogStatus]">
    <el-form ref="dataForm" :rules="rules" :model="data" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="功能分组" prop="pid">
            <el-select v-model="data.groupId">
              <el-option v-for="item in groups" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="功能名称" prop="name">
            <el-input v-model="data.name" placeholder="请输入功能名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="功能标识" prop="funcCode">
            <el-input v-model="data.funcCode" placeholder="功能标识可用英文、冒号、下划线和横线" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="data.description"
              placeholder="请输入简介" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="dialogStatus === 'update' ? updateData() : createData()">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listGroup, insert, getData, update } from '@/api/node'

export default {
  name: 'NodeForm',
  data() {
    return {
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: {
        'create': '添加功能',
        'update': '编辑功能',
      },

      obj: "node",
      groups: [],
      data: {},
      rules: {
        name: [{ required: true, message: '名称是必填项', trigger: 'blur' }],
        funcCode: [
          {required: true, message: '标识是必填项', trigger: 'blur'},
          {pattern: /^[a-zA-Z:-_]*$/, message: '只可以用英文字母,冒号,下划线和横线', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    showDialog(mode, id) {
      this.setDefault()
      this.dialogStatus = mode
      this.initGroup()
      if (mode === 'update') {
        this.data.id = id
        this.initData()
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogVisible = true
    },
    setDefault() {
      this.data = Object.assign({}, {
        id: undefined,
        groupId: 0,
        funcCode: '',
        name: '',
        description: ''
      })
    },
    initGroup(){
      this.groups = []
      this.groups.push({ id: 0, title: '无分组', name: 'none'})
      listGroup().then(resp => {
        var list = resp.data.list
        for (var i in list) {
          this.groups.push(list[i])
        }
      })
    },
    async initData() {
      await getData(this.obj, this.data.id).then((resp) => {
        this.data = Object.assign({}, resp.data)
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.data)
          insert(this.obj, params).then( (resp) => {
            const {message, data} = resp
            if (data.affected) {
              this.$notify({
                message:message,
                type:'success'
              })
              this.dialogVisible=false
              this.$emit("update")
            } else {
              this.$notify({
                message:message,
                type:'error'
              })
            }
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.data)
          update(this.obj,params).then((resp) => {
            const { message, data } = resp
            if (data.affected) {
              this.$notify({
                message: message,
                type: 'success'
              })
              this.dialogVisible = false
              this.$emit("update")
            } else {
              this.$notify({
                message: message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
