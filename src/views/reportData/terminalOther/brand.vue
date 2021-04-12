<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'export'" type="primary" @click="onExportClick" style="margin-right:500px">导出</el-button>
            <el-date-picker
              v-model="times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp">
            </el-date-picker>
        </div>
      </div>

      <el-table
        :data="tableData"
        border stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
     >
        <!-- <el-table-column type="index" :index="indexMethod" label="序号" width="60"></el-table-column> -->
        <el-table-column prop="csName"sortable label="渠道名称" width="200"></el-table-column>
        <el-table-column prop="csCode" label="渠道编码" width="450"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="200"></el-table-column>
        <el-table-column prop="num" sortable label="数量" width="172"></el-table-column>
        <el-table-column prop="sale"sortable  label="含税额" width="172"></el-table-column>
      </el-table>
    </my-table>

  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage"
import Download from '@/components/Download'
import { getAttachmentList, deleteAtta, addAtta, getAttaBrandId, upload } from '@/api/attachment'
import { getReportBrandList} from '@/api/reportData'
import {getDate} from '@/utils/tools'
export default {
  name: "reportBrand",
  components: {UploadImage, Download},
  data() {
    return {
      searchForm: [
        {
          key: 'csName',
          placeholder: '渠道名称',
          type: "input"
        },

        {
          key: 'csCode',
          placeholder: '渠道编号',
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
        attachmenList: [],
        uploadLoading: false
      },

      tableData: [],
      ruleForm: {
        csName: "",
        csCode: "",
        storeNumber: "",
        storeName: true,
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
        this.searchQuery.total = res.count
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
      //console.log(this.times[0]+":"+this.formatDates(this.times[0],'Y/M/D'))
      //console.log(this.times[0]+":"+this.formatDates(this.times[1],'Y/M/D'))
      if (this.times){
        this.searchQuery.startTime=this.times[0]
        this.searchQuery.endTime=this.times[1]

      }
      if (!this.times){
        this.searchQuery.startTime=0
        this.searchQuery.endTime=25646752000000

      }
      return new Promise((resolve, reject) => {
        getReportBrandList(this.searchQuery)
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

    onRemoveUpload(file) {
      console.log(file)

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
      getReportBrandList(params)
        .then(res => {
          let listData = res.list
          import("@/utils/excel/Export2Excel").then(excel => {
            const tHeader = [
              "渠道名称",
              "渠道编号",
              "品牌",
              "数量",
              "含税售额"
            ]
            const filterVal = [
              "csName",
              "csCode",
              "brandName",
              "num",
              "saleContainTax",
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

  }
}
</script>
