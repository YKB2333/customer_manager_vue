<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'export'" type="primary" @click="onExportClick">导出</el-button>
          <el-button v-permission-button="'upload'" type="text" style="margin-right:500px" @click="showUploadAtta()">上传报表</el-button>
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          />
        </div>
      </div>

      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        element-loading-text="拼命加载中"
      >
        <!-- <el-table-column type="index" :index="indexMethod" label="序号" width="60"></el-table-column> -->
        <el-table-column prop="csName" label="客户名称" width="80" />
        <el-table-column prop="csCode" label="客户编号" width="80" />
        <el-table-column prop="storeNumber" label="店铺号" width="80" />
        <el-table-column prop="storeName" label="门店名" width="150" />
        <el-table-column prop="supplyType" label="供货类型" width="100" />
        <el-table-column prop="mnemonicCode" label="商品助记号" width="100" />
        <el-table-column prop="ncCode" label="NC编码" width="80" />
        <el-table-column label="商品名称" prop="skuName" width="235" />
        <el-table-column label="品牌" prop="brandName" width="80" />
        <el-table-column label="销售日期" prop="orderTime" width="100" />
        <el-table-column label="数量" sortable prop="num" width="50" />
        <el-table-column label="含税额" sortable prop="saleContainTax" width="60" />
      </el-table>
    </my-table>
    <!--弹窗-->
    <!-- 附件列表弹窗 -->
    <my-dialog
      v-model="docDialog.dialogVisible"
      :title="dialogTitle"
      @close="closeDialog()"
    >
      <!--<div v-show="docDialog.dialogType === 'attaList'">
        <el-table :data="docDialog.attachmenList">
          <el-table-column label="附件">
            <template slot-scope="scope">
              <span class="mr10">{{ scope.row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-button type="danger" @click="deleteAtta(scope.row, scope.$index)">删除</el-button>
                <download :attaId="scope.row.id" :fileName="scope.row.fileName"></download>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>-->
      <div v-show="docDialog.dialogType">
        <el-upload
          ref="upload"
          class="inline-block"
          :action="`${$config.baseURL}/customer/report-terminan-data/uplodaReport`"
          :on-success="(response, file) => onSuccessUpload(response, file)"
          :on-remove="(file) => onRemoveUpload(file)"
          :multiple="false"
          :httpRequest="uploadRequest"
          :disabled="docDialog.uploadLoading"
          :auto-upload="docDialog.isUpload"
        >
          <el-button type="primary" >选择文件上传</el-button>
        </el-upload>
        <div class="mt30">
          <el-button type="success" @click="addAtta" :disabled="docDialog.uploadLoading">上传报表</el-button>
        </div>
        <div v-show="docDialog.uploadLoading">
          <el-button type="text" size="medium" :loading="docDialog.uploadLoading">上传中</el-button>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage"
import Download from '@/components/Download'
import { getAttachmentList, deleteAtta, addAtta, getAttaBrandId, upload } from '@/api/attachment'
import { getReportList} from '@/api/reportData'
import {getDate} from '@/utils/tools'
export default {
  name: "reportData",
  components: {UploadImage, Download},
  data() {
    return {
      searchForm: [
        {
          key: 'csName',
          placeholder: '客户名称',
          type: "input"
        },
        {
          key: 'storeNumber',
          placeholder: '店铺号',
          type: "input"
        },
        {
          key: 'storeName',
          placeholder: '门店名',
          type: "input"
        },
        {
          key: 'supplyType',
          placeholder: '供货类型',
          type: "input"
        },
        {
          key: 'skuName',
          placeholder: '商品名称',
          type: "input"
        },
        {
          key: 'brandName',
          placeholder: '品牌',
          type: "input"
        },
      ],
      tableLoading: false,
      searchQuery: {
        startTime: 0,
        endTime: 25646752000000,
        pageIndex: 1,
        pageSize: 10,
        total: 0, // 总条数
      },
        times:[],
      docDialog: {
        dialogVisible: false,
        dialogType: "",
        uploadLoading: false,
        isUpload:false,
      },

      tableData: [],
      dialogType: "上传报表",
      ruleForm: {
        csName: "",
        csCode: "",
        storeNumber: "",
        storeName: true,
        supplyType: "",
        mnemonicCode: "",
        barCode: "",
        ncCode: "",
        skuName: "",
        brandName: "",
        num: "",
        saleContainTax: ''
      },
    }
  },
  created() {
    this.fetchTableData()
  },
  computed: {
    dialogTitle() {
        return "上传报表"
    },
  },
  methods: {
    onChange() {
      this.fetchTableData()
    },
    //时间戳
    formatDates(number, format) { // formatDate('Y/M/D h:m:s')
      let formatNumber = (n) => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
      var returnArr = []
      var date = new Date(number)
      returnArr.push(date.getFullYear())
      returnArr.push(formatNumber(date.getMonth() + 1))
      returnArr.push(formatNumber(date.getDate()))
      returnArr.push(formatNumber(date.getHours()))
      returnArr.push(formatNumber(date.getMinutes()))
      returnArr.push(formatNumber(date.getSeconds()))

      for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
      }
      return format
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchBrandList()
        this.searchQuery.total = res.count // 总条数
        this.tableData = res.list // 报表数据数据
        this.tableData.forEach((item, index) => {
          if (item.csName) {
            item.orderTime = this.formatDates(item.orderTime, 'Y/M/D ')
          }
        })
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    // 获取报表数据列表
    fetchBrandList() {
    /*  console.log(this.times[0]+":"+this.formatDates(this.times[0],'Y/M/D'))
      console.log(this.times[1]+":"+this.formatDates(this.times[1],'Y/M/D'))*/
      if (this.times){
        this.searchQuery.startTime=this.times[0]
        this.searchQuery.endTime=this.times[1]
      }
      if (!this.times){
        this.searchQuery.startTime=0
        this.searchQuery.endTime=25646752000000
      }

      return new Promise((resolve, reject) => {
        getReportList(this.searchQuery)
          .then(res => {
            resolve(res)
          }).catch(error => {
          reject(error)
        })
      })
    },
    showUploadAtta(row) {
      this.docDialog.dialogType = "uploadAtta"
      this.docDialog.dialogVisible = true
    },


    // 导出Excel
    onExportClick() {
      // 导出
      let formatJson = (filterVal, jsonData) => {
        return jsonData.map(v =>
          filterVal.map(j => {
            if (j === "orderTime") {
              return this.formatDates(v[j], 'Y/M/D ')
            }else {
              return v[j]
            }
          })
        )
      }
      this.$store.commit("SHOW_LOADING", "正在导出Excel")
      let params = this.$lodash.cloneDeep(this.searchQuery)
      params["pageIndex"] = 1
      params["pageSize"] = this.$maxNumber
      getReportList(params)
        .then(res => {
          let listData = res.list
          import("@/utils/excel/Export2Excel").then(excel => {
            const tHeader = [
              "客户名称",
              "客户编号",
              "店铺号",
              "门店名",
              "供货类型",
              "商品助记码",
              "NC编码",
              "商品名称",
              "品牌",
              "销售日期",
              "数量",
              "含税售额"
            ]
            const filterVal = [
              "csName",
              "csCode",
              "storeNumber",
              "storeName",
              "supplyType",
              "mnemonicCode",
              "ncCode",
              "skuName",
              "brandName",
              "orderTime",
              "num",
              "saleContainTax"
            ]
            const list = listData
            const data = formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "报表"
            })
            // excel.export_table_to_excel('table', '品牌')
          })
        })
        .finally(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    },
    onRemoveUpload(file) {
      console.log(file)

    },
    uploadRequest(data) {
      console.info("自定义上传")
      const _file = data.file
      var formData = new FormData()
      formData.append("file", _file)
      return new Promise((resolve, reject) => {
        this.docDialog.uploadLoading = true
        upload(data.action, formData)
          .then(res => {
            this.docDialog.uploadLoading = false
            this.$message.success('添加成功')
            this.fetchTableData()
          })
          .catch(err => {
            this.docDialog.uploadLoading = false
            reject()
          })
      })
    },
    closeDialog(){
      this.docDialog.dialogVisible = false
    },
    addAtta() {
      console.log("添加附件1");
      this.$confirm("确定添加？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$refs.upload.submit();
          this.$refs["upload"].clearFiles();
        })
        .catch(() => {});
    },

  }
}
</script>
