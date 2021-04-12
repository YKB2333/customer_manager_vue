<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" @click="add">新增</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="cname" label="客户"></el-table-column>
        <el-table-column prop="name" label="新品名称"></el-table-column>
        <el-table-column prop="image" label="新品图片">
          <template slot-scope="scope">
            <img
              style="width:100px;height:100px;cursor: pointer;"
              :src="scope.row.image"
              @click="handleDownload(scope.row.image)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaList(scope.row)">{{ scope.row.attaCount}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column prop="content" label="详细内容" :show-overflow-tooltip="true" width="300"></el-table-column>
        <el-table-column label="上市时间" :formatter="(row)=>$formatDate(row.marketTime, 'Y/M/D')"></el-table-column>
        <el-table-column
          label="创建时间"
          :formatter="(row)=>$formatDate(row.createTimestamp, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            <!-- <el-button type="text" @click="showUploadResAcqAtta(scope.row)">上传附件</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="800px"
      max-height
      @close="closeDialog"
    >
      <el-form
        :model="saveForm"
        :rules="rules"
        ref="saveForm"
        :label-width="labelWidth"
        inline
        style="width: 700px"
      >
        <el-form-item label="客户" prop="name">
          <el-select
            v-model="saveForm.customerId"
            filterable
            placeholder="请选择客户"
            :style="inputStyle"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新品名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="请输入新品名称" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="新品图片" prop="image">
          <div :style="inputStyle">
            <simple-file v-model="saveForm.image" :uploadOss="uploadGoodsImages"></simple-file>
          </div>
        </el-form-item>
        <el-form-item label="详细内容" prop="content">
          <el-input
            type="textarea"
            v-model="saveForm.content"
            placeholder="请输入详细内容"
            :rows="8"
            :style="inputStyle"
          ></el-input>
        </el-form-item>
        <el-form-item label="上市时间" prop="marketTime">
          <el-date-picker
            v-model="saveForm.marketTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="align-center">
        <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import {
  getProductNewsList,
  saveProductNews,
  deleteProductNews
} from "@/api/productNews";
import { getAllBaseInfoList } from "@/api/baseInfo";
import { uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "ProductNews",
  components: {},
  data() {
    return {
      labelWidth: "100px",
      inputStyle: { width: "220px" },
      searchForm: [
        {
          key: "customerId",
          placeholder: "请输入客户ID",
          type: "input"
        },
        {
          key: "name",
          placeholder: "请输入新品名称",
          type: "input"
        }
      ],
      searchQuery: {
        customerId: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      baseInfoData: [],
      saveForm: {
        id: null,
        customerId: null,
        name: null,
        image: null,
        content: null,
        marketTime: null
      },
      rules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入新品名称", trigger: "blur" }],
        image: [{ required: true, message: "请选择新品图片", trigger: "blur" }],
        marketTime: [
          { required: true, message: "请选择新品上市时间", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      saveBtnLoading: false // 保存按钮的loading状态
    };
  },
  async created() {
    await this.fetchTableData();
    this.fetchBaseInfoData();
  },
  computed: {
    dialogTitle() {
      return this.saveForm.id == null ? "新增" : "编辑";
    }
  },
  methods: {
    uploadGoodsImages,
    handleDownload(path) {
      window.open(path, "_blank");
    },
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getProductNewsList(this.searchQuery)
        .then(res => {
          this.searchQuery.total = res.total; // 总条数
          res.records.forEach(r => {
            r.customerId += "";
            r.id += "";
          });
          this.tableData = res.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    fetchBaseInfoData() {
      return getAllBaseInfoList().then(res => {
        this.baseInfoData = res;
      });
    },
    add() {
      this.dialogVisible = true;
    },
    edit(item) {
      this.saveForm = this.$lodash.cloneDeep(item);
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.saveForm = {};
      this.$refs['saveForm'].clearValidate();
    },
    // 保存提交
    submit() {
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        saveProductNews(this.saveForm)
          .then(res => {
            this.$message.success("添加成功");
            this.fetchTableData();
            this.closeDialog();
          })
          .finally(() => {
            this.saveBtnLoading = false;
          });
      });
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProductNews(item.id + "").then(res => {
          this.$message.success("删除成功");
          this.fetchTableData();
        });
      });
    }
  }
};
</script>
