<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle[dialogStatus]" width="50%">
    <el-form ref="dataForm" :rules="rules" :model="role" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="14">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="role.name" placeholder="请输入角色名" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="简介" prop="description">
            <el-input type="description" :autosize="{ minRows: 2, maxRows: 4 }" v-model="role.description"
              placeholder="请输入简介" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="系统功能" prop="authorize">
            <el-input v-model="role.authorize" type="hidden" style="width:1px;height:1px;" />
            <node-selector ref="nodeSelector" />
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
import { getUser, insertUser, updateUser } from '@/api/user';
import nodeSelector from '@/views/setting/components/node-selector.vue';

export default {
  name: 'UserForm',
  components: {
    nodeSelector
  },
  data() {
    const checkAuth = (rule, value) => {
      return new Promise((resolve, reject) => {
        var auth = []
        try {
          auth = JSON.parse(value)
        } catch (d) {
          console.log('json parse error', value)
        }
        if (auth.length === 0) {
          this.$notify({
            type: 'warning',
            message: '尚未授权功能',
            duration: 2000
          })
          reject('尚未授权功能')
        } else {
          resolve()
        }
      })
    }
    return {
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: {
        create: '新增角色',
        update: '更新角色',
      },

      role: {},
      rules: {
        name: [
          { required: true, message: '角色是必填项', trigger: 'blur' }
        ],
        authorize: [
          { trigger: 'blur', validator: checkAuth }
        ]
      }
    }
  },
  methods: {
    showDialog(mode, uuid) {
      this.setDefault()
      this.dialogStatus = mode
      if (mode === 'update') {
        this.role.roleUuid = uuid
        this.initData()
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      this.dialogVisible = true
    },
    setDefault() {
      this.role = Object.assign({}, {
        roleUuid: undefined,
        name: '',
        description: '',
        authorize: ''
      })
    },
    async initData() {
      await getUser(this.user.userUuid).then((resp) => {
        this.user = Object.assign({}, resp.data)
      })
    },
    handleChange() {
      this.initParentOption()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.user)
          delete params.confirmPassword
          console.log('user', this.user, params)
          insertUser(params).then( (resp) => {
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
          var params = Object.assign({}, this.user)
          updateUser(params).then((resp) => {
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
