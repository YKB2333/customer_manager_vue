<template>
  <div>
    <el-table v-loading="loading" border :data="tableData" :span-method="spanMethod">
      <el-table-column prop="name" label="客户名称" width="280"></el-table-column>
      <el-table-column label="类型" width="90">
        <template slot-scope="scope">
          {{ scope.row.type === "active" ? "活动" : "销售额" }}
        </template>
      </el-table-column>
      <el-table-column v-for="date of dateList" align="center" :key="date" :label="date" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 'active'">
            <div v-for="item of scope.row[date]" :key="item">
              <div style="display: flex; align-items: center; justify-content: center; cursor: pointer" @click="gotoActivity(scope.row.name)" >
                <div
                  style="width:10px;height: 10px;background: #95f204;border-radius: 10px;"
                ></div>
                <div
                  style="color: rgba(0, 0, 0, 0.65);margin-left: 5px;vertical-align: middle;margin-top: 1px;"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div v-else style="cursor: pointer" @click="gotoDeatil(scope.row.name, date)">
            {{ scope.row[date] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination
      style="margin-bottom: -12px" 
      :page-index="page.pageIndex" :page-size="page.pageSize" :total="page.total"
      @onPageSizeChange="onPageSizeChange" @onPageIndexChange="onPageIndexChange"
    ></the-pagination>
  </div>
</template>

<script>
import { activityCalendar, exportActivityCalendar } from '@/api/statistic'
import thePagination from "@/components/Pagination";
import { formatDate } from '@/utils'
import FileSaver from 'file-saver'
export default {
  components: { thePagination },
  name: "ActiveCalendar",
  props: {
    value: {
      type: Object,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      allList: [],
      dateList: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        orderStr: ''
      }
    };
  },
  methods: {
    // #region 数据获取于格式化
    getData() {
      const pam = {
        ...this.value,
        ...this.page
      }
      this.loading = true;
      activityCalendar(pam)
        .then(arr => {
          this.dateList = this.getDateList();
          this.allList = this.formatData(arr);
          this.page.total = this.allList.length / 2;
          this.handleList()
        })
        .finally(() => {
          this.loading = false;
        })
    },
    formatData(arr) {
      let csMap = {};
      let res = [];
      arr.forEach(item => {
        if (!csMap[item.csCode]) {
          csMap[item.csCode] = [];
        }
        csMap[item.csCode].push(item)
      })
      for (const key in csMap) {
        if (Object.hasOwnProperty.call(csMap, key)) {
          const list = csMap[key];
          let active = {
            name: list[0].csName,
            type: 'active',
            csCode: list[0].csCode,
            id: list[0].csCode,
          };
          let sale = {
            name: list[0].csName,
            type: 'sale',
            csCode: list[0].csCode,
            id: list[0].csCode,
          };
          list.forEach(item => {
            active[item.date] = item.activityList.map(v => v.title);
            sale[item.date] = item.amt;
          })
          res.push(active);
          res.push(sale);
        }
      }
      return res ;
    },
    handleList(index=this.page.pageIndex, size= this.page.pageSize ) {
      let relSize = size * 2;
      let start = relSize * (index - 1);
      let end = this.allList.length  > (index * relSize ) ? (index * relSize)  : this.allList.length; 
      this.tableData = this.allList.slice(start, end )
    },
    getDateList() {
      let startDate = this.value.salesTime[0]
      let endDate = this.value.salesTime[1]
      let date = startDate;
      let arr = []
      while (date < endDate ) {
        arr.push( formatDate(date, 'Y-M-D') )
        date+=24*60*60*1000
      }
      return arr;
    },
    query() {
      this.page.pageIndex = 1;
      this.page.pageSize = 10;
      this.getData();
    },
    reset() {
      this.query();
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }

      return {
        rowspan: 1,
        colspan: 1,
      };
    },
    onPageSizeChange(e) {
      this.page.pageIndex = 1;
      this.page.pageSize = e;
      this.handleList(1,e)
    },
    onPageIndexChange(e) {
      this.page.pageIndex = e;
      this.handleList(e)
    },
    // #endregion
    
    // #region 转跳
    gotoActivity(customerName) {
      this.$router.push({
        path: '/activity',
        query: {customerName }
      })
    },
    gotoDeatil(name, date) {
      console.log(name, date);
      // this.$router.push({
      //   path: '/statistic/customerShipment',
      //   query: { name, date}
      // })
      this.$eventHub.$emit('toDetail', { name, date})
    },
    // #endregion

    export() {
      const pam = {
        ...this.value,
        ...this.page
      }
      return new Promise((res, rej) => {
        exportActivityCalendar(pam)
          .then(blob => {
            const fileName = `活动日历${formatDate(new Date().getTime(), 'Y-M-D h:m')}.xlsx`;
            FileSaver.saveAs(blob, fileName)
            res(blob);
          })
          .finally(() => {
            rej(true)
          })
      })
    }
  },
};
</script>

<style>
</style>