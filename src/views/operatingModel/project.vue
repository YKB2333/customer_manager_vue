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
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="leader" label="负责人"></el-table-column>
        <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaDialog(scope.row)">{{ scope.row.attaCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="详细内容" :show-overflow-tooltip="true" width="300"></el-table-column>
        <el-table-column label="项目启动时间" :formatter="(row)=>$formatDate(row.startTime, 'Y/M/D')"></el-table-column>
        <el-table-column
          label="创建时间"
          :formatter="(row)=>$formatDate(row.createTimestamp, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            <el-button v-permission-button="'uploda'" type="text" @click="showAttaDialog(scope.row)">上传附件</el-button>
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
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="请输入项目名称" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="saveForm.leader" placeholder="请输入负责人" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="启动时间" prop="startTime">
          <el-date-picker
            v-model="saveForm.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="详细内容" prop="content">
          <el-input
            type="textarea"
            v-model="saveForm.content"
            placeholder="请输入详细内容"
            :style="inputStyle"
            :rows="6"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="align-center">
        <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
    <!--附件上传-->
    <my-dialog title="附件列表" v-model="attaDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="attaDialogVisible"
        v-model="attaList"
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
  getProjectList,
  saveProject,
  deleteProject,
  getAttaList,
  addAtta,
  deleteAtta
} from "@/api/project";
import { getAllBaseInfoList } from "@/api/baseInfo";
import { uploadOperateOss } from "@/api/uploadOss";
export default {
  name: "Project",
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
          placeholder: "请输入项目名称",
          type: "input"
        },
        {
          key: "leader",
          placeholder: "请输入负责人",
          type: "input"
        }
      ],
      searchQuery: {
        customerId: "",
        name: "",
        leader: "",
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
        id: null,
        customerId: null,
        name: null,
        leader: null,
        content: null,
        startTime: null
      },
      rules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        leader: [
          { required: true, message: "请输入项目负责人", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择项目启动时间", trigger: "blur" }
        ]
      },
      currentRow: null,
      attaDialogVisible: false,
      attaList: []
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
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getProjectList(this.searchQuery)
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
    // 保存提交
    submit() {
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        saveProject(this.saveForm)
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
    closeDialog() {
      this.saveForm = {};
      this.dialogVisible = false;
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProject(item.id + "").then(res => {
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
      this.fetchTableData()
    },
    delAtta(atta) {
      debugger
      return new Promise((resolve, reject) => {
        deleteAtta(atta.id).then(res => {
          getAttaList(atta.projectId)
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
        });
      });
    },
    addAtta(atta) {
      debugger
      return new Promise((resolve, reject) => {
        atta.projectId = this.currentRow.id;
        addAtta(atta).then(res => {
          getAttaList(atta.projectId)
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
        });
      });
    }
  }
};
</script>
