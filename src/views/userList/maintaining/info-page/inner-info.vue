<template>
  <div>
    <el-table class="mt10" :data="innerPersonInfoSaveAndUpdateVos">
      <div slot="append" v-if="!isLook">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="clearInnerPersonInfo"
          size="small"
          style="width: 100%"
          >请点击添加内部联系人信息</el-button>
      </div>
      <el-table-column label="序号" width="60" type="index">
      </el-table-column>
      <el-table-column prop="fullName" label="姓名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fullName" placeholder="请输入姓名" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column class-name="must" label="业务板块">
        <template slot-scope="scope">
          <el-select disabled v-model="scope.row.businessId">
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话">
        <template slot-scope="scope">
          <el-input v-model="scope.row.tel" placeholder="请输入电话" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="所属组织">
        <template slot-scope="scope">
          <el-input v-model="scope.row.orgName" placeholder="请输入所属组织" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deptName" placeholder="请输入所属部门" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="jobTitle" label="负责内容">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jobTitle" placeholder="请输入负责内容" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" v-if="!isLook">
        <template slot-scope="scope">
          <el-button type="text" @click="editInnerPerson(scope.row)">修改</el-button>
          <el-button type="text" @click="delInnerPerson(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="medium" class="mt20" @click="$router.go(-1)">返回列表</el-button>
    <!--修改新增内部联系人-->
    <el-dialog
      :title="isEditInnerPerson ? '修改内部联系人' : '内部联系人信息'"
      :visible.sync="InnerPersonInfoFlag"
      width="70%"
      :before-close="shopInfoClose">
      <el-table class="mt10" :data="innerPersonList">
        <el-table-column label="序号" width="60" type="index">
        </el-table-column>
        <el-table-column class-name="must" prop="fullName" label="姓名">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.fullName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入姓名"
              :remote-method="remoteMethod"
              :loading="innerPersonLoading"
              @change="getInnerUser">
              <el-option
                v-for="(item, i) in innerPersonOptions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column class-name="must" label="业务板块">
          <template slot-scope="scope">
            <el-select v-model="scope.row.businessId">
              <el-option
                v-for="item in businessList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="tel" label="电话">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tel" placeholder="请输入电话"></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="orgName" label="所属组织">
          <template slot-scope="scope">
            <el-input v-model="scope.row.orgName" placeholder="请输入所属组织"></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="deptName" label="所属部门">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deptName" placeholder="请输入所属部门"></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="jobTitle" label="负责内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jobTitle" placeholder="请输入负责内容"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="InnerPersonInfoFlag = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">{{ isEditInnerPerson ? "修 改" : "添 加" }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInnerPersonInfoListByBId, getJobTitleById,
  delInnerPersonInfoById, updateInnerPersonInfoById,
  addInnerPersonInfoById, getAllEcologyUsers
} from "@/api/client"

export default {
  props: {
    businessList: Array, //业务板块
    userId: String,
    isLook: Boolean,
  },
  data() {
    return {
      innerPersonInfoSaveAndUpdateVos: [],
      innerPersonList: [
        {
          orgId: "", //所属组织id
          orgName: "", //所属组织
          deptId: "", //所属部门id
          deptName: "", //所属部门
          email: "", //邮箱
          fullName: "", //姓名
          tel: "", //电话
          jobTitleId: "",
          jobTitle: "",
          businessId: '',
          workCode:''//工号
        }
      ],
      isEditInnerPerson: false,
      InnerPersonInfoFlag: false,
      innerPersonLoading: false,
      states: [], // 内部跟进人信息,名字列表
      innerPersonOptions: [], // 内部跟进人信息
    }
  },
  created() {
    this.init()
    getAllEcologyUsers().then((res) => {
      this.states = res.map((item) => {
        return { value: item.lastname, label: item.lastname, userlist: item }
      })
    })
  },
  methods: {
    init() {
      getInnerPersonInfoListByBId(this.userId).then((res) => {
        this.innerPersonInfoSaveAndUpdateVos = res
      })
    },
    clearInnerPersonInfo() {
      this.InnerPersonInfoFlag = true
      this.isEditInnerPerson = false
      this.innerPersonList[0]["fullName"] = ""
      this.innerPersonList[0]["businessId"] = ""
      this.innerPersonList[0]["orgId"] = ""
      this.innerPersonList[0]["orgName"] = ""
      this.innerPersonList[0]["deptId"] = ""
      this.innerPersonList[0]["deptName"] = ""
      this.innerPersonList[0]["email"] = ""
      this.innerPersonList[0]["tel"] = ""
      this.innerPersonList[0]["jobTitleId"] = ""
      this.innerPersonList[0]["jobTitle"] = ""
      this.innerPersonList[0]["workCode"] = ""
    },
    remoteMethod(query) {
      if (query !== "") {
        this.innerPersonLoading = true
        setTimeout(() => {
          this.innerPersonLoading = false
          this.innerPersonOptions = this.states.filter((item) => {
            return item.label.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.innerPersonOptions = []
      }
    },
    // 选中时获取客户信息 并赋值
    getInnerUser(user) {
      let stateslist = null
      this.states.forEach((item) => {
        if (item.label == user) {
          stateslist = item.userlist
        }
      })
      this.innerPersonList.forEach((item) => {
        if (item.fullName == user) {
          item.orgId= stateslist.subcompanyid1
          item.orgName= stateslist.subcompanyname//所属组织
          item.deptName = stateslist.departmentname //所属部门
          item.deptId = stateslist.departmentid //所属部门id
          item.email = stateslist.email //邮箱
          item.fullName = stateslist.lastname //姓名
          item.tel = stateslist.mobile //电话
          item.workCode= stateslist.workcode
          getJobTitleById(stateslist.jobtitle).then((res) => {
            item.jobTitleId = res._jobtitleid
            item.jobTitle = res._fullname
          })
        }
      })
    },
    editInnerPerson(item) {
      item["id"] += ""
      item["baseInfoId"] += ""
      let copy = _.cloneDeep(item)
      this.innerPersonList = [copy]
      this.InnerPersonInfoFlag = !this.InnerPersonInfoFlag
      this.isEditInnerPerson = true
    },
    delInnerPerson(item) {
      this.$confirm(`确认删除内部联系人吗？`).then(() => {
        delInnerPersonInfoById(item.id).then((res) => {
          this.$message({ message: "删除成功", type: "success" });
          this.init()
        })
      })
    },
    // 关闭添加店铺弹窗时
    shopInfoClose(done) {
      done()
    },
    //添加内部联系人信息
    onSubmit() {
      if (this.isEditInnerPerson) {
        let params = _.cloneDeep(this.innerPersonList)
        if (
          !(
            params[0].fullName &&
            params[0].tel &&
            params[0].deptName &&
            params[0].jobTitle &&
            params[0].businessId
          )
        ) {
          this.$message({
            message: !params[0].fullName
              ? "内部跟进人姓名不能为空"
              : !params[0].tel
              ? "内部跟进人电话不能为空"
              : !params[0].deptName
              ? "内部跟进人所属部门不能为空"
              : !params[0].businessId
              ? "内部跟进人业务板块不能为空"
              : "内部跟进人负责内容不能为空",
            type: "warning",
          })
          return false
        } else {
          updateInnerPersonInfoById(params[0]).then((res) => {
            this.$message.success('修改客户联系人信息成功')
            this.init()
            this.InnerPersonInfoFlag = !this.InnerPersonInfoFlag
          })
        }
      } else {
        this.innerPersonList[0]["baseInfoId"] = this.userId
        if (
          !(
            this.innerPersonList[0].fullName &&
            this.innerPersonList[0].tel &&
            this.innerPersonList[0].deptName &&
            this.innerPersonList[0].jobTitle &&
            this.innerPersonList[0].businessId
          )
        ) {
          this.$message({
            message: !this.innerPersonList[0].fullName
              ? "内部跟进人姓名不能为空"
              : !this.innerPersonList[0].tel
              ? "内部跟进人电话不能为空"
              : !this.innerPersonList[0].deptName
              ? "内部跟进人所属部门不能为空"
              : !this.innerPersonList[0].businessId
              ? "内部跟进人业务板块不能为空"
              : "内部跟进人负责内容不能为空",
            type: "warning",
          })
          return false
        } else {
          addInnerPersonInfoById(this.innerPersonList[0]).then((res) => {
            this.$message.success('添加客户联系人信息成功')
            // 添加成功后刷新数据
            this.init()
            this.InnerPersonInfoFlag = !this.InnerPersonInfoFlag
          })
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
</style>