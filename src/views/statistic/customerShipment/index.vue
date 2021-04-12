<template>
  <div>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="客户出货报表" name="report">
        <shipment-report></shipment-report>
      </el-tab-pane>
      <el-tab-pane label="客户出货明细" name="detail">
        <detail></detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ShipmentReport from "./report";
import detail from './detail'

export default {
  name: "CustomerShipment",
  components: { ShipmentReport, detail },
  created() {
    this.$eventHub.$on('toDetail', (e) => {
      console.log(e);
      this.activeTab = 'detail'})
  },
  beforeDestroy() {
    this.$off('toDetail', {})
  },
  data() {
    return {
      activeTab: "report",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>