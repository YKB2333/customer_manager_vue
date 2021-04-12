<template>
  <div>
    <el-input :disabled="disabled" placeholder="请输入内容" v-model="v" @blur="toValue" @keyup.enter.native="toValue" >
      <el-button size="mini" icon="el-icon-more" @click="dialogVisible=true" slot="append" ></el-button>
    </el-input>
    <el-dialog
      title="提示"
      :modal="false"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose">
      <div>
        <el-input v-model="v"   type="textarea"  :rows="8"  placeholder="请输入数据进行查询" ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'batchQueryInput',
  data() {
    return{
      v: '',
      isUpdateV: true,
      dialogVisible: false
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '批量搜索'
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    }
  },
  methods: {
    handleV(val) {
      console.log(val);
      if (typeof val === 'string') {
        return val.split(/[，.,\s\v\n\t\r]/).filter(item => item)
      }
      return []
    },
    toValue(event) {
      this.isUpdateV = false;
      let arr = this.handleV(this.v);
      console.log(arr, 'intoValue');
      let isEmit = false;
      if (arr.length !== this.value.length) {
        isEmit = true;
      }
      arr.forEach((v, i) => {
        if (v !== (this.value || this.value[i])) {
          isEmit = true;
        }
      } )
      if (isEmit) {
        this.$emit('input', arr)
        this.$emit('change', arr)
      }
      setTimeout(() => {
        this.v = this.value.join(',\n')
      }, 10);
    },
    // #region 弹窗相关
    handleClose() {
      this.toValue();
      // this.dialogVisible = false;
    }
    // #endregion
  },
  watch: {
    value: {
      handler(val, oldVal) { // 外部改变绑定的数组时,需要更新v的值
        if (!this.isUpdateV) {
          this.isUpdateV = true;
          return;
        }
        if (Array.isArray(val)) {
          this.v = val.join(',\n')
        }
        this.v = '';
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style>

</style>