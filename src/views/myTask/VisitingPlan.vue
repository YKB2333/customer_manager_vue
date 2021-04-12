<template>
  <div class="VisitngPlan-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">                     
          <el-button
            v-permission-button="'add'"
            type="primary"
            @click="getPlan(3,'')"
          >新增</el-button>
          <!-- <el-button  v-permission-button="'delete'" type="warning" size="small" @click="download">清除</el-button> -->
        </div>
      </div>       
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="计划单号">
          <template slot-scope="scope">
            <span>{{ scope.row.id + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planDescribe" label="计划说明"></el-table-column>
        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">店铺拜访</span>
            <span v-else-if="scope.row.type == 2">客户拜访</span>
            <!-- <span style="color:#D9001B">审核中</span> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.planStatus == 0" style="color:#52A6FF">初始</span>
            <span v-else-if="scope.row.planStatus == 1" style="color:#41CC00">待审批</span>
            <span v-else-if="scope.row.planStatus == 2" style="color:#FF9B00">已通过</span>
            <span v-else-if="scope.row.planStatus == 3" style="color:#797979">已驳回</span>
            <span v-else-if="scope.row.planStatus == 4" style="color:#797979">已取消</span>
            <!-- <span style="color:#D9001B">审核中</span> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatDate('Y/M/D')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划开始日期">
          <template slot-scope="scope">
            <span>{{scope.row.startDate | formatDate('Y/M/D')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划完成日期">
          <template slot-scope="scope">
            <span>{{scope.row.endDate | formatDate('Y/M/D')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.enableStatusCustomer == 1 "
              disabled
            >{{'未核准' }}</el-button>
            <el-button 
              v-permission-button="'edit'"
              type="text"
              @click="getPlan(2,scope.row.id)"
              :disabled="scope.row.planStatus==='4' || scope.row.planStatus==='1' || scope.row.planStatus === '2'"
            >编辑</el-button>
            <el-button
              v-permission-button="'submitcheck'"
              type="text"
              @click="submitted(scope.row.id)"
              :disabled="scope.row.planStatus==='1' || scope.row.planStatus==='4' || scope.row.planStatus === '2'"
            >提交审核</el-button>
            <el-button
              v-permission-button="'cancelPlan'"
              type="text"
              @click="getShop(scope.row.id)"
              :disabled="scope.row.planStatus==='4' || scope.row.executedTaskCount > 0"
            >取消计划</el-button>
            <el-button
              v-permission-button="'examine'"
              type="text"
              @click="getPlan(1,scope.row.id)"
            >查看</el-button>
            <el-button
              v-permission-button="'approvallog'"
              type="text" 
              @click="getlCoopInfos(scope.row.id)" 
              :disabled="scope.row.checkedStatus==='2'"
            >审批日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <el-dialog title="计划取消" :visible.sync="shopFlag" width="600px">
      <!-- <h4>计划取消</h4> -->
      <div style="display:flex;padding:20px 30px">
        <div class="must mr20">取消原因:</div>
        <div>
          <el-input type="textarea" :autosize="{ minRows: 5}" :maxlength="255" v-model="cancelDesc" placeholder="" :style="inputStyle"></el-input>
        </div>
      </div>
      <div class="dialog-footer" style="display:flex;justifyContent: space-around;padding:0 100px 0 160px">
        <el-button type="danger" v-permission-button="'cancel'" @click="shopFlag = false">取 消</el-button>
        <el-button type="primary" v-permission-button="'acknowledgement'" @click="cancelVisitInfo(userId)">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 审批日志 -->
    <el-dialog title="审批日志" :visible.sync="coopInfoFlag" width="80%">
      <!-- 插槽内容 -->
      <el-table
        :data="examinationData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="applicantName" label="提审人">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.applicant + '' }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="提审时间">
          <template slot-scope="scope">
            <span v-if="scope.row.applicantDate">{{scope.row.applicantDate | formatDate('Y/M/D')}}</span>
            <span v-else-if="scope.row.applicantDate === null">{{''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvedByName" label="审批人"></el-table-column>
        <el-table-column label="审批结果">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvedResult == 1">待审批</el-tag>
            <el-tag v-else-if="scope.row.approvedResult == 2">审批通过</el-tag>
            <el-tag v-else-if="scope.row.approvedResult == 3">审批不通过</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
        <el-table-column prop="approvedDesc" label="审批说明"></el-table-column>
        <el-table-column label="审批时间">
          <template slot-scope="scope">
            <span v-if="scope.row.approvedDate">{{scope.row.approvedDate | formatDate('Y/M/D')}}</span>
            <span v-else-if="scope.row.approvedDate === null">{{''}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="email" label="计划开始日期"></el-table-column>
        <el-table-column prop="tel" label="计划完成日期"></el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, formatDate } from "../../utils";
import Tags from "@/components/Tags";
import {getPlanApprovalLogs,cancelVisit,getVisit,getVisitPlans,addVisitplan,submitForReview,updateVisitPlan} from "@/api/visitplan"
import FileSaver from "file-saver";
export default {
  name: "VisitngPlan",
  components: { Tags },
  data() {
    return {
      cancelDesc:'',
      inputStyle: { width: "360px" },
      cancellation:'',
      times:[],
      inputValue: "",
      searchForm: [
        {
          key: "id",
          label: "计划单号",
          placeholder: "",
          clearable: false,
          type: "input",
        },
       {
          key: "time",
          label: "创建时间",
          type: "date_picker",
          pickerType: "daterange",
          clearable: false,
          format: "yyyy-MM-dd",  
          valueFormat: "timestamp",
          defaultTime: ["00:00:00", "23:59:59"],
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",         
        },
        {
          key: "createName",
          label: "创建人",
          placeholder: "",
          type: "input",
        },
        {
          key: "planStatus",
          label: "状态",
          placeholder: "",
          options: [
            { label: "初始", value: '0' },
            { label: "待审批", value: "1" },
            { label: "已通过", value: "2" },
            { label: "已驳回", value: "3" },
            { label: "已取消", value: "4" },
          ],
          type: "select",
        },

        {
          key: "type",
          label: "任务类型",
          placeholder: "",
          options: [
            { label: "店铺拜访", value: "1" },
            { label: "客户拜访", value: "2" },
          ],
          type: "select",
        },
      ],
      searchQuery: {
        id:"",
        type:"",
        planStatus: "",
        time:[],
        createName: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0, // 总条数
      },
      tableData: [],
      examinationData:[],
      tableLoading: false,
      shopFlag: false,
      contactFlag: false,
      InnerPersonFlag: false,
      coopInfoFlag: false,
      coopFlag: false,
      userId: "",
    };
  },
  computed: {},
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
   // 提交审核
   submitted(id) {
     submitForReview(id).then((res)=>{
       this.$message({ message: "提交审核成功", type: "success" });
       this.fetchTableData();
     })
   },

   // 拜访计划取消
   cancelVisitInfo(id) {
     if( this.cancelDesc === '') {
       this.$message({ message: "请填写取消原因!", type: "warning" });
     } else {
        let data = this.$lodash.cloneDeep(this.searchQuery);
        data.id = id
        data.cancelDesc = this.cancelDesc
        cancelVisit(data).then((res)=>{
          this.$message({ message: "客户拜访计划取消成功", type: "success" });
          this.cancelDesc = ''
          this.shopFlag = false;
          this.fetchTableData();
        })
        .catch((error)=>{
          console.log(error,'error')
        })
      }
    },
   // 取消
   getShop(id) {
     this.userId = id
     this.shopFlag = !this.shopFlag;
     this.cancelDesc = ''
   },

    // 查看审批日志
    getlCoopInfos(id) {
      // this.userId = id;
      let a = id.c[0]
      let b = id.c[1]
      let _id = a + b;
      console.log(id,b,'id')
      getPlanApprovalLogs(id).then((res) => {
        console.log(res);
        this.examinationData = res
      });
      this.coopInfoFlag = !this.coopInfoFlag;
    },
    // 新增/编辑/查看
    getPlan(cat,id) {
      this.$eventHub.$off(this.$eventName.CUSTOMER_VISITING_PLAN_REFLUSH)
      this.$eventHub.$on(this.$eventName.CUSTOMER_VISITING_PLAN_REFLUSH, () => this.fetchTableData())
      this.$router.push({
        name: "check",
        query: { identify: cat, id: id },
      });
    },
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true;
        let res = await this.fetchVisitPlanList();
        this.searchQuery.total = res.count; // 总条数
        let visitPlanList = res.list; // 品牌数据
        console.log(visitPlanList,'visitPlanList');
        this.tableData = visitPlanList;
      } catch (error) {
        console.log("catch", error);
      } finally {
        this.tableLoading = false;
      }
    },
    fetchVisitPlanList() {
      return new Promise((resolve, reject) => {
        let params = this.$lodash.cloneDeep(this.searchQuery);
        params.srartCreateDate = params.time[0];
        params.endCreateDate = params.time[1];
        console.log('params',params)
        getVisitPlans(params).then((res) => {
          resolve(res);
        });
      });
    },
  }
}
</script>

<style lang='scss' scoped>
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
</style>

