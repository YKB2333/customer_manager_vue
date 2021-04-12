<template>
  <div>
    <el-form ref="f" :model="searchQuery" inline label-width="100px">
      <el-form-item label="客户编码" prop="ncCode">
        <el-input
          v-model="searchQuery.ncCode"
          placeholder="客户编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="name">
        <el-input
          v-model="searchQuery.name"
          placeholder="客户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="出货时间" prop="salesTime">
        <range-picker v-model="searchQuery.salesTime"></range-picker>
      </el-form-item>
    </el-form>



    <div class="mb10">
      <el-button type="primary" @click="query" >查询</el-button>
      <el-button type="primary"  @click="getData" >刷新</el-button>
      <el-button type="primary" @click="reset" >重置</el-button>
      <el-button v-permission-button="'export'" type="primary" @click="exportReport" :loading="exportLoading" >导出</el-button>
    </div>

    <el-tabs type="border-card" v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="出货统计" name="count">
        <count ref="count" v-model="searchQuery" ></count>
      </el-tab-pane>
      <el-tab-pane label="活动日历" name="calendar">
        <active-calendar ref="calendar" v-model="searchQuery" ></active-calendar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import rangePicker from '@/views/statistic/customerShipment/component/range-picker'
import Count from "./count";
import ActiveCalendar from "./active-calendar";
export default {
  name: "ShipmentReport",
  components: { Count, ActiveCalendar, rangePicker,  },
  data() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0).getTime();
    const yesterdayStart = todayStart - 1000 * 60 * 60 * 24;
    const yesterdayEnd = todayStart - 1000;
    return {
      activeTab: "count",
      exportLoading: false,
      searchQuery: {
        ncCode: "",
        name: "",
        salesTime: [yesterdayStart, yesterdayEnd],
      },
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    tabClick() {
      console.log(this.activeTab);
      this.getData();
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
    query() {
      if (!this.checkParams()) {
        return;
      }
      this.$refs[this.activeTab].query();
    },
    getData() {
      if (!this.checkParams()) {
        return;
      }
      this.$refs[this.activeTab].getData();
    },
    reset() {
      this.$refs['f'].resetFields();
      this.$refs['count'].reset();
      this.$refs['calendar'].reset();
    },
    exportReport() {
      if (!this.checkParams()) {
        return;
      }
      this.exportLoading = true;
      this.$refs[this.activeTab]
        .export()
        .then(res => {
          return ;
        })
        .finally(() => {
          this.exportLoading = false;
        })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>