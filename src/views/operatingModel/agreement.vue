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
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="name" label="合同名称"></el-table-column>
        <el-table-column prop="businessName" label="业务板块"></el-table-column>
        <el-table-column prop="signSubject" label="签约主体"></el-table-column>
        <el-table-column label="合同期限" width="200" >
            <template slot-scope="scope">
                <span>{{$formatDate(scope.row.startTime,'Y/M/D')}}</span>
                ~
                <span>{{$formatDate(scope.row.endTime,'Y/M/D')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="closeMethod" label="结算方式"></el-table-column>
        <el-table-column prop="paymentType" label="账期类型"></el-table-column>
        <el-table-column prop="paymentDay" label="账期天数"></el-table-column>
        <!-- <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaDialog(scope.row)">{{ scope.row.attaCount}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            <!-- <el-button type="text" @click="showAttaDialog(scope.row)">上传附件</el-button> -->
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
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="请输入合同名称" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="业务板块" prop="businessId">
          <el-select :style="inputStyle" v-model="saveForm.businessId" >
            <el-option v-for="item in businessList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="签约主体">
          <el-input v-model="saveForm.signSubjectId"  placeholder="请输入签约主体" :style="inputStyle"></el-input>
        </el-form-item> -->
        <el-form-item label="签约主体" prop="signSubjectId">
          <el-select ref="selectRef" v-model="saveForm.signSubjectId" @change="selectSign" filterable :style="inputStyle" placeholder="请选择签约主体">
            <el-option
              v-for="item in companyInfo"
              :key="item.id"
              :label="item._fullname"
              :value="item._subcompanyid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同开始时间" prop="startTime">
          <el-date-picker
            v-model="saveForm.startTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同截止时间" prop="endTime">
          <el-date-picker
            v-model="saveForm.endTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :style="inputStyle"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="closeMethod" label="结算方式">
          <el-select  v-model="saveForm.closeMethod" :style="inputStyle" placeholder="请选择结算方式">
            <el-option value="现款现货"></el-option>
            <el-option value="月结"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账期类型">
          <el-select  v-model="saveForm.paymentType" :style="inputStyle" placeholder="请选择账期类型">
            <el-option value="货到"></el-option>
            <el-option value="票到"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账期天数">
          <el-input-number :min="0" v-model ="saveForm.paymentDay" placeholder="请输入账期天数" :style="inputStyle"></el-input-number>
        </el-form-item>
        <el-form-item label="上传附件" prop="attaList">
          <file-list
            v-if="attaVisible"
            v-model="saveForm.attaList"
            async
            :uploadOss="uploadContractAtta"
            :removePromise="delAtta"
            :removeMessage="false"
            :uploadPromise="addAtta"
          ></file-list>
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
import { listBusiness} from "@/api/business";
import {
    getContractList,
    saveContract,
    deleteContract,
    addAttachment,
    getAttaList,
    delAttachment,
    getAllCompanyInfo,
    updateContract
} from "@/api/agreement";
import { getAllBaseInfoList,getEnableList } from "@/api/baseInfo";
import { uploadContractAtta, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "agreement",
  components: {},
  data() {
    return {
      attaVisible:false,
      labelWidth: "120px",
      inputStyle: { width: "220px" },
      searchForm: [
        {
          key: "customerName",
          placeholder: "请输入客户名称",
          type: "input"
        },
      ],
      searchQuery: {
        baseInfoId: "",
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
        baseInfoId: null,
        signSubject: null,
        closeMethod: null,
        paymentType: null,
        businessId:null,
        paymentDay:0,
        startTime: null,
        endTime: null,
        attaList:[]
      },
      businessList:[],//业务板块
      companyInfo:[],
      rules: {
        businessId:[
          { required: true, message: "请选择业务板块", trigger: "change" }
        ],
        attaList: [
          { required: true, message: "请添加附件", trigger: "blur" }
        ],
        baseInfoId: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        signSubjectId: [
          { required: true, message: "请选择签约主体", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择活动开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择活动结束时间", trigger: "blur" }
        ],
        closeMethod:[
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        name:[
          { required: true, message: "请输入合同名称", trigger: "blur" }
        ],
      },
      attaList: [],
      editFalg:''
    };
  },
  async created() {
    await this.fetchTableData();
    this.fetchBaseInfoData();
    this.getSign()
    this.listBusiness()
  },
  computed: {
    dialogTitle() {
      this.saveForm.id == null ? this.editFalg = "新增" : this.editFalg = "编辑";
      return this.saveForm.id == null ? "新增" : "编辑";
    }
  },
  methods: {
    listBusiness(){//获取业务板块 业务板块
      listBusiness().then(res=>{
        this.businessList = res
      })
    },
    getSign(){
      return getAllCompanyInfo().then(res => {
        this.companyInfo = res;
      });
    },
    selectSign(data){
      this.$nextTick(()=>{
        this.saveForm.signSubject = this.$refs.selectRef.selected.label
      })
    },
    uploadContractAtta,
    uploadGoodsImages,
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getContractList(this.searchQuery)
        .then(res => {
          console.log("res",res)
          this.searchQuery.total = res.total; // 总条数
          res.records.forEach(r => {
            r.baseInfoId += "";
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
      this.attaVisible = true
    },
    edit(item) {
      this.saveForm = this.$lodash.cloneDeep(item);
      // getAttaList(this.saveForm.id).then(res => {
      //   res.forEach(r => {
      //     r.id += "";
      //   });
      //   this.saveForm.attaList = res;
        this.dialogVisible = true;
        this.attaVisible = true
      // }).catch(error =>{
      //   this.$message("获取附件信息失败",error);
      // });
    },
    // 保存提交
    submit() {
      if(this.saveForm && this.saveForm.attaList.length == 0){
        this.$message.warning('附件不能为空')
        return
      }
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        if (this.editFalg ==="新增"){
          saveContract(this.saveForm)
            .then(res => {
              this.$message.success("添加成功");
              this.fetchTableData();
              this.closeDialog();
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
        }else {
          updateContract(this.saveForm)
            .then(res => {
              this.$message.success("修改成功");
              this.fetchTableData();
              this.closeDialog();
            })
            .finally(() => {
              this.saveBtnLoading = false;
            });
        }
      });
    },
    closeDialog() {
      this.saveForm = {
        baseInfoId: null,
        signSubject: null,
        closeMethod: null,
        paymentType: null,
        paymentDay:0,
        startTime: null,
        endTime: null,
        attaList:[]
      };
      this.dialogVisible = false;
      this.attaVisible = false
      this.fetchTableData();
    },
    del(item, index) {
      this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteContract(item.id + "").then(res => {
          this.$message.success("删除成功");
          this.fetchTableData();
        });
      });
    },
    delAtta(atta) {
      return new Promise((resolve, reject) => {
        this.$confirm("确认删除", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.saveForm.attaList.forEach((item,index)=>{
            if(item.attaUrl == atta.attaUrl){
              this.saveForm.attaList.splice(index,1)
              resolve(this.saveForm.attaList);
            }
          })
        }).catch((e)=>{
          reject(e)
        })
      });
    },
    addAtta(atta) {
      this.saveForm.attaList.push(atta)
    }
  }
};
</script>
