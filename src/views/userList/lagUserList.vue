<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <el-table
        :data="tableData"
        border stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中">
        <el-table-column label="客户ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ncCode" label="NC客户编码"></el-table-column>
        <el-table-column prop="name" label="客户名称"></el-table-column>
        <el-table-column prop="address" label="企业总部地址"></el-table-column>
        <el-table-column prop="legalPerson" label="法人"></el-table-column>
        <el-table-column prop="industry" label="所属行业"></el-table-column>
        <el-table-column prop="email" label="e-mail地址"></el-table-column>
        <el-table-column prop="tel" label="电话"></el-table-column>
        <el-table-column label="企业性质">
          <template slot-scope="scope">
            <span v-if="scope.row.enterpriseType == '0'">企业</span>
            <span v-else-if="scope.row.enterpriseType == '1'">个人</span>
          </template>
        </el-table-column>
        <el-table-column label="客户类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type == 0 ? '外部单位' : '内部单位'}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="审核状态">
          <template slot-scope="scope">
            <span>{{ scope.row.checkedStatus == 0 ? '未核准' : '核准'}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="启用状态">
          <template slot-scope="scope">
            <span>{{ scope.row.enableStatusCustomer == 1 ? '未启用' :scope.row.enableStatusCustomer == 2 ? '已启用':'已停用'}} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'viewDetails'" type="text" @click="getUser(scope.row.id)">查看详情</el-button>
            <el-button v-permission-button="'cease'" type="text" v-if="scope.row.checkedStatus != 0" @click="startUser(scope.row.id,scope.row.enableStatusCustomer)" >{{ scope.row.enableStatusCustomer == '3' ? "启用客户" : '停用客户' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 添加店铺 -->
    <el-dialog
      title="提示"
      :visible.sync="shopFlag"
      width="60%"
      :before-close="handleClose">
      <h4>客户店铺信息</h4>
      <el-table class="mt10" :data="shopInfoSaveAndUpdateVos">
        <div slot="append" >
          <br>
          <el-button type="primary" icon="el-icon-plus" @click="shopInfoFlag = true" size="small"  style="width:100%">请点击添加客户店铺信息</el-button>
        </div>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="区域">
          <template slot-scope="scope">
            <el-input v-model="scope.row.area" v-if="scope.row.area"></el-input>
            <el-cascader v-else :props="area" @change="setArea"></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入店铺名"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" placeholder="请输入店铺号"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营团队">
          <template slot-scope="scope">
            <el-input v-model="scope.row.operateTeam" placeholder="请输入运营团队"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营类型" width="180px">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.operateType">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in operateType" :key="index" ></el-option>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="editShopInfo(scope)" >修改</el-button>
            <el-button type="text" @click="delShopInfo(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopFlag = false">取 消</el-button>
        <el-button type="primary" @click="shopFlag = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加店铺 -->
    <el-dialog
      :title="isEditSho ? '修改店铺信息' : '店铺信息'"
      :visible.sync="shopInfoFlag"
      width="50%"
      :before-close="shopInfoClose">
      <el-table class="mt10" :data="shopInfoList" >
        <el-table-column prop="date" label="区域">
          <template slot-scope="scope">
            <div @click="setAreaTwoId(scope.$index)">
              <el-input v-model="scope.row.area" v-if="scope.row.area"></el-input>
              <el-cascader :props="shoArea" @change="setShopArea"  v-else></el-cascader>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入店铺名"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" placeholder="请输入店铺号"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营团队">
          <template slot-scope="scope">
            <el-input v-model="scope.row.operateTeam" placeholder="请输入运营团队"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营类型" width="190px">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.operateType">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in operateType" :key="index" ></el-option>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="shopInfoFlag = false">取 消</el-button>
        <el-button type="primary" @click="addShopInfo"> {{ isEditSho ? '修 改' : '添 加'}}</el-button>
      </span>
    </el-dialog>
    <!--标签管理-->
    <el-dialog
      title="标签管理"
      :visible.sync="tagVisible"
      width="30%"
      center>
      <span slot="footer" class="dialog-footer">
        <el-form>
          <el-form-item  label="标签" prop="tag">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button class="button-new-tag" size="small" @click="showInput">+ 点击输入标签</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="tagVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTag('dynamicTags')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveShopInfo,updateShopInfo,selectLagUserPage,openEnableStatus,closeEnableStatus,delShopInfo,getShopInfoListByBaseInfoId,getDistrictList,getBaseInfoById,getTagListById,updateTagById } from '@/api/client'
import { operateType } from "@/const/goods";

export default {
  name: 'lagUserList',
  components: {  },
  data() {
    return {
      operateType:operateType,
      tagVisible:false,
      spuData:[],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      tagVo:{
        baseInfoId:'',
        tags:[]
      },
      shopInfoSaveAndUpdateVos:[
        {
          baseInfoId:'',
          area	:'',//区域
          city	:'',//城市
          // code	:'',//店铺号(不允许修改，添加时有效，修改忽略该参数)
          id	:null,//客户店铺信息id(修改时传入)
          name	:'',//店铺名
          operateTeam	:'',//运营团队
          operateType	:'',//运营类型：外包/直营
          province	:'',//省份
        }
      ],
      isEditSho:false,
      shopInfoList:[{
        area	:'',//区域
        city	:'',//城市
        code	:'',//店铺号(不允许修改，添加时有效，修改忽略该参数)
        baseInfoId:'',
        name	:'',//店铺名
        operateTeam	:'',//运营团队
        operateType	:'',//运营类型：外包/直营
        province	:'',//省份
      }],
      shoArea: {
        lazy: true,
        lazyLoad : (node, resolve) =>{
          let level = 'province';
          let padcode = '';
          if(node.hasOwnProperty('data')){
            switch (node.level) {
              case 1:level='city';padcode=node.data.adcode;break;
              case 2:level='district';padcode=node.data.adcode;break;
              case 3:level='street';padcode=node.data.adcode;break;
              default:level='city';padcode=node.data.adcode;break;
            }
          }
          getDistrictList({
            level:level,
            padcode:padcode
          }).then(res=>{
            res.forEach(item => {
              item['value'] = item.name
              item['label'] = item.name
              if(node.level == 3){
                item['leaf'] = true;
              }
              this.shopInfoList[0].areaCode = res[0].adcode;
            })
            resolve(res); // 返回数据
          })
        }
      },
      baseinfo:{

      },
       area: {
        lazy: true,
        lazyLoad : (node, resolve) =>{
          let level = 'province';
          let padcode = '';
          if(node.hasOwnProperty('data')){
            switch (node.level) {
              case 1:level='city';padcode=node.data.adcode;break;
              case 2:level='district';padcode=node.data.adcode;break;
              case 3:level='street';padcode=node.data.adcode;break;
              default:level='city';padcode=node.data.adcode;break;
            }
          }
          getDistrictList({
            level:level,
            padcode:padcode
          }).then(res=>{
            res.forEach(item => {
              item['value'] = item.name
              item['label'] = item.name
              if(node.level == 3){
                item['leaf'] = true;
              }
              this.baseinfo.areaCode = res[0].adcode;
            })
            resolve(res); // 返回数据
          })
        }
      },
      searchForm: [
        {
          key: 'name',
          label: '客户名称',
          placeholder: '客户名称',
          type: "input"
        },
        {
          key: 'enableStatusCustomer',
          label: '启用状态',
          placeholder: '启用状态',
          options: [
            { label: '全部', value: null },
            { label: '未启用（建档保存）', value: '1' },
            { label: '已启用（准入通过）', value: '2' },
            { label: '已停用（停用通过）', value: '3' },
          ],
          type: "select"
        },
        {
          key: 'checkedStatus',
          label: '审核状态',
          placeholder: '审核状态',
          options: [
            { label: '全部', value: null },
            { label: '核准', value: '1' },
            { label: '未核准', value: '0' },
          ],
          type: "select"
        },
      ],
      searchQuery: {
        name: "",
        isEnable: "",
        checkedStatus: "1",
        category: "",
        lagMonth: 6,
        pageIndex: 1,
        pageSize: 10,
        orderStr:"id desc",
        total: 0, // 总条数
      },
      tableData:[],
      tableLoading:false,
      shopFlag: false,
      ShopInfoIndex:0, // 客户店铺索引
      shopInfoFlag:false, // 添加店铺开关
      userId:'',// 客户弹窗id
    }
  },
  computed: {
  },
  created() {
    this.fetchTableData() // 加载表格数据
  },
  mounted() {
  },
  methods: {
    // 添加商品窗口，获取选中添加地址
    setShopArea(e){
      this.shopInfoList[0].province = e[0] ? e[0] :'' // 省
      this.shopInfoList[0].city = e[1] ? e[1] :''// 市
      this.shopInfoList[0].area = e[2] ? e[2] :''// 区
    },
     // 添加店铺信息
    addShopInfo(){
      if(this.isEditSho){
        this.shopInfoList[0]['baseInfoId'] = this.userId;
        updateShopInfo(this.shopInfoList[0]).then(res=>{
          this.$message({ message: '修改客户店铺信息成功',type: 'success'});
          getShopInfoListByBaseInfoId(this.userId).then(res=>{
            this.shopInfoSaveAndUpdateVos = res
          })
          this.shopInfoFlag = !this.shopInfoFlag;
        })
        return
      }
      let isNull = this.shopInfoList[0].operateTeam == '' || this.shopInfoList[0].name == '';// 判断第一个参数和第二个是不是空
      if(isNull){
        this.$message({ message: '请填写：客户店铺信息',type: 'warning'});
        return
      }
      this.shopInfoList[0]['baseInfoId'] = this.userId;
      saveShopInfo(this.shopInfoList[0]).then(res=>{
        this.$message({ message: '添加客户店铺信息成功',type: 'success'});
        // 添加成功后刷新数据
        getShopInfoListByBaseInfoId(this.userId).then(res=>{
          this.shopInfoSaveAndUpdateVos = res
        })
      }).catch(error=>{
        console.log(error);
      })
      this.shopInfoFlag = !this.shopInfoFlag;
    },
    // 关闭添加店铺弹窗时
    shopInfoClose(done) {
      done();
    },
     // 获取点击客户店铺时候的索引
    setAreaTwoId(index){
      this.ShopInfoIndex = index
    },

   // 基本信息地图 获取选中的地址
    setArea(e){
      this.baseinfo.area = e.join('/')
    },
    // 修改客户店铺
    editShopInfo(item){
      this.shopInfoList = [item.row];
      this.shopInfoFlag = !this.shopInfoFlag;
      this.isEditSho = true; // 弹窗时修改的状态
    },
    // 删除客户店铺
    delShopInfo(item){
      this.$confirm(`确认删除吗？`)
      .then(_ => {
        delShopInfo(item.id).then(res=>{
          getShopInfoListByBaseInfoId(this.userId).then(res=>{
            this.shopInfoSaveAndUpdateVos = res
          })
          this.$message({message: '删除成功',type: 'success'});
        })
      })
      .catch(_ => {});
    },
    getShop(id){
      this.userId = id;
      getShopInfoListByBaseInfoId(id).then(res=>{
        this.shopInfoSaveAndUpdateVos = res
      })
      this.shopFlag = !this.shopFlag;

    },
    handleClose(done) {
      done();
    },
    // 核准
    getCheckedStatus(){
      this.$message({ message: '客户信息未核准,请稍后~',type: 'warning'});
    },
    //启用客户
    startUser (id,flag){
      console.log(flag);
      if(flag === '3'){ // 启用
        openEnableStatus(id).then(res=>{
          this.onChange();
          console.log(res);
        })
      } else { // 停用
        closeEnableStatus(id).then(res=>{
          this.tableData = []
          this.onChange();
          console.log(res);
        })
      }
    },

    // 客户店铺信息
    storeInformation (){
    },
    //修改客户信息
    editUser(id){
      this.$router.push({ name: 'maintainingEditUser',query:{id:id,isLook:false} })
    },
    //修改客户信息
    getUser(id){
      this.$router.push({ name: 'maintainingEditUser',query:{id:id,isLook:true} })
    },
    onChange(){
      this.fetchTableData()
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchClientList()
        this.searchQuery.total = res.total // 总条数
        let brandList = res.records // 品牌数据
        console.log(brandList);
        this.tableData = brandList

      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    fetchClientList() {
      return new Promise((resolve, reject) => {
        selectLagUserPage(this.searchQuery)
        .then(res => {
          resolve(res)
        })
      })
    },
    manageTag(data){
      getTagListById(data).then(res=>{
        this.dynamicTags=res
        this.tagVo.baseInfoId=data
        resolve(res)
      }).catch(error =>{

      })
      this.tagVisible=!this.tagVisible;
    },
    addTag(data){
      this.tagVo.tags=this.dynamicTags
      this.tagVo.baseInfoId=this.tagVo.baseInfoId.toString()
      updateTagById(this.tagVo).then(res=> {
        this.tagVisible = false
      })
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.spuData.tags = this.dynamicTags;
    },

  },
  watch: {

  },
}
</script>

<style lang='scss' scoped>
.el-button+.el-button {
  margin-left: 0px;
}

</style>
<style lang="scss">

</style>

