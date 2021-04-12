<template>
  <div style="height: 350px" ref="dom" class="charts chart-line"></div>
</template>

<script>
import echarts from "echarts";
// import tdTheme from "./theme.json";
import { on, off } from "@/utils/tools";
export default {
  name: "detailLine",
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    init(){
      let dataAxis = Object.keys(this.value);
      let data = Object.values(this.value);
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center"
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: dataAxis
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            type: "line",
            data,
            label: {
              show: true,
              color: '#595959'
            },
            itemStyle: {
              color: '#5b8ff9'
            }
          }
        ]
      };
      let myCharts = echarts.init(this.$refs.dom);
      this.dom = myCharts;
      myCharts.setOption(option);
      on(window, "resize", this.resize);
    }
  },
  watch:{
    value(){
      this.init();
    }
  },
  mounted() {
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
