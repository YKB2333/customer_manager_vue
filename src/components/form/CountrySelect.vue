<template>
  <div :class="inputStye">
    <el-cascader
      v-model="selectVal"
      :props="area"
      ref="elcascader"
      @change="onChange"
      :placeholder="placeholder"
      :clearable="clearable"
    ></el-cascader>
  </div>
</template>

<script>
import { getDistrictList } from '@/api/client'
import { country } from '@/const/country'

export default {
  name: 'CountrySelect',
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      // 是否可选择任一级
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputStye: 'placeholderStyle2',
      area: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          setTimeout(() => {
            const { level, data } = node
            if (!level) {
              const arr = this.countryList.map((v) => ({
                label: v.label,
                value: v.label,
                adcode: v.value === 'CN' ? '100000' : '',
                leaf: !(v.value === 'CN'),
              }))
              resolve(arr)
            } else {
              if (level === 3) {
                resolve(null)
                return
              }
              let pamMap = {
                1: 'province',
                2: 'city',
              }
              getDistrictList({
                level: pamMap[level],
                padcode: data.adcode,
              }).then((res) => {
                let arr = res.map((v) => ({
                  adcode: v.adcode,
                  value: v.name,
                  label: v.name,
                  leaf: node.level == 2 || v.adcode == 710000,
                }))
                resolve(arr) // 返回数据
              })
            }
          }, 500)
        },
        checkStrictly: this.checkStrictly,
      },

      countryList: country,
      selectVal: [],
    }
  },
  computed: {
    // to fix: 已有的值不匹配控件时使用placeholder回显
    placeholder() {
      let s = Array.isArray(this.selectVal)
        ? this.selectVal.join('/')
        : this.selectVal
      this.inputStye = s ? 'placeholderStyle1' : 'placeholderStyle2'
      return s || '请选择'
    },
  },
  methods: {
    onChange(val) {
      let value = ''
      val.map((item) => {
        value = val.join('/')
      })
      this.$nextTick(() => {
        if (this.$refs.elcascader) {
          this.$refs.elcascader.dropDownVisible = false
        }
        this.$emit('input', value)
      })
    },
  },
  watch: {
    value: {
      handler: function (val) {
        if (val == null || val === '') {
          this.selectVal = []
          return
        }
        if (typeof val === 'string') {
          this.selectVal = val.split('/')
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.placeholderStyle1 {
  /deep/ .el-input__inner::placeholder {
    color: #606266;
  }
  /* 谷歌 */
  /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #606266;
  }
  /* 火狐 */
  /deep/ .el-input__inner:-moz-placeholder {
    color: #606266;
  }
  /*ie*/
  /deep/ .el-input__inner:-ms-input-placeholder {
    color: #606266;
  }
}

.placeholderStyle2 {
  /deep/ .el-input__inner::placeholder {
    color: #c4c9cf;
  }
  /* 谷歌 */
  /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #c4c9cf;
  }
  /* 火狐 */
  /deep/ .el-input__inner:-moz-placeholder {
    color: #c4c9cf;
  }
  /*ie*/
  /deep/ .el-input__inner:-ms-input-placeholder {
    color: #c4c9cf;
  }
}
</style>
