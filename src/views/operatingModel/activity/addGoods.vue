<template>
  <span>
    <el-button type="primary" @click="showDialog" >添加商品</el-button>
    <el-dialog
      :title="'商品信息'"
      :visible.sync="isChoiceGoods"
      custom-class="compact"
      width="70%"
      :before-close="goodsClose"
      destroy-on-close
    >
      <my-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        v-model="goodsSearchQuery"
        :searchForm="goodsSearchForm"
        @change="onChangeGoods"
      >
        <el-table ref="t" class="mt10" max-height="400px" :data="goods" align="center"  @selection-change="selectChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="cateName" label="商品分类"></el-table-column>
          <el-table-column prop="brandName" label="品牌"> </el-table-column>
          <el-table-column prop="codeBar" label="商品条码"> </el-table-column>
          <el-table-column prop="spuName" label="商品名称"> </el-table-column>
          <el-table-column prop="skuSn" label="规格编码"> </el-table-column>
          <el-table-column label="规格值" prop="规格值" >
            <template slot-scope="scope">
              <div v-if="scope.row.firstAtbKey">{{ `${scope.row.firstAtbKey}:${scope.row.firstAtbValue}` }}</div>
              <div v-if="scope.row.secondAtbKey">{{ `${scope.row.secondAtbKey}:${scope.row.secondAtbValue}` }}</div>
            </template>
          </el-table-column>
        </el-table>
       
      </my-table>
      <span slot="footer"> 
        <el-button @click="goodsClose" >取消</el-button>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { getSkuPager, addGoods } from '@/api/activity'
import {   selectPage as getGoodssPages, findAll } from '@/api/client'
import { addCust } from '@/api/activity'
export default {
  name: 'addGoods',
  props: {
    activityId: null
  },
  created() {
  },
  data() {
    return {
      loading: false,
      isChoiceGoods: false,
      goods: [],
      goodsSearchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: '',
        total: 0 // 总条数
      },
      selectList: [],
      goodsSearchForm: [
        {
          key: 'cateCode',
          label: '商品分类:',
          placeholder: '商品分类',
          type: 'cate_cascader'
        },
        {
          key: 'brand',
          label: '品牌:',
          placeholder: '品牌',
          type: 'brand_select'
        },
        {
          key: 'skuSns',
          label: '规格编码',
          type: 'batch_query',
        },
        {
          key: 'codeBars',
          label: '商品条码',
          type: 'batch_query',
        },
        {
          key: 'name',
          label: '商品名称:',
          placeholder: '商品名称',
          type: 'input'
        },
        // 商品名称
      ]
    }
  },
  methods: {
    // #region 模态框
    showDialog() { // 打开
      this.isChoiceGoods = true;
      this.onChangeGoods();
    },
    goodsClose() { // 关闭弹窗
      this.isChoiceGoods = false
      this.selectList = [];
      this.goodsSearchQuery = {
        pageIndex: 1,
        pageSize: 10,
        orderStr: '',
        total: 0, 
      }
    },
    addGoods() { // 确认操作
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error('未选中商品');
        return;
      }
      let pam = this.selectList.map(v => ({
        skuId: v.id,
        spuId: v.spuId
      }))
      addGoods(this.activityId, pam)
        .then(res => {
          this.$message.success('添加活动商品成功');
          this.$emit('afterSuccess', res);
          this.goodsClose();
        })
    },
    // #endregion
    // #region 获取数据与选中
    onChangeGoods() {
      this.loading = true;
      this.goodsSearchQuery.brandId = this.goodsSearchQuery.brand ? [this.goodsSearchQuery.brand] : [];
      this.selectList = []; // 暂时不要跨页勾选
      getSkuPager(this.goodsSearchQuery)
        .then((res) => {
          this.isChoiceGoods = true
          this.goods = res && res.records || [];
          this.goodsSearchQuery.total = res.total || 0;
          let arr = JSON.parse(JSON.stringify(this.selectList)) 
          this.reSelect(arr)
        })
        .finally(() =>　{
          this.loading = false
        })
    },
    selectChange(e) {
      let arr = this.selectList.filter(v => !this.goods.some(item => item.id === v.id));
      this.selectList = arr.concat(e)
    },
    reSelect(selectTempList){
      this.$nextTick(()=> {
        this.goods.forEach(i=> {
            selectTempList.forEach(v => {
                if(v.id===i.id){
                  this.$refs['t'].toggleRowSelection(i);
                }
            });
          })
      });
    },
    // #endregion

  }


}
</script>

<style lang="scss" scoped>
/deep/ .compact{
  & > .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
}
</style>