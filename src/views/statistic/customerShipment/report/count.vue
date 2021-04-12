<template>
  <div>
    <el-table  v-loading="loading" ref="t" :data="data" border @sort-change="onSortChange">
      <el-table-column label="客户编码" prop="csCode" min-width="90" ></el-table-column>
      <el-table-column label="客户名称" prop="csName" min-width="230"></el-table-column>
      <el-table-column label="所属组织" prop="orgName" min-width="135"></el-table-column>
      <el-table-column label="所属部门" prop="bmName" min-width="135"></el-table-column>
      <el-table-column label="出货单数" prop="billNum" min-width="100" sortable="custom" >
        <template slot="header">
          出货单数 
          <el-tooltip content="客户所有出货单数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>  
      </el-table-column>
      <el-table-column label="已完成单数" prop="finishNum" min-width="110" sortable="custom">
        <template slot="header">
          已完成单数 
          <el-tooltip content="客户已完成出货单数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>  
      </el-table-column>
      <el-table-column label="退单数" prop="refundNum" min-width="90" sortable="custom">
        <template slot="header">
          退单数 
          <el-tooltip content="客户售后单数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>  
      </el-table-column>
      <el-table-column label="出货商品总数" prop="shippedGoodsNum" min-width="120" sortable="custom">
        <template slot="header">
          出货商品总数 
          <el-tooltip content="客户出货单商品数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>    
      </el-table-column>
      <el-table-column label="未出货商品总数" prop="noShippedGoodsNum" min-width="130" sortable="custom">
        <template slot="header">
          未出货商品总数 
          <el-tooltip content="客户未出货合作商品数量统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>    
      </el-table-column>
      <el-table-column label="出货额" prop="amt" min-width="100" sortable="custom">
        <template slot="header">
          出货额 
          <el-tooltip content="客户商品出货单-退货单金额统计" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination style="margin-bottom: -12px" :page-index="page.pageIndex" :page-size="page.pageSize" :total="page.total"
      @onPageSizeChange="onPageSizeChange" @onPageIndexChange="onPageIndexChange" ></the-pagination>
  </div>
</template>

<script>
import {salesSettle, exportSalesSettle} from '@/api/statistic'
import thePagination from '@/components/Pagination'
import FileSaver from 'file-saver'
import { formatDate } from '@/utils'

export default {
  name: 'Count',
  components: { thePagination },
  props: {
    value: {
      type: Object,
      default: () => ({name: '', ncCode: '', salesTime: [], })
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      allList: [],
      backupsList: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        orderStr: ''
      }
    }
  },
  methods: {
    // #region 获取数据
    query() {
      this.page.pageIndex = 1;
      this.page.pageSize = 10;
      this.getData();
    },
    getData() {
      this.loading = true;
      const pam = {
        ...this.value,
        ...this.page
      };
      salesSettle(pam)
        .then(res => {
          this.allList = res || [];
          this.page.total = this.allList.length;
          this.backupsList = JSON.parse(JSON.stringify(res || []))  ;
          this.handleList()
        })
        .finally(() => {
          this.loading = false;
        })
    },
    handleList(index=this.page.pageIndex, size=this.page.pageSize ) {
      let start = size * (index - 1);
      let end = index * size ; 
      this.data = this.allList.slice(start, this.allList.length  > end ? end : this.allList.length )
    },
    reset() {
      this.onSortChange({prop: '', order: null})
      this.$refs['t'].clearSort();
      this.query();
    },
    onPageSizeChange(e) {
      this.page.pageIndex = 1;
      this.page.pageSize = e;
      this.handleList(1, e);
    },
    onPageIndexChange(e) {
      this.page.pageIndex = e;
      this.handleList(e)
    },
    onSortChange({prop, order}) {
      let orderStr = order ? (order === 'ascending' ? `${prop} asc` :  `${prop} desc`) : '';
      this.page.orderStr = orderStr;
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
    // #endregion

    // #region 操作
    export() { // 导出
      const pam = {
        ...this.value,
        ...this.page
      };
      return new Promise((res, rej) => {
        exportSalesSettle(pam)
          .then(blob => {
            const fileName = `客户出货报表${formatDate(new Date().getTime(), 'Y-M-D h:m')}.xlsx`;
            FileSaver.saveAs(blob, fileName);
            res(blob)
          })
          .finally(() => {
            rej(true)
          })
      })
    }
    // #endregion
  }

}
</script>

<style>

</style>