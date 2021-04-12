<template>
  <div>
    <el-select v-model="selectVal" filterable :clearable="clearable">
      <el-option
        v-for="(brand,index) in brandList"
        :key="'brand'+index"
        :value="brand.id"
        :label="brand.name"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { getMaxNumber } from "@/utils";
import { getBrandList } from "@/api/brand";

export default {
  name: "BrandSelect",
  components: {},
  props: {
    value: null,
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      brandList: []
    };
  },
  computed: {
    selectVal: {
      set(val) {
        console.log(val);
        this.$emit("input", val);
        this.$emit("change", val);
      },
      get() {
        return this.value;
      }
    }
  },
  methods: {
    // 加载品牌下拉框数据
    fetchBrandData() {
      getBrandList({
        pageIndex: 1,
        pageSize: getMaxNumber(),
        isEnable: true
      }).then(res => {
        this.brandList = res.list;
      });
    },
  },
  created() {
    this.fetchBrandData();
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
