<template>
  <span>
    <el-button type="primary" @click="show" >添加商品</el-button>
    <el-dialog title="商品信息" :visible="showDialog" width="70%" custom-class="my_dialog_class" @close="showDialog = false" :modal="false" >
       <div style="width: 90%;margin:0 auto">
          <el-form ref="f" :model="searchQuery" inline label-width="150" >
            <el-form-item label="商品分类" prop="cateId">
              <cate-cascader :checkStrictly="false" returnValue="cateId"  v-model="searchQuery.cateId" placeholder="商品分类"></cate-cascader>
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
              <brand-select v-model="searchQuery.brandId" placeholder="品牌"></brand-select>
            </el-form-item>
            <el-form-item label="规格编码" prop="skuSns">
              <batch-query-input  v-model="searchQuery.skuSns" placeholder="规格编码"  ></batch-query-input>
            </el-form-item>
            <el-form-item label="商品条码" prop="codeBars" >
              <batch-query-input  v-model="searchQuery.codeBars" placeholder="商品条码"  ></batch-query-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="searchQuery.name" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-form>
          <div class="mb10">
            <el-button type="primary" @click="query" >查询</el-button>
            <el-button type="primary" @click="getData" >刷新</el-button>
            <el-button type="primary" @click="reset" >重置</el-button>
          </div>
          <div class="tip" >
            备注：列表可选客户销售渠道授权商品信息，非客户销售渠道授权商品不展示
          </div>
        </div>
        <el-table ref="t" :data="tableList" width="100%" height="400px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品分类" prop="cateName"></el-table-column>
          <el-table-column label="品牌" prop="brandName"></el-table-column>
          <el-table-column label="商品条码" prop="codeBar"></el-table-column>
          <el-table-column label="商品名称" prop="name" width="400"></el-table-column>
          <el-table-column label="规格编码" prop="skuSn"></el-table-column>
          <el-table-column label="规格值" >
            <template slot-scope="scope">
              <div v-if="scope.row.firstAtbKey" >{{ scope.row.firstAtbKey + ':' +  scope.row.firstAtbValue}}</div>
              <div v-if="scope.row.secondAtbKey" >{{ scope.row.secondAtbKey + ':' +  scope.row.secondAtbValue}}</div>
            </template>
          </el-table-column>
        </el-table>
        <the-pagination
          :total="searchQuery.total"
          :pageSize="searchQuery.pageSize"
          :pageIndex="searchQuery.pageIndex"
          @onPageSizeChange="onPageSizeChange"
          @onPageIndexChange="onPageIndexChange"
        ></the-pagination>

        <span slot="footer" class="dialog-footer">
          <el-button  @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="onConfirm" :loading="loading" >确认</el-button>
        </span>
    </el-dialog>
  </span>
</template>

<script>
import BrandSelect from '@/components/Table/BrandSelect'
import CateCascader from '@/components/Table/CateCascader'
// CateCascader
import batchQueryInput from './batchQueryInput'
import thePagination from '@/components/Pagination'
import { goodsPage, batchSaveCoopGoods } from '@/api/coopGoods'
import { getMaxNumber } from "@/utils";
export default {
  name: 'addGoods',
  components: {batchQueryInput, thePagination, BrandSelect, CateCascader },
  data() {
    return {
      selectList: [],
      showDialog: false,
      tableList: [],
      loading: false,
      searchQuery: {
        brandId: '',
        cateId: '',
        skuSns: [],
        codeBars: [],
        name: '',
        pageSize: 10,
        pageIndex: 1,
        total: 0,
      },
    }
  },
  methods: {
    // #region 获取列表数据
    getData() {
      goodsPage(this.customerId, this.searchQuery)
        .then(res => {
          this.tableList = res.records || [];
          this.searchQuery.total = Number(res.total ) || 0;
          this.reSelect(this.selectList);
        })
    },
    reSelect(selectTempList){
      this.$nextTick(()=> {
        if(selectTempList&& selectTempList.length>0){
            this.tableList.forEach(item=> {
                selectTempList.forEach(item2 => {
                    if(item2===item.skuId){
                      this.$refs['t'].toggleRowSelection(item);
                    }
                });
              })
              selectTempList=[]
          }
      });
    },
    query() {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = 10;
      this.selectList = [];
      this.getData();
    },
    onPageSizeChange(val) {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = val;
      this.getData();
    },
    onPageIndexChange(val) {
      this.searchQuery.pageIndex = val;
      this.getData()
    },
    reset() {
      this.$refs['f'] && this.$refs['f'].resetFields();
      this.searchQuery.pageSize = 10;
      this.searchQuery.pageIndex = 1
      this.query();
    },
    // #endregion
    // #region 模态框事件
    show() {
      this.showDialog = true;
      this.selectList = [];
      this.reset();
    },
    onConfirm() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error("未选中商品，无法保存！");
        return; 
      }
      this.$confirm( `确认将这${this.selectList.length}个商品加入客户合作商品列表中吗？`, '添加商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let pam = {
            customerId: this.customerId,
            skuIds: this.selectList
          }
          this.loading = true
          batchSaveCoopGoods(pam)
            .then(res => {
              this.$message.success('保存成功！');
              this.showDialog = false;
              this.$emit('afterSuccess', res)
            })
            .finally(() => {
              this.loading = false
            })
        })

    },
    // #endregion
    handleSelectionChange(e) { // 选中处理
      this.selectList = this.selectList.filter(v => !this.tableList.find(item => item.skuId === v )) // 非当前页的选中的id
      this.selectList = this.selectList.concat(e.map(v => v.skuId)); // 非当前页选中的id + 当前选中的id
    },
  },
  props: {
    customerId: {
      type: [Number, String],
      default: 0
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .my_dialog_class{
  & > .el-dialog__body {
    padding-top: 8px;
    padding-bottom: 0;
  }
  
}
.tip {
  margin: 10px 0px;
  color: rgba(0,0,0, .45);
}
</style>