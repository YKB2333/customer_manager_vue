<template>
  <the-dialog
    :close-on-click-modal="false"
    ref="dialog"
    title="导入"
    @close="whenClose"
  >
    <el-upload
      action="#"
      :on-remove="handleRemove"
      :httpRequest="uploadRequest"
      :multiple="false"
      :limit="1"
      accept=".xls,.xlsx"
    >
      <el-button size="mini" type="primary" :disabled="file !== null"
        >选择文件</el-button
      >
    </el-upload>

    <el-button
      class="mt30"
      type="success"
      size="mini"
      @click="onSubmit"
      :loading="loading"
      :disabled="file === null"
    >
      {{ loading ? "加载中" : "预览" }}
    </el-button>
    <el-button
      class="mt30"
      type="success"
      size="mini"
      @click="saveBatch"
      :loading="loading"
      v-if="allowImport"
    >
      {{ loading ? "正在导入" : "导入" }}
    </el-button>
    <el-table
      :data="tableData"
      v-if="true"
      height="500px"
      border
      style="width: 900px"
    >
      <el-table-column
        prop="tip"
        label="验证信息"
        width="100"
      ></el-table-column>
      <el-table-column prop="ncCode" label="客户编码" width="100">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="180">
      </el-table-column>
      <el-table-column prop="categoryName" label="商品分类"> </el-table-column>
      <el-table-column prop="brandName" label="品牌"> </el-table-column>
      <el-table-column prop="skuSn" label="规格编码"> </el-table-column>
      <el-table-column prop="spuName" label="商品名称"> </el-table-column>
      <el-table-column prop="codeBar" label="商品条码"> </el-table-column>
    </el-table>
  </the-dialog>
</template>

<script>
import TheDialog from "@/components/Dialog";
import { importShopGoods, saveBatchShopGoods } from "@/api/shopGoods";

export default {
  name: "ProductImport",
  components: { TheDialog },
  data() {
    return {
      allowImport: false,
      tableData: [],
      loading: false,
      // 要上传的文件
      file: null,
    };
  },
  computed: {},
  created() {},
  methods: {
    saveBatch() {
      this.loading = true;
      saveBatchShopGoods(this.tableData)
        .then((res) => {
          this.$message.success("导入成功");
          this.$eventHub.$emit("importShopGoodsSuccess", res);
        })
        .catch((e) => {
          this.$message.error(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    show() {
      this.$refs["dialog"].show();
    },
    hide() {
      this.$refs["dialog"].hide();
    },
    uploadRequest(data) {
      // console.info(data)
      // 获取选择的文件
      this.file = data.file;
    },
    // 预览
    onSubmit() {
      this.allowImport = false;
      let formData = new FormData();
      formData.append("file", this.file);
      this.loading = true;
      importShopGoods(formData)
        .then((res) => {
          this.tableData = res;
          let one = this.tableData.filter((item) => {
            return item.tip;
          });
          if (one.length === 0) {
            this.allowImport = true;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 删除时触发
    handleRemove(file, fileList) {
      this.file = null;
      this.tableData = [];
    },
    whenClose() {
      // 注销bus事件
      this.$eventHub.$off("importShopGoodsSuccess");
    },
  },
};
</script>

<style lang="scss">
.custom-dialog-class-1 {
  height: auto !important;
}
</style>
