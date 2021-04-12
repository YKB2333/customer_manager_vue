<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button type="primary" @click="add">新增</el-button>
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
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="baseInfoName" label="客户"></el-table-column>
        <el-table-column prop="businessName" label="业务部门"></el-table-column>
        <!-- <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showAttaList(scope.row)">{{ scope.row.attaCount}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column prop="benchmarkingGoods" label="对标商品" :show-overflow-tooltip="true" width="300"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button  type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button  type="text" @click="del(scope.row, scope.$index)">删除</el-button>
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
        <el-form-item label="分析主题" prop="title">
          <el-input v-model="saveForm.title" placeholder="请输入主题名称" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="baseInfoId">
          <el-select
            v-model="saveForm.baseInfoId"
            filterable
            placeholder="请选择客户"
            :style="inputStyle"
            ref="baseinfoRef"
            @change="changeBaseInfo"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务部门" prop="businessId">
          <el-select
            v-model="saveForm.businessId"
            filterable
            placeholder="请选择业务部门"
            :style="inputStyle"
          >
            <el-option
              v-for="(item, index) in businessData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析人" prop="analystNames">
          <tags title="添加分析人" v-model="saveForm.analystNames" />
        </el-form-item>
        <el-form-item label="对标商品" prop="benchmarkingGoods">
          <el-input v-model="saveForm.benchmarkingGoods" placeholder="请输入" :style="inputStyle"></el-input>
        </el-form-item>
        <el-form-item label="上传附件" prop="attaList">
          <file-list
            v-if="dialogVisible"
            v-model="saveForm.attaList"
            async
            :uploadOss="uploadProAnalyzeAtta"
            :removePromise="delProAnalyzeAtta"
            :uploadPromise="addProAnalyzeAtta"
          ></file-list>
        </el-form-item>
        <el-form-item label="分析内容" prop="content">
          <div>
            <wangeditor ref="wangeditor" v-model="saveForm.analyzeContent" @change="catchData" ></wangeditor>
            <p v-if="!saveForm.analyzeContent" style="color: red">请填写内容</p>
          </div>
        </el-form-item>
        <el-form-item  label="推广商品" prop="spuIds">
          <el-select
            multiple
            v-model="saveForm.spuIds"
            filterable
            placeholder="请选择商品"
            style="width:540px;"
          >
            <el-option
              v-for="(item, index) in spuData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
    selectPage,
    saveCoreSuppliers,
    delCoreSuppliers,
    getProAnalyzeAtta,
    saveOrUpdateCoreSupplierAnalyze
  } from "@/api/operatingModel";
  import E from 'wangeditor';
  import { getAllBaseInfoList } from "@/api/baseInfo";
  import { uploadGoodsImages } from "@/api/uploadOss";
  import { uploadProAnalyzeAtta } from "@/api/uploadOss";
  import { listBusiness} from "@/api/business";
  import { spuList } from "@/api/goods";
  import Tags from '@/components/Tags';
  import wangeditor from '@/components/wangeditor'
  export default {
    name: "ProductNews",
    components: {Tags,wangeditor},
    data() {
      return {
          selectIds: [],
        labelWidth: "100px",
        inputStyle: { width: "220px" },
        searchForm: [
          {
            key: "baseInfoName",
            placeholder: "请输入客户名称",
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
        businessData:[],
        spuData:[],
        saveForm: {
          id: null,
          baseInfoId:'',
          baseInfoName:'',
          spuId: null,
          spuIds:[],
          benchmarkingGoods:'',
          name: null,
          image: null,
          content: null,
          marketTime: null,
          attaList:[],
          analystNames:[]
        },
        rules: {
          businessId: [
            { required: true, message: "请选择业务部门", trigger: "blur" }
          ],
          title: [{ required: true, message: "请选择分析主题", trigger: "blur" }],
          analystNames: [
            { required: true, message: "请选择分析人", trigger: "blur" }
          ],
          baseInfoId: [
            { required: true,  message: "请选择客户",trigger: "blur" }
          ],
        },
        dialogVisible: false,
        saveBtnLoading: false, // 保存按钮的loading状态
      };
    },
    async created() {
      await this.fetchTableData();
      this.fetchBaseInfoData();
      this.fetchBusinessData();
      this.fetchSpuData();
    },
    computed: {
      dialogTitle() {
        return this.saveForm.id == null ? "新增" : "编辑";
      }
    },
    methods: {
      changeBaseInfo(item){
        this.$nextTick(()=>{
          let baseInfoName = this.$refs.baseinfoRef.selected.label || null
          this.saveForm.baseInfoName = baseInfoName
        })
      },
      catchData(){

      },
      uploadGoodsImages,
      handleDownload(path) {
        window.open(path, "_blank");
      },
      onChange() {
        this.fetchTableData();
      },
      uploadProAnalyzeAtta,
      // 加载表格数据
      fetchTableData() {
        this.tableLoading = true;
        return selectPage(this.searchQuery)
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
      fetchSpuData() {
        return spuList().then(res => {
          this.spuData = res;
        });
      },
      fetchBusinessData() {
        return listBusiness().then(res => {
          this.businessData = res;
        });
      },
      add() {
        this.dialogVisible = true;
      },
      edit(item) {
          console.log(item);
        this.saveForm = this.$lodash.cloneDeep(item);
        this.saveForm.spuIds =  this.saveForm.spuIds && this.saveForm.spuIds.filter(key => key).map(key=> parseInt(key))
        this.saveForm.baseInfoId += ''
        this.saveForm.attaList = this.saveForm.attaList == null?[]:this.saveForm.attaList
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.wangeditor.htmlPut()
        })
      },
      closeDialog() {
        this.dialogVisible = false;
        this.$nextTick(()=>{
          this.$refs.wangeditor.htmlPut('')
        })
        this.saveForm = {
          attaList:[]
        };
        this.$refs['saveForm'].clearValidate();
      },
      // 保存提交
      submit() {
        this.$refs.saveForm.validate(valid => {
          if (!valid) return false;
          if (!this.saveForm.analyzeContent){
           this.$message.error("富文本内容必填")
            return false;
          }
          this.saveBtnLoading = true;
          saveOrUpdateCoreSupplierAnalyze(this.saveForm)
            .then(res => {
              console.log("9999");
              this.$message.success("添加成功");
              this.fetchTableData();
              this.closeDialog();
//              this.$router.ps
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
          delCoreSuppliers(item.id + "").then(res => {
            this.$message.success("删除成功");
            this.fetchTableData();
          });
        });
      },
      getProAnalyzeAtta(row) {
        getProAnalyzeAtta(row.id).then(res => {
          res.forEach(r => {
            r.id += "";
          });
          this.currentRow = row;
          this.attaList = res;
          this.attaDialogVisible = true;
        });
      },
      showAttaDialog(row) {
        getStrategicAtta(row.id).then(res => {
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
        this.saveForm = {}
        this.attaList = [];
        this.attaDialogVisible = false;
        this.fetchTableData();
      },
      delProAnalyzeAtta(atta) {
        console.log(atta);
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
      addProAnalyzeAtta(atta) {
        console.log("a",atta)
        console.log('this.saveForm',this.saveForm)
        this.saveForm.attaList.push(atta)
        console.log(this.saveForm.attaList)
      },

    }
  };
</script>

