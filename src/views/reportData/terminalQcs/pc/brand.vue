<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'export'" type="primary" style="margin-right:500px" @click="onExportClick">导出</el-button>
          <el-date-picker
            @change="onStartDateChange"
            v-model="startMonth"
            type="month"
            format="yyyy 第 MM 月"
            placeholder="选择开始月"
          >
          </el-date-picker>
          <el-date-picker
            @change="onEndDateChange"
            v-model="endMonth"
            type="month"
            format="yyyy 第 MM 月"
            placeholder="选择结束月">
          </el-date-picker>
        </div>
      </div>

      <el-table
        :data="tableData"
        border stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中">
        <el-table-column prop="storeNumber" label="店铺号" width="150"></el-table-column>
        <el-table-column prop="storeName" label="门店名" width="450"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="200"></el-table-column>
        <el-table-column prop="sale" sortable label="含税额"  width="200"  ></el-table-column>
        <el-table-column prop="num" label="数量" sortable width="195" ></el-table-column>
      </el-table>
    </my-table>

     <!--弹窗-->
    <!-- 附件列表弹窗 -->

  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage"
import Download from '@/components/Download'
import { getQcsPcReportBrandList} from '@/api/reportData'
import {getDate} from '@/utils/tools'
export default {
  name: "reportData",
  components: {UploadImage, Download},
  data() {
    return {
      searchForm: [

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
          key: 'brandName',
          placeholder: '品牌',
          type: "input"
        },
      ],
      times:[],
      startMonth:'',
      endMonth:'',
      tableLoading: false,
      searchQuery: {
        startMonth: 0,
        endMonth: 1000000,
        pageIndex: 1,
        pageSize: 10,
        total: 0, // 总条数
      },
      docDialog: {
        dialogVisible: false,
        dialogType: "",
        attachmenList: [],
        uploadLoading: false
      },

      tableData: [],
      ruleForm: {
        storeNumber: "",
        skuName: "",
        brandName: "",
        num: "",
        sale: '',

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
    onStartDateChange(value) {
      if (value){
        this.searchQuery.startMonth=`${value.getFullYear()}${this.$moment(value).month()+1}`
      }else {
        this.searchQuery.startMonth=0
      }
    },
    onEndDateChange(value) {
      if(value) {
        this.searchQuery.endMonth=`${value.getFullYear()}${this.$moment(value).month()+1}`
      }else {
        this.searchQuery.endMonth=1000000
      }
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchBrandList()
        this.searchQuery.total = res.count // 总条数
        this.tableData = res.list // 报表数据数据
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    // 获取报表数据列表
    fetchBrandList() {
      return new Promise((resolve, reject) => {
        getQcsPcReportBrandList(this.searchQuery)
          .then(res => {
            resolve(res)
          }).catch(error => {
          reject(error)
        })
      })
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
      getQcsPcReportBrandList(params)
        .then(res => {
          let listData = res.list
          import("@/utils/excel/Export2Excel").then(excel => {
            const tHeader = [
              "店铺号",
              "门店名",
              "品牌",
              "含税额",
              "数量"
            ]
            const filterVal = [
              "storeNumber",
              "storeName",
              "brandName",
              "sale",
              "num",
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

  }
}
</script>
