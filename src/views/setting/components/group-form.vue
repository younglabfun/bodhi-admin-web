<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle[dialogStatus]">
    <el-form ref="dataForm" :rules="rules" :model="data" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="分组名称" prop="title">
            <el-input v-model="data.title" placeholder="请输入分组名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分组标识" prop="name">
            <el-input v-model="data.name" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="data.sort" :min="0" :max="999" />
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
import { insert, getData, update } from '@/api/node'

export default {
  name: 'NodeGroupForm',
  data() {
    return {
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: {
        'create': '添加分组',
        'update': '编辑分组',
      },

      obj: "group",
      data: {},
      rules: {
        title: [{ required: true, message: '名称是必填项', trigger: 'blur' }],
        name: [
          {required: true, message: '标识是必填项', trigger: 'blur'},
          {pattern: /^[a-zA-Z]*$/, message: '只可以用英文字母', trigger: 'blur'}
        ],
        sort: [{type: 'integer', min:0, max: 999, required: true, message: '排序是必填项，且只能为小于999的数字', trigger: 'blur'}],
      }
    }
  },
  methods: {
    showDialog(mode, id) {
      this.setDefault()
      this.data.id = id
      this.dialogStatus = mode
      this.init()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogVisible = true
    },
    setDefault() {
      this.data = Object.assign({}, {
        id: undefined,
        title: '',
        name: '',
        sort: 0
      })
    },
    async init() {
      if (this.dialogStatus === 'update') {
        await this.initData()
      }
      await this.initParentOption()
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
          params.sort = parseInt(this.data.sort)
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
          params.sort = parseInt(this.data.sort)
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
