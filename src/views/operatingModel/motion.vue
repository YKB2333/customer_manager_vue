<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="客户名称"></el-table-column>
        <el-table-column label="成功案例">
          <template slot-scope="scope">
            <el-tag v-permission-button="'successCase'" type="success" class="pointer" @click="showAttaDialog(scope.row,4)">{{ scope.row.successCount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="客户提案">
          <template slot-scope="scope">
            <el-tag v-permission-button="'customerProposal'" class="pointer" @click="showAttaDialog(scope.row,2)">{{ scope.row.proposalsCount}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <!--附件上传-->
    <my-dialog title="附件列表" v-model="attaDialogVisible" @close="closeAttaDialog">
      <file-list
        v-if="attaDialogVisible"
        v-model="attaList"
        :uploadOss="uploadContractAtta"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>
  </div>
</template>

<script>
import {
    getMotionList,
    getAttaList,
    delAttachment,
    addAttachment,
} from "@/api/motion";
import { getAllBaseInfoList } from "@/api/baseInfo";
import { uploadContractAtta, uploadGoodsImages } from "@/api/uploadOss";
export default {
  name: "motion",
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
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      baseInfoData: [],
      saveBtnLoading: false, // 保存按钮的loading状态
      companyInfo:[],
      currentRow: null,
      attaDialogVisible: false,
      attaList: [],
      AttaParams:{},
    };
  },
  async created() {
    await this.fetchTableData();
    this.fetchBaseInfoData();
  },
  methods: {
    uploadContractAtta,
    uploadGoodsImages,
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return getMotionList(this.searchQuery)
        .then(res => {
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
      return getAllBaseInfoList().then(res => {
        this.baseInfoData = res;
      });
    },
    // 保存提交
    showAttaDialog(row,type) {
      let params = {
        id :row.id,
        type:type
      }
      this.AttaParams = params
      getAttaList(params).then(res => {
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
      console.log(atta);
      return new Promise((resolve, reject) => {
        delAttachment(atta.id).then(res => {
          getAttaList(this.AttaParams)
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
        atta.customerId = this.AttaParams.id;
        atta.type = this.AttaParams.type;
        addAttachment(atta).then(res => {
          getAttaList(this.AttaParams)
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
