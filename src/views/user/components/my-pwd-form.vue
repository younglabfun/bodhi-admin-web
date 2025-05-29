<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    :title="dialogTitle"
    width="30%"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="params"
      label-position="right"
      label-width="100px"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item label="原密码" prop="password">
            <el-input
              type="password"
              v-model="params.password"
              placeholder="请输入密码"
              show-password
              inline-message="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              type="password"
              v-model="params.newPassword"
              placeholder="请输入密码"
              show-password
              inline-message="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              type="password"
              v-model="params.confirmPassword"
              placeholder="请输入确认密码"
              show-password
              inline-message="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel"> 取消 </el-button>
      <el-button type="primary" @click="updateMyPwd"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validPassword, validConfirmPasswrod } from "@/utils/validate";
import { resetPassword } from "@/api/account";

export default {
  name: "MyPwdForm",
  data() {
    const validatorPassword = (rule, value, callback) => {
      const valid = validPassword(value);
      if (valid != true) {
        callback(new Error(valid));
      } else {
        callback();
      }
    };
    const validatorConfirmPassword = (rule, value, callback) => {
      const valid = validConfirmPasswrod(value, this.params.newPassword);
      if (valid != true) {
        callback(new Error(valid));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogTitle: "修改密码",

      params: {},
      rules: {
        password: [
          { required: true, message: "原密码是必填项", trigger: "blur" },
        ],
        newPassword: [
          { required: true, trigger: "blur", validator: validatorPassword },
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatorConfirmPassword,
          },
        ],
      },
    };
  },
  methods: {
    showDialog() {
      this.setDefault();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible = true;
    },
    setDefault() {
      this.params = Object.assign(
        {},
        {
          password: "",
          newPassword: "",
          confirmPassword: "",
        }
      );
    },
    updateMyPwd() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var params = Object.assign({}, this.params);
          resetPassword(params.password, params.newPassword).then((resp) => {
            const { message, data } = resp;
            if (data.affected) {
              this.$notify({
                message: message,
                type: "success",
              });
              this.dialogVisible = false;
              this.$emit("resetPwd");
            } else {
              this.$notify({
                message: message,
                type: "error",
              });
            }
          });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
};
</script>
