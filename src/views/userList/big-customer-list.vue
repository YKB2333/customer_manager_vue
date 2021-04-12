<template>
  <div>
    <el-dialog 
      v-bind="$attrs" 
      v-on="$listeners" 
      @open="onOpen" 
      @close="onClose" 
      title="重点客户名单维护"
      top="10vh">
      <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
        <div class="mb10 row">
          <el-button type="danger" v-permissionButton="'removeCustomerLevel'" @click="onDelete" :loading="loadingBtn === 'delete'">删除</el-button>
          <el-upload action="#" :http-request="onImport" :show-file-list="false" class="mlr10" v-permissionButton="'importLevelACustomer'">
            <el-button type="success" :loading="loadingBtn === 'import'">导入</el-button>
          </el-upload>
          <el-button type="primary" @click="onDownload" :loading="loadingBtn === 'download'" v-permissionButton="'exportCustomerLevelTemplate'">下载模版</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          stripe
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="ncCode" label="NC编码" width="100"></el-table-column>
          <el-table-column prop="name" label="客户名称" width="260"></el-table-column>
          <el-table-column prop="simpleName" label="客户简称（渠道）"></el-table-column>
          <!-- 内容太多了，暂时不开放
          <el-table-column prop="bmName" label="所属部门" width="160">
            <template slot-scope="scope">
              <template v-if="scope.row.bmName">
                <el-tag :key="index" v-for="(bmName, index) in scope.row.bmName.split(',')">{{bmName}}</el-tag>
              </template>
            </template>
          </el-table-column>
          -->
        </el-table>
      </my-table>
    </el-dialog>
  </div>
</template>

<script>
import { deleteCustomerLevel, importCustomerLevel, downloadCustomerLevelTmpl } from '@/api/client'
import { baseInfoRatePage } from '@/api/baseInfo'
import FileSaver from 'file-saver'

export default {
  inheritAttrs: false,
  components: {},
  props: ['dateData'],
  data() {
    return {
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        name: "",
        ncCode: "",
        customerLevel: "A",
        total: 0,
      },
      searchForm: [
        {
          label: "客户名称",
          key: "name",
          placeholder: "请输入客户名称",
          type: "input",
        },
        {
          label: "NC编码",
          key: "ncCode",
          placeholder: "请输入NC编码",
          type: "input",
        }
      ],
      tableData: [],
      tableLoading: false,
      multipleSelection: [],
      loadingBtn: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.fetchTableData()
    },
    onClose() {},
    close() {
      this.$emit('update:visible', false)
    },
    fetchTableData() {
      this.tableLoading = true
      baseInfoRatePage(this.searchQuery).then(res => {
        this.searchQuery.total = parseInt(res.total) // 总条数
        this.tableData = res.records
        console.log('客户名单', this.tableData)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    onChange() {
      this.fetchTableData()
    },

    onDelete() {
      if (this.multipleSelection.length) {
        this.$confirm('确认删除吗？', {
          type: 'warning'
        }).then(() => {
          this.loadingBtn = 'delete'
          const ids = this.multipleSelection.map(e => e.id.toString())
          deleteCustomerLevel(ids).then(res => {
            this.$message.success('删除成功')
            this.fetchTableData()
          }).finally(() => {
            this.loadingBtn = ''
          })
        })
      } else {
        this.$message.warning('请勾选要删除的行')
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    onImport(data) {
      const formData = new FormData()
      formData.append("file", data.file)
      this.loadingBtn = 'import'
      importCustomerLevel(formData).then(res => {
        this.$message.success('导入成功')
        this.fetchTableData()
      }).finally(() => {
        this.loadingBtn = ''
      })
    },

    onDownload() {
      this.loadingBtn = 'download'
      downloadCustomerLevelTmpl().then(blob => {
        FileSaver.saveAs(blob, '重点客户名单excel导入模版.xlsx')
      }).finally(() => {
        this.loadingBtn = ''
      })
    }

  }
}

</script>
<style>
</style>
