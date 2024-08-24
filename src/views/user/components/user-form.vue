<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form ref="dataForm" :rules="rules" :model="data" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="type">
            <el-select v-model="data.type" @change="handleChange">
              <el-option v-for="item in typeOptions" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="pid">
            <el-select v-model="data.pid">
              <el-option v-for="item in parentOptions" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="data.title" placeholder="请输入菜单名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="data.icon">
              <template slot="prepend"><i :class="data.icon || 'fa fa-edit'" /></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由名" prop="route">
            <el-input v-model="data.route" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标识" prop="funcCode">
            <el-input v-model="data.funcCode" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组件" prop="component">
            <el-input v-model="data.component" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="路径或外链" prop="href">
            <el-input v-model="data.href" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="data.sort" :min="0" :max="999" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否显示" prop="isShow">
            <el-switch v-model="data.isShow" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="data.remark"
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
import { insertMenu, getMenu, updateMenu, getMenuList } from '@/api/menu'

export default {
  name: 'UserForm',
  data() {
    return {
      dialogVisible: false,
      dialogStatus: '',
      dialogTitle: '',

      data: {},
      typeOptions: [
        { id: 0, label: '管理菜单' },
        { id: 1, label: '站点菜单' }
      ],
      parentOptions: [],
      rules: {
        title: [{ required: true, message: '标题是必填项', trigger: 'blur' }],
        route: [{required: true, message: '路由名是必填项', trigger: 'blur'}],
        sort: [{type: 'integer', min:0, max: 999, required: true, message: '排序是必填项，且只能为小于999的数字', trigger: 'blur'}],
        component: [{ required: true, message: '组件是必填项', trigger: 'blur' }],
        href: [{ required: true, message: '路径或外链是必填项', trigger: 'blur' }],
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
        type: 0,
        pid: 0,
        title: '',
        funcCode: '',
        route: '',
        component: '',
        href: '',
        icon: '',
        sort: 0,
        isShow: '1',
        remark: ''
      })
    },
    async init() {
      if (this.dialogStatus === 'update') {
        await this.initData()
      }
      await this.initParentOption()
    },
    async initParentOption(){
      this.parentOptions = []
      this.parentOptions.push({ id: 0, label: '一级菜单' })
      await getMenuList(this.data.pid, this.data.type).then( (resp) => {
        var data = resp.data.list
        for (var i in data) {
          if (this.data.id !== undefined && data[i].id === this.data.id) continue
          var item = {id: data[i].id, label: data[i].title}
          this.parentOptions.push(item)
        }
      })
    },
    async initData() {
      await getMenu(this.data.id).then((resp) => {
        this.data = Object.assign({}, resp.data)
        this.data.isShow = resp.data.isShow.toString()
      })
    },
    handleChange() {
      this.initParentOption()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.data)
          params.sort = parseInt(this.data.sort)
          params.isShow = parseInt(this.data.isShow)
          insertMenu(params).then( (resp) => {
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
          params.isShow = parseInt(this.data.isShow)
          updateMenu(params).then((resp) => {
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
