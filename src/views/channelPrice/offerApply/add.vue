<template>
  <div class="profitRate-page">
     <div style="text-align: center;margin-bottom: 25px;">定价申请单编辑</div>
     <div style="text-align: left;margin-bottom: 10px;">客户信息</div>
     <el-form :model="applyData" ref="ruleForm" label-width="200px" inline  class="newfrom" :rules="rules">
       <el-form-item label="客户名称" prop="baseInfoId" >
       
         <el-select
            filterable
            placeholder="请选择客户"
            @change="selectCustomerUser"
            v-model="applyData.baseInfoId"
          >
            <el-option
              v-for="(item, index) in baseInfoData"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
       </el-form-item>
       <el-form-item label="店铺名称"  prop="shopId"  >
           <el-select filterable  placeholder="请选择店铺"  v-model="applyData.shopId"   clearable>
              <el-option
                v-for="(item, index) in shops"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
          </el-select>
       
       </el-form-item>
       <el-form-item label="合作方式"   prop="coopType" >         
         <el-select v-model="applyData.coopType" >
            <el-option label="采购分销" value="0"></el-option>
            <el-option  label="一件代发" value="1"></el-option>
                </el-select>
      </el-form-item>
       <el-form-item label="客户等级"  prop="customerGrade" >              
         <el-select v-model="applyData.customerGrade" :disabled="true">
            <el-option label="一般客户" value="1"></el-option>
            <el-option  label="战略客户" value="2"></el-option>
                </el-select>
      </el-form-item>
       <el-form-item label="渠道类型"  prop="channelTypeCode">
            <el-select v-model="applyData.channelTypeCode" placeholder="请选择" :disabled="true">
                  <el-option  v-for="(item, index) in channelTypes" :key="index"  @change="selectChannelType"
                   :label="item.name" :value="item.code">

                  </el-option>
                </el-select>
        </el-form-item>
       <el-form-item label="业务归属主体"  prop="saleCompanyCode">
                 <el-select ref="selectRef" v-model="applyData.saleCompanyCode" @change="selectCompanyInfo" filterable >
            <el-option
              v-for="item in companyInfo"
              :key="item.id"
              :label="item._fullname"
              :value="item._subcompanyid">
            </el-option>
          </el-select>
       </el-form-item>
       <el-form-item label="业务归属部门"  prop="saleDepartCode" >
                
          <el-cascader :props="defaultParams"
                       :options="departments"
                       v-model="applyData.saleDepartCode"
                       @change="onChangeCas"
                       :disabled="!applyData.saleCompanyCode"
          ></el-cascader>
        </el-form-item>
       <el-form-item label="结算方式"  prop="closeMethod"><el-input v-model="applyData.closeMethod" :disabled="true"></el-input></el-form-item>
       <el-form-item label="账期天数"  v-if="applyData.closeMethod==='月结'">
            <el-input-number
                  v-model="applyData.paymentDay"
                  :step="1"
                  size="small"
                  controls-position="right"
                  :min="1"
                    ></el-input-number>
       </el-form-item>
       <el-form-item label="是否退换货" prop="isCannel">
                <el-select v-model="applyData.isCannel" >
            <el-option label="非退货" value="0"></el-option>
            <el-option  label="退货" value="1"></el-option>
                </el-select>
       </el-form-item>
     </el-form>
     
     <!--申请单商品数据-->
     <div style="text-align: left;margin-bottom: 10px;">报价明细</div>
     <div slot="before-table" >
     <div class="mb10 row">
        <el-upload action="#" :http-request="onImport" :show-file-list="false" class="mlr10" v-permissionButton="'upload'" 
        v-if="applyData.baseInfoId  && applyData.coopType">
            <el-button type="primary" >导入</el-button>
          </el-upload>
        <el-button  type="primary" @click="onDownload" style="margin-right:10px"  v-permissionButton="'export'">下载模板</el-button>
                <el-tooltip effect="dark" :content="tip" >
          <span style="color: #888;margin-top:5px">
            <i class="el-icon-question ml6;"></i>
          </span>
        </el-tooltip>
        <el-button  type="danger" style="margin-left:10px" @click="deleteSku" v-if="applyData.baseInfoId  && applyData.coopType"
        >删除</el-button>
    
      </div>
    </div>
      <el-table
        :data="tableData"
        border
        stripe
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
        height="500px"
        style=" border-radius: 10px;"
      >
         <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" fixed="left"></el-table-column>
        <el-table-column prop="spuName" label="商品名称" min-width="200px" fixed="left"></el-table-column>
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
        <el-table-column  label="本次合作价" min-width="120px" >
              <template slot-scope="scope">
                        <el-input
                  v-model="scope.row.currentMsrp"
                  
                  style="width:90px"
                  @input="calMsrp(scope.row)"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  ></el-input>
                    
                    
              </template>
        </el-table-column>
        <el-table-column prop="currentProfitRates" label="" min-width="90px">
           <template slot="header">
                  <el-tooltip effect="dark" content="合作价毛利率：（1 - 成本价 / 本次合作价）* 100" placement="top">
                    <span>合作价毛利率<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
          <template slot-scope="scope"><div style="color: blue;">{{scope.row.currentProfitRates}}%</div></template></el-table-column>
        <el-table-column prop="amplitude" label="">
          <template slot="header">
                  <el-tooltip effect="dark" content="调幅差：合作价毛利率 - 建议渠道价毛利率" placement="top">
                    <span>调幅差<i class="el-icon-info ml6"></i></span>
                  </el-tooltip> 
                </template>
          <template slot-scope="scope">
            <div v-if="scope.row.amplitude<=5 && scope.row.amplitude>=-5" style="color: blue;">{{scope.row.amplitude}}%</div>
            <div v-else style="color: red;">{{scope.row.amplitude}}%</div>
            </template></el-table-column>
      </el-table>
 
  <div slot="before-table">
      <div class="pb10 btn" style="margin:auto">
        <el-button  v-if="tableData && tableData.length>0" type="success"  @click="saveAppy()" style="margin-right:20px" v-permission-button="'approved'">保存</el-button>  
        <el-button  type="danger"  @click="goBack()">返回列表</el-button>                     
      </div>
    </div> 

       <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      title="导入商品信息"
      width="80%"
      style=" border-radius: 15px;"
      > 
      <div style="margin-bottom:20px">    
            <el-table
        :data="tempTableData"
        border
        stripe
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
         height="400px"
      >
         <el-table-column prop="validateMsg" label="校验信息"><template slot-scope="scope"><div style="color: red;">{{scope.row.validateMsg}}</div></template></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
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
        <el-table-column prop="spuName" label="商品名称" ></el-table-column>
         <el-table-column prop="codeBar" label="商品条码" ></el-table-column>
        <el-table-column prop="atbkeyValue" label="主/副属性"></el-table-column>
        <el-table-column prop="brand" label="品牌" ></el-table-column>
        <el-table-column prop="wholesaleSpec" label="箱规" ></el-table-column>
        <el-table-column prop="currentMsrp" label="本次合作价"></el-table-column>
        <el-table-column prop="channelTypeName" label="渠道类型"></el-table-column>
        
        </el-table>
        </div>   
    <div slot="footer" class="align-center">
        <el-button type="primary" @click="importData()"  style="margin-right:20px">导 入</el-button>
        <el-button @click="closeDialog()">关 闭</el-button>
      </div>
    </my-dialog>  
  </div>
</template>
<script>
import {
getChannelOfferApply,getListGoods,updateApplyGoods,channelOfferApply,importValidate,importGoods,saveChannelOfferApply,downloadChannelOfferApplyTmpl
} from '@/api/profitRate'
import { getchoiceCustomers}from '@/api/channelPrice'
import { formatDate ,toNumberStr,accAdd,accSub,accMul,accDiv} from '@/utils'
import { selectPage, findAll,getShopInfoListByBaseInfoId,getBaseInfoById,getOAThreeSub,getDepartment} from '@/api/client'
import { getAllBaseInfoList } from "@/api/baseInfo";
import {getAllCompanyInfo} from "@/api/agreement";
import FileSaver from 'file-saver';
export default {
  name: 'offerApplyView',
  components: {},
  data() {
    return {
      tip:'导入模板与“渠道报价查询”功能导出报价excle一致，可使用与客户确认报价后的excle直接导入。',
      dialogVisible:false,
      applyData: {
        baseInfoId: "",//客户编码
        shopId: "",//客户关联店铺id
        customerGrade: "",//客户等级
        coopType:"",//合作方式
        channelTypeCode:"",//渠道类型编码
        channelType:"",//渠道类型
        closeMethod:"",
        ncCode:"",
        goodsSaveVoList:[],
        isCannel:"",
        paymentDay:0,
        saleCompanyCode:"",
        saleCompanyName:"",
        saleDepartCode:"",
        saleDepartName:"",

      },
      tableData: [],
      channelTypes:[],
      baseInfoData:[],
      companyInfo:[],
      tempTableData:[],
      shops:[],
      multipleSelection:[],
       rules: {
        baseInfoId: [{ required: true, message: "请选择客户名称", trigger: "blur" }],
        shopId: [{ required: false, message: "请选择店铺名称", trigger: "blur" }],
        coopType: [{ required: true, message: "请选择合作方式", trigger: "blur" }],
        customerGrade: [{ required: true, message: "请选择客户等级", trigger: "blur" }],
        channelTypeCode: [{ required: true, message: "请选择渠道类型", trigger: "blur" }],
        closeMethod: [{ required: true, message: "请选择结算方式", trigger: "blur" }],
        isCannel: [{ required: true, message: "请选择是否退换货", trigger: "blur" }],
        saleCompanyCode: [{ required: true, message: "请选择业务归属主体", trigger: "blur" }],
        saleDepartCode: [{ required: true, message: "请选择业务归属部门", trigger: "blur" }],
      },
      allDepartment:[],
      departments:[],//所属公司部门
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
     
      },
    }
  },
  computed: {
  },
  created() {

  
  },
  mounted() {
    this.fetchBaseInfoData();
     this.initChannelTypeList();
     this.getAllCompanyInfo();
  },
  methods: {
    fetchBaseInfoData() {
      getchoiceCustomers().then(res => {
        this.baseInfoData = res;
      });
    },
    getAllCompanyInfo(){
      return getOAThreeSub().then(res => {
        this.companyInfo = res;
      });
    },
    getDepartmentInfo(ompanyid){
      this.allDepartment=[]
        getDepartment(ompanyid).then(res=>{
         this.allDepartment=res
        })
    },
    selectCompanyInfo(value){
        this.companyInfo.forEach(item=>{
          if(item._subcompanyid==value){
            this.applyData.saleCompanyName=item._fullname
            this.departments=item.departmentBeanList
          
          }
        })
       
this.departments=this.departments.map(item=>{
     if(!item.departmentBeanList||item.departmentBeanList.length<=0){
       item.departmentBeanList=null
     }
     return item
     
})
  this.getDepartmentInfo(value)
    },
    onChangeCas(data){
      let name=''
      data.forEach(item=>{
           this.allDepartment.forEach(item2=>{
              if(item==item2._departmentid){
                if(name!=''){
                  name=name+'/'
                }
                name=name+item2._fullname
              }
           })
      })
      this.applyData.saleDepartCode=data[data.length-1]
    this.applyData.saleDepartName=name
    },
        selectChannelType(value){
                 this.channelTypes.forEach(item=>{
          if(item.code==value){
             this.applyData.channelType=item.name
          }
        })
    },
    initChannelTypeList() {
      findAll().then((res) => {
        this.channelTypes = res
      })
    },
     selectCustomerUser(item){
        this.applyData.shopId= null
        this.applyData.baseInfoId=item

          getBaseInfoById(item).then(res=>{
              if(res){
                this.applyData.customerGrade=(!res.customerGrade||res.customerGrade==='1')?'1':'2'
                this.applyData.channelTypeCode=res.channelTypeCode
                this.applyData.closeMethod=res.closeMethod
                this.applyData.ncCode=res.ncCode
                if(!this.applyData.customerGrade||!this.applyData.channelTypeCode){
                this.$message.warning('此客户未维护渠道类型或客户等级信息，请先前往"客户档案"进行维护!')
                }
              }
         })
         

        getShopInfoListByBaseInfoId(item).then((res) => {
          this.shops = res
        })
    },
     async  getChannelOfferApply(){
       this.$store.commit("SHOW_LOADING");
       getChannelOfferApply(this.applyId).then((res) => {
        if (res) { 
          this.applyData = res
          this.getListGoods()
        }
        this.$store.commit("SHOW_LOADING",false);
      }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      })
     },
     onImport(data) {
       this.$store.commit("SHOW_LOADING");
      const formData = new FormData()
      formData.append("file", data.file)
      
      importValidate(formData).then(res => {
         this.$store.commit("SHOW_LOADING",false);
          this.tempTableData=res
          this.showDialog()
         
      }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
        
      })
    },

    onDownload() {
      // this.loadingBtn = 'download'
      // downloadCustomerLevelTmpl().then(blob => {
      //   FileSaver.saveAs(blob, '重点客户名单excel导入模版.xlsx')
      // }).finally(() => {
      //   this.loadingBtn = ''
      // })
    },
    importData(){
     let isError=false
     let skuSns=[]
        this.tempTableData.forEach(item=>{
          skuSns.push(item.skuSn)
            if(item.validateMsg){
                isError=true
            }
        })
      if(isError){
        this.$message.warning('导入失败，导入报价商品信息有误，请更正后再导入')
        return
      }

      this.getListGoods(skuSns);

    },
    deleteSku(){
      if(!this.multipleSelection || this.multipleSelection.length<=0){
        this.$message.error('删除失败，请选择商品后再删除')
        return 
      }
         this.multipleSelection.filter((s) => {
              this.tableData.filter((t, index) => {
                if (s.skuSn === t.skuSn) {
                  this.tableData.splice(index, 1)
                }
              })
            })
    },
    saveAppy(){
       this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
      this.$store.commit("SHOW_LOADING","申请单保存中");
      this.applyData.goodsSaveVoList=[]
        this.tableData.forEach(item=>{
          this.applyData.goodsSaveVoList.push({skuSn:item.skuSn,currentMsrp:item.currentMsrp,spuId:item.spuId,skuId:item.skuId})
        })
        this.selectChannelType(this.applyData.channelTypeCode)
        saveChannelOfferApply(this.applyData).then(res=>{
          this.$store.commit("SHOW_LOADING",false);
           this.$message.success('申请单保存成功')
           this.goBack()
        }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
        
      })
        
       }else{
          this.$message.error('保存失败，申请单必填项为空')
       }
       })
    },

    // 加载表格数据
    async getListGoods(skuSns) {
       this.$store.commit("SHOW_LOADING","导入中");
      let param={
        ncCode:this.applyData.ncCode,
        shopId:this.applyData.shopId,
        customerGrade:this.applyData.customerGrade,
        coopType:this.applyData.coopType,
        channelTypeCode:this.applyData.channelTypeCode,
        skuSns:skuSns
      }
      await importGoods(param).then((res) => {
        this.$store.commit("SHOW_LOADING",false);
        this.closeDialog();
        if (res) {
          this.tableData=res.map(sku=>{
                this.tempTableData.forEach(tsku=>{
                  if(sku.skuSn==tsku.skuSn){
                      sku.currentMsrp=tsku.currentMsrp
                       
                    }
                })
                this.calMsrp(sku)
                return sku
          })
          this.tempTableData=[]    
          this.this.multipleSelection = []
        }
         
      }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
        
      })
     
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
    },

    calMsrp(obj){
      //成本价计算
 obj.currentProfitRates=!obj.currentMsrp||obj.currentMsrp==0?0:accSub(100,accMul(accDiv(obj.costPrice,obj.currentMsrp).toFixed(4),100).toFixed(2))
      obj.amplitude=accSub(obj.currentProfitRates,obj.channelProfitRates)
    },
    goBack(){
      this.$eventHub.$emit(this.$eventName.CUSTOMER_CHANNEL_OFFER_APPLY_REFLUSH)
      this.$router.push({name: "offerApply"});
    },
    showDialog(){
      this.dialogVisible=true  
    },
    closeDialog(){
      this.dialogVisible=false
    },
    onDownload() {
      this.$store.commit("SHOW_LOADING","模板导出中");
      downloadChannelOfferApplyTmpl().then(blob => {
        FileSaver.saveAs(blob, '渠道报价excel导入模版.xlsx')
         this.$store.commit("SHOW_LOADING",false);
      }).catch(() => {
        this.$store.commit("SHOW_LOADING",false);
      }).finally(() => {
        
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
.newfrom {
      background-color: white;
    margin-bottom: 20px;
    margin-top: 20px;
    padding-top: 20px;
    border-radius: 10px;
}

</style>
