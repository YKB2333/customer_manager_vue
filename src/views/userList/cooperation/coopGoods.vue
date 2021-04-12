<template>
  <div>
    <div style="width: 90%;margin:0 auto">
      <el-form ref="f" :model="searchQuery" inline label-width="150" >
        <el-form-item label="商品分类" prop="cateId">
          <cate-cascader :checkStrictly="false" returnValue="cateId" v-model="searchQuery.cateId" placeholder="商品分类"></cate-cascader>
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
        <el-button type="primary" @click="getData" >查询</el-button>
        <el-button type="primary" @click="getData" >刷新</el-button>
        <el-button type="primary" @click="reset" >重置</el-button>
        <el-button type="primary" v-permission-button="'syncFromNC'" @click="syncFromNC">同步NC商品</el-button>
        <el-button type="primary" v-permission-button="'syncFromChannelPrice'" @click="syncFromChannelPrice" >同步历史合作商品</el-button>
        <add-goods class="mlr10" v-permission-button="'add'" :customerId="this.searchQuery.customerId" @afterSuccess="reset" ></add-goods>
        <el-button type="primary" v-permission-button="'exportCoopGoods'" @click="exportCoopGoods" :loading="expotLoading" >导出</el-button>
        <el-button type="primary" v-permission-button="'downloadTpl'" @click="downloadTpl" >模板下载</el-button>
        <el-upload v-permission-button="'importCoopGoods'" action="#" :http-request="onImport" :show-file-list="false" class="mlr10" 
        style="display:inline" >
            <el-button type="primary" >导入</el-button>
        </el-upload>
        <!-- <el-button type="primary" v-permission-button="'importCoopGoods'" @click="importDialogVisible = true" >导入</el-button> -->
      </div>
    </div>


    <el-table :data="tableList" border width="100%" height="400px" >
      <el-table-column label="商品分类" prop="cateName" width="100"></el-table-column>
      <el-table-column label="品牌" prop="brandName" width="140"></el-table-column>
      <el-table-column label="商品条码" prop="codeBar" width="130"></el-table-column>
      <el-table-column label="商品名称" prop="name" width="400"></el-table-column>
      <el-table-column label="规格编码" prop="skuSn" width="130"></el-table-column>
      <el-table-column label="规格值" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.firstAtbKey" >{{ scope.row.firstAtbKey + ':' +  scope.row.firstAtbValue}}</div>
          <div v-if="scope.row.secondAtbKey" >{{ scope.row.secondAtbKey + ':' +  scope.row.secondAtbValue}}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.skuTitleImage || scope.row.spuTitleImage || require('@/assets/images/logo.png')" style="max-width: 30px; max-height: 30px;">
              <el-image :src="scope.row.skuTitleImage || scope.row.spuTitleImage || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope" >
          <el-button type="text" v-permission-button="'delete'" @click="remove(scope.row)" >删除</el-button>
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
  </div>
</template>

<script>
import BrandSelect from '@/components/Table/BrandSelect'
import CateCascader from '@/components/Table/CateCascader'
import  addGoods from './addGoods'
import batchQueryInput from './batchQueryInput'
import thePagination from '@/components/Pagination'
import {getCoopGoods, syncFromNC, syncFromChannelPrice, deleteCoopGoods, exportCoopGoods, downloadTpl, importCoopGoods } from '@/api/coopGoods'
import { getBrandList } from "@/api/brand";
import { getMaxNumber, formatDate } from "@/utils";
import FileSaver from 'file-saver'

export default {
  name: 'coopGoods',
  components: {batchQueryInput, thePagination, BrandSelect, CateCascader, addGoods },
  data() {
    return {
      expotLoading: false,
      tableList: [],
      searchQuery: {
        brandId: '',
        cateId: '',
        customerId: '',
        skuSns: [],
        codeBars: [],
        name: '',
        pageSize: 10,
        pageIndex: 1,
        total: 0,
      },
      cateList: [],
      brandList: []
    }
  },
  methods: {
    // #region 数据获取
    query() {
      this.searchQuery.pageIndex = 1;
      this.getData()
    },
    getData() {
      this.searchQuery.customerId = this.customerId
      getCoopGoods(this.searchQuery)
        .then(res => {
          this.tableList = res.records || [];
          this.searchQuery.total = res.total || 0;
        })
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
      this.$refs['f'].resetFields();
      this.searchQuery.pageSize = 10;
      this.searchQuery.pageIndex = 1
      this.getData();
    },
    // #endregion
    // #region 操作
    remove(good) { //删除
      this.$confirm('确认刪除该合作商品吗？', '删除合作商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 
        let params = {
          customerId: this.customerId,
          skuIds: [
            good.skuId
          ]
        }
        console.log(params);
        deleteCoopGoods(params)
          .then(res => {
              this.$message({
                type: "success",
                message: `删除成功!`
              });
              this.getData();
          })
      })
    },
    syncFromNC() { // 同步NC商品信息
      this.$confirm('确认同步NC客户商品信息吗？', '同步NC商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncFromNC(this.customerId)
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: `同步${res || 0}个商品!`
              });
              this.getData();
              // console.log(res);
            })
        })

    },
    syncFromChannelPrice() { // 同步历史合作商品信息
      this.$confirm('确认同步历史合作商品信息吗？', '同步历史合作商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncFromChannelPrice(this.customerId)
            .then(res => {
              this.$message({
                type: "success",
                message: `同步${res || 0}个商品!`
              });
              this.getData();
              // console.log(res);
            })
        })
    },
    exportCoopGoods() { // 导出功能
      this.searchQuery.customerId = this.customerId
      console.log(this.searchQuery);
      this.expotLoading = true;
      exportCoopGoods(this.searchQuery) 
        .then(blob => {
          console.log(this.searchQuery);
          let fileName = `客户合作商品${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.xlsx')
          this.$message.success('导出成功!')
        })
        .finally(() => {
          this.expotLoading = false;
        })
    },
    downloadTpl() {
      downloadTpl()
        .then(blob => {
          let fileName = '客户合作商品导入模版';
          FileSaver.saveAs(blob, fileName + '.xlsx')
          this.$message.success('导出成功!')
        })
    },
    onImport(data){
      const formData = new FormData()
      formData.append("file", data.file);
      importCoopGoods(this.customerId, formData)
        .then(res => {
          console.log(res);
          this.$message.success('导入成功！');
          this.getData();
        })
    },
    // #endregion 
  },
  props: {
    customerId: {
      type: [Number, String],
      default: 0
    }
  },
}
</script>

<style>

</style>