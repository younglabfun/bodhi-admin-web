<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "./scroll-to";

export default {
  name: "Pagination-container",
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, size: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, size: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 0px;
  text-align: right;
  & > .el-pagination {
    padding: 0;
    margin: 5px auto;
  }
}
.pagination-container.hidden {
  display: none;
}

::v-deep {
  .el-pager li,
  .el-pagination .el-pagination__jump .el-input__inner {
    border-radius: 4px !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    background: #ffffff !important;
    &.active {
      border: 1px solid #4b85ff !important;
      background: #4b85ff !important;
    }
  }

  .el-pagination__sizes {
    & > .el-select.el-select--mini {
      margin: 0 auto !important;
      width: auto !important;
      height: 28px !important;
      box-sizing: border-box;
      border-radius: 4px !important;
      border: 0 !important;
      background: #ffffff !important;
      & > .el-input {
        margin: 0 auto !important;
        & > .el-input__inner {
          border-radius: 4px !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
          padding-left: 6px !important;
          font-size: 13px !important;
          font-weight: 400 !important;
        }
        & > .el-input__suffix {
          top: 0 !important;
          right: 5px !important;
        }
      }
    }
  }
}
</style>
