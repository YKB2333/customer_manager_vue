<template>
  <!-- 利润率档案 -->
  <div class="profitRate-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">     
          <el-button type="primary" :disabled="isAdd" @click="add"
          v-permission-button="'add'"
            >新增</el-button
          >
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="customerGrade" label="客户等级">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              {{
                scope.row.customerGrade === '1'
                  ? '一般客户'
                  : scope.row.customerGrade === '2'
                  ? '战略客户'
                  : '-'
              }}
            </div>
            <div v-else>
              <el-select v-model="model.customerGrade" placeholder="请选择">
                <el-option label="一般客户" :value="1"></el-option>
                <el-option label="战略客户" :value="2"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作方式">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              {{
                scope.row.coopMode === '0'
                  ? '采购分销'
                  : scope.row.coopMode === '1'
                  ? '一件代发'
                  : '-'
              }}
            </div>
            <div v-else>
              <el-select v-model="model.coopMode" placeholder="请选择">
                <el-option label="采购分销" :value="0"></el-option>
                <el-option label="一件代发" :value="1"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="profitRate" label="利润率">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              <div v-if="!scope.row.isEdit">
                <span v-if="scope.row.profitRate || scope.row.profitRate === 0"
                  >{{ scope.row.profitRate }}%</span
                >
              </div>
              <div v-else>
                <el-input-number
                  v-model="scope.row.profitRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                ></el-input-number>
                <span>%</span>
              </div>
            </div>
            <div v-else>
              <el-input-number
                v-model="model.profitRate"
                :precision="2"
                controls-position="right"
                :step="0.1"
                size="small"
                :min="0.0"
              ></el-input-number>
              <span>%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creatorBy" label="创建人"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createDate">{{
              scope.row.createDate | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.createDate === null">{{ '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="editorBy" label="最后修改人"></el-table-column>
        <el-table-column label="最后修改时间">
          <template slot-scope="scope">
            <span v-if="scope.row.updateDate">{{
              scope.row.updateDate | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.updateDate === null">{{ '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.id || scope.row.isEdit"
              type="text"
              @click="save(scope.row)"
              v-permission-button="'save'"
              >保存</el-button
            >
            <el-button v-else @click="edit(scope.row)" v-permission-button="'edit'" type="text">
              
              编辑
            </el-button>

            <el-button
              v-if="scope.row.id"
              @click="getModifyLogs(scope.row.id)"
              type="text"
              v-permission-button="'ModifyLogs'"
            >
              修改日志
            </el-button>
            
            <el-button type="text" v-permission-button="'delete'" @click="del(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <el-dialog title="修改日志" :visible.sync="showLogs" width="800px">
      <my-table
        v-model="logSearchQuery"
        :searchForm="logSearchForm"
        @change="logsOnChange"
      >
        <el-table
          :data="logsData"
          border
          stripe
          v-loading="logsLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="creatorBy" label="修改人"></el-table-column>
          <el-table-column prop="createDate" label="修改时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createDate">{{
                scope.row.createDate | formatDate('Y/M/D')
              }}</span>
              <span v-else-if="scope.row.createDate === null">{{ '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="beforeProfitRate" label="修改前利润率">
            <template slot-scope="scope">
              <span v-if="scope.row.beforeProfitRate">
                {{ scope.row.beforeProfitRate }} %
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="afterProfitRate" label="修改后利润率">
            <template slot-scope="scope">
              <span v-if="scope.row.afterProfitRate">
                {{ scope.row.afterProfitRate }} %
              </span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProfitRatePages,
  saveProfitRate,
  deleteProfitRate,
  editProfitRate,
  getModifyLogPages
} from '@/api/profitRate'
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'
export default {
  name: 'profitRate',
  components: {},
  data() {
    return {
      showLogs: false,
      isAdd: false,
      tableData: [],
      logsData: [],
      searchForm: [],
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      model: {},
      logsLoading: false,
      tableLoading: false,
      loading: false,
      logSearchForm: [],
      logSearchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      }
    }
  },
  computed: {},
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
    // 加载表格数据
    async fetchTableData() {
      this.tableLoading = true
      let params = this.searchQuery
      getProfitRatePages(params).then((res) => {
        if (res) {
          this.tableData = res.list
          this.searchQuery.total = res.count
        }
      })
      this.tableLoading = false
    },
    // 新增
    add() {
      this.model = {}
      this.tableData.unshift({})
      this.isAdd = true
    },
    // 保存
    save(item) {
      //新增保存
      if (!item.id) {
        if (!this.checkModel()) {
          return
        }
        saveProfitRate(this.model)
          .then((res) => {
            this.$message.success('保存成功')
            this.fetchTableData()
            this.isAdd = false
          })
          .catch((e) => {
            this.$message.success('保存失败')
          })
      }
      //修改保存
      else {
        if (item.profitRate == undefined) {
          this.$message.warning('利润率不能为空')
          return
        }
        editProfitRate(item)
          .then((res) => {
            this.$message.success('保存成功')
            this.fetchTableData()
          })
          .catch((e) => {
            this.$message.success('保存失败')
          })
      }
    },
    checkModel() {
      if (!this.tableData.length > 0) {
        return true
      }
      if (this.model.customerGrade === undefined ) {
        this.$message.warning('请选择客户等级')
        return false
      }
      if (this.model.coopMode === undefined) {
        this.$message.warning('请选择合作方式')
        return false
      }
      if (this.model.profitRate == undefined) {
        this.$message.warning('请输入利润率')
        return false
      }
      if (this.tableData.length > 0) {
        if (this.model.customerGrade !== undefined && this.model.coopMode !== undefined) {
          let arr = this.tableData.filter((t) => {
            return t.customerGrade == this.model.customerGrade
          })
          let result = arr.filter((a) => {
            return a.coopMode == this.model.coopMode
          })
          if (result.length > 0) {
            this.$message.warning('此类型数据已存在，不可重复添加')
            return false
          }
        }
      }
      return true
    },
    onChange() {
      this.fetchTableData()
    },
    del(item) {
      if (item.id) {
        this.$confirm('是否确认删除该利润率档案？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteProfitRate(item.id)
              .then((res) => {
                this.$message.success('删除成功')
                this.fetchTableData()
                this.isAdd = false
              })
              .catch((e) => {
                this.$message.error('删除失败')
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.tableData.splice(item, 1)
        this.isAdd = false
      }
    },
    edit(item) {
      item.isEdit = true
      this.tableData = this.tableData.map((t) => {
        if (t.id.toString() === item.id.toString()) {
          t = item
        }
        return t
      })
    },
    getModifyLogs(id) {
      this.showLogs = true
      this.logsLoading = true
      this.logSearchQuery.profitRateId = id
      getModifyLogPages(this.logSearchQuery).then((res) => {
        if (res) {
          this.logsData = res.list
          this.logSearchQuery.total = res.count
        }
      })
      this.logsLoading = false
    },
    logsOnChange() {
      this.getModifyLogs(this.logSearchQuery.profitRateId)
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
.must:before {
  content: '* ';
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}
.btn {
  width: 18%;
  padding-top: 20px;
}
.add-btn {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin: auto;
}
.inputs {
  width: 200px;
}
.content {
  width: 450px;
}
.contents {
  width: 300px;
}
.div-one {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
/deep/
  .el-calendar__button-group
  .el-button-group
  .el-button:nth-child(2)
  span {
  color: transparent !important;
  &::after {
    content: '本月';
    color: #606266;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
