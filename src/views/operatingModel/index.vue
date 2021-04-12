<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" @click="dialogType = 'add';dialogVisible = true">新增</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" :index="indexMethod" label="序号" width="60"></el-table-column>
        <el-table-column prop="logo" label="平台LOGO" width="100">
          <template slot-scope="scope">
            <div style="text-align: center">
              <img
                :src="scope.row.logo || require('@/assets/images/logo.png')"
                width="60"
                height="60"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="platformName" label="平台名称"></el-table-column>
        <el-table-column prop="custName" label="客户名称"></el-table-column>
        <el-table-column label="规则概述" width="120" prop="ruleDesc" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="资源获取方式附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showResAcqDialog(scope.row)">{{ scope.row.resAcqCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活动日历附件">
          <template slot-scope="scope">
            <el-tag
              class="pointer"
              @click="showScheduleDialog(scope.row)"
            >{{ scope.row.scheduleCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status == 0">草稿</el-tag>
            <el-tag type="success" v-if="scope.row.status == 1">发布</el-tag>
            <el-tag type="warning" v-if="scope.row.status == 2">下线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTimestamp"
          sortable
          :formatter="(row)=>$formatDate(row.createTimestamp, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <my-popover-button
              v-if="scope.row.status == 1"
              v-permission-button="'offline'"
              type="text"
              @confirm="disOperatingModel(scope.row)"
            >下线</my-popover-button>
            <my-popover-button v-else v-permission-button="'offline'" type="text" @confirm="releaseOperatingModel(scope.row)">发布</my-popover-button>
            <el-button v-permission-button="'edit'" type="text" @click="editOperatingModel(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="deleteOperatingModel(scope.row, scope.$index)">删除</el-button>
            <el-button v-permission-button="'uploadResource'" type="text" @click="showResAcqDialog(scope.row)">上传资源获取方式</el-button>
            <el-button v-permission-button="'uploadEvent'" type="text" @click="showScheduleDialog(scope.row)">上传活动日历</el-button>
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
      @close="resetForm('ruleForm')"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        inline
        style="width: 700px"
      >
        <el-form-item label="所属客户" prop="baseInfoId2Str">
          <el-select
            v-model="ruleForm.baseInfoId2Str"
            filterable
            placeholder="请选择客户"
            style="width: 300px"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台Logo" prop="logo" style="display: block">
          <upload-image
            ref="uploadImage"
            url="/uploadOperatingModelAttaFile"
            tip="建议尺寸: 100*100，或正方型图片"
            v-model="ruleForm.logo"
          >
          </upload-image>
        <!--  <div >
            <simple-file v-model="ruleForm.logo" :uploadOss="uploadOperateOss"></simple-file>
          </div>-->
        </el-form-item>
        <el-form-item label="平台名称" prop="platformName">
          <el-input v-model="ruleForm.platformName" placeholder="请输入" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="tag">
          <el-input v-model="ruleForm.tag" placeholder="请输入" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="规则概述" prop="ruleDesc" style="display: block">
          <el-input
            type="textarea"
            v-model="ruleForm.ruleDesc"
            placeholder="请输入"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item style="display: block; text-align: left; padding-left: 80px">
          <el-button type="primary" :loading="saveBtnLoading" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
    <!-- 附件列表弹窗 -->
    <my-dialog title="资源获取方式附件" v-model="resAcqDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="resAcqDialogVisible"
        v-model="resAcqAttaList"
        :uploadOss="uploadOperateOss"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>
    <my-dialog title="活动日历附件" v-model="scheduleDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="scheduleDialogVisible"
        v-model="scheduleAttaList"
        :uploadOss="uploadOperateOss"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>
  </div>
</template>

<script>
import {
  getOperatingModelList,
  addOperatingModel,
  updateOperatingModel,
  deleteOperatingModel,
  release,
  offline,
  getResAcqAtta,
  getScheduleAtta,
  addAtta,
  deleteAtta
} from "@/api/operatingModel";
import { getAllBaseInfoList } from "@/api/baseInfo";
import { uploadOperateOss } from "@/api/uploadOss";
import UploadImage from '../../components/UploadImage'

export default {
  name: "OperatingModel",
  components: { UploadImage },
  data() {
    return {
      uploadOperateOss,
    /*  inputStyle: { width: "220px" },*/
      searchForm: [
        {
          key: "platformName",
          placeholder: "平台名称",
          type: "input"
        },
        {
          key: "status",
          placeholder: "状态",
          options: [
            { label: "全部", value: "" },
            { label: "草稿", value: 0 },
            { label: "发布", value: 1 },
            { label: "下线", value: 2 }
          ],
          type: "select"
        }
      ],
      tableLoading: false,
      searchQuery: {
        platformName: "",
        status: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableData: [], // 表格数据
      baseInfoData: [],
      dialogVisible: false,
      dialogType: "add", // 弹窗类型：新增add、编辑edit
      ruleForm: {
        platformName: "",
        logo: "",
        baseInfoId2Str: null,
        ruleDesc: ""
      },
      rules: {
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" }
        ],
        ruleDesc: [
          { required: true, message: "请输入规则概述", trigger: "blur" }
        ],
        baseInfoId2Str: [
          { required: true, message: "请选择客户", trigger: "change" }
        ]
      },
      currentRow: null, // 当前编辑项数据
      currentIndex: 0,
      attaType: null,
      resAcqDialogVisible: false,
      resAcqAttaList: [],
      scheduleDialogVisible: false,
      scheduleAttaList: [],
      attaForm: null,
      saveBtnLoading: false // 保存按钮的loading状态
    };
  },
  async created() {
    await this.fetchTableData();
    this.fetchBaseInfoData();
  },
  computed: {
    dialogTitle() {
      if (this.dialogType === "add") {
        return "添加运营方式";
      } else if (this.dialogType === "edit") {
        return "编辑运营方式";
      }

      return "";
    }
  },
  methods: {
    onChange() {
      this.fetchTableData();
    },
    fetchBaseInfoData() {
      return getAllBaseInfoList().then(res => {
        this.baseInfoData = res;
      });
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getOperatingModelList(this.searchQuery)
        .then(res => {
          this.searchQuery.total = res.total; // 总条数
          this.tableData = res.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    disOperatingModel(item) {
      // console.log(item)
      offline(item.id).then(res => {
        this.$message.success("禁用成功");
        item.status = 2;
      });
    },
    releaseOperatingModel(item) {
      // console.log(item)
      release(item.id).then(res => {
        this.$message.success("发布成功");
        item.status = 1;
      });
    },
    editOperatingModel(item, index) {
      // console.log(item)
      this.currentRow = item;
      this.currentIndex = index;
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.ruleForm = this.$lodash.cloneDeep(item);
      });
    },
    deleteOperatingModel(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOperatingModel(item.id).then(res => {
            this.$message.success("删除成功");
            this.fetchTableData();
          });
        })
        .catch(() => {});
    },
    indexMethod(index) {
      // 序号
      return (
        this.searchQuery.pageSize * (this.searchQuery.pageIndex - 1) +
        (index + 1)
      );
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saveBtnLoading = true;
          if (this.dialogType === "add") {
            // 添加
            addOperatingModel(this.ruleForm)
              .then(res => {
                // console.log(res)
                this.$message.success("添加成功");
                this.resetForm("ruleForm");
                this.fetchTableData();
              })
              .finally(() => {
                this.saveBtnLoading = false;
              });
          } else if (this.dialogType === "edit") {
            // 编辑
            let params = this.$lodash.cloneDeep(this.ruleForm);
            params.id = this.currentRow.id;
            updateOperatingModel(params)
              .then(res => {
                this.$set(this.tableData, this.currentIndex, params);
                this.$message.success("修改成功");
                this.resetForm("ruleForm");
                this.fetchTableData();
              })
              .finally(() => {
                this.saveBtnLoading = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    showResAcqDialog(row) {
      this.currentRow = row;
      this.attaType = 1;
      getResAcqAtta(row.id).then(res => {
        this.resAcqAttaList = res;
        this.resAcqDialogVisible = true;
      });
    },
    showScheduleDialog(row) {
      this.currentRow = row;
      this.attaType = 2;
      getScheduleAtta(row.id).then(res => {
        this.scheduleAttaList = res;
        this.scheduleDialogVisible = true;
      });
    },
    closeAttaDialog() {
      this.currentRow = null;
      this.resAcqAttaList = [];
      this.scheduleAttaList = [];
      this.scheduleDialogVisible = false;
      this.resAcqDialogVisible = false;
      this.fetchTableData();
    },
    delAtta(atta) {
      return new Promise((resolve, reject) => {
        deleteAtta(atta.id)
          .then(res => {
            if (this.attaType == 1) {
              getResAcqAtta(this.currentRow.id).then(res => {
                resolve(res);
              });
            } else {
              getScheduleAtta(this.currentRow.id).then(res => {
                resolve(res);
              });
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    addAtta(atta) {
      return new Promise((resolve, reject) => {
        atta.operatingModelId = this.currentRow.id;
        atta.type = this.attaType;
        addAtta(atta)
          .then(res => {
            if (this.attaType == 1) {
              getResAcqAtta(this.currentRow.id).then(res => {
                resolve(res);
              });
            } else {
              getScheduleAtta(this.currentRow.id).then(res => {
                resolve(res);
              });
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }
};
</script>
