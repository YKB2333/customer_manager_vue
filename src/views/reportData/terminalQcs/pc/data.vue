<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'export'" type="primary" @click="onExportClick">导出</el-button>
          <el-button v-permission-button="'upload'" type="text" @click="showUploadAtta()" style="margin-right:200px">上传报表</el-button>
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
        <el-table-column prop="storeNumber" label="店铺号" width="80"></el-table-column>
        <el-table-column prop="storeName" label="门店名" width="150"></el-table-column>
        <el-table-column prop="supplyType" label="供货类型" width="100"></el-table-column>
        <el-table-column prop="mnemonicCode" label="商品助记号" width="100"></el-table-column>
        <el-table-column prop="ncCode" label="NC编码"  width="150"></el-table-column>
        <el-table-column label="商品名称"  prop="skuName" width="235"></el-table-column>
        <el-table-column label="品牌"  prop="brandName" width="80"></el-table-column>
        <el-table-column label="销售月" prop="month" width="100" ></el-table-column>
        <el-table-column label="数量" sortable prop="num" width="100" ></el-table-column>
        <el-table-column label="含税额" sortable prop="saleContainTax" width="150"  ></el-table-column>
      </el-table>
    </my-table>

     <!--弹窗-->
    <!-- 附件列表弹窗 -->
    <my-dialog
      @close="closeDialog()"
      :title="dialogTitle"
      v-model="docDialog.dialogVisible"

      >
     <!-- <div v-show="docDialog.dialogType === 'attaList'">
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
          :action="`${$config.baseURL}/customer/report-qcs-pc-data/uploadReport`"
          :on-success="(response, file) => onSuccessUpload(response, file)"
          :on-remove="(file) => onRemoveUpload(file)"
          :multiple="false"
          :httpRequest="uploadRequest"
          :disabled="docDialog.uploadLoading"
          :auto-upload="docDialog.isUpload"
          >
          <el-button type="primary" >选择报表上传</el-button>

        </el-upload>
        <div class="mt30">
          <el-button type="success" @click="addAtta" :disabled="docDialog.uploadLoading">上传报表</el-button>
        </div>
        <div v-show="docDialog.uploadLoading">
          <el-button type="text" :loading="docDialog.uploadLoading">上传中</el-button>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage"
import Download from '@/components/Download'
import { getQcsPcReportList} from '@/api/reportData'
import {upload } from '@/api/attachment'
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
          key: 'skuName',
          placeholder: '商品名称',
          type: "input"
        },
        {
          key: 'brandName',
          placeholder: '品牌',
          type: "input"
        },
        {
          key: 'ncCode',
          placeholder: 'NC编号',
          type: "input"
        },
      ],
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
        uploadLoading: false,
        isUpload:false
      },

      tableData: [],
      dialogType: "上传报表",
      ruleForm: {
        storeNumber: "",
        group: "",
        mnemonicCode: "",
        ncCode: "",
        skuName: "",
        brandName: "",
        num: "",
        saleContainTax: '',
        month:""
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
        getQcsPcReportList(this.searchQuery)
          .then(res => {
            resolve(res)
          }).catch(error => {
          reject(error)
        })
      })
    },
    showUploadAtta(row) {
      this.docDialog.dialogType = true
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
      getQcsPcReportList(params)
        .then(res => {
          let listData = res.list
          import("@/utils/excel/Export2Excel").then(excel => {
            const tHeader = [
              "店铺号",
              "门店名",
              "供货类型",
              "商品助记码",
              "NC编码",
              "商品名称",
              "品牌",
              "销售周",
              "数量",
              "含税售额"
            ]
            const filterVal = [
              "storeNumber",
              "storeName",
              "supplyType",
              "mnemonicCode",
              "ncCode",
              "skuName",
              "brandName",
              "month",
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
      this.docDialog.dialogType=false
      this.docDialog.dialogVisible = false
      this.$refs["upload"].clearFiles();
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
