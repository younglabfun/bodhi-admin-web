<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="40%">
    <el-form ref="dataForm" :rules="rules" :model="user" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="14">
          <el-form-item label="登录名" prop="username">
            <el-input v-model="user.username" placeholder="请输入登录名" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="邮件" prop="email">
            <el-input v-model="user.email" placeholder="请输入邮件地址" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus === 'create'" :span="14">
          <el-form-item label="密码" prop="password">
            <el-input type="password"  v-model="user.password" placeholder="请输入密码" show-password inline-message="true" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus === 'create'" :span="14">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password"  v-model="user.confirmPassword" placeholder="请输入确认密码" show-password inline-message="true" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="user.name" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="user.remark"
              placeholder="请输入备注" />
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
import { validUsername, validPassword, validConfirmPasswrod } from '@/utils/validate';
import { getUser, insertUser, updateUser } from '@/api/user';

export default {
  name: 'UserForm',
  data() {
    const validatorUserName = (rule, value, callback) => {
      const valid = validUsername(value, 4, 12)
      if (valid != true) {
        callback(new Error(valid))
      } else {
        callback()
      }
    }
    const validatorPassword = (rule, value, callback) => {
      const valid = validPassword(value)
      if (valid != true) {
        callback(new Error(valid))
      } else {
        callback()
      }
    }
    const validatorConfirmPassword = (rule, value, callback) => {
      const valid = validConfirmPasswrod(value, this.user.password)
      if (valid != true) {
        callback(new Error(valid))
      } else {
        callback()
      }
    }
    const validatorName = (rule, value, callback) => {
      var pattern = new RegExp("[`~!@#$^&*()=|{}':; ',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (pattern.test(value)) {
        callback(new Error('不可以使用特殊字符'))
      } else{
        callback()
      }
    }
    return {
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: '',

      user: {},
      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validatorUserName }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatorPassword }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validatorConfirmPassword }
        ],
        email: [
          { required: true, type: 'email', message: 'Email格式错误', trigger: 'blur' }
        ],
        name: [
          { trigger: 'blur', validator: validatorName }],
      }
    }
  },
  methods: {
    showDialog(mode, uuid) {
      this.setDefault()
      this.dialogStatus = mode
      if (mode === 'update') {
        this.user.userUuid = uuid
        this.initData()
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      this.dialogVisible = true
    },
    setDefault() {
      this.user = Object.assign({}, {
        userUuid: undefined,
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        remark: ''
      })
      if (this.dialogStatus === 'update') {
        delete this.user.password
        delete this.user.confirmPassword
      }
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
