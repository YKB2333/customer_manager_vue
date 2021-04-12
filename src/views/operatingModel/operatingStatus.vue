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
        <el-table-column prop="baseInfoName" label="客户名称"></el-table-column>
        <el-table-column prop="industryRank" label="行业排行"></el-table-column>
        <el-table-column prop="industryShare" label="行业份额"></el-table-column>
        <el-table-column prop="annualSales" label="年度销售额"></el-table-column>
        <el-table-column prop="targetAndPlan" label="发展目标与计划"></el-table-column>
        <el-table-column prop="targetGroups" label="目标客户群体"></el-table-column>
        <el-table-column prop="mainCategory" label="主营品类"></el-table-column>
        <el-table-column prop="mainCategoryPro" label="主营品类销售占比"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
           <!-- <el-button type="text" @click="showAttaDialog(scope.row)">上传附件</el-button>-->
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
      <el-form :model="saveForm" :rules="rules" ref="saveForm" :label-width="labelWidth" inline>
        <el-form-item label="客户" prop="baseInfoId">
          <el-select
            v-model="saveForm.baseInfoId"
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
        <el-form-item label="行业排名" >
          <el-input v-model="saveForm.industryRank" placeholder="请输入行业排名" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="行业份额" >
          <el-input v-model="saveForm.industryShare" placeholder="请输入行业份额" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="年度销售额(万)" >
          <el-input v-model="saveForm.annualSales" placeholder="请输入年度销售额"  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="发展目标与计划" >
          <el-input v-model="saveForm.targetAndPlan" placeholder="请输入发展目标与计划" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="目标群体" >
          <el-input v-model="saveForm.targetGroups" placeholder="请输入目标群体" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="主营品类" >
          <el-input v-model="saveForm.mainCategory" placeholder="请输入主营品类" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="主营品类销售占比" >
          <el-input v-model="saveForm.mainCategoryPro" placeholder="请输入主营品类销售占比" :style="inputStyle"></el-input>
        </el-form-item>
       <!-- <el-form-item label="活动方案" prop="content">
          <el-input
            type="textarea"
            v-model="saveForm.programme"
            placeholder="请输入详细内容"
            :style="inputStyle"
            :rows="8"
          ></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="align-center">
        <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
    <!--附件上传-->
   <!-- <my-dialog title="附件列表" v-model="attaDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="attaDialogVisible"
        v-model="attaList"
        :uploadOss="uploadOperateOss"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>-->
  </div>
</template>

<script>
import {
  add,update,del,page
} from "@/api/operatingModel";
import { getAllBaseInfoList,getEnableList } from "@/api/baseInfo";
import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "Activity",
  components: {},
  data() {
    return {
      labelWidth: "120px",
      inputStyle: { width: "220px" },
      searchForm: [
        {
          key: "baseInfoName",
          placeholder: "请输入客户名称",
          type: "input"
        },
      ],
      searchQuery: {
        baseInfoName: "",
        title: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      baseInfoData: [],
      dialogVisible: false,
      saveBtnLoading: false, // 保存按钮的loading状态
      saveForm: {
         id:'',
         baseInfoId:'',//客户id
        baseInfoName:'',//客户名字
        industryRank:'',//行业排名
        industryShare:'',//行业份额
        annualSales:'',//年度销售额
        targetAndPlan:'',//发展目标与计划
        targetGroups:'',//目标客群
        mainCategory:'',//主要品类
        mainCategoryPro:'',//主要品类销售占比
      },
      rules: {
        baseInfoId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        /*title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        titleImage: [
          { required: true, message: "请添加活动图片", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择活动开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择活动结束时间", trigger: "blur" }
        ]*/
      },
      currentRow: null,
      attaDialogVisible: false,
      attaList: [],
      editTpye:null,
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
    uploadOperateOss,
    uploadGoodsImages,
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return page(this.searchQuery)
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
      return getEnableList().then(res => {
        this.baseInfoData = res;
      });
    },
    add() {
      this.dialogVisible = true;
      this.editTpye = "add";
    },
    edit(item) {
      this.saveForm = this.$lodash.cloneDeep(item);
      this.saveForm.baseInfoId = this.saveForm.baseInfoId+'';
      this.dialogVisible = true;
      console.log("update",this.saveForm);
      this.editTpye = "update";
    },
    // 保存提交
    submit() {
      console.log("aaaa")
      if (this.editTpye==="add"){
        this.$refs.saveForm.validate(valid => {
          if (!valid) return false;
          this.saveBtnLoading = true;
          console.log("save",this.saveForm)
          add(this.saveForm)
            .then(res => {
              this.$message.success("添加成功");
              this.fetchTableData();
              this.closeDialog();
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
        });
      }else {
        this.$refs.saveForm.validate(valid => {
          if (!valid) return false;
          this.saveBtnLoading = true;
          console.log("save",this.saveForm)
          update(this.saveForm)
            .then(res => {
              this.$message.success("修改成功");
              this.fetchTableData();
              this.closeDialog();
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
        });
      }

    },
    closeDialog() {
      this.saveForm = {};
      this.dialogVisible = false;
      this.$refs['saveForm'].clearValidate();
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        del(item.id + "").then(res => {
          this.$message.success("删除成功");
          this.fetchTableData();
        });
      });
    },
    showAttaDialog(row) {
      getAttaList(row.id).then(res => {
        res.forEach(r => {
          r.id += "";
        });
        this.currentRow = row;
        this.attaList = res;
        this.attaDialogVisible = true;
      });
    },
    closeAttaDialog() {
      this.currentRow = null;
      this.attaList = [];
      this.attaDialogVisible = false;
      this.fetchTableData();
    },
  }
};
</script>
