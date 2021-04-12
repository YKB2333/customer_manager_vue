<template>
  <div class="lookover-page">
    <!-- 表单 -->
    <el-form style="display:flex;flexWrap:wrap" :disabled="true">
          <el-form-item class="content" label="任务单号">
              <el-input class="inputs" placeholder="请输入内容" v-model="id"></el-input>
          </el-form-item>
          <el-form-item class="content" label="任务日期">
            <el-date-picker
              v-model="dateScope"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="content" label="创建人" >
              <el-input class="inputs" placeholder="请输入内容" v-model="creatorName"></el-input>
          </el-form-item>
          <template v-if="type == 1">
            <el-form-item class="content" label="店铺号" >
                <el-input class="inputs" placeholder="请输入内容" v-model="shopCode"></el-input>
            </el-form-item>
            <el-form-item class="content" label="店铺名称" >
                <el-input class="inputs" placeholder="请输入内容" v-model="shopName"></el-input>
            </el-form-item>
          </template>
          <el-form-item class="content" label="客户编码" >
              <el-input class="inputs" placeholder="请输入内容" v-model="customerCode"></el-input>
          </el-form-item>
          <el-form-item class="content" label="客户名称" >
              <el-input class="inputs" placeholder="请输入内容" v-model="customerName"></el-input>
          </el-form-item>
          <el-form-item class="content" label="任务说明" >
              <el-input class="inputs" placeholder="请输入内容" v-model="taskDescribe"></el-input>
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
          <el-form-item class="content" label="状态">
            <el-select v-model="taskStatus">
              <el-option label="初始" value="0"></el-option>
              <el-option label="待处理" value="1"></el-option>
              <el-option label="执行中" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="已取消" value="4"></el-option>
              <el-option label="已过期" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="content" label="进店时间" >
              <el-input class="inputs" placeholder="请输入内容" v-model="inTime"></el-input>
          </el-form-item>
          <el-form-item class="content" label="离店时间" >
              <el-input class="inputs" placeholder="请输入内容" v-model="outTime"></el-input>
          </el-form-item>
          <el-form-item class="content" label="盘点库存">
            <el-select v-model="isCheckStock">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
              <el-option label="空" value="空"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="content" label="计划单号" >
              <el-input class="inputs" placeholder="请输入内容" v-model="planId"></el-input>
          </el-form-item>
          
          

    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="陈列信息" name="first">
          <!-- 插槽内容 -->
          <el-table
            :data="taskDisplayVos"
            border
            stripe
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
          >
            <el-table-column label="陈列类型" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.displayType == 1">收银台</span>
                <span v-else-if="scope.row.displayType == 2">地堆</span>
                <span v-else-if="scope.row.displayType == 3">货架</span>
            </template>
            </el-table-column>
            <el-table-column label="POP照片">
              <template slot-scope="scope">
                <div style="display:flex">
                  <div v-for="(item,index) in scope.row.popImages" :key="index">
                    <img :src="item" alt="" width="100px" height="100px" style="display:block;" class="img">
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="陈列照片">
              <template  slot-scope="scope">
                <div style="display:flex">
                  <div v-for="(item,index) in scope.row.displayImages" :key="index">
                    <img :src="item" alt="" width="100px" height="100px" style="display:block;" class="img">
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="second">
        <my-table v-model="searchQuery" @change="onChange">
          <!-- 插槽内容 -->   
          <el-table
            :data="tableData"
            border
            stripe
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
          >
            <el-table-column label="NC编码">
              <template slot-scope="scope">
                <span>{{ scope.row.skuSn + '' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="codeBar" label="商品条码"></el-table-column>
            <el-table-column prop="mnemonicCode" label="助记码">
            </el-table-column>
            <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
            <el-table-column prop="" label="主/副属性">
              <template slot-scope="scope">
                <span v-if="scope.row.firstAtbKey && scope.row.firstAtbValue">{{ scope.row.firstAtbKey || ''}}:{{scope.row.firstAtbValue || ''}}</span>
                <span v-if="scope.row.secondAtbKey && scope.row.secondAtbValue">{{ scope.row.secondAtbKey || ''}}:{{scope.row.secondAtbValue || ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="salesGrade" label="销售等级">
            </el-table-column>
            <el-table-column prop="shopStock" label="门店库存">
            </el-table-column>
            <el-table-column prop="overdueNum" label="过期数量">
            </el-table-column>
            <el-table-column prop="tempNum" label="临期数量">
            </el-table-column>
            <el-table-column prop="recentNum" label="近期数量">
            </el-table-column>
            <el-table-column prop="normalNum" label="正常商品">
            </el-table-column>
            <el-table-column prop="damagedNum" label="破损商品">
            </el-table-column>
          </el-table>
        </my-table>
      </el-tab-pane>
      <el-tab-pane label="竞品信息" name="third">
        <template v-if="taskCompetitorVos && taskCompetitorVos.length > 0">
          <div v-for="(item,index) in taskCompetitorVos" :key="index" class="Partfour">
            <el-form style="display:flex;flexWrap:wrap" :disabled="true">
              <el-form-item class="content" label="竞品品牌：" >
                  <el-input class="inputs" placeholder="请输入内容" v-model="item.competeBrand"></el-input>
              </el-form-item>
              <el-form-item class="content" label="商品分类：" >
                  <el-input class="inputs" placeholder="请输入内容" v-model="item.competeCate"></el-input>
              </el-form-item>
              <el-form-item class="content" label="竞品公司：" >
                  <el-input class="inputs" placeholder="请输入内容" v-model="item.competeCompany"></el-input>
              </el-form-item>
              <el-form-item class="content" label="活动类型：" >
                  <el-input class="inputs" placeholder="请输入内容" v-if="item.activityType == 1" :value="'新品'"></el-input>
                  <el-input class="inputs" placeholder="请输入内容" v-if="item.activityType == 2" :value="'促销'"></el-input>
                  <el-input class="inputs" placeholder="请输入内容" v-if="item.activityType == 3" :value="'新品&促销'"></el-input>
              </el-form-item>
              <el-form-item class="content" label="活动周期：">
                <el-date-picker
                  v-model="item.times"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <div style="display:flex;padding:20px 0px">
                <div style="marginRight:20px">活动说明：</div>
                <div>
                  <el-input type="textarea" :autosize="{ minRows: 5}" :disabled="true" v-model="item.activityDesc" placeholder="" :style="textareaStyle"></el-input>
                </div>
              </div>
              <div style="display:flex;padding:20px 0px;width:100%">
                <div style="marginRight:20px">活动照片：</div>
                <div style="display:flex">
                  <div v-for="(item,index) in item.activityPicList" :key="index">
                    <img :src="item" alt="" width="200px" height="200px" style="display:block;marginRight:20px">
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </template>
        <template v-else>
          <span>暂无数据</span>
        </template>
          
      </el-tab-pane>
      <el-tab-pane label="拜访小结" name="fourth">
        <div style="display:flex;padding:20px 30px">
          <div style="marginRight:20px">客户需求:</div>
          <div>
            <el-input type="textarea" :autosize="{ minRows: 5}" :disabled="true" :value="demand" placeholder="" :style="textareaStyle"></el-input>
          </div>
        </div>
        <div style="display:flex;padding:20px 30px">
          <div style="marginRight:20px">拜访总结:</div>
          <div>
            <el-input type="textarea" :autosize="{ minRows: 5}" :disabled="true" v-model="summary" placeholder="" :style="textareaStyle"></el-input>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 取消 -->
    <el-dialog title="" :visible.sync="shopFlag" width="45%">
      <h4>计划取消</h4>
      <div style="display:flex;padding:20px 30px">
        <div style="marginRight:20px">取消原因:</div>
        <div>
          <el-input type="textarea" :autosize="{ minRows: 10}" v-model="cancellation" placeholder="" :style="inputStyle"></el-input>
        </div>
      </div>
      <div class="dialog-footer" style="display:flex;justifyContent: space-around;padding:0 20px 0 60px">
        <el-button type="primary" @click="cancelVisitInfo(userId)">确 认</el-button>
        <el-button type="danger" @click="shopFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 调整 -->
    <el-dialog title="" :visible.sync="adjustmentFlag" width="55%">
      <h4>计划调整</h4>
      <div style="display:flex;padding:20px 30px">
        <div style="marginRight:20px">原计划时间:</div>
        <div>
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="选择日期" :disabled="isEdit">
          </el-date-picker>
        </div>
        <div class="ml100" style="marginRight:20px">调整计划时间:</div>
        <div>
          <el-date-picker
            v-model="adjustDateAfterd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div style="display:flex;padding:20px 30px">
        <div style="marginRight:20px">调整原因:</div>
        <div>
          <el-input type="textarea" :autosize="{ minRows: 5}" v-model="cancellation" placeholder="" :style="inputStyle"></el-input>
        </div>
      </div>
      <div class="dialog-footer" style="display:flex;justifyContent: space-around;padding:0 20px 0 60px">
        <el-button type="primary" @click="moduLationVisitInfo(userId)">确 认</el-button>
        <el-button type="danger" @click="adjustmentFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 调整日志 -->
    <el-dialog title="调整日志" :visible.sync="coopInfoFlag" width="80%">
      <!-- 插槽内容 -->
      <el-table
        :data="examinationData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="" label="调整人">
          <template slot-scope="scope">
            <span>{{ scope.row.adjustBy + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整时间">
          <template slot-scope="scope">
            <span>{{scope.row.adjustDate | formatDate('Y/M/D')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整类型">
            <template slot-scope="scope">
                <span v-if="scope.row.adjustType == 1" style="color:#41CC00">取消</span>
                <span v-else-if="scope.row.adjustType == 2" style="color:#797979">调整时间</span>
                <!-- <span style="color:#D9001B">审核中</span> -->
            </template>
        </el-table-column>
        <!-- <el-table-column prop="legalPerson" label="状态"></el-table-column> -->
        <el-table-column prop="adjustDesc" label="调整原因"></el-table-column>
        <el-table-column label="调整后时间">
          <template slot-scope="scope">
            <span>{{scope.row.adjustDateAfter | formatDate('Y/M/D')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="email" label="计划开始日期"></el-table-column>
        <el-table-column prop="tel" label="计划完成日期"></el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { operateType } from "@/const/goods";
import Tags from "@/components/Tags";
import {adjust,cancel,TaskgetOneVisitPlan,getSkusByTaskId,getVisitTaskPage,getTaskApprovalLogs} from "@/api/visitplan"
import { deepClone, formatDate } from "../../utils";
import FileSaver from "file-saver";
export default {
  name: "userlist",
  components: { Tags },
  data() {
    return {
      activeName: 'first',
      isEdit:true,// 调整-原计划时间禁用
      cancelDesc:'',
      textareaStyle:{width:'1000px'},
      inputStyle: { width: "360px" },
      value1:'',// 原计划时间
      cancellation:'',// 调整/取消原因
      adjustDateAfterd:'',// 调整后时间
      adjustType:'',// 调整类型
      startDate:'',// 计划开始时间
      times:[],
      operateType: operateType,
      isEditSho: false,
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0, // 总条数
      },
      taskDisplayVos:[],
      tableData: [],
      examinationData:[],
      tableLoading: false,
      shopFlag: false,
      adjustmentFlag:false,
      InnerPersonFlag: false,
      coopInfoFlag: false,
      coopFlag: false,
      userId: "",
      id:'',// 任务单号
      startDate:'',
      createDate:'',
      creatorName:'',
      shopCode:'',
      shopName:'',
      customerCode:'',
      customerName:'',
      taskDescribe:'',
      entourages:'',// 随行人员
      type:'',
      taskStatus:'',
      inTime:'',
      outTime:'',
      isCheckStock:'',
      planId:'',
      summary:'',
      demand:'',
      taskCompetitorVos:[],
      dateScope: [],
    };
  },
  computed: {},
  created() {
    this.userId = this.$route.query.id
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
   formatDate,
   onChange() {
    this.fetchTableData();
   },

   handleClick(tab, event) {
    console.log(tab, event);
   },
   
   // 调整
   moduLation(id,date) {
    this.userId = id
    this.startDate = date
    this.adjustmentFlag = true
   },

   // 调整确认请求
   moduLationVisitInfo() {
    console.log('this',this.startDate)
     let data = {
         adjustDateAfter:this.adjustDateAfterd,
         adjustDesc:this.cancellation,
         adjustType:2,
         taskId:this.userId,
         adjustDate:this.startDate,
        };
     adjust(data).then((res)=>{
       this.$message({ message: "客户拜访任务调整成功", type: "success" });
       this.adjustmentFlag = false;
       this.fetchTableData();
     })
     .catch((error)=>{
       console.log(error,'error')
     })
   },
   // 拜访任务取消确认
   cancelVisitInfo() {
       console.log('this',this.userId,this.cancellation)
     let data = {taskId:this.userId,adjustDesc:this.cancellation};
     cancel(data).then((res)=>{
       this.$message({ message: "客户拜访任务取消成功", type: "success" });
       this.shopFlag = false;
       this.fetchTableData();
     })
     .catch((error)=>{
       console.log(error,'error')
     })
   },
    // 查看审批日志
    getlCoopInfos(id) {
      // this.userId = id;
      let a = id.c[0]
      let b = id.c[1]
      let _id = a + b;
      console.log(id,b,'id')
      getTaskApprovalLogs(id).then((res) => {
        console.log(res);
        this.examinationData = res
      });
      this.coopInfoFlag = !this.coopInfoFlag;
    },
    // 取消
    getShop(id) {
      this.userId = id
      this.shopFlag = !this.shopFlag;
    },

    //修改客户信息
    getUser(cat,id) {
      this.$router.push({
        name: "lookover",
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
        let res = await this.fetchLookoverList();
        console.log(res,'2222222')
        let lookoverList = res; // 表格数据
        console.log(lookoverList,'brandList');
        this.taskDisplayVos = lookoverList.taskDisplayVos
        let _taskDisplayVos = lookoverList
        console.log(_taskDisplayVos,'_taskDisplayVos');
        this.summary = _taskDisplayVos.summary
        this.demand = _taskDisplayVos.demand
        this.id = JSON.parse(JSON.stringify(lookoverList.id))
        this.startDate = lookoverList.startDate
        this.dateScope = [lookoverList.startDate, lookoverList.endDate]
        this.createDate = lookoverList.createDate
        this.creatorName = lookoverList.creatorName
        this.shopCode = lookoverList.shopCode
        this.shopName = lookoverList.shopName
        this.customerCode = lookoverList.customerCode
        this.customerName = lookoverList.customerName
        this.taskDescribe = lookoverList.taskDescribe
        this.entourages = lookoverList.entourages// 随行人员
        this.type = lookoverList.type
        this.taskStatus = lookoverList.taskStatus
        this.inTime = lookoverList.inTime ? this.formatDate(lookoverList.inTime, 'Y/M/D') : ''
        this.outTime = lookoverList.outTime ? this.formatDate(lookoverList.outTime, 'Y/M/D') : ''
        this.isCheckStock = lookoverList.isCheckStock
        this.planId = JSON.parse(JSON.stringify(lookoverList.planId))
        console.log('this.planId',this.planId)
        this.taskCompetitorVos = lookoverList.taskCompetitorVos ? lookoverList.taskCompetitorVos.map((item)=>{
          console.log(item,'item')
          item.times = [item.activityStartDate,item.activityEndDate]
          return item
        }) : []
        console.log(this.taskCompetitorVos,'this.taskCompetitorVos')
        let data = await this.getSkusByTask();
        console.log(data.list,'1111111')
        this.tableData = data.list;
        this.searchQuery.total = data.count
      } catch (error) {
        console.log("catch", error);
      } finally {
        this.tableLoading = false;
      }
    },
    fetchLookoverList() {
      return new Promise((resolve, reject) => {
        TaskgetOneVisitPlan(this.userId).then((res) => {
          resolve(res);
        });
      });
    },
    getSkusByTask() {
      console.log('this----d',this.userId)
      return new Promise((resolve, reject) => {
        this.searchQuery.taskId = this.userId,           
            getSkusByTaskId( this.searchQuery).then((res) => {
              resolve(res);
            });
      });
    },

    onDatePicker() {
      this.change();
    },
    change() {
      this.$emit("input", this.query);
      this.$emit("change", this.query);
    },
  },
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
.Partfour {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}
.img {
  margin-right: 20px;
}
</style>
<style lang="scss">
</style>

