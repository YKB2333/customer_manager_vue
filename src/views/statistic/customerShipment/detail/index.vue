<template>
  <div>
      <el-form ref="f" :model="searchQuery" inline label-width="100px">
      <el-form-item label="客户编码" prop="ncCode">
        <el-input v-model="searchQuery.ncCode" placeholder="客户编码" ></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="searchQuery.name" placeholder="客户名称" ></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="brandId">
        <brand-select v-model="searchQuery.brandId" placeholder="品牌"></brand-select>
      </el-form-item>
      <el-form-item label="商品编码" prop="skuSn">
        <el-input v-model="searchQuery.skuSn" placeholder="商品编码"></el-input>
        <!-- <brand-select v-model="searchQuery.NCode" placeholder="商品编码"></brand-select> -->
      </el-form-item>
      <el-form-item label="商品名称" prop="spuName">
        <el-input v-model="searchQuery.spuName" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="出货时间" prop="salesTime">
        <rangePicker v-model="searchQuery.salesTime" ></rangePicker>
      </el-form-item>
    </el-form>
    <div class="mb10">
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="primary" @click="getData">刷新</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button v-permission-button="'export'" type="primary" @click="exportReport" :loading="exportLoading">导出</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" ref="t" @sort-change="onSortChange">
      <el-table-column label="客户编码" prop="csCode" width="100"></el-table-column>
      <el-table-column label="客户名称" prop="csName" width="230"></el-table-column>
      <el-table-column label="品牌名称" prop="brandName" width="150"></el-table-column>
      <el-table-column label="商品编码" prop="skuSn" width="120"></el-table-column>
      <el-table-column label="商品条码" prop="codeBar" width="125"></el-table-column>
      <el-table-column label="商品名称" prop="spuName" width="300"></el-table-column>
      <el-table-column label="规格值" width="120">
        <template slot-scope="scope" >
          <div v-if="scope.row.firstAtbKey" >{{ scope.row.firstAtbKey + ':' +  scope.row.firstAtbValue}}</div>
          <div v-if="scope.row.secondAtbKey" >{{ scope.row.secondAtbKey + ':' +  scope.row.secondAtbValue}}</div>
        </template>
      </el-table-column>
      <el-table-column  prop="num" sortable="custom" width="110">
        <template slot="header">
          出货数量 
          <el-tooltip content="客户商品出货单-退货单数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="refundNum"  sortable="custom" width="110">
        <template slot="header">
          退单数量 
          <el-tooltip content="商品退货单数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="amt"  sortable="custom" width="110">
        <template slot="header">
          出货额 
          <el-tooltip content="客户商品出货单-退货单金额统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showLineChart(scope.row)" >折线图</el-button>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination style="margin-bottom: -12px" :page-index="searchQuery.pageIndex" :page-size="searchQuery.pageSize" :total="searchQuery.total"
  @onPageSizeChange="onPageSizeChange" @onPageIndexChange="onPageIndexChange" ></the-pagination>
 
    <el-dialog
      custom-class="compact"
      destroy-on-close
      title="商品出库推移" 
      :visible.sync="isShowLineChart" 
      @close="isShowLineChart = false"
      width="50%">
      <div v-loading="chartLoading" >
        <deatil-line  :value="chartValue" ></deatil-line>
      </div>
      <div slot="footer">
        <el-button @click="isShowLineChart = false">取 消</el-button>
        <el-button type="primary" @click="isShowLineChart = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {goodsSalesSettle, exportGoodsSalesSettle, singleGoodsSalesSettle } from '@/api/statistic'
import BrandSelect from '@/components/Table/BrandSelect'
import rangePicker from '../component/range-picker'
import deatilLine from '@/views/statistic/customerShipment/detail/line'
import thePagination from '@/components/Pagination'
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'

export default {
  name: 'detail',
  components: { BrandSelect, rangePicker , deatilLine, thePagination},
  data() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0).getTime();
    const yesterdayStart = todayStart - 1000 * 60 * 60 * 24;
    const yesterdayEnd = todayStart - 1000;
    return {
      exportLoading: false,
      chartLoading: false,
      loading: false,
      chartValue: {},
      isShowLineChart: false,
      tableData: [],
      allList: [],
      backupsList: [],
      chartDate: [],
      searchQuery: {
        ncCode: "",
        name: "",
        skuSn: '',
        spuName: '',
        salesTime: [yesterdayStart, yesterdayEnd],
        orderStr: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
    }
  },
  created() {
    this.$eventHub.$on('toDetail', (e) => {
      this.searchQuery.name = e.name;
      let arr =e.date.split('-').map(Number);
      let start = new Date(arr[0], arr[1] - 1, arr[2], 0, 0, 0 ).getTime()
      let end = start + 1000 * 60 * 60 * 24 - 1000;
      this.searchQuery.salesTime = [start, end]
      this.getData();
    })
    this.getData();
  },
  beforeDestroy() {
    this.$eventHub.$off('toDetail', {} )
  },
  methods: {
    // #region 数据获取
    onSortChange({prop, order}) {
      let orderStr = order ? (order === 'ascending' ? `${prop} asc` :  `${prop} desc`) : '';
      this.searchQuery.orderStr = orderStr;
      if (!order) {
        this.allList = JSON.parse(JSON.stringify(this.backupsList));
        this.handleList();
        return;
      }
      this.allList.sort((a, b) => {
        if (order === 'ascending') {
          return a[prop] - b[prop]
        } else {
          return b[prop] - a[prop]
        }
      })
      this.handleList();
    },
    getData() {
      if (!this.checkParams()) {
        return;
      }
      this.loading = true;
      goodsSalesSettle(this.searchQuery)
        .then(res => {
          this.chartDate = JSON.parse(JSON.stringify(this.searchQuery.salesTime));
          this.allList = res || [];
          this.searchQuery.total = this.allList.length;
          this.backupsList = JSON.parse(JSON.stringify(res || []))  ;
          this.handleList()
        })
        .finally(() => {
          this.loading = false;
        })
    },
    query() {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = 10;
      this.getData();
    },
    handleList(index=this.searchQuery.pageIndex, size=this.searchQuery.pageSize ) {
      let start = size * (index - 1);
      let end = this.allList.length  > (index * size) ? (index * size)  : this.allList.length; 
      this.tableData = this.allList.slice(start, end )
    },    
    reset() {
      this.onSortChange({prop: '', order: null})
      this.$refs['t'].clearSort();
      this.$refs.f.resetFields();
      this.query();
    },
    onPageSizeChange(e) {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = e;
      this.handleList(1, e);
    },
    onPageIndexChange(e) {
      this.searchQuery.pageIndex = e;
      this.handleList(e)
    },
    checkParams() {
      if (!Array.isArray(this.searchQuery.salesTime) || this.searchQuery.salesTime.length === 0) {
        this.$message.error('统计范围为必填项！')
        return false;
      }
      let isCanSearch = (this.searchQuery.salesTime[1] - this.searchQuery.salesTime[0]) < 31*24*60*60*1000
      if (!isCanSearch) {
        this.$message.error('统计范围不能大于1个月！')
        return false;
      }
      return true;
    },
    // #endregion
    // #region 操作
    showLineChart(data) {
      const pam = {
        ncCode: data.csCode,
        skuSn: data.skuSn,
        salesTime: this.chartDate
      }
      this.isShowLineChart = true;
      this.chartLoading = true;
      singleGoodsSalesSettle(pam)
        .then(res => {
          let val = {};
          res.forEach(v => {
            val[v.date] = v.amt
          })
          this.chartValue = val;
        })
        .finally(() => {
          this.chartLoading = false
        })
    },
    exportReport() {
      if (!this.checkParams()) {
        return;
      }
      this.exportLoading = true;
      exportGoodsSalesSettle(this.searchQuery)
        .then(blob => {
          console.log('success export detail');
          const fileName = `客户出货明细${formatDate(new Date().getTime(), 'Y-M-D h:m')}.xlsx`;
          FileSaver.saveAs(blob, fileName)
        })
        .finally(() => {
          this.exportLoading = false;
        })
    }
    // #endregion
  }
}
</script>

<style lang="scss" scoped>
/deep/ .compact {
  & > .el-dialog__body {
    padding: 0;
    margin-top: -10px;
    padding-left: 10px;
  }
}
</style>
