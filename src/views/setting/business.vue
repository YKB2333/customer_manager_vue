<template>
  <div>
    <div style="background:#fff;padding:20px;">
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" @click="add">新增业务板块</el-button>
          <el-button v-permission-button="'export'" type="warning"   @click="onExportClick">导出</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="id" label="ID" width="40"></el-table-column>
        <el-table-column prop="relaId" label="关联板块ID" width="90"></el-table-column>
        <el-table-column prop="icon" label="首页图标" width="120">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.icon || require('@/assets/images/logo.png')" style="max-width: 100px; max-height: 100px;">
              <el-image :src="scope.row.icon || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="icon2" label="发现客户图标"  width="120">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="click">
              <img slot="reference" :src="scope.row.icon2 || require('@/assets/images/logo.png')" style="max-width: 100px; max-height: 100px;">
              <el-image :src="scope.row.icon2 || require('@/assets/images/logo.png')" style="max-width: 600px; max-height: 600px;"></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="color2" label="发现客户颜色" width="100">
          <template slot-scope="scope">
            <el-color-picker v-model="scope.row.color2"></el-color-picker>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="板块名称"></el-table-column>
        <el-table-column prop="isShow" label="首页展示" width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.isShow ? '展示' : '' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="业务版块" width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.isBusiness ? '是' : '' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="columnId" label="cms栏目ID" width="90"></el-table-column>
        <el-table-column prop="bmCode" label="版块负责人角色"></el-table-column>
        <el-table-column prop="bcCode" label="版块核心人员角色"></el-table-column>
        <el-table-column type="expand" label="部门组织" width="80">
          <template slot-scope="scope">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item :label="`部门${index + 1}`" v-for="(item,index) in scope.row.businessOrganizationDtos" :key="index">
                <span>{{ item.fullBmname ? (item.zzname + '-' + item.fullBmname) : '' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="pos" label="排序" width="50"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-permission-button="'viewDatails'" type="text" @click="$router.push({name:'businessDetail',query:{id:scope.row.id,name:scope.row.name}})">详情</el-button>
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row)">修改</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      title="新增业务板块"
      width="600px"
      max-height
      @close="closeDialog"
    >
      <el-form :rules="rules" :model="saveForm" ref="saveForm" label-width="150px" inline>
        <el-form-item label="版块名称" prop="name">
          <el-input style="width:300px;" v-model="saveForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="首页展示" prop="isShow">
          <el-switch
            v-model="saveForm.isShow"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="业务版块" prop="isBusiness">
          <el-switch
            v-model="saveForm.isBusiness"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="首页图标" prop="icon">
          <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerLogo`"
              :type='true'
              :isUrl="[saveForm.icon]"
              @onSuccessUpload="onSuccessUploadIcon">
            </upload>
        </el-form-item>
        <el-form-item label="发现客户图标" prop="icon2">
          <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerLogo`"
              :type='true'
              :isUrl="[saveForm.icon2]"
              @onSuccessUpload="onSuccessUploadIcon2">
            </upload>
        </el-form-item>
        <el-form-item label="发现客户颜色" prop="color2">
          <el-color-picker v-model="saveForm.color2"></el-color-picker>
        </el-form-item>
        <el-form-item label="关联版块ID" prop="relaId">
          <el-input style="width:300px;" v-model="saveForm.relaId" placeholder="请输入关联版块ID"></el-input>
        </el-form-item>
        <el-form-item label="cms栏目ID" prop="columnId">
          <el-input style="width:300px;" v-model="saveForm.columnId" placeholder="请输入栏目ID"></el-input>
        </el-form-item>
        <el-form-item label="版块负责人角色" prop="bmCode">
          <el-input style="width:300px;" v-model="saveForm.bmCode" placeholder="请输入版块负责人角色"></el-input>
        </el-form-item>
        <el-form-item label="版块负责人">
          <div style="width: 300px;">
            <el-tag v-for="item in bmUser" :key="item.id">
              {{item.userName || item.mobile}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="版块核心人员角色" prop="bcCode">
          <el-input style="width:300px;" v-model="saveForm.bcCode" placeholder="请输入版块核心人员角色"></el-input>
        </el-form-item>
        <el-form-item label="版块核心人员">
          <div style="width: 300px;">
            <el-tag v-for="item in bcUser" :key="item.id">
              {{item.userName || item.mobile}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="pos">
          <el-input-number v-model="saveForm.pos" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="align-center">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import { getList, save, del, edit, userList} from "@/api/business";
import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
import { baseURL } from '@/config'
import upload from '@/components/upload'

export default {
  name: "business",
  components: { upload },
  data() {
    return {
      editFalg:'新增',
      rules: {
        name:[
          { required: true, message: "请输入版块名称", trigger: "blur" }
        ],
        columnId:[
          { required: false, message: "请输入栏目ID", trigger: "blur" }
        ],
        bmCode:[
          { required: false, message: "请输入请输入报表统计管理员角色", trigger: "blur" }
        ]
      },
      saveForm:{},
      dialogVisible:false,
      searchQuery: {
        customerId: "",
        title: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableLoading: false,
      tableData: [], // 表格数据
      iconlist:[],
      icon2list:[],
      baseURL,
      bmUser: [],
      bcUser: [],
    };
  },
  async created() {
    await this.fetchTableData();
  },
  computed: {

  },
  methods: {
    edit(row){
      this.editFalg = '修改'
      this.saveForm = row

      if(row.bmCode){
        userList(row.bmCode).then(res => {
          this.bmUser = res
        })
      }
      if(row.bcCode){
        userList(row.bcCode).then(res => {
          this.bcUser = res
        })
      }

      this.dialogVisible = true
    },
    del(id){
      this.$confirm(`确认删除吗？`)
      .then(_ => {
        del(id).then(res=>{
          this.$message({message: '删除成功',type: 'success'});
          this.fetchTableData()
        })
      })
      .catch(_ => {
        this.$message({message: '操作失败'});
        this.fetchTableData()
      });
    },
    // 加载表格数据
    add(){
      this.saveForm = {}
      this.editFalg = '新增'
      this.dialogVisible = true
    },
    fetchTableData() {
      this.tableLoading = true;
      return getList(this.searchQuery)
        .then(res => {
          this.tableData = res;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    closeDialog(){
      this.dialogVisible = false
      this.$refs['saveForm'].clearValidate();
    },
    submit(){
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.saveBtnLoading = true;
        if (this.editFalg ==="新增"){
          save(this.saveForm).then(res=>{
            this.dialogVisible = false
            this.fetchTableData();
          })
        }else {
          edit(this.saveForm).then(res=>{
            this.dialogVisible = false
            this.fetchTableData();
          })
        }
      });
      
    },
       // 导出Excel
    onExportClick() {
            // 导出
      let formatJson = (filterVal, jsonData) => {
        return jsonData.map(v =>
          filterVal.map(j => {
            if (j === "orderTime") {
              return this.formatDates(v[j], 'Y/M/D ')
            }else {
              return v[j]
            }
          })
        )
      }
      let listData =[]
      this.$store.commit("SHOW_LOADING", "正在导出Excel")
      let params = this.$lodash.cloneDeep(this.searchQuery)
      params["pageIndex"] = 1
      params["pageSize"] = this.$maxNumber
      getList(this.searchQuery)
        .then(res => {
          if(!res|| res.length<0){
              this.$message({message: '导出失败，不存在业务板块信息',type: 'error'});
              this.$store.commit("SHOW_LOADING", false)
              return;
          }
          res.forEach(element => {
            if(element.businessOrganizationDtos && element.businessOrganizationDtos.length>0){
                element.businessOrganizationDtos.forEach(bm => {
                    let tempInfo={}
                    tempInfo.name=element.name
                    tempInfo.bmcode=bm.bmcode
                    tempInfo.bmname=bm.bmname
                    tempInfo.fullBmcode=bm.fullBmcode
                    tempInfo.fullBmname=bm.fullBmname
                    tempInfo.zzcode=bm.zzcode
                    tempInfo.zzname=bm.zzname
                    listData.push(tempInfo)
                })
            }  
          });
          console.info("tempInfo:",listData)

          import("@/utils/excel/Export2Excel").then(excel => {
            const tHeader = [
              "业务板块",
              "公司编码",
              "公司名称",
              "部门编码",
              "部门名称",
              "完整部门编码",
              "完整部门名称",
            ]
            const filterVal = [
              "name",
              "zzcode",
              "zzname",
              "bmcode",
              "bmname",
              "fullBmcode",
              "fullBmname",
            ]
            // const list = listData
            const data = formatJson(filterVal, listData)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "业务板块"
            })
          })
        })
        .finally(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    },
    // 图标上传成功时的钩子
    onSuccessUploadIcon(res, file) {
      this.saveForm.icon = res
    },
    onSuccessUploadIcon2(res, file) {
      this.saveForm.icon2 = res
    },
  }
};
</script>
