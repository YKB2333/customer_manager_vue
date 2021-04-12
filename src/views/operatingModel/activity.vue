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
        <!-- <el-table-column prop="cname" label="客户"></el-table-column> -->
        <el-table-column prop="title" label="标题"></el-table-column>
        <!--<el-table-column prop="titleImage" label="标题图片"></el-table-column>-->
        <el-table-column prop="titleImage" label="标题图片" width="100">
          <template slot-scope="scope">
            <div style="text-align: center">
              <img
                :src="scope.row.titleImage || require('@/assets/images/logo.png')"
                width="60"
                height="60"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaDialog(scope.row)">{{ scope.row.attaCount}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="programme" label="详细内容" :show-overflow-tooltip="true" width="300"></el-table-column> -->
        <el-table-column label="活动启动时间" :formatter="(row)=>$formatDate(row.startTime, 'Y/M/D')"></el-table-column>
        <el-table-column label="活动结束时间" :formatter="(row)=>$formatDate(row.endTime, 'Y/M/D')"></el-table-column>
        <el-table-column
          label="创建时间"
          :formatter="(row)=>$formatDate(row.createTimestamp, 'Y/M/D h:m')"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            <el-button v-permission-button="'upload'" type="text" @click="showAttaDialog(scope.row)">上传附件</el-button>
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
        <el-form-item label="客户" prop="customerId">
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
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="saveForm.title" placeholder="请输入项目名称" :style="inputStyle"></el-input>
        </el-form-item>
        <!-- <el-form-item label="-" prop="content"> -->
          <!-- <el-input
            type="textarea"
            v-model="saveForm.programme"
            placeholder="请输入详细内容"
            :style="inputStyle"
            :rows="8"
          ></el-input> -->
        <!-- </el-form-item> -->
        <el-form-item label="活动开始时间" prop="startTime">
          <el-date-picker
            v-model="saveForm.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动截止时间" prop="startTime">
          <el-date-picker
            v-model="saveForm.endTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="标题图片" prop="titleImage">
          <div :style="inputStyle">
            <simple-file v-model="saveForm.titleImage" :uploadOss="uploadGoodsImages"></simple-file>
          </div>
        </el-form-item>
        <el-form-item label="活动案例" prop="content">
          <div>
          <wangeditor ref="wangeditor" v-model="saveForm.programme" @change="catchData"></wangeditor>
        </div>
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
  getActivityList,
  saveActivity,
  deleteActivity,
  getAttaList,
  addAtta,
  deleteAtta
} from "@/api/activity";
import wangeditor from '@/components/wangeditor'
// import E from 'wangeditor'
import { getAllBaseInfoList } from "@/api/baseInfo";
import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "Activity",
  components: {wangeditor},
  data() {
    return {
      labelWidth: "120px",
      inputStyle: { width: "220px" },
      searchForm: [
        {
          label: '客户名称',
          key: "customerName",
          placeholder: "请输入客户名称",
          type: "input",
        },
        {
          label: '活动标题',
          key: "title",
          placeholder: "请输入活动标题",
          type: "input"
        }
      ],
      searchQuery: {
        // customerId: "",
        customerName: "",
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
        id: null,
        customerId: null,
        title: null,
        titleImage: null,
        programme: null,
        startTime: null,
        endTime: null
      },
      rules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        titleImage: [
          { required: true, message: "请添加活动图片", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择活动开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择活动结束时间", trigger: "blur" }
        ]
      },
      currentRow: null,
      attaDialogVisible: false,
      attaList: []
    };
  },
  async created() {
    if (this.$route.query && this.$route.query.customerName) {
      this.searchQuery.customerName = this.$route.query.customerName;
    }
    await this.fetchTableData();
    this.fetchBaseInfoData();
  },
  computed: {
    dialogTitle() {
      return this.saveForm.id == null ? "新增" : "编辑";
    }
  },
  methods: {
    catchData(){
      
    },
    uploadOperateOss,
    uploadGoodsImages,
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getActivityList(this.searchQuery)
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
      this.$router.push('/activity/add')
      // this.dialogVisible = true;
    },
    edit(item) {
      this.$router.push({
        path: '/activity/edit',
        query: {
          id: item.id
        }
      })
      // this.saveForm = this.$lodash.cloneDeep(item);
      // this.dialogVisible = true;
      // this.$nextTick(()=>{
      //   this.$refs.wangeditor.htmlPut()
      // })
    },
    // 保存提交
    submit() {
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        saveActivity(this.saveForm)
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
      this.$refs['saveForm'].clearValidate();
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteActivity(item.id + "").then(res => {
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
    delAtta(atta) {
      return new Promise((resolve, reject) => {
        deleteAtta(atta.id).then(res => {
          getAttaList(atta.activityId)
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
      return new Promise((resolve, reject) => {
        atta.activityId = this.currentRow.id;
        addAtta(atta).then(res => {
          getAttaList(atta.activityId)
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
