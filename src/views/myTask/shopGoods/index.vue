<template>
  <div class="shopGoods-page">
    <!--  -->
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" @click="addShopGoods" :disabled="isAdding"
            >新增</el-button
          >
          <el-button v-permission-button="'deleteAll'" type="primary" @click="deleteAll">删除</el-button>
          <el-button v-permission-button="'download'" type="warning" @click="downloadTemplate"
            >下载模板</el-button
          >
          <el-button
            type="danger"
            @click="importDialogVisible = true"
            v-permission-button="'import'"
            >导入</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ncCode" label="客户编码">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.id"
              v-model="model.ncCode"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户编码或客户名称"
              :remote-method="getCustomers"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.ncCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称">
          <template slot-scope="scope">
            <span v-if="!scope.row.id">{{ model.customerName }}</span>
            <span v-else>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="商品分类">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.id"
              v-model="model.categoryName"
              placeholder="请输入商品分类"
            ></el-input>
            <span v-else>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.id"
              v-model="model.brandName"
              placeholder="请输入品牌"
            ></el-input>
            <span v-else>{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="skuSn" label="规格编码">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.id"
              v-model="model.skuSn"
              filterable
              remote
              reserve-keyword
              placeholder="请输入规格编码或商品名称"
              :remote-method="getSkus"
              :loading="loading"
            >
              <el-option
                v-for="item in skuSnOrSpuNames"
                :key="item.skuId"
                :label="`${item.skuSn}` + ':' + `${item.spuName}` + ' ' + `${item.specString}`"
                :value="item.skuSn"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.skuSn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spuName" label="商品名称">
          <template slot-scope="scope">
            <span v-if="!scope.row.id">{{ model.spuName }}</span>
            <span v-else>{{ scope.row.spuName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="codeBar" label="商品条码">
          <template slot-scope="scope">
            <span v-if="!scope.row.id">{{ model.codeBar }}</span>
            <span v-else>{{ scope.row.codeBar }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="save()" v-if="!scope.row.id"
              >保存</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.checkedStatus != 0"
              @click="del(scope.row)"
               v-permission-button="'delete'" 
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <el-dialog title="导入声明" :visible.sync="importDialogVisible" width="30%">
      <p style="color: red">
        导入的商品信息必须是“文本”格式，特别注意客户编码，规格编码，商品条码
      </p>
      <p style="color: red">
        请保证录入数据的准确性，只有数据准备了才能够进行导入
      </p>
      <p style="color: red">
       选择文件后，请点击“预览”，认真校对数据的准确性。
      </p>
      <p style="color: red">
        只有在点击“预览”且数据准确的情况下，“导入”按钮才会出现”
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importShopGoods" :loading="loading"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getShopGoodsPages,
  getCategorysAndBrands as categorysAndBrands,
  downloadTemplate as download,
  choiceNcCodeOrCustomerName,
  choiceSkuSnOrSpuName,
  saveShopGoods,
  deleteShopGoods,
  deleteBatchShopGoods,
} from "@/api/shopGoods";
import { formatDate } from "@/utils";
import FileSaver from "file-saver";
export default {
  name: "ShopGoods",
  components: {},
  data() {
    return {
      skuSnOrSpuNames: [],
      options: [],
      ncCodesOrCustomerNames: [],
      tableData: [],
      categorys: [],
      brands: [],
      isAdding: false,
      filterable: true,
      remote: true,
      model: {},
      searchForm: [
        {
          key: "customerName",
          label: "客户名称",
          placeholder: "请输入客户名称",
          type: "input",
        },
        {
          key: "ncCode",
          label: "客户编码",
          placeholder: "请输入客户编码",
          type: "input",
        },
        {
          key: "categoryName",
          label: "商品分类",
          placeholder: "请选择商品分类",
          options: [],
          type: "select",
        },
        {
          key: "brandName",
          label: "品牌",
          placeholder: "请选择品牌",
          options: [],
          type: "select",
        },
        {
          key: "skuSn",
          label: "规格编码",
          placeholder: "请输入规格编码",
          type: "input",
        },
        {
          key: "spuName",
          label: "商品名称",
          placeholder: "请输入商品名称",
          type: "input",
        },
        {
          key: "codeBar",
          label: "商品条码",
          placeholder: "请输入商品条码",
          type: "input",
        },
      ],
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0, // 总条数
      },
      isAdd: false,
      importDialogVisible: false,
      tableLoading: false,
      loading: false,
      ids: [],
    };
  },
  computed: {},
  created() {
    this.fetchTableData(); // 加载表格数据
    this.getCategorysAndBrands();
  },
  mounted() {},
  methods: {
    // 加载表格数据
    async fetchTableData() {
      this.tableData = [];
      this.tableLoading = true;
      let params = this.searchQuery;
      getShopGoodsPages(params).then((res) => {
        if (res) {
          this.tableData = res.list;
          this.searchQuery.total = res.count;
        }
      });
      this.tableLoading = false;
    },
    // 获取分类和品牌
    getCategorysAndBrands() {
      categorysAndBrands().then((res) => {
        this.searchForm[2].options = [];
        this.searchForm[3].options = [];
        this.categorys = res.categorys;
        this.brands = res.brands;
        this.categorys.forEach((res) => {
          let category = {};
          category.label = res;
          category.value = res;
          this.searchForm[2].options.push(category);
        });
        this.brands.forEach((res) => {
          let brand = {};
          brand.label = res;
          brand.value = res;
          this.searchForm[3].options.push(brand);
        });
      });
    },
    onChange() {
      this.fetchTableData();
      this.getCategorysAndBrands();
    },
    // 下载模板
    downloadTemplate() {
      download()
        .then((blob) => {
          let fileName = `门店商品信息维护表${formatDate(
            new Date().getTime(),
            "Y-M-D h:m"
          )}`;
          FileSaver.saveAs(blob, fileName + ".xlsx");
        })
        .catch((error) => {
          this.$message("下载模板失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //新增门店商品
    addShopGoods() {
      this.isAdding = true;
      this.model = {};
      this.isAdd = true;
      this.tableData.unshift({});
      this.isAdd = false;
    },
    getCustomers(content) {
      let params = {
        pageIndex: 1,
        pageSize: 10,
      };
      params.content = content;
      choiceNcCodeOrCustomerName(params).then((res) => {
        console.log("res", res);
        if (res) {
          this.ncCodesOrCustomerNames = res.list;
          this.options = res.list.map((item) => {
            return {
              value: `${item.ncCode}`,
              label: `${item.ncCode}:${item.customerName}`,
            };
          });
        } else {
          this.options = [];
        }
      });
    },
    getSkus(content) {
      let params = {
        pageIndex: 1,
        pageSize: 10,
      };
      params.content = content;
      choiceSkuSnOrSpuName(params).then((res) => {
        if (res) {
          this.skuSnOrSpuNames = res.list;
        } else {
          this.skuSnOrSpuNames = [];
        }
        console.log("skuSnOrSpuNames", this.skuSnOrSpuNames);
      });
    },

    // 保存新增门店商品
    save() {
      if (!this.checkModel()) {
        return;
      }
      let param = this.model;
      saveShopGoods(param)
        .then((r) => {
          this.$message.success("保存成功");
          this.isAdding = false;
          this.fetchTableData();
        })
        .catch(() => {
          this.$message.error("保存失败！");
        });
    },
    // 批量删除
    deleteAll() {
      if (this.ids.length == 0) {
        this.$message.warning("请勾选需要删除的数据");
        return;
      }

      this.$confirm(
        "此操作将删除当前勾选数据, 档案删除后不可恢复，是否确认删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          console.log("ids", this.ids);
          deleteBatchShopGoods(this.ids).then(() => {
            this.$message.success("删除成功");
            this.fetchTableData();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    handleSelectionChange(selection) {
      this.ids = selection
        .filter((item) => item.id)
        .map((item) => {
          return item.id;
        });
    },
    // 删除单个
    del(item) {
      this.$confirm("档案删除后不可恢复，是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (item.id) {
            deleteShopGoods(item.id)
              .then(() => {
                this.$message.success("删除成功");
                this.fetchTableData();
              })
              .catch(() => {
                this.$message.error("删除失败");
              });
          } else {
            this.tableData.shift();
            this.isAdding = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 导入
    importShopGoods() {
      this.importDialogVisible = false;
      const view = this.$instantCompt(require("./import/index.vue").default);
      view.show();
      // 监听导入成功事件
      this.$eventHub.$on("importShopGoodsSuccess", (res) => {
        // 导入成功后刷新列表
        console.log('页面数据')
        this.fetchTableData();
        // 隐藏弹窗
        view.hide();
      });
    },

    checkModel() {
      if (!this.model.ncCode) {
        this.$message.warning("请填入客户编码");
        return false;
      }
      if (!this.model.customerId) {
        this.$message.warning("请选择正确客户编码");
      }
      if (!this.model.categoryName) {
        this.$message.warning("请填入商品分类");
        return false;
      }
      if (!this.model.brandName) {
        this.$message.warning("请填入品牌");
        return false;
      }
      if (!this.model.skuSn) {
        this.$message.warning("请填入规格编码");
        return false;
      }
      if (!this.model.skuId) {
        this.$message.warning("请选择正确规格编码");
      }
      return true;
    }
  },
  watch: {
    "model.ncCode": {
      handler(newVal, oldVal) {
        if (newVal) {
          let customer = this.ncCodesOrCustomerNames.filter(
            (item) => item.ncCode === newVal
          );
          console.log("customer", customer);
          this.model.customerName = customer[0].customerName;
          this.model.customerId = customer[0].customerId;
        }
      },
    },
    "model.skuSn": {
      handler(newVal, oldVal) {
        if (newVal) {
          let sku = this.skuSnOrSpuNames.filter(
            (item) => item.skuSn === newVal
          );
          console.log("sku", sku);
          this.model.spuName = sku[0].spuName;
          this.model.codeBar = sku[0].codeBar;
          this.model.skuId = sku[0].skuId;
          this.model.spuId = sku[0].spuId;
        }
        console.log("model", this.model);
      },
    },
  },
};
</script>

<style lang='scss' scoped>
p {
  margin: 0;
  padding: 0;
}
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
.must:before {
  content: "* ";
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: "* ";
  color: #ff1818;
}
.btn {
  width: 18%;
  padding-top: 20px;
}
.add-btn {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin: auto;
}
.inputs {
  width: 200px;
}
.content {
  width: 450px;
}
.contents {
  width: 300px;
}
.div-one {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
/deep/
  .el-calendar__button-group
  .el-button-group
  .el-button:nth-child(2)
  span {
  color: transparent !important;
  &::after {
    content: "本月";
    color: #606266;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}
</style>

