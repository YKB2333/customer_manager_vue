<template>
  <div>
    <el-cascader
      style="width: 250px;"
      :options="cascaderOptions"
      v-model="selectVal"
      :props="{ expandTrigger : expandTrigger, checkStrictly: checkStrictly, emitPath: false  }"
      :clearable="clearable"
    ></el-cascader>
  </div>
</template>

<script>
import { getMaxNumber, generateCategoryCascader } from "@/utils";
import { getCategoryList } from "@/api/category";

export default {
  name: "CateCascader",
  components: {},
  props: {
    value: [String, Number],
    checkStrictly: {
      // true选择任意一级选项, false只能选择最后一级
      type: Boolean,
      default: true
    },
    cateList: {
      type: Array,
      default: () => {
        [];
      }
    },
    returnValue: {
      type: String,
      default: "cateCode"
    },
    expandTrigger: {
      type: String,
      default: "click"
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cascaderOptions: [],
      // selectVal: []
    };
  },
  computed: {
    selectVal: {
      set(currentVal) {
        let result = '';
        result = currentVal;
        if (typeof currentVal === 'string') {
          if (this.returnValue === 'cateCode') {
            let arr = currentVal.split('-').map(Number)
            if (arr.length !== 3) {
              if (result!== '') {
                result = currentVal + '-'
              }
            }
          }
        }
        this.$emit("input", result);
        this.$emit("change", result);
      },
      get() {
        if (typeof this.value === 'string') {
          if (this.value.lastIndexOf('-') === (this.value.length - 1) ) {
            return this.value.substring(0, this.value.length - 1)
          }
        }
        return this.value;
      }
    }
  },
  created() {},
  mounted() {
    // 已有分类列表, 显示当前分类
    if (this.cateList && this.cateList.length) {
      this.cascaderOptions = generateCategoryCascader(this.cateList, "cateId");
    } else {
      this.fetchCategoryData();
    }
  },
  methods: {
    fetchCategoryData(show) {
      getCategoryList({
        pageIndex: 1,
        pageSize: getMaxNumber(),
        isShow: true
      })
        .then(res => {
          // console.log('分类列表=>', res.list)
          let list = res.list;
          this.cascaderOptions = generateCategoryCascader(
            list,
            this.returnValue
          );
          // console.log(this.cascaderOptions)
        })
        .finally(() => {
          this.isLoadingCateList = false;
        });
    },
    onCateSelectChange(currentVal) {
      let result = "";
      if (currentVal.length) {
        if (this.returnValue === "cateCode") {
          if (this.cateList && this.cateList.length) {
            result = currentVal.join("-");
          } else {
            if (currentVal.length === 3) {
              result = currentVal[currentVal.length - 1];
            } else {
              result = currentVal[currentVal.length - 1] + "-";
            }
          }
        } else if (this.returnValue === "cateId") {
          result = Number(currentVal[currentVal.length - 1]);
        }
      }
      this.$emit("input", result);
      this.$emit("change", result);
    },
    clear() {
      this.selectVal = '';
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
