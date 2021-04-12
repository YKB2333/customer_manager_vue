<template>
  <div class="profitRate-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">     
          <el-button type="primary"  
          v-permission-button="'add'" @click="add"
            >新增</el-button>
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="applyNo" label="渠道定价申请单" min-width="130px"></el-table-column>
        <el-table-column prop="ncCode" label="客户编码" ></el-table-column>
        <el-table-column prop="customerName" label="客户名称" min-width="200px"></el-table-column>
        <el-table-column prop="shopName" label="店铺名称" min-width="130px"></el-table-column>
        <el-table-column prop="creatorName" label="申请人"></el-table-column>
        <el-table-column label="申请时间" min-width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTimestamp">{{
              scope.row.createTimestamp | formatDate('Y/M/D h:m:s')
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <approve-timeline :id="scope.row.id" :list="timelineList" :request-id="requestId" :is-loading="isLoading" @hoverCheckedStatus="onHoverCheckedStatus">
              <el-tag v-if="scope.row.status === '0'">初始</el-tag>
              <el-tag  v-if="scope.row.status === '1'">已提交</el-tag>
              <el-tag  v-if="scope.row.status === '2'">已驳回</el-tag>
              <el-tag  v-if="scope.row.status === '3'">已通过</el-tag>
              <el-tag  v-if="scope.row.status === '4'">已作废</el-tag>
            </approve-timeline>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" min-width="160px" fixed="right">
          <template slot-scope="scope">
            <el-button  type="text" @click="viewDetails(scope.row)" v-permission-button="'viewDetails'">查看</el-button>
              <el-button  type="text" @click="edit(scope.row)" v-permission-button="'edit'" v-if="scope.row.status==='0' || scope.row.status==='2'">编辑</el-button>
            <el-button     type="text"  @click="approved(scope.row)" v-permission-button="'approved'" v-if="scope.row.status==='0' || scope.row.status==='2'">提交审批</el-button>
            <el-button  type="text"  @click="cancel(scope.row)" v-permission-button="'cancel'" v-if="scope.row.status==='0' || scope.row.status==='2' || scope.row.status==='3'"> 作废 </el-button> 
          </template>
        </el-table-column>
      </el-table>
    </my-table>

  </div>
</template>
<script>
import {
  getChannelOfferApplyPages,
  channelOfferApply,
  cannelChannelOfferApply,
  getWorkflow
} from '@/api/profitRate'
import { formatDate } from '@/utils'
import ApproveTimeline from '@/components/approve-timeline'
// import FileSaver from 'file-saver'
export default {
  name: 'serviceFee',
  components: { ApproveTimeline },
  data() {
    return {
      tableData: [],
      searchForm: [
        {
          key: 'customerName',
          label: '客户名称',
          placeholder: '输入客户名称',
          clearable: true,
          type: 'input'
        },
        {
          key: 'ncCode',
          label: '客户编码',
          placeholder: '输入客户编码',
          clearable: true,
          type: 'input'
        },
        {
          key: 'shopName',
          label: '店铺名称',
          placeholder: '输入店铺名称',
          clearable: true,
          type: 'input'
        }, 
        {
          key: 'applyNo',
          label: '申请单号',
          placeholder: '输入申请单号',
          clearable: true,
          type: 'input'
        },       
        {
          key: 'status',
          label: '状态',
          placeholder: '选择状态',
          clearable: true,
          options: [
            { label: '全部', value: null },
            { label: '初始', value: '0' },
            { label: '已提交', value: '1' },
            { label: '已驳回', value: '2' },
            { label: '已通过', value: '3' },
            { label: '已作废', value: '4' }
          ],
          type: 'select'
        },
        {
          key: "time",
          label: "申请时间",
          type: "date_picker",
          pickerType: "daterange",
          clearable: false,
          format: "yyyy-MM-dd",  
          valueFormat: "timestamp",
          defaultTime: ["00:00:00", "23:59:59"],
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",         
        }
        ],
      searchQuery: {
        customerName: '',
        shopName: '',
        ncCode: '',
        applyNo: '',
        pageIndex: 1,
        time:[],
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      requestId: '',//审批流程id
      timelineList: [],//审批时间轴
      isLoading: false,
      tableLoading: false,
    }
  },
  computed: {
  },
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {},
  methods: {
    // 加载表格数据
    async fetchTableData() {
      this.tableLoading = true
      this.searchQuery.customerName=this.searchQuery.customerName.trim()
       this.searchQuery.shopName=this.searchQuery.shopName.trim()
       this.searchQuery.ncCode=this.searchQuery.ncCode.trim()
       this.searchQuery.applyNo=this.searchQuery.applyNo.trim()
       this.searchQuery.srartCreateDate = this.searchQuery.time[0];
        this.searchQuery.endCreateDate = this.searchQuery.time[1];
      let params = this.searchQuery
      getChannelOfferApplyPages(params).then((res) => {
         this.tableLoading = false
          this.tableData =[]
          this.searchQuery.total = 0
          if(res && res.records.length>0){
          this.tableData = res.records
          this.searchQuery.total = res.total
          }
       
      })
     
    },
    onChange() {
      this.fetchTableData()
    },
    add(){
       this.$eventHub.$off(this.$eventName.CUSTOMER_CHANNEL_OFFER_APPLY_REFLUSH)
       this.$eventHub.$on(this.$eventName.CUSTOMER_CHANNEL_OFFER_APPLY_REFLUSH, () => this.fetchTableData())
       this.$router.push({name: "offerApplyAdd"});
    },
    viewDetails(item){
      this.$router.push({
        name: "offerApplyView",
        query: { id: item.id},
      });
    },
    edit(item){
       this.$eventHub.$off(this.$eventName.CUSTOMER_CHANNEL_OFFER_APPLY_REFLUSH)
       this.$eventHub.$on(this.$eventName.CUSTOMER_CHANNEL_OFFER_APPLY_REFLUSH, () => this.fetchTableData())
       this.$router.push({
        name: "offerApplyEdit",
        query: {  id: item.id },
      });
    },
    approved(item){ 
      this.$store.commit("SHOW_LOADING","提审中");
       channelOfferApply(item.id).then((res) => {
            this.$message.success('定价申请单提交审批成功')
            item.status='1'  
            this.$store.commit("SHOW_LOADING",false);             
       }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
      })
    },
    cancel(item){
       this.$store.commit("SHOW_LOADING");
       cannelChannelOfferApply(item.id).then((res) => {
            this.$message.success('定价申请单作废成功')
            item.status='4'
        this.$store.commit("SHOW_LOADING",false);             
       }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
      })
    },
    onHoverCheckedStatus(id) {
      this.isLoading = true;
      getWorkflow(id).then(res => {
        this.timelineList = []
        this.requestId = res && res.requestId
        let arr = res && res.workflowRequestLogs.reverse()
        if(arr){
          arr.map((item,idx) => {
            let obj = {
              remark: item.remark ? `审批意见: ${item.remark}` : '',
              receivedPersons: `接收人 ${item.receivedPersons}`,
              content: `(${item.operatorDept}) ${item.operatorName} ${item.operateType}`,
              timestamp: `${item.operateDate} ${item.operateTime}`,
            }
            item.operateType === '提交'
            ? (
              obj.size = 'large',
              obj.type = 'primary',
              obj.icon = 'el-icon-circle-plus'
            )
            : (item.operateType === '批准' 
                ? (
                  obj.size = 'large',
                  obj.type = 'success',
                  obj.icon = 'el-icon-success'
                )
                : obj.type = 'warning'
              )
            this.timelineList.push(obj)
          })
        }
      }).finally(()=>{
        this.isLoading = false;
      })
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
</style>
