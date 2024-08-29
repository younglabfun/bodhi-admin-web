<template>
  <el-button
    v-clipboard:copy="copyData"
    v-clipboard:success="onCopy"
    v-clipboard:error="onError"
    type="text"
    size="mini"
    style="margin-left: 2px;padding:0;"
  >
    <i class="el-icon-copy-document" />
  </el-button>
</template>

<script>
export default {
  name: 'CopyButton',
  props: {
    copyData: {
      type: String,
      default: ''
    }
  },
  methods: {
    onCopy(e) {
      this.$message({
        type: 'success',
        message: '内容已复制到剪切板'
      })
    },
    onError(e) {
      this.$message.error('复制失败！')
    }
  }
}
</script>
