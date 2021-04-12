<template>
  <div class="VisitTask-page">
    <!-- 表单 -->
    <my-table
      v-model="searchQuery"
      :searchForm="searchForm"
      @change="onChange"
      v-loading="downLoadLoading"
      element-loading-text="正在下载商品图..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div slot="before-table">
        <div class="pb10">
          <el-button
            type="warning"
            v-permission-button="'exportTasks'"
            @click="exportTaskExcel"
            >导出</el-button
          >
          <el-button
            type="success"
            @click="batchDownLoadPic"
            v-permission-button="'batchDownLoadPic'"
            style="margin-left:10px"
            >下载商品图</el-button
          >
        </div>
      </div>
      <!-- 插槽内容 -->
      <el-table
        :data="tableData"
        border
        stripe
        ref="taskData"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="任务单号">
          <template slot-scope="scope">
            <span>{{ scope.row.id + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerCode" label="客户编码"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="shopName" label="店铺名称"> </el-table-column>
        <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
        <el-table-column prop="" label="计划单号">
          <template slot-scope="scope">
            <span>{{ scope.row.planId + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus == 1" style="color: #ff9b00"
              >待处理</span
            >
            <span v-else-if="scope.row.taskStatus == 2" style="color: #e95e10"
              >执行中</span
            >
            <span v-else-if="scope.row.taskStatus == 3" style="color: #41cc00"
              >已完成</span
            >
            <span v-else-if="scope.row.taskStatus == 4" style="color: #000000"
              >已取消</span
            >
            <span v-else-if="scope.row.taskStatus == 0" style="color: #0000ff"
              >初始</span
            >
            <span v-else-if="scope.row.taskStatus == 5" style="color: #ccc"
              >已过期</span
            >
            <!-- <span style="color:#D9001B">审核中</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人"> </el-table-column>
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">店铺拜访</span>
            <span v-else-if="scope.row.type == 2">客户拜访</span>
            <!-- <span style="color:#D9001B">审核中</span> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | formatDate('Y/M/D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务计划时间">
          <template slot-scope="scope">
            <span
              >{{ scope.row.startDate | formatDate('Y/M/D') }}~{{
                scope.row.endDate | formatDate('Y/M/D')
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission-button="'examine'"
              type="text"
              @click="getLookTask(1, scope.row.id)"
              >查看</el-button
            >
            <el-button
              v-permission-button="'cancel'"
              type="text"
              @click="getCancel(scope.row.id)"
              :disabled="
                !scope.row.isOwner ||
                scope.row.taskStatus == 4 ||
                scope.row.taskStatus == 3 ||
                scope.row.taskStatus == 2
              "
              >取消</el-button
            >
            <el-button
              v-permission-button="'adjustment'"
              type="text"
              @click="
                moduLation(scope.row.id, scope.row.startDate, scope.row.endDate)
              "
              :disabled="
                !scope.row.isOwner ||
                scope.row.taskStatus == 4 ||
                scope.row.taskStatus == 3 ||
                scope.row.taskStatus == 2
              "
              >调整</el-button
            >
            <el-button
              v-permission-button="'adjustmententry'"
              type="text"
              @click="getlCoopInfos(scope.row.id)"
              :disabled="scope.row.checkedStatus === '2'"
              >调整记录</el-button
            >

            <el-button
              type="text"
              @click="downLoadPic(scope.row)"
              :disabled="scope.row.taskStatus !== '3'"
              v-permission-button="'downLoadPic'"
              >下载商品图</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <!-- 取消 -->
    <el-dialog title="" :visible.sync="shopFlag" width="600px">
      <h4>任务取消</h4>
      <div style="display: flex; padding: 20px 30px">
        <div class="must mr20">取消原因:</div>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            :maxlength="255"
            v-model="cancellation"
            placeholder=""
            :style="inputStyle"
          ></el-input>
        </div>
      </div>
      <div
        class="dialog-footer"
        style="
          display: flex;
          justifycontent: space-around;
          padding: 0 160px 0 160px;
        "
      >
        <el-button
          type="danger"
          v-permission-button="'cancel'"
          @click="shopFlag = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          v-permission-button="'acknowledgement'"
          @click="cancelVisitInfo(userId)"
          >确 认</el-button
        >
      </div>
    </el-dialog>
    <!-- 调整 -->
    <el-dialog title="任务调整" :visible.sync="adjustmentFlag" width="35%">
      <!-- <h4>任务调整</h4> -->
      <div style="display: flex; padding: 20px 30px">
        <div style="marginright: 20px">原任务时间:</div>
        <div>
          <!-- <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="选择日期" :disabled="isEdit">
          </el-date-picker> -->
          <el-date-picker
            :disabled="true"
            v-model="originaltime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div style="display: flex; padding: 20px 30px">
        <div class="must mr20" :required="true">调整任务时间:</div>
        <div>
          <!-- <el-date-picker
            v-model="adjustDateAfterd"
            type="date"
            placeholder="选择日期">
          </el-date-picker> -->

          <el-date-picker
            v-model="adjustmenttime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div style="display: flex; padding: 20px 30px">
        <div class="must mr20" :required="true">调整原因:</div>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            :maxlength="255"
            v-model="cancellation"
            placeholder=""
            :style="inputStyle"
          ></el-input>
        </div>
      </div>
      <div
        class="dialog-footer"
        style="
          display: flex;
          justifycontent: space-around;
          padding: 0 200px 0 260px;
        "
      >
        <el-button
          type="danger"
          v-permission-button="'cancel'"
          @click="adjustmentFlag = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          v-permission-button="'acknowledgement'"
          @click="moduLationVisitInfo(userId)"
          >确 认</el-button
        >
      </div>
    </el-dialog>
    <!-- 调整日志 -->
    <el-dialog title="调整日志" :visible.sync="coopInfoFlag" width="80%">
      <!-- 插槽内容 -->
      <el-table
        :data="examinationData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="" label="调整人">
          <template slot-scope="scope">
            <span>{{ scope.row.adjustByName + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原任务开始时间">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustStartDate">{{
              scope.row.adjustStartDate | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.adjustStartDate === null">{{ '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原任务结束时间">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustStartDate">{{
              scope.row.adjustStartDate | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.adjustStartDate === null">{{ '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整类型">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustType == 1" style="color: #41cc00"
              >取消</span
            >
            <span v-else-if="scope.row.adjustType == 2" style="color: #797979"
              >调整时间</span
            >
            <!-- <span style="color:#D9001B">审核中</span> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
        <el-table-column prop="adjustDesc" label="调整原因"></el-table-column>
        <el-table-column label="调整后开始时间">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustStartDateAfter">{{
              scope.row.adjustStartDateAfter | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.adjustStartDateAfter === null">{{
              ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整后结束时间">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustEndDateAfter">{{
              scope.row.adjustEndDateAfter | formatDate('Y/M/D')
            }}</span>
            <span v-else-if="scope.row.adjustEndDateAfter === null">{{
              ''
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="email" label="计划开始日期"></el-table-column>
        <el-table-column prop="tel" label="计划完成日期"></el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Tags from '@/components/Tags'
import {
  adjust,
  cancel,
  TaskgetOneVisitPlan,
  getSkusByTaskId,
  getVisitTaskPage,
  getTaskApprovalLogs,
  exportTasks,
  downLoadPic as downLoadPicHttp,
  batchDownLoadPic as batchDownLoadPicHttp
} from '@/api/visitplan'
import { deepClone, formatDate } from '../../utils'
import FileSaver from 'file-saver'
export default {
  name: 'visitTask',
  components: { Tags },
  data() {
    return {
      downLoadLoading: false,
      taskGoodsPicSelectAllList: [],
      tasks: [], //选中的任务id
      isEdit: true, // 调整-原计划时间禁用
      cancelDesc: '',
      inputStyle: { width: '360px' },
      value1: '', // 原任务时间
      cancellation: '', // 调整/取消原因
      adjustDateAfterd: '', // 调整后时间
      adjustType: '', // 调整类型
      startDate: '', // 任务开始时间
      times: [],
      originaltime: [],
      adjustmenttime: [],
      area: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let level = 'province'
          let padcode = ''
          if (node.hasOwnProperty('data')) {
            switch (node.level) {
              case 1:
                level = 'city'
                padcode = node.data.adcode
                break
              case 2:
                level = 'district'
                padcode = node.data.adcode
                break
              case 3:
                level = 'street'
                padcode = node.data.adcode
                break
              default:
                level = 'city'
                padcode = node.data.adcode
                break
            }
          }
          getDistrictList({
            level: level,
            padcode: padcode
          }).then((res) => {
            res.forEach((item) => {
              item['value'] = item.name
              item['label'] = item.name
              if (node.level == 3) {
                item['leaf'] = true
              }
              this.baseinfo.areaCode = res[0].adcode
            })
            resolve(res) // 返回数据
          })
        }
      },
      searchForm: [
        {
          key: 'customerName',
          label: '客户名称',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'shopCode',
          label: '店铺号',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'shopName',
          label: '店铺名称',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'time',
          label: '创建时间',
          type: 'date_picker',
          pickerType: 'daterange',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          clearable: true
        },
        {
          key: 'customerCode',
          label: '客户编码',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'planId',
          label: '计划单号',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'salesman',
          label: '业务员',
          placeholder: '',
          type: 'input',
          clearable: true
        },
        {
          key: 'taskStatus',
          label: '状态',
          placeholder: '',
          options: [
            { label: '初始', value: '0' },
            { label: '待处理', value: '1' },
            { label: '执行中', value: '2' },
            { label: '已完成', value: '3' },
            { label: '已取消', value: '4' },
            { label: '已过期', value: '5' }
          ],
          type: 'select',
          clearable: true
        },

        {
          key: 'type',
          label: '任务类型',
          placeholder: '',
          options: [
            { label: '店铺拜访', value: '1' },
            { label: '客户拜访', value: '2' }
          ],
          type: 'select',
          clearable: true
        },
         {
          key: 'planTime',
          label: '计划时间',
          type: 'date_picker',
          pickerType: 'daterange',
          clearable: true,
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
      ],
      searchQuery: {
        creator: '', //业务员id
        customerCode: '', //客户编号
        customerName: '', // 客户名称
        planId: '', // 计划单号
        type: '', // 任务类型
        salesman: '', //业务员
        time: [], // 创建时间
        planTime:[],//计划时间
        taskStatus: '', // 任务状态
        createName: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      tableData: [],
      examinationData: [],
      tableLoading: false,
      shopFlag: false,
      adjustmentFlag: false,
      coopInfoFlag: false,
      coopFlag: false,
      userId: '', // 客户弹窗id
      shopId: '', //店铺id
      selectAllList: [] //分页选中数据
    }
  },
  computed: {},
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
    // 下载商品图
    downLoadPic(item) {
      this.downLoadLoading = true
      var start = new Date().getTime()
      downLoadPicHttp(item)
        .then((blob) => {
          let fileName = `拜访任务图片明细表${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.zip')
          var end = new Date().getTime()
          this.downLoadLoading = false
          this.$message.success('下载成功')
          console.log('导出成功,耗时' + (end - start) / 1000 + '秒')
        })
        .catch((e) => {
          this.downLoadLoading = false
          console.log(e, '异常')
        })
    },
    // 调整
    moduLation(id, startdate, enddate) {
      this.originaltime = [startdate, enddate]
      this.userId = id
      this.adjustmentFlag = true
    },
    // 调整确认请求
    moduLationVisitInfo() {
      if (this.adjustmenttime === [] || this.adjustmenttime === null) {
        this.$message({ message: '请填写调整任务日期！', type: 'warning' })
      } else if (this.cancellation === '') {
        this.$message({ message: '请填写调整原因！', type: 'warning' })
      } else {
        let data = {
          adjustStartDateAfter: this.adjustmenttime[0],
          adjustEndDateAfter: this.adjustmenttime[1],
          adjustDesc: this.cancellation,
          adjustType: 2,
          taskId: this.userId
        }
        adjust(data)
          .then((res) => {
            this.$message({ message: '客户拜访任务调整成功', type: 'success' })
            this.cancellation = ''
            this.adjustmenttime = ''
            this.adjustmentFlag = false
            this.fetchTableData()
          })
          .catch((error) => {
            console.log(error, 'error')
          })
      }
    },
    // 拜访任务取消确认
    cancelVisitInfo() {
      if (this.cancellation === '') {
        this.$message({ message: '请填写取消原因！', type: 'warning' })
      } else {
        let data = { taskId: this.userId, adjustDesc: this.cancellation }
        cancel(data)
          .then((res) => {
            this.$message({ message: '客户拜访任务取消成功', type: 'success' })
            this.cancellation = ''
            this.shopFlag = false
            this.fetchTableData()
          })
          .catch((error) => {
            console.log(error, 'error')
          })
      }
    },
    // 查看审批日志
    getlCoopInfos(id) {
      // this.userId = id;
      let a = id.c[0]
      let b = id.c[1]
      let _id = a + b
      getTaskApprovalLogs(id).then((res) => {
        this.examinationData = res
      })
      this.coopInfoFlag = !this.coopInfoFlag
    },
    // 取消
    getCancel(id) {
      this.userId = id
      this.shopFlag = !this.shopFlag
    },
    //查看
    getLookTask(cat, id) {
      this.$router.push({
        name: 'lookover',
        query: { identify: cat, id: id }
      })
    },
    onChange() {
      this.fetchTableData()
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchVisitTaskList()
        this.searchQuery.total = res.count // 总条数
        let visitTaskList = res.list // // 表格数据
        let selectTempList = _.cloneDeep(this.selectAllList)
        this.tableData = visitTaskList
        this.reSelectSpu(selectTempList)
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    reSelectSpu(selectTempList) {
      this.$nextTick(() => {
        if (selectTempList && selectTempList.length > 0) {
          this.tableData.forEach((item) => {
            selectTempList.forEach((item2) => {
              if (item2.toString() === item.id.toString()) {
                this.$refs['taskData'].toggleRowSelection(item)
              }
            })
          })
          selectTempList = []
        }
      })
    },
    fetchVisitTaskList() {
      return new Promise((resolve, reject) => {
        let params = this.$lodash.cloneDeep(this.searchQuery)
        params.createDateStart = params.time[0]
        params.createDateEnd = params.time[1]
        params.planDateStart = params.planTime[0]
        params.planDateEnd = params.planTime[1]
     
        getVisitTaskPage(params).then((res) => {
          resolve(res)
        })
      })
    },

    onDatePicker() {
      this.change()
    },
    change() {
      this.$emit('input', this.query)
      this.$emit('change', this.query)
    },
    handleSelectionChange(selection) {
      //导出的多选
      let arr = this.selectAllList.filter((item) => {
        return !this.tableData.find((e) => e.id.toString() == item.toString())
      })
      this.selectAllList = arr
      if (selection && selection.length > 0) {
        selection.forEach((item) => {
          this.selectAllList.push(item.id)
        })
      }
      //下载商品图的多选
      let list = this.taskGoodsPicSelectAllList.filter((item) => {
        return !this.tableData.find(
          (e) => e.id.toString() == item.id.toString()
        )
      })
      this.taskGoodsPicSelectAllList = list
      if (selection && selection.length > 0) {
        selection.forEach((item) => {
          this.taskGoodsPicSelectAllList.push(item)
        })
      }
    },
    //下载商品图（批量）
    batchDownLoadPic() {   
      if (!this.taskGoodsPicSelectAllList.length) {
        this.$message.warning('请勾选需要下载商品图的任务选项')
        return
      }

      let arr = this.taskGoodsPicSelectAllList.filter((task) => {
        return task.taskStatus !== '3'
      })
      if (arr && arr.length) {
        this.$message.warning('已勾选选项中存在未完成的任务')
        return
      }
      this.downLoadLoading = true
      batchDownLoadPicHttp(this.taskGoodsPicSelectAllList)
        .then((blob) => {
             
          let fileName = `拜访任务图片明细表${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.zip')
          var end = new Date().getTime()   
             this.downLoadLoading = false       
          this.$message.success('下载成功')
          console.log('导出成功,耗时' + (end - start) / 1000 + '秒')
        })
        .catch((e) => {
          this.downLoadLoading = false
          console.log(e, '异常')
        })
    },
    // 导出
    exportTaskExcel() {
      var start = new Date().getTime()
      let params = _.cloneDeep(this.searchQuery)
      params.createDateStart = params.time[0]
      params.createDateEnd = params.time[1]
      params.planDateStart = params.planTime[0]
      params.planDateEnd = params.planTime[1]
      params.taskIds = this.selectAllList
      this.$confirm(
        `在没有勾选数据的情况下，会默认导出搜索条件下的所有数据，是否继续导出？`,
        '提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }
      )
        .then((c) => {
          this.$store.commit('SHOW_EXPORTING')
          exportTasks(params)
            .then((blob) => {
              console.info(blob)
              let fileName = `拜访任务明细表${formatDate(
                new Date().getTime(),
                'Y-M-D h:m'
              )}`
              FileSaver.saveAs(blob, fileName + '.xlsx')
              var end = new Date().getTime()
              this.$message.success(
                '导出成功,耗时' + (end - start) / 1000 + '秒'
              )
            })
            .finally(() => {
              this.$store.commit('SHOW_EXPORTING', false)
            })
        })
        .catch((_) => {})
    }
  },
  watch: {
    searchQuery: function (newValue) {
      if (newValue !== undefined) {
        this.taskGoodsPicSelectAllList = []
        this.selectAllList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
<style lang="scss"></style>
