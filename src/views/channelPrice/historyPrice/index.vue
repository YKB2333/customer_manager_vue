<template>
  <div class="profitRate-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- <div slot="before-table">
        <div class="pb10">     
          <el-button type="primary" :disabled="isAdd" @click="add"
          v-permission-button="'add'"
            >新增</el-button
          >
        </div>
      </div> -->

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="ncCode" label="客户编码" ></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200px"></el-table-column>
        <el-table-column prop="shopName" label="店铺名称" width="130px"></el-table-column>
        <el-table-column prop="applyNo" label="定价申请单" ></el-table-column>
        <el-table-column prop="spuName" label="商品名称" width="130px"></el-table-column>
        <el-table-column prop="skuSn" label="商品编码" ></el-table-column>
        <el-table-column prop="codeBar" label="商品条码" ></el-table-column>
        <el-table-column prop="currentMsrp" label="合作价格" ></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTimestamp">{{
              scope.row.createTimestamp | formatDate('Y/M/D h:m:s')
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

  </div>
</template>
<script>
import {
  channelOfferApplyHistoryPages
} from '@/api/profitRate'
import { formatDate } from '@/utils'
// import FileSaver from 'file-saver'
export default {
  name: 'serviceFee',
  components: {},
  data() {
    return {
      tableData: [],
      searchForm: [
        {
          key: 'customerName',
          label: '客户名称',
          placeholder: '输入客户名称',
          clearable: true,
          type: 'input'
        },
        {
          key: 'ncCode',
          label: '客户编码',
          placeholder: '输入客户编码',
          clearable: true,
          type: 'input'
        },
        {
          key: 'shopName',
          label: '店铺名称',
          placeholder: '输入店铺名称',
          clearable: true,
          type: 'input'
        },        
        {
          key: 'applyNo',
          label: '定价申请单号',
          placeholder: '输入定价申请单号',
          clearable: true,
          type: 'input'
        },
        ],
      searchQuery: {
        customerName: '',
        shopName: '',
        ncCode: '',
        applyNo: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },

  
      tableLoading: false,
    }
  },
  computed: {
  },
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
    // 加载表格数据
    async fetchTableData() {
      this.tableLoading = true
      this.searchQuery.customerName=this.searchQuery.customerName.trim()
       this.searchQuery.shopName=this.searchQuery.shopName.trim()
       this.searchQuery.ncCode=this.searchQuery.ncCode.trim()
       this.searchQuery.applyNo=this.searchQuery.applyNo.trim()
      let params = this.searchQuery
      channelOfferApplyHistoryPages(params).then((res) => {
         this.tableLoading = false
        if (res) {
          this.tableData = res.records
          this.searchQuery.total = res.total
        }
      })
     
    },
    onChange() {
      this.fetchTableData()
    },
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
