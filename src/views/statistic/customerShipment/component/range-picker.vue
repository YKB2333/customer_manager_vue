<template>
  <el-date-picker
    v-model="val"
    type="daterange"
    align="right"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="pickerOptions"
    :default-time="['00:00:00', '23:59:59']"
    value-format="timestamp"
  >
  </el-date-picker>
</template>

<script>

const now = new Date();
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0).getTime();
const yesterdayStart = todayStart - 1000 * 60 * 60 * 24;
const yesterdayEnd = todayStart - 1000;
export default {
  name: 'RangePicker',
  props: {
    value: {
      type: Array,
      default: () => {
        return [yesterdayStart, yesterdayEnd]
      }
    }
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > yesterdayEnd ;
        },
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              picker.$emit("pick", [yesterdayStart, yesterdayEnd]);
            },
          },
          {
            text: "近七天",
            onClick(picker) {
              const start = todayStart - 7*24*60*60*1000
              picker.$emit("pick", [start, yesterdayEnd]);
            },
          },
          {
            text: "近三十天",
            onClick(picker) {
              const start = todayStart - 30*24*60*60*1000
              picker.$emit("pick", [start, yesterdayEnd]);
            },
          },
        ],
      },
    }
  },
  methods: {

  }
}
</script>

<style>

</style>