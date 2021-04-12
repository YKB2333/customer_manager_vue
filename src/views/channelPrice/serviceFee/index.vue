<template>
  <!-- 利润率档案 -->
  <div class="profitRate-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">     
          <el-button type="primary"  
          v-permission-button="'add'" @click="add"
            >新增</el-button
          >
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        highlight-current-row
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" fixed="left" ></el-table-column>
        <el-table-column prop="archivesType" label="档案类型" width="70px" align="center" fixed="left">
          <template slot-scope="scope">
              {{
                scope.row.archivesType === '0'
                  ? '标准档案'
                  : scope.row.archivesType === '1'
                  ? '定制档案'
                  : '-'
              }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200px" align="center" fixed="left"></el-table-column>
        <el-table-column prop="shopName" label="店铺名称" width="130px" align="center" fixed="left"></el-table-column>
        <el-table-column prop="customerGrade" label="客户等级" align="center" width="70px" >
          <template slot-scope="scope">
              {{
                scope.row.customerGrade === '1'
                  ? '一般客户'
                  : scope.row.customerGrade === '2'
                  ? '战略客户'
                  : '-'
              }}
          </template>
          </el-table-column>
        <el-table-column prop="coopType" label="合作方式" align="center" width="70px">
                    <template slot-scope="scope">
              {{
                scope.row.coopType === '0'
                  ? '采购分销'
                  : scope.row.coopType === '1'
                  ? '一件代发'
                  : '-'
              }}
          </template>
          </el-table-column>
        <el-table-column prop="channelType" label="渠道类型" align="center" width="70px"></el-table-column>

<el-table-column prop="platformFeeRate" label="平台服务费（百分比）" align="center" min-width="150px"><template slot-scope="scope"><span v-if="scope.row.platformFeeRate!=null">{{scope.row.platformFeeRate}}%</span></template></el-table-column>
<el-table-column prop="channelFeeRate" label="渠道费用（百分比）" align="center" min-width="150px"><template slot-scope="scope"><span v-if="scope.row.channelFeeRate!=null">{{scope.row.channelFeeRate}}%</span></template></el-table-column>
<el-table-column prop="publicityFeeRate" label="推广宣传费（百分比）" align="center" min-width="150px"><template slot-scope="scope"><span v-if="scope.row.publicityFeeRate!=null">{{scope.row.publicityFeeRate}}%</span></template></el-table-column>
<el-table-column prop="transportFeeRate" label="运输费（百分比）" align="center" min-width="150px"><template slot-scope="scope"><span v-if="scope.row.transportFeeRate!=null">{{scope.row.transportFeeRate}}%</span></template></el-table-column>
<el-table-column prop="transportFee" label="运输费（定额）" align="center" min-width="110px"><template slot-scope="scope"><span v-if="scope.row.transportFee!=null">{{scope.row.transportFee}}</span></template></el-table-column>
<el-table-column prop="storageFeeRate" label="仓储费（百分比）" align="center" min-width="140px"><template slot-scope="scope"><span v-if="scope.row.storageFeeRate!=null">{{scope.row.storageFeeRate}}%</span></template></el-table-column>
<el-table-column prop="salesTaxRate" label="营业税金（百分比）"  align="center" min-width="140px"><template slot-scope="scope"><span v-if="scope.row.salesTaxRate!=null">{{scope.row.salesTaxRate}}%</span></template></el-table-column>
<el-table-column prop="otherSaleFeeRate" label="其它销售费用（百分比）" align="center" min-width="170px"><template slot-scope="scope"><span v-if="scope.row.otherSaleFeeRate!=null">{{scope.row.otherSaleFeeRate}}%</span></template></el-table-column>
<el-table-column prop="fundPossessionFeeRate" label="资金占用费（百分比）" align="center" min-width="150px"><template slot-scope="scope"><div ><span v-if="scope.row.fundPossessionFeeRate!=null">{{scope.row.fundPossessionFeeRate}}%</span></div></template></el-table-column>
<el-table-column prop="manageFeeRate" label="固定管理费用（百分比）" align="center" min-width="170px"><template slot-scope="scope"><div ><span v-if="scope.row.manageFeeRate!=null">{{scope.row.manageFeeRate}}%</span></div></template></el-table-column>
<el-table-column prop="status" label="启用状态" width="70px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'">启用</el-tag>
            <el-tag  type="info" v-if="scope.row.status === '1'">禁用</el-tag>
          </template>
</el-table-column>

        <el-table-column prop="creatorName" label="创建人"><template slot-scope="scope">{{scope.row.creatorName}}</template></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTimestamp">{{
              scope.row.createTimestamp | formatDate('Y/M/D h:m:s')
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="editorName" label="最后修改人" min-width="100px"> <template slot-scope="scope">{{scope.row.editorName}}</template></el-table-column>
        <el-table-column label="修改时间" width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTimestamp">{{
              scope.row.updateTimestamp | formatDate('Y/M/D h:m:s')
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === '1'" type="text" @click="enable(scope.row)" v-permission-button="'enable'"> 启用</el-button>
              <el-button v-else-if="scope.row.status === '0' && scope.row.archivesType === '1'" type="text" @click="disable(scope.row)" v-permission-button="'disable'" > 禁用</el-button>
            <el-button   v-permission-button="'edit'" @click="edit(scope.row)" type="text"> 编辑</el-button>
            <el-button type="text" v-permission-button="'delete'" @click="del(scope.row)" v-if="scope.row.archivesType === '1' && scope.row.status === '1' "> 删除</el-button> 
            <el-button
              v-if="scope.row.id"
              @click="getModifyLogs(scope.row.id)"
              type="text"
              v-permission-button="'modifyLogs'"
            >
              修改日志
            </el-button>
            
             </template>
        </el-table-column>
      </el-table>
    </my-table>


 <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="1000px"
      max-height
      @close="resetForm('ruleForm')"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        inline
        style="width: 800px"
      >
<div class="row max-width">
        <div class="flex-2" >
       <el-form-item label="档案类型" prop="narchivesType" >
                <el-select v-model="ruleForm.narchivesType" placeholder="请选择" :disabled="dialogType==='edit'">
                  <el-option label="标准档案" value="0"></el-option>
                  <el-option label="定制档案" value="1"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="合作方式" prop="ncoopType">
                <el-select v-model="ruleForm.ncoopType" placeholder="请选择" :disabled="dialogType==='edit'">
                  <el-option label="采购分销" value="0"></el-option>
                  <el-option label="一件代发" value="1"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="客户名称" prop="nbaseInfoId" v-show="ruleForm.narchivesType=='1'">
       
                 <el-select
            filterable
            placeholder="请选择客户"
            @change="selectCustomerUser"
            v-model="ruleForm.nbaseInfoId"
            :disabled="dialogType==='edit'"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>

          <!-- <el-autocomplete
          v-model="ruleForm.ncCode"
          :fetch-suggestions="querySearchAsync"
          placeholder="请选择客户"
             :trigger-on-focus="false"
        ></el-autocomplete> -->
       </el-form-item>
       <el-form-item label="平台服务费（百分比）" prop="nplatformFeeRate">
               <el-input-number
                  v-model="ruleForm.nplatformFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
             <el-form-item label="推广宣传费（百分比）" prop="npublicityFeeRate">
               <el-input-number
                  v-model="ruleForm.npublicityFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
              <el-form-item label="其它销售费用（百分比）" prop="notherSaleFeeRate">
               <el-input-number
                  v-model="ruleForm.notherSaleFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
               size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
                     <el-form-item label="仓储费（百分比）" prop="nstorageFeeRate">
               <el-input-number
                  v-model="ruleForm.nstorageFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
               size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
       <el-form-item label="运输费（百分比）" prop="ntransportFeeRate">
               <el-input-number
                  v-model="ruleForm.ntransportFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
        </div>

        <div class="flex-2" >
       <el-form-item label="客户等级" prop="ncustomerGrade" >
                <el-select v-model="ruleForm.ncustomerGrade" placeholder="请选择" :disabled="dialogType==='edit'|| ruleForm.narchivesType=='1'">
                  <el-option label="一般客户" value="1"></el-option>
                  <el-option label="战略客户" value="2"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="渠道类型" prop="nchannelTypeCode">
                <el-select v-model="ruleForm.nchannelTypeCode" placeholder="请选择" :disabled="dialogType==='edit' || ruleForm.narchivesType=='1'">
                  <el-option  v-for="(item, index) in channelTypes" :key="index"  :label="item.name" :value="item.code"></el-option>
                </el-select>
       </el-form-item>
       <el-form-item label="店铺名称" prop="nshopId" v-if="ruleForm.narchivesType=='1'">
            <el-select filterable  placeholder="请选择店铺"  v-model="ruleForm.nshopId" :disabled="dialogType==='edit'">
              <el-option
                v-for="(item, index) in shops"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
       </el-form-item>





       <el-form-item label="渠道费用（百分比）" prop="nchannelFeeRate">
               <el-input-number
                  v-model="ruleForm.nchannelFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>
 
       
       <el-form-item label="营业税金（百分比）" prop="nsalesTaxRate">
               <el-input-number
                  v-model="ruleForm.nsalesTaxRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>

       <el-form-item label="资金占用费（百分比）" prop="nfundPossessionFeeRate">
               <el-input-number
                  v-model="ruleForm.nfundPossessionFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                 size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>

              <el-form-item label="固定管理费用（百分比）" prop="nmanageFeeRate">
               <el-input-number
                  v-model="ruleForm.nmanageFeeRate"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                 size="small"
                  :min="0.0"
                  :max="100.0"
                ></el-input-number>
                <span> %</span>
       </el-form-item>

       <el-form-item label="运输费（定额）" prop="ntransportFee">
               <el-input-number
                  v-model="ruleForm.ntransportFee"
                  :precision="2"
                  controls-position="right"
                  :step="0.1"
                  size="small"
                  :min="0.0"
                ></el-input-number>
       </el-form-item>  
               </div>
      </div>
      </el-form>
         <div slot="footer" class="align-center">
        <el-button type="primary" :loading="saveBtnLoading" @click="submit" style="margin-right:20px">保 存</el-button>
        <el-button @click="resetForm('ruleForm')">关 闭</el-button>
      </div>
    </my-dialog>


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
          <el-table-column prop="beforeBean" label="修改前内容" min-width="250px">
          </el-table-column>
          <el-table-column prop="afterBean" label="修改后内容" min-width="250px">
          </el-table-column>
        </el-table>
      </my-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  getChannelServiceFeePages,
  saveChannelServiceFee,
  editChannelServiceFee,
  deleteChannelServiceFee,
  enableChannelServiceFee,
disableChannelServiceFee,
getOfferModifyLogPages
} from '@/api/profitRate'
import { getchoiceCustomers}from '@/api/channelPrice'
import { selectPage, findAll,getShopInfoListByBaseInfoId,getBaseInfoById} from '@/api/client'
import { getAllBaseInfoList } from "@/api/baseInfo";
import { formatDate } from '@/utils'
import {deepClone} from '@/utils'
import JSONbig from 'json-bigint'

// import FileSaver from 'file-saver'
export default {
  name: 'serviceFee',
  components: {},
  data() {
    return {
      isStandard:false,
      showLogs: false,
      tableData: [],
      logsData: [],
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
          key: 'channelTypeCode',
          label: '渠道类型',
           clearable: true,
          placeholder: '输入渠道类型',
          options: [{ label: '全部', value: null }],
          type: 'select'
        },
        {
          key: 'archivesType',
          label: '档案类型',
          placeholder: '输入档案类型',
           clearable: true,
          options: [
            { label: '全部', value: null },
            { label: '标准档案', value: '0' },
            { label: '定制档案', value: '1' }
          ],
          type: 'select'
        },
        {
          key: 'customerGrade',
          label: '客户等级',
          placeholder: '输入客户等级',
          options: [
            { label: '全部', value: null },
            { label: '一般客户', value: '1' },
            { label: '战略客户', value: '2' }
          ],
          type: 'select'
        }
        ],
      searchQuery: {
        customerName: '',
        shopName: '',
        ncCode: '',
        archivesType: '',
        customerGrade: '',
        coopType: '',
        channelTypeCode: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      channelTypes:[],
      baseInfoData:[],
      shops:[],
      dialogVisible: false,
      saveBtnLoading:false,
      dialogType: "add", // 弹窗类型：新增add、编辑edit
      ruleForm: {
        nid:"",
        nbaseInfoId: "",//客户编码
        nncCode:"",
        nshopId: "",//客户关联店铺id
        narchivesType: "",//档案类型
        ncustomerGrade: "",//客户等级
        ncoopType:"",//合作方式
        nchannelTypeCode:"",//渠道类型编码
        nchannelType:"",//渠道类型
        nplatformFeeRate: 0,//平台服务费（百分比）
        nchannelFeeRate: 0,//渠道费用（百分比）
        npublicityFeeRate:0,//推广宣传费（百分比）
        ntransportFeeRate: 0,//运输费（百分比）
        ntransportFee: 0,//运输费（定额）
        nsalesTaxRate: 0,//营业税金（百分比）
        notherSaleFeeRate: 0,//其它销售费用（百分比）
        nfundPossessionFeeRate: 0,//资金占用费（百分比）
        nstorageFeeRate:0,//仓储费（百分比）
        nmanageFeeRate:0//固定管理费用（百分比）
      },
      newRuleForm: {
        nid:"",
        nbaseInfoId: "",//客户编码
        nncCode:"",
        nshopId: "",//客户关联店铺id
        narchivesType: "",//档案类型
        ncustomerGrade: "",//客户等级
        ncoopType:"",//合作方式
        nchannelTypeCode:"",//渠道类型编码
        nchannelType:"",//渠道类型
        nplatformFeeRate: 0,//平台服务费（百分比）
        nchannelFeeRate: 0,//渠道费用（百分比）
        npublicityFeeRate:0,//推广宣传费（百分比）
        ntransportFeeRate: 0,//运输费（百分比）
        ntransportFee: 0,//运输费（定额）
        nsalesTaxRate: 0,//营业税金（百分比）
        notherSaleFeeRate: 0,//其它销售费用（百分比）
        nfundPossessionFeeRate: 0,//资金占用费（百分比）
        nstorageFeeRate:0,//仓储费（百分比）
        nmanageFeeRate:0//固定管理费用（百分比）
      },
      rules: {
        narchivesType: [
          { required: true, message: "请选择档案类型", trigger: "blur" }
        ],
        // nbaseInfoId: [
        //   { required: this.ruleForm.narchivesType==='1', message: "请选择客户信息", trigger: "blur" }
        // ],
        // nshopId: [
        //   { required:  this.ruleForm.narchivesType==='1', message: "请选择店铺信息", trigger: "blur" }
        // ],
        ncustomerGrade: [
          { required: true, message: "请选择客户等级", trigger: "blur" }
        ],
        ncoopType: [
          { required: true, message: "请选择合作方式", trigger: "blur" }
        ],
        nchannelTypeCode: [
          { required: true, message: "请选择渠道类型", trigger: "blur" }
        ],
        nplatformFeeRate: [
          { required: true, message: "请输入平台服务费（百分比）", trigger: "blur" }
        ],
        nchannelFeeRate: [
          { required: true, message: "请输入渠道费用（百分比）", trigger: "blur" }
        ],
        npublicityFeeRate: [
          { required: true, message: "请输入推广宣传费（百分比）", trigger: "blur" }
        ],
        ntransportFeeRate: [
          { required: true, message: "请输入运输费（百分比）", trigger: "blur" }
        ],
        ntransportFee: [
          { required: true, message: "请输入运输费（定额）", trigger: "blur" }
        ],
        nsalesTaxRate: [
          { required: true, message: "请输入营业税金（百分比）", trigger: "blur" }
        ],
        notherSaleFeeRate: [
          { required: true, message: "请输入其它销售费用（百分比）", trigger: "blur" }
        ],
        nfundPossessionFeeRate: [
          { required: true, message: "请输入资金占用费（百分比）", trigger: "blur" }
        ],
        nstorageFeeRate: [
          { required: true, message: "请输入仓储费（百分比）", trigger: "blur" }
        ],
        nmanageFeeRate: [
          { required: true, message: "请输入固定管理费用（百分比）", trigger: "blur" }
        ]
      },

      model: {},
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
    dialogTitle() {
      if (this.dialogType === "add") {
        return "添加服务费档案";
      } else if (this.dialogType === "edit") {
        return "编辑服务费档案";
      }

      return "";
    }
  },
  created() {
      this.initChannelTypeList()
    this.fetchTableData() // 加载表格数据
    this. fetchBaseInfoData()
  },
  mounted() {},
  methods: {
    // 加载表格数据
    async fetchTableData() {
      this.tableLoading = true
      this.searchQuery.customerName=this.searchQuery.customerName.trim()
       this.searchQuery.shopName=this.searchQuery.shopName.trim()
       this.searchQuery.ncCode=this.searchQuery.ncCode.trim()
      
      let params = _.cloneDeep(this.searchQuery)
      if(params.channelTypeCode){
        let  channelTypeCode=params.channelTypeCode.split("|")
        params.channelTypeCode=channelTypeCode[0]
      }

      getChannelServiceFeePages(params).then((res) => {
         this.tableLoading = false
        if (res) {
          this.tableData = res.records
          this.searchQuery.total = res.total
        }
      })
     
    },
    initChannelTypeList() {
      findAll().then((res) => {
        this.channelTypes = res
        res.forEach((item) => {
          let channelType = {}
          channelType.value =item.code+"|"+ item.name
          channelType.label = item.name
          this.searchForm[3].options.push(channelType)
        })
      })
    },
   
    fetchBaseInfoData() {
      getchoiceCustomers().then(res => {
        this.baseInfoData = res;
      });
    },
    selectCustomerUser(item){
        this.ruleForm.nshopId= null
        this.ruleForm.nbaseInfoId=item

          getBaseInfoById(item).then(res=>{
              if(res){
                console.info(res.customerGrade)
                this.ruleForm.ncustomerGrade=(!res.customerGrade||res.customerGrade==='1')?'1':'2'
                this.ruleForm.nchannelTypeCode=res.channelTypeCode
                this.ruleForm.nncCode=res.ncCode
              }
         })

        getShopInfoListByBaseInfoId(item).then((res) => {
          this.shops = res
        })
    },
    enable(item){
        enableChannelServiceFee(item.id)
          .then((res) => {
            this.$message.success('服务费档案启用成功')
            item.status='0'
          })
          .catch((e) => {
            this.$message.success('服务费档案启用失败')
          })
    },
    disable(item){
        disableChannelServiceFee(item.id)
          .then((res) => {
            this.$message.success('服务费档案禁用成功')
            item.status='1'
          })
          .catch((e) => {
            this.$message.success('服务费档案禁用失败')
          })
    },


    // 新增
    add() {
     this.dialogType='add'
     this.dialogVisible=true
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.ruleForm=_.cloneDeep(this.newRuleForm)
     
    },
    // 保存
    submit() {
       this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
      
      if(this.ruleForm.narchivesType==='1' &&!this.ruleForm.nbaseInfoId){
        this.$message.error('客户名称不能为空')
           return 
      }
      // if(this.ruleForm.narchivesType==='1' &&!this.ruleForm.nshopId){
      //   this.$message.error('店铺名称不能为空')
      //      return 
      // }
      //新增保存
      this.saveBtnLoading=true
      this.channelTypes.forEach(item=>{
         if(item.code==this.ruleForm.nchannelTypeCode){
           this.ruleForm.nchannelType=item.name
          
         }
      })
      if (this.dialogType==='add') {
        saveChannelServiceFee(this.getParam(this.ruleForm))
          .then((res) => {
            this.$message.success('服务费用档案保存成功')
            this.fetchTableData()
            this.dialogVisible=false
          })
          .finally(() => {
             this.saveBtnLoading=false
          })
      }
      //修改保存
      else {
        editChannelServiceFee(this.getParam(this.ruleForm))
          .then((res) => {
            this.$message.success('服务费用档案保存成功')
            this.fetchTableData()
            this.dialogVisible=false
          })
          .finally(() => {
             this.saveBtnLoading=false
          })
      }
      }})
    },
    onChange() {
      this.fetchTableData()
    },
    del(item) {
       this.$confirm('档案删除后不可恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            deleteChannelServiceFee(item.id)
              .then((res) => {
                this.$message.success('服务费档案删除成功')
                this.fetchTableData()
              })
          .catch((e) => {
            this.$message.error(e)
          })
      })
    },
    edit(item) {
     this.dialogType='edit'
     this.dialogVisible=true
     this.ruleForm.nid=item.id
     this.ruleForm.nbaseInfoId=item.baseInfoId//客户编码
     this.ruleForm.nncCode=item.ncCode,
     this.ruleForm.nshopId= item.shopId //客户关联店铺id
     this.ruleForm.narchivesType=item.archivesType//档案类型
     this.ruleForm.ncustomerGrade=item.customerGrade//客户等级
     this.ruleForm.ncoopType=item.coopType//合作方式
     this.ruleForm.nchannelTypeCode=item.channelTypeCode//渠道类型编码
     this.ruleForm.nchannelType=item.channelType//渠道类型
     this.ruleForm.nplatformFeeRate=item.platformFeeRate//平台服务费（百分比）
     this.ruleForm.nchannelFeeRate=item.channelFeeRate//渠道费用（百分比）
     this.ruleForm.npublicityFeeRate=item.publicityFeeRate//推广宣传费（百分比）
     this.ruleForm.ntransportFeeRate=item.transportFeeRate//运输费（百分比）
     this.ruleForm.ntransportFee=item.transportFee//运输费（定额）
     this.ruleForm.nstorageFeeRate=item.storageFeeRate//仓储费（百分比）
     this.ruleForm.nsalesTaxRate=item.salesTaxRate//营业税金（百分比）
     this.ruleForm.notherSaleFeeRate=item.otherSaleFeeRate//其它销售费用（百分比）
     this.ruleForm.nfundPossessionFeeRate=item.fundPossessionFeeRate//资金占用费（百分比）
     this.ruleForm.nmanageFeeRate=item.manageFeeRate//固定管理费用（百分比）
     if(item.archivesType&&item.archivesType=="1"){
      getShopInfoListByBaseInfoId(item.baseInfoId).then((res) => {
      this.shops = res
    })
     }

    },

    getParam(item){
    let  newRuleForm={}
     newRuleForm.id=item.nid
     newRuleForm.baseInfoId=item.nbaseInfoId//客户编码
     newRuleForm.ncCode=item.nncCode,
     newRuleForm.shopId= item.nshopId //客户关联店铺id
     newRuleForm.archivesType=item.narchivesType//档案类型
     newRuleForm.customerGrade=item.ncustomerGrade//客户等级
     newRuleForm.coopType=item.ncoopType//合作方式
     newRuleForm.channelTypeCode=item.nchannelTypeCode//渠道类型编码
     newRuleForm.channelType=item.nchannelType//渠道类型
     newRuleForm.platformFeeRate=item.nplatformFeeRate//平台服务费（百分比）
     newRuleForm.channelFeeRate=item.nchannelFeeRate//渠道费用（百分比）
     newRuleForm.publicityFeeRate=item.npublicityFeeRate//推广宣传费（百分比）
     newRuleForm.transportFeeRate=item.ntransportFeeRate//运输费（百分比）
     newRuleForm.transportFee=item.ntransportFee//运输费（定额）
     newRuleForm.storageFeeRate=item.nstorageFeeRate//仓储费（百分比）
     newRuleForm.salesTaxRate=item.nsalesTaxRate//营业税金（百分比）
     newRuleForm.otherSaleFeeRate=item.notherSaleFeeRate//其它销售费用（百分比）
     newRuleForm.fundPossessionFeeRate=item.nfundPossessionFeeRate//资金占用费（百分比）
     newRuleForm.manageFeeRate=item.nmanageFeeRate//固定管理费用（百分比）
     return  newRuleForm;
    },
getModifyLogs(id) {
      this.showLogs = true
      this.logsLoading = true
      this.logSearchQuery.relationField = id
       this.logSearchQuery.logType='updateChannelServiceFee'
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

</style>
