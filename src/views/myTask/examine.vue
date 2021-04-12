<template>
  <div class="examine-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">   
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission-button="'approve'"
              type="text" 
              @click="getlCoopInfos(scope.row.id)" 
              :disabled="scope.row.checkedStatus==='2'"
            >审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 审批 -->
    <el-dialog title="" :visible.sync="coopInfoFlag" width="80%">
      <!-- 表单 -->
      <el-form style="display:flex;flexWrap:wrap" :disabled="true">
            <el-form-item class="content" label="计划单号">
                <el-input class="inputs" placeholder="请输入内容" v-model="id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="content" label="计划日期">
              <el-date-picker
                v-model="time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="content" label="创建人" >
                <el-input class="inputs" placeholder="请输入内容" v-model="createName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="content" label="计划说明" >
                <el-input class="inputs" placeholder="请输入内容" v-model="planDescribe"></el-input>
            </el-form-item>
            <el-form-item class="content" label="随行人员" >
                <el-input class="inputs" placeholder="请输入内容" v-model="entourages"></el-input>
            </el-form-item>
            <el-form-item class="content" label="任务类型">
              <el-select v-model="type">
                <el-option label="店铺拜访" value="1"></el-option>
                <el-option label="客户拜访" value="2"></el-option>
              </el-select>
            </el-form-item>
      </el-form>
      <template>
            <div style="float:right" class="pb20"><el-button type="info" v-permission-button="'calendarshows'" @click="exhibition">日历展示</el-button></div>
      </template>
      <!-- 插槽内容 -->
      <el-table
        :data="examinationData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="任务单号">
          <template slot-scope="scope">
            <span>{{ scope.row.id ? scope.row.id + '' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerCode" label="客户编码"></el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="shopCode" label="店铺号"></el-table-column>
        
        <el-table-column prop="shopName" label="店铺名称">
        </el-table-column>
        <el-table-column prop="address" label="客户地址">
        </el-table-column>
        <el-table-column label="任务计划开始日期">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate | formatDate('Y/M/D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务计划完成日期">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate | formatDate('Y/M/D') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注">
        </el-table-column> -->
        <!-- <el-table-column label="操作" width="" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="copy(scope)"
              :disabled="identify == 1 ? true : false"
            >复制此行</el-button>
            <el-button
              type="text"
              @click="deletClient(scope.row)"
              :disabled="identify == 1 ? true : false"
            >删除此行</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <template>
        <div style="display:flex;padding:20px 0px">
          <div class="must mr20">审核说明：</div>
          <div>
            <el-input type="textarea" placeholder="" :maxlength="255" :autosize="{ minRows: 5 }" v-model="approvedDesc" :style="textareaStyle"/>
          </div>
        </div>
        <div class="ml100 btn">
          <el-button  type="danger" v-permission-button="'approveresult'" @click="examinationResult(3)">审核不通过</el-button>                     
          <el-button
            class="ml20"
            v-permission-button="'approveresult'"
            type="primary"
            @click="examinationResult(2)"
          >审核通过</el-button>
          <!-- <el-button  type="danger" @click="" v-if="identify != 1">提交审核</el-button> -->
        </div>
      </template>
    </el-dialog>

    <!-- 日历展示 -->
    <el-dialog title="" :visible.sync="calendarFlag" width="65%">
      <el-calendar>
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p style="margin:0;padding:0">{{data.day.split('-').slice(2).join('-')}}</p>
          <div class="div-one">
            <div v-for="(item,index) in testData" :key="index">
              <p style="margin:0;padding:0;fontSize:12px">{{moment(date).format('YYYY-MM-DD')===moment(item.endDate).format('YYYY-MM-DD')?"●"+item.taskDescribe : ''}}</p>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Tags from "@/components/Tags";
import { listBusiness } from "@/api/business";
import {approval,
calendarShow,
getOneVisitPlan,
getVisitPlanApproveds,
getPlanApprovalLogs,
cancelVisit,getVisit,
getVisitPlans,
addVisitplan,
submitForReview,
updateVisitPlan} from "@/api/visitplan"
import { deepClone, formatDate } from "../../utils";
import FileSaver from "file-saver";
export default {
  name: "examine",
  components: { Tags },
  data() {
    return {
      moment,
      cancelDesc:'',
      textareaStyle:{ width: "360px" },
      inputStyle: { width: "360px" },
      cancellation:'',
      times:[],
      id:"",
      createName:"",
      planDescribe: "",
      time:[],
      entourages: "",
      type: "",
      searchForm: [
        {
          key: "id",
          label: "计划单号",
          placeholder: "",
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
      ],
      searchQuery: {
        id:"",
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
      calendarFlag:false,
      contactFlag: false,
      InnerPersonFlag: false,
      coopInfoFlag: false,
      userId: "", // 客户弹窗id
      shopId: "", //店铺id
      testData:[],
      approvedDesc:'',

    };
  },
  computed: {},
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
    // 审核结果
    examinationResult(i) {
      if (this.approvedDesc === '') {
        this.$message({ message: "请填写审核说明信息！", type: "warning" });
      } else {
        let params = {
        approvedDesc:this.approvedDesc,
        approvedResult:i,
        planId:this.userId
        }
        approval(params).then((res)=>{
          console.log("res",res)
          this.$message({ message: res, type: "success" });
          this.approvedDesc = ''
          this.fetchTableData()
          this.coopInfoFlag = !this.coopInfoFlag;
        })
      }
    },

    // 日历展示
    exhibition() {
      calendarShow(this.userId).then((res)=>{
        console.log(res,'99999')
        this.testData = res
      })
      this.calendarFlag = true
    },

    // 审批
    getlCoopInfos(id) {
      this.userId = id;
      let a = id.c[0]
      let b = id.c[1]
      let _id = (a + b)
      console.log(_id,'id')
      getOneVisitPlan(id).then((res) => {
        console.log(res);
        this.id = JSON.parse(JSON.stringify(res.id))
        this.time = [res.startDate,res.endDate]
        this.createName = JSON.parse(JSON.stringify(res.createName))
        this.planDescribe = res.planDescribe
        this.entourages = res.entourages
        this.type = res.type
        let taskList = res.taskList; // 数据
        console.log(taskList,'777777');
        this.examinationData = taskList
      });
      this.coopInfoFlag = !this.coopInfoFlag;
    },

    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true;
        let res = await this.fetchExamineList();
        console.log('res,',res)
        this.searchQuery.total = res.count; // 总条数
        let examineList = res.list; // 表格数据
        console.log(examineList,'examineList');
        this.tableData = examineList;
      } catch (error) {
        console.log("catch", error);
      } finally {
        this.tableLoading = false;
      }
    },
    fetchExamineList() {
      return new Promise((resolve, reject) => {
        let params = this.$lodash.cloneDeep(this.searchQuery);
        params.srartCreateDate = params.time[0];
        params.endCreateDate = params.time[1];
        console.log('params',params)
        getVisitPlanApproveds(params).then((res) => {
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
.inputs {
  width: 200px;
}
.content {
  width: 450px;
}
.div-one {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

/deep/ .el-calendar__button-group .el-button-group .el-button:nth-child(2) span{
  color: transparent !important;
  &::after{
    content: '本月';
    color: #606266;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}
</style>

