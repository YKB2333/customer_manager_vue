<template>
  <div :class="active==1?'newfrom newfromWidth':'newfrom'"  >
    <div class="stepStyle">
     <el-steps :active="active"  >
          <el-step title="计划内容" @click.native="active=1" ></el-step>
          <el-step title="拜访内容"  @click.native="active=2"></el-step>
        </el-steps>
        </div>
      <!-- 表单 -->
      <el-form v-if="active==1"  :disabled="identify == 1 ? true : false" label-width="200px" class="newform2 stepOneLeft" >
            <el-form-item class="content" label="计划单号" v-if="identify != 3">
                <el-input class="inputs" placeholder="请输入内容" v-model="id" :disabled="true" ></el-input>
            </el-form-item>
            <el-form-item  class="content"  label="计划说明" required>
              <el-input class="inputs "  placeholder="请输入内容" :maxlength="255" v-model="planDescribe"></el-input>
            </el-form-item>
            <el-form-item  class="content" required label="计划日期">
              <el-date-picker
                v-model="time"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                :default-time='["00:00:00", "23:59:59"]'
                range-separator="至" 
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="content" label="创建人" v-if="identify != 3">
                <el-input class="inputs" placeholder="请输入内容" v-model="creator" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item class="content" label="随行人员">
                <el-input class="inputs" placeholder="请输入内容" :maxlength="255" v-model="entourages"></el-input>
            </el-form-item>
            <el-form-item  class="content"  label="任务类型" required>
              <el-select  v-model="type" :disabled="(id > 0 || (estimate === true && identify == 3)) ? true : false">
                <el-option label="店铺拜访" value="1"></el-option>
                <el-option label="客户拜访" value="2"></el-option>
              </el-select>
            </el-form-item>
      </el-form>
      <!-- 插槽内容 -->
      <div v-if="active==2" class="customerList">
      <template >
        <div slot="before-table" >
          <div class="pb10">                     
            <el-button
              v-permission-button="'addclient'"
              type="primary"
              @click="addClient()"
              v-if="identify != 1"
              style="margin-right:10px"
            > {{type=="1"?"添加店铺":"添加客户"}}</el-button>
            <el-button  type="danger" v-permission-button="'delete'" v-if="identify != 1" @click="del">删除</el-button>
            <div style="float:right"><el-button type="info" v-permission-button="'calendarshows'" v-if="identify != 3"  @click="exhibition">日历展示</el-button></div>
          </div>
          </div>   
      </template>
      <el-table
        :data="tableData"
        border
        stripe
        @selection-change="currentChange"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="任务单号" width="125px">
          <template slot-scope="scope">
            <span>{{ scope.row.id ? scope.row.id + '' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerCode" label="客户编码" width="100"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" min-width="150"></el-table-column>
        <template v-if="type == 1">
          <el-table-column prop="shopCode" label="店铺号" width="100"></el-table-column>
          <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
        </template>
        <el-table-column label="拜访地址" width="400px">
          <template slot-scope="scope">
            <div>
            
              <span style="margin-left:10px;" >{{scope.row.address}}</span>
           <span style="color:red;" v-if="scope.row.address&&!scope.row.longitude">(缺少经纬度信息)</span>
             <span style="float: right" @click="addressForMap(scope)" ><el-link :underline="false" ><i class="el-icon-edit"></i></el-link></span>
             </div>
          </template>
        </el-table-column>
        <el-table-column label="任务计划日期" width="375px">
          <template slot-scope="scope">
            <span>
              <el-date-picker
                v-model="scope.row.dateScope"
                :disabled="identify == 1 ? true : false"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                :default-time='["00:00:00", "23:59:59"]'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否盘点库存"  width="100px">
          <template slot-scope="scope">
            <span>
              <el-select :disabled="identify == 1 ? true : false" v-model="scope.row.isCheckStock">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="identify != 1" label="操作"  fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission-button="'copytrip'"
              type="text"
              @click="copy(scope)"
              :disabled="identify == 1 ? true : false"
            >复制此行</el-button>
            <el-button
              v-permission-button="'deletetrip'"
              type="text"
              @click="deletClient(scope.row)"
              :disabled="identify == 1 ? true : false"
            >删除此行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 客户选择 @change="onChange"  @change="onChange"-->
      <el-dialog title="客户选择" :visible.sync="coopInfoFlag" width="45%">
        <el-form style="display:flex;flexWrap:wrap">
          <el-form-item class="contents" label="店铺号"  v-if="type != 2">
              <el-input class="inputs" placeholder="请输入内容" v-model="shopCode"></el-input>
          </el-form-item>
          <el-form-item class="contents" label="店铺名称"  v-if="type != 2">
            <el-input class="inputs" placeholder="请输入内容" v-model="shopName"></el-input>
          </el-form-item>
          <el-form-item class="contents" label="客户编码" >
              <el-input class="inputs" placeholder="请输入内容" v-model="customerCode"></el-input>
          </el-form-item>
          <el-form-item class="contents" label="客户名称" >
              <el-input class="inputs" placeholder="请输入内容" v-model="customerName"></el-input>
          </el-form-item>
          <el-form-item class="contents" label="业务员" v-if="type == '2'" >
              <el-input class="inputs" placeholder="请输入内容" v-model="salesman"></el-input>
          </el-form-item>
          <div class="pb10 ml100">                     
            <el-button
              v-permission-button="'grabble'"
              type="primary"
              @click="calendar()"
              v-if="identify != 1"
            >搜索</el-button>
            <!-- <el-button  type="danger" @click="" v-if="identify != 1">提交审核</el-button> -->
            <el-button v-permission-button="'cancel'" class="ml20"  @click="clearInput()">清除</el-button>
          </div>
        </el-form>
        <!-- 插槽内容 -->  
        <el-table
          :data="addtableData"
          border
          stripe
          height="300"
          @selection-change="currentChange1"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="customerCode" label="客户编码"></el-table-column>
          <el-table-column prop="customerName" label="客户名称"></el-table-column>
          <el-table-column prop="shopName" label="店铺名称" v-if="type == '1' ">
          </el-table-column>
        </el-table>
        <div class="pb10 add-btn">
          <el-button  type="danger" v-permission-button="'cancel'" @click="coopInfoFlag = false">取消</el-button>                     
          <el-button
            v-permission-button="'acknowledgement'"
            type="primary"
            @click="determine()"
          >确认</el-button>
        </div>
      </el-dialog>
    
    <!-- 日历展示 -->
    <el-dialog title="" :visible.sync="calendarFlag" width="65%">
      <el-calendar>
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p>{{data.day.split('-').slice(2).join('-')}}</p>
          <div class="div-one">
            <div v-for="(item,index) in testData" :key="index">
              <p style="fontSize:12px">{{moment(date).format('YYYY-MM-DD')===moment(item.endDate).format('YYYY-MM-DD')? '●'+item.taskDescribe : ''}}</p>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-dialog>

    
      <div class="buttonCss" >
        <el-button  type="danger" @click="goback()" >返回列表</el-button>                     
        <el-button
        @click="active--"
         v-if="active==2"
        >上一步</el-button
      >
       <el-button
        @click="active++"
        v-if="active==1"
        >下一步</el-button>
        <el-button
          v-permission-button="'save'"
          type="primary"
          @click="saveClient()"
          v-if="identify != 1"
        >保存</el-button>
      </div>


    
    <!--地图地址选择-->
    <el-dialog
          :title="'地址选择'"
          :visible.sync="showMap"
          width="850px"
          top="2vh"
         custom-class="mapDialog"
          >
      <iframe id="mapPage" width="100%" height="100%" frameborder=0
        :src=mapSrc>
      </iframe>
    <div style="text-align:center">
      <el-button type="primary"  @click="getMapLocation" style="margin-right:10px">确 认</el-button>
      <el-button type="danger"  @click="showMap=false" >取 消</el-button>
    </div>
    </el-dialog>

  </div>
</template>


<script>
import { operateType } from "@/const/goods";
import moment from 'moment'
import {
  getCoopInfoListByBaseInfoId,
} from "@/api/client";
import Tags from "@/components/Tags";
import {
calendarShow,
getPlanApprovalLogsVisit,
cancelVisit,getOneVisitPlan,
saveVisitPlan,
addVisitplan,
submitForReview,
updateVisitPlan,
getVisitTaskOptions
} from "@/api/visitplan"
import { deepClone, formatDate } from "../../utils";
import FileSaver from "file-saver";
export default {
  name: "check",
  components: { Tags },
  data() {
    return {
      active:1,
      moment,
      calendarvalue:new Date(),
      identify:'',
      id:"",
      creator:"",
      planDescribe: "",
      time:[],
      entourages: "",
      type: "",
      operateType: operateType,
      tagVisible: false,
      dynamicTags: [],
      inputValue: "",
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() >= this.time[0] && time.getTime() <= this.time[1];
        // }
      },
      pickerOptions1: {},
      ChecksearchForm: [
        {
          key: "shopCode",
          label: "店铺号",
          placeholder: "",
          type: "input",
        },
        {
          key: "shopName",
          label: "店铺名称",
          placeholder: "",
          type: "input",
        },
        {
          key: "customerCode",
          label: "客户编码",
          placeholder: "",
          type: "input",
        },
        {
          key: "customerName",
          label: "客户名称",
          placeholder: "",
          type: "input",
        },
        {
          key: "salesman",
          label: "业务员",
          placeholder: "",
          type: "input",
        },
      ],
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0, // 总条数
      },
      ChecksearchQuery: {
        shopCode:"",
        shopName:"",
        customerCode: "",
        customerName: "",
        salesman: "",
      },
      shopCode:"",
      shopName:"",
      customerCode: "",
      customerName: "",
      salesman: "",
      tableData: [],
      addtableData:[],
      tableLoading: false,
      estimate:false,
      shopFlag: false,
      contactFlag: false,
      coopInfoFlag: false,
      calendarFlag:false,
      coopFlag: false,
      userId: "", // 路由传入id
      currentValue:[],
      currentValue1:[],
      testData: {},
       showMap:false,

      mapSrc:"https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp",
      tableDataIndex:0,
      maplocation:{}
    };
  },
  computed: {

  },
  created() {
    this.$eventHub.$off(this.$eventName.CUSTOMER_LIST_REFLUSH)
    this.$eventHub.$on(this.$eventName.CUSTOMER_LIST_REFLUSH, () => this.fetchTableData())
    this.userId = this.$route.query.id 
    this.identify = this.$route.query.identify
    this.fetchTableData() // 加载表格数据
   
  },

  mounted() {
    this.init();
     this.mapResponse()
  },
  methods: {
        addressForMap(scope){
        this.showMap=true
        this.tableDataIndex=scope.$index
        this.maplocation=null
        if(scope.row.longitude){
          let coord="coord="+scope.row.latitude+","+scope.row.longitude
          this.mapSrc=this.mapSrc+"&coord="+coord
        }
        
    },
    getMapLocation(){
      if(!this.maplocation||!this.maplocation.latlng||!this.maplocation.latlng.lng){
         this.$message({type: 'warning',message: '请选择地图地址'});
        return
      }
     this.tableData.forEach((item,index)=>{
        if(index == this.tableDataIndex){
          item.longitude=this.maplocation.latlng.lng
         item.latitude=this.maplocation.latlng.lat
         item.address=this.maplocation.poiaddress
         item.errorMsg=null
        }
      })
       this.showMap=false
    },

    mapResponse(){
    window.addEventListener('message', (event)=> {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        console.info("loc:",loc)
        this.maplocation= event.data
        }
    }, false);
    },
    clearInput() {
      this.shopCode = ''
      this.shopName = ''
      this.customerCode = ''
      this.customerName = ''
      this.salesman = ''
    },
    // 清空
    clear() {
      this.entourages = ''
      this.planDescribe = ''
      this.type = ''
      this.time = ''
    },
    // 添加客户搜索
    calendar() {
      let params ={
          id:this.id,
          creator:this.creator,
          planDescribe: this.planDescribe,
          srartCreateDate: this.time[0],
          endCreateDate: this.time[1],
          entourages: this.entourages,
          type: this.type,
          shopCode:this.shopCode,
          shopName:this.shopName,
          customerCode:this.customerCode,
          customerName:this.customerName,
          salesman:this.salesman,
          pageIndex: 1,
          pageSize: 10,
          orderStr: "id desc",
        }
        // params.taskList=this.$lodash.cloneDeep(this.ChecksearchQuery);
        console.log('params',params)
        getVisitTaskOptions(params).then((res) => {
          this.addtableData = res;
        });
    },

    // 日历展示
    exhibition() {
      calendarShow(this.userId).then((res)=>{
        this.testData = res
      })
      this.calendarFlag = true
    },

    // 添加客户-确认
    determine() {
      // console.info("this.currentValue1",this.currentValue1)
      // if(this.currentValue1&&this.currentValue1.length>0){
      //     this.currentValue1.forEach(item=>{
      //       if(item.address&&!item.longitude){
      //           item.errorMsg=
      //       }
      //     })
      // }
      if(this.identify == '3') {
        this.tableData = this.tableData.concat(this.currentValue1)
        this.estimate = true
      } else {
        this.tableData = this.tableData.concat(this.currentValue1)
      }
      this.coopInfoFlag = false
    },
    // 批量删除
    del() {
      this.$confirm('此操作将删除当前勾选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentValue.map(item=>{
            this.tableData = this.tableData.filter(it=>{
              return item !== it // item.id !== it.id
            })
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    currentChange(currentRow) {
      this.currentValue = currentRow
    },
    currentChange1(currentRow) {
      if(this.type == '1') {
        currentRow = currentRow.map((item)=>{
          item.isCheckStock = '是'
          return item
        })
      } else {
        currentRow = currentRow.map((item)=>{
          item.isCheckStock = '否'
          return item
        })
      }
      this.currentValue1 = currentRow
    },
    // 添加客户
    addClient(id) {
      if(this.planDescribe == '') {
        this.$message({type: 'warning',message: '请填写计划说明!'});
      } else if(this.time == '') {
        this.$message({type: 'warning',message: '请填写计划日期!'});
      } else if(this.type == '') {
        this.$message({type: 'warning',message: '请填写任务类型!'});
      } else if(this.type == '') {
        this.$message({type: 'warning',message: '请选择任务类型'});
      } else {
        // this.userId = id;
        let params ={
          id:this.id,
          creator:this.creator,
          planDescribe: this.planDescribe,
          srartCreateDate: this.time[0],
          endCreateDate: this.time[1],
          entourages: this.entourages,
          type: this.type,
          pageIndex: 1,
          pageSize: 10,
          orderStr: "id desc",
        }
        params.taskList=this.$lodash.cloneDeep(this.ChecksearchQuery);
        console.log('params',params)
        getVisitTaskOptions(params).then((res) => {
          this.addtableData = res;
          // this.searchQuery.total = res.count
        });
        this.coopInfoFlag = !this.coopInfoFlag;
      }
    },
    // 编辑保存/新增保存
    saveClient() {
      if(this.planDescribe == '') {
        this.$message({type: 'warning',message: '请填写计划说明!'});
        return
      } 
      if(this.time == '') {
        this.$message({type: 'warning',message: '请填写计划日期!'});
        return
      } 
       if(this.type == '') {
        this.$message({type: 'warning',message: '请填写任务类型!'});
        return
      }
      if(this.tableData&&this.tableData.length>0){
            let isAddressEmpty=false;
            let isDateEmpty=false;
            let isAddressLocationEmpty=false;
            this.tableData.forEach(item => {
              if(!item.dateScope||item.dateScope.size<=0){
                isDateEmpty=true;
              }
              if(!item.address){
                isAddressEmpty=true;
              }
              if(!item.longitude){
                isAddressLocationEmpty=true;
              }
            })
            if(isAddressEmpty||isDateEmpty){
                this.$message({type: 'warning',message: '拜访地址、拜访时间不能为空'});
                return
            }
            if(isAddressLocationEmpty){
                this.$message({type: 'warning',message: '拜访地址缺少经纬度信息，请点击右侧编辑按钮选择地址信息'});
                return
            }
      }
       
      
      if (this.identify == '3'){
          console.log('this.time[1]',this.time[1])
          let params ={
            id:this.id,
            creator:this.creator,
            planDescribe: this.planDescribe,
            startDate: this.time[0],
            endDate: this.time[1],
            entourages: this.entourages,
            type: this.type,
            taskList : this.tableData.map(tableData => {
              if(tableData.dateScope){
                tableData.startDate = tableData.dateScope[0]
                tableData.endDate = tableData.dateScope[1]
              }
              return tableData
            }),
            pageIndex: 1,
            pageSize: 10,
            orderStr: "id desc",
          }
          saveVisitPlan(params).then((res)=>{
            console.log(res,'updateVisitPlan')
            this.$message({type: 'success',message: '新增客户拜访计划保存成功！'});
            this.estimate = false
            this.clear()
            this.currentValue1 = []
            this.goback()
          })
      } else {
          let params ={
            id:this.id,
            creator:this.creator,
            planDescribe: this.planDescribe,
            startDate: this.time[0],
            endDate: this.time[1],
            entourages: this.entourages,
            type: this.type,
            taskList: this.tableData.map(tableData => {
              if(tableData.dateScope){
                tableData.startDate = tableData.dateScope[0]
                tableData.endDate = tableData.dateScope[1]
              }
              return tableData
            }),
            pageIndex: 1,
            pageSize: 10,
            orderStr: "id desc",
          }
          console.log('params',params)
          updateVisitPlan(params).then((res)=>{
            console.log(res,'updateVisitPlan')
            this.$message({type: 'success',message: '编辑客户拜访计划保存成功！'});
            this.goback()
          })
       }
    
    },
    goback() {
      this.$eventHub.$emit(this.$eventName.CUSTOMER_VISITING_PLAN_REFLUSH)
      this.$router.push({name: "VisitngPlan"});
    },
    // 初始化
    init() {
    },
    onChangeCas(e) {
      console.log(e);
    },
    // onChange() {
    //   this.fetchTableData();
    // },
    // 加载表格数据
    async fetchTableData() {
      if(this.identify == '3') {
        this.tableData = []
      } else {
        try {
          this.tableLoading = true;
          let res = await this.fetchClientList();
          this.id = JSON.parse(JSON.stringify(res.id))
          this.time = [res.startDate,res.endDate]
          this.creator = JSON.parse(JSON.stringify(res.creator))
          this.planDescribe = res.planDescribe
          this.entourages = res.entourages
          this.type = res.type
          let taskList = res.taskList; // 数据
          console.log(taskList,'777777');
          this.tableData = taskList.map(taskData => {
            taskData.dateScope = [taskData.startDate, taskData.endDate]
            return taskData
          });
        } catch (error) {
          console.log("catch", error);
        } finally {
          this.tableLoading = false;
        }
      }
    },
    fetchClientList() {
      let _id = this.$route.query.id 
      console.log('this.userId', _id)
      return new Promise((resolve, reject) => {
        getOneVisitPlan(_id).then((res) => {
          resolve(res);
        });
      });
    },
    // 复制此行
    copy(scope) {
      console.log(scope.$index)
      let row = JSON.parse(JSON.stringify(scope.row))
      console.log(row,'row')
      row.id = null
      row.isCheckStock = '是'
      this.tableData.splice(scope.$index + 1, 0, row)
      // getTagListById(data)
      //   .then((res) => {
      //     this.dynamicTags = res;
      //     this.tagVo.baseInfoId = data;
      //     resolve(res);
      //   })
      //   .catch((error) => {});
      this.tagVisible = !this.tagVisible;
    },
    // 删除此行
    deletClient(scope) {
      this.tableData = this.tableData.filter(index=>{
        console.log(index,'item.$index')
        return index !== scope
      })
    },

    onDatePicker() {
      this.change();
    },
    change() {
      this.$emit("input", this.query);
      this.$emit("change", this.query);
    },
    isEnableApply(obj){
          if(!obj.checkedStatus||obj.checkedStatus===''){
              return true;
          }
          if( obj.checkedStatus==='2'|| !obj.isDataInTemp){
              return false;
          }
         return true;
    }
  },
}
</script>

<style lang='scss' scoped>
p{
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
  content: "* ";
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: "* ";
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

.newfrom {
      background-color: white;
    padding-top: 20px;
    border-radius: 10px;
    // text-align: center;
    // width:800px;
    
    padding-bottom: 10px;
    margin:0 auto;
    left:0; 
    right:0;
}
.newfromWidth{
  width:800px;
  height: 800px;
}
.customerList {
     margin-left: 15px;
    margin-right: 15px;
   
}
.customerList .el-table{
 border: 1px solid #c0c4cc;
    border-radius: 10px;
}
.buttonCss {
 margin-top: 30px;
  text-align: center;
}
.buttonCss .el-button{
  margin-right: 30px;
}

.newform2{
  width: 100%;
  //margin-left: 50px;
  margin-top: 50px;
  margin-bottom: 100px;
}
.stepOneLeft{
  margin-left: 50px;
}
.stepStyle{
  width:400px;
    margin:0 auto;
    left:0; 
    right:0;
}
/deep/ .el-dialog.mapDialog{
  height: 95%;
}
 /deep/ .el-dialog__body{
  height: 90%;
  margin-bottom: 10px;
}
</style>

