<template>
  <span>
    <span @click="preview()">
      <slot>
        <el-button type="text" size="small">操作日志</el-button>
      </slot>
    </span>

    <!-- 日志dialog -->
    <el-dialog
      :title="title"
      :visible.sync="logDialog"
      @close="close"
      border
      close-on-press-escape
      close-on-click-modal
    >
      <el-table :data="logTableData" style="width: 100%" max-height="400">
        <el-table-column prop="creatorName" label="操作人" width="140"></el-table-column>
        <el-table-column prop="operationName" label="操作名称" width="140"></el-table-column>
        <el-table-column label="操作时间" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="备注" width="400">
          <template slot-scope="scope">
            <div v-for="item in scope.row.opt" :key="item">{{item}}</div>
          </template>
        </el-table-column>
      </el-table>
      <the-pagination
        :pageIndex="logQuery.pageIndex"
        :pageSize="logQuery.pageSize"
        :total="logQuery.total"
        @onPageSizeChange="logTableSizeChange"
        @onPageIndexChange="logTableIndexChange"
      />
    </el-dialog>
  </span>
</template>

<script>
// 通用的log组件
import { getLogPages } from '@/api/common'
import ThePagination from '@/components/Pagination'
export default {
  name: 'commonLog',
  components: { ThePagination },
  props: {
    logType: {
      type: String,
      required: true,
    },
    systemType: {
      type: String,
      default: 'customer',
    },
    id: {
      required: true,
    },
    title: {
      type: String,
      default: '操作日志',
    },
  },
  data() {
    return {
      logTableData: [],
      logDialog: false,
      logQuery: {
        pageSize: 10,
        pageIndex: 1,
        logType: '',
        systemType: 'customer',
        relationField: '',
        total: 0,
      },
    }
  },
  watch: {
    logType: {
      handler: function (val) {
        this.logQuery.logType = val
      },
      immediate: true,
    },

    systemType: {
      handler: function (val) {
        this.logQuery.systemType = val
      },
    },
    immediate: true,
  },
  methods: {
    // #region 日志相关
    close() {
      this.logDialog = false
      this.logTableData = []
      this.logQuery.pageIndex = 1
      this.logQuery.pageSize = 10
    },
    preview() {
      this.logQuery.relationField = this.id + ''
      this.getLogData()
      this.logDialog = true
    },
    getLogData() {
      getLogPages(this.logQuery).then((res) => {
        let arr
        if (res && res.records) {
          arr = res.records.map((v) => {
            let opt = (v.afterBean || '').replace(/];/g, '];>>>').split('>>>')
            return {
              ...v,
              opt,
            }
          })
        }
        this.logTableData = arr || []
        this.logQuery.total = res.total || 0
      })
    },
    logTableSizeChange(e) {
      this.logQuery.pageIndex = 1
      this.logQuery.pageSize = e
      this.getLogData()
    },
    logTableIndexChange(e) {
      this.logQuery.pageIndex = e
      this.getLogData()
    },
    // #endregion
  },
}
</script>

<style lang="scss" scoped>
</style>