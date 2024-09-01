<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle[dialogStatus]" width="60%">
    <el-form ref="dataForm" :rules="rules" :model="role" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="14">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="role.name" placeholder="请输入角色名" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="role.description"
              placeholder="请输入简介" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="功能" prop="authorize">
            <node-selector
              ref="nodeSelector"
              :auth="role.authorizeJson"
              @authChanged="handleAuthChanged"
            />
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
import { getRole, insertRole, updateRole } from '@/api/role';
import nodeSelector from '@/views/setting/components/node-selector.vue';

export default {
  name: 'RoleForm',
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
        authorizeJson: [
          { required: true, message: '功能是必选项', trigger: 'blur' },
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
      setTimeout(() => {
        this.$refs.nodeSelector.initSelector()
      }, 1*200)

      this.dialogVisible = true
    },
    setDefault() {
      this.role = Object.assign({}, {
        roleUuid: undefined,
        name: '',
        description: '',
        authorizeJson: ''
      })
    },
    handleAuthChanged(authJson){
      this.role.authorizeJson = authJson
    },
    async initData() {
      await getRole(this.role.roleUuid).then((resp) => {
        this.role = Object.assign({}, resp.data)
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.role)
          insertRole(params).then( (resp) => {
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
          var params = Object.assign({}, this.role)
          updateRole(params).then((resp) => {
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
