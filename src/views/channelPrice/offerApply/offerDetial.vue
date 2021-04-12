<template>
  <div class="profitRate-page">
     <div style="text-align: center;margin-bottom: 25px;">定价申请单详情</div>
     <div style="text-align: left;margin-bottom: 10px;">基本信息</div>
     <el-form :model="applyData" ref="ruleForm" label-width="200px" inline  :disabled="true" class="newfrom">
       <el-form-item label="渠道报价申请单"  ><el-input v-model="applyData.applyNo"></el-input></el-form-item>
       <el-form-item label="申请人"  ><el-input v-model="applyData.creatorName"></el-input></el-form-item>
       <el-form-item label="申请时间"  ><el-input v-model="applyData.createTimestamp"></el-input></el-form-item>
    
       <el-form-item label="状态" prop="status">
                <el-select v-model="applyData.status" >
            <el-option label="初始" value="0"></el-option>
            <el-option  label="已提交" value="1"></el-option>
            <el-option  label="已驳回" value="2"></el-option>
            <el-option  label="已通过" value="3"></el-option>
            <el-option  label="已作废" value="4"></el-option>
                </el-select>
       </el-form-item>
     </el-form>

     <div style="text-align: left;margin-bottom: 10px;">客户信息</div>
     <el-form :model="applyData" ref="ruleForm" label-width="200px" inline :disabled="true"  class="newfrom">
       <el-form-item label="客户名称"  ><el-input v-model="applyData.customerName"></el-input></el-form-item>
       <el-form-item label="店铺名称"  ><el-input v-model="applyData.shopName"></el-input></el-form-item>
       <el-form-item label="合作方式"  >         
         <el-select v-model="applyData.coopType" >
            <el-option label="采购分销" value="0"></el-option>
            <el-option  label="一件代发" value="1"></el-option>
                </el-select>
      </el-form-item>
       <el-form-item label="客户等级"  >              
         <el-select v-model="applyData.customerGrade" >
            <el-option label="一般客户" value="1"></el-option>
            <el-option  label="战略客户" value="2"></el-option>
                </el-select>
      </el-form-item>
       <el-form-item label="渠道类型"  ><el-input v-model="applyData.channelType"></el-input></el-form-item>
       <el-form-item label="业务归属主体"  ><el-input v-model="applyData.saleCompanyName"></el-input></el-form-item>
       <el-form-item label="业务归属部门"  ><el-input v-model="applyData.saleDepartName"></el-input></el-form-item>
       <el-form-item label="结算方式"  ><el-input v-model="applyData.closeMethod"></el-input></el-form-item>
       <el-form-item label="账期天数"  ><el-input v-model="applyData.paymentDay"></el-input></el-form-item>
       <el-form-item label="是否退换货" prop="isCannel">
                <el-select v-model="applyData.isCannel" >
            <el-option label="非退货" value="0"></el-option>
            <el-option  label="退货" value="1"></el-option>
                </el-select>
       </el-form-item>
     </el-form>
     <!--申请单商品数据-->
     <div style="text-align: left;margin-bottom: 10px;">报价明细</div>
      <el-table
        :data="tableData"
        border
        stripe
        element-loading-text="拼命加载中"
        height="500px"
        style="border-radius: 10px;"
      >
        <el-table-column type="index" label="序号" fixed="left"></el-table-column>
        <el-table-column prop="spuName" label="商品名称" width="200px" fixed="left"></el-table-column>
              <el-table-column prop="skuSn" label="" >
                <template slot="header">
                  <el-tooltip effect="dark" content="nc编码" placement="top">
                    <span>规格编码<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
                <template slot-scope="scopes">
                        {{scopes.row.skuSn}}
                </template>
           </el-table-column>
        <el-table-column prop="codeBar" label="商品条码" ></el-table-column>
        <el-table-column prop="brandName" label="品牌" ></el-table-column>
        <el-table-column prop="firstAtbKey" label="主/副属性">
              <template slot-scope="scope">
                <span v-if="scope.row.firstAtbKey && scope.row.firstAtbValue">{{ scope.row.firstAtbKey || ''}}:{{scope.row.firstAtbValue || ''}}</span>
                <span v-if="scope.row.secondAtbKey && scope.row.secondAtbValue">{{ scope.row.secondAtbKey || ''}}:{{scope.row.secondAtbValue || ''}}</span>
              </template>
        </el-table-column>
        <el-table-column prop="msrp" label="建议零售价"></el-table-column>
        <el-table-column prop="channelMsrp" label="建议渠道报价"></el-table-column>
                <el-table-column prop="channelProfitRates" label="" min-width="90px">
               <template slot="header">
                  <el-tooltip effect="dark" content="建议价毛利率：（1 - 成本价 / 建议渠道报价） * 100" placement="top">
                    <span>建议价毛利率<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
                <template slot-scope="scope">{{scope.row.channelProfitRates}}%</template></el-table-column>
        <el-table-column prop="historyMsrp" label="历史合作价"></el-table-column>
        <el-table-column prop="currentMsrp" label="本次合作价"></el-table-column>
                <el-table-column prop="currentProfitRates" label="" min-width="90px">
           <template slot="header">
                  <el-tooltip effect="dark" content="合作价毛利率：（1 - 成本价 / 本次合作价）* 100" placement="top">
                    <span>合作价毛利率<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
                <template slot-scope="scope">{{scope.row.currentProfitRates}}%</template></el-table-column>
                <el-table-column prop="amplitude" label="">
          <template slot="header">
                  <el-tooltip effect="dark" content="调幅差：合作价毛利率 - 建议渠道价毛利率" placement="top">
                    <span>调幅差<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
                <template slot-scope="scope">{{scope.row.amplitude}}%</template></el-table-column>
        <el-table-column label="操作"><template slot-scope="scope"><el-button   v-permission-button="'modifyLogs'" @click="getModifyLogs(scope.row.id)" type="text">修改日志</el-button></template></el-table-column>
      </el-table>

      <!--申请单审批日志-->
     <div style="text-align: left;margin-bottom: 10px;margin-top:20px">审批日志</div>
      <el-table
        :data="applyLogData"
        border
        stripe
        style="border-radius: 10px;"
      >
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="approver" label="审批人" ><template slot-scope="scope">{{scope.row.endNode==true?'系统':scope.row.approver}}</template></el-table-column>
        <el-table-column prop="approveDate" label="审批时间" ></el-table-column>
        <el-table-column prop="approvedResult" label="审批结果" ><template slot-scope="scope">{{scope.row.endNode==true?'归档':scope.row.approvedResult==='submit'?'通过':'不通过'}}</template></el-table-column>
        <el-table-column prop="reason" label="审批意见" ></el-table-column>
      </el-table>
 
       <div slot="before-table">
      <div class="pb10 btn" style="margin:auto">
        <el-button  type="danger"  @click="goBack()">返回列表</el-button>                     
      </div>
    </div>
     <el-dialog title="修改日志" :visible.sync="showLogs" width="900px">
      <my-table
        v-model="logSearchQuery"
        :searchForm="logSearchForm"
        @change="logsOnChange"
      >
        <el-table
          :data="logsData"
          border
          stripe
          v-loading="logsLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="creatorName" label="修改人" width="70px"></el-table-column>
          <el-table-column prop="createDate" label="修改时间" min-width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.createDate">{{
                scope.row.createDate |  formatDate('Y/M/D h:m:s')
              }}</span>
              <span v-else-if="scope.row.createDate === null">{{ '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="beforeBean" label="修改前合作价" min-width="250px">
          </el-table-column>
          <el-table-column prop="afterBean" label="修改后合作价" min-width="250px">
          </el-table-column>
        </el-table>
      </my-table>
    </el-dialog>   
  </div>
</template>
<script>
import {
getChannelOfferApply,getListGoods,listApplyLog,getOfferModifyLogPages
} from '@/api/profitRate'
import { formatDate } from '@/utils'
export default {
  name: 'offerApplyView',
  components: {},
  data() {
    return {
      applyId:null,
      applyData: {},
      tableData: [],
      applyLogData:[],
       showLogs: false,
       logsData: [],
        logsLoading: false,
      tableLoading: false,
      loading: false,
      logSearchForm: [],
      logSearchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      }
    }
  },
  computed: {
  },
  created() {
   this.applyId=this.$route.query.id
   this.getChannelOfferApply()
  },
  mounted() {

  },
  methods: {
     async  getChannelOfferApply(){
       this.$store.commit("SHOW_LOADING");
       getChannelOfferApply(this.applyId).then((res) => {
        if (res) { 
          this.applyData = res
           this.applyData.createTimestamp=formatDate(this.applyData.createTimestamp,'Y/M/D h:m:s')
          this.getListGoods()
          this.getApplyLog()
        }
      }).finally(() => {
        this.$store.commit("SHOW_LOADING",false);
      })
     },
     getApplyLog(){
        listApplyLog(this.applyId).then((res) => {
        if (res) {
          this.applyLogData = res
        }
      })
     },
    // 加载表格数据
    async getListGoods() {
      getListGoods(this.applyId).then((res) => {
        if (res) {
          this.tableData = res
        }
      })
     
    },
    goBack(){
      this.$router.push({name: "offerApply"});
    },
getModifyLogs(id) {
      this.showLogs = true
      this.logsLoading = true
      this.logSearchQuery.relationField =id
       this.logSearchQuery.logType='updateChannelOfferApplyGood'
      getOfferModifyLogPages(this.logSearchQuery).then((res) => {
        if (res) {
          this.logsData = res.records
          this.logSearchQuery.total = res.total
        }
      })
      this.logsLoading = false
    },
    logsOnChange() {
      this.getModifyLogs(this.logSearchQuery.relationField)
    }

  },
  watch: {}
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
.must:before {
  content: '* ';
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}
.btn {
  width: 18%;
  padding-top: 20px;
}
.add-btn {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin: auto;
}
.inputs {
  width: 200px;
}
.content {
  width: 450px;
}
.contents {
  width: 300px;
}
.div-one {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
/deep/
  .el-calendar__button-group
  .el-button-group
  .el-button:nth-child(2)
  span {
  color: transparent !important;
  &::after {
    content: '本月';
    color: #606266;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}
.el-button + .el-button {
  margin-left: 0px;
}

.newfrom {
      background-color: white;
    margin-bottom: 20px;
    margin-top: 20px;
    padding-top: 20px;
    border-radius: 10px;
}
</style>
