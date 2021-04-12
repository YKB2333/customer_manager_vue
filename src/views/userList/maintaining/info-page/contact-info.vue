<template>
  <div>
    <el-table class="mt10" :data="contactsInfoSaveAndUpdateVos" default-expand-all>
      <div slot="append" v-if="!isLook">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="clearContactInfo('contactInfo')"
          size="small"
          style="width: 100%"
        >请点击添加客户联系人信息</el-button>
      </div>
      <el-table-column label="序号" width="50" type="index">
      </el-table-column>
      <el-table-column prop="daaSource" label="来源" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.dataSource" disabled>
            <el-option :key="ds.value" v-for="ds in dataSource" :label="ds.label" :value="ds.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="姓名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fullName" placeholder="请输入姓名" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="性别" width="80">
        <template slot-scope="scope">
          <el-select v-model="scope.row.gender" disabled>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="电话">
        <template slot-scope="scope">
          <el-input v-model="scope.row.mobile" placeholder="请输入电话" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="Email">
        <template slot-scope="scope">
          <el-input v-model="scope.row.email" placeholder="请输入Email" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="负责内容">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position" placeholder="请输入负责内容" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="微信/QQ">
        <template slot-scope="scope">
          <el-input v-model="scope.row.im" placeholder="请输入微信/QQ" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column type="expand" label="身份证" width="80" v-if="tempEnterpriseType == '1'">
        <template slot-scope="scope">
          <el-form label-position="left" inline>
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="scope.row.idCard" placeholder="身份证号" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证（手持证件）" prop="idCardHolding">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardHolding" :uploadOss="uploadContactsIDcard" :removable="false"></simple-file>
              </div>
            </el-form-item>
            <el-form-item label="身份证（正面）" prop="idCardObverse">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardObverse" :uploadOss="uploadContactsIDcard" :removable="false"></simple-file>
              </div>
            </el-form-item>
            <el-form-item label="身份证（反面）" prop="idCardReverse">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardReverse" :uploadOss="uploadContactsIDcard" :removable="false"></simple-file>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="100px" v-if="!isLook">
        <template slot-scope="scope">
          <template v-if="scope.row.dataSource == '2'">
            <el-tooltip class="item" effect="dark" content="一件达客户不支持修改" placement="left">
              <el-button type="text">修改</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="一件达客户不支持删除" placement="left">
              <el-button type="text">删除</el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-button type="text" @click="editContactsInfo(scope)">修改</el-button>
            <el-button type="text" @click="delContactsInfo(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="medium" class="mt20" @click="$router.go(-1)">返回列表</el-button>
    <!--修改新增客户联系人-->
    <el-dialog
      :title="isEditContacts ? '修改客户联系人' : '客户联系人信息'"
      :visible.sync="contactInfoFlag"
      width="80%">
      <el-table class="mt10" :data="contactsInfoList" default-expand-all>
        <el-table-column label="序号" width="50" type="index">
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="姓名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.fullName" placeholder="请输入姓名"></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="性别" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.gender">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="电话">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mobile" placeholder="请输入电话"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Email">
          <template slot-scope="scope">
            <el-input v-model="scope.row.email" placeholder="请输入Email"></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="负责内容">
          <template slot-scope="scope">
            <el-input v-model="scope.row.position" placeholder="请输入负责内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="微信/QQ">
          <template slot-scope="scope">
            <el-input v-model="scope.row.im" placeholder="请输入微信/QQ"></el-input>
          </template>
        </el-table-column>

        <el-table-column type="expand" label="身份证" width="80" v-if="tempEnterpriseType == '1'">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="scope.row.idCard" placeholder="身份证号"></el-input>
              </el-form-item>
              <el-form-item label="身份证（手持证件）" prop="idCardHolding">
                <div style="{width: 220px;}">
                  <simple-file v-model="scope.row.idCardHolding" :uploadOss="uploadContactsIDcard"></simple-file>
                </div>
              </el-form-item>
              <el-form-item label="身份证（正面）" prop="idCardObverse">
                <div style="{width: 220px;}">
                  <simple-file v-model="scope.row.idCardObverse" :uploadOss="uploadContactsIDcard"></simple-file>
                </div>
              </el-form-item>
              <el-form-item label="身份证（反面）" prop="idCardReverse">
                <div style="{width: 220px;}">
                  <simple-file v-model="scope.row.idCardReverse" :uploadOss="uploadContactsIDcard"></simple-file>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contactInfoFlag = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">{{ isEditContacts ? "修 改" : "添 加" }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dataSource } from "@/const/customer"
import {
  delContactsInfoById, getContactsInfoListById,
  updateContactsInfoById, addContactsInfoId,
} from "@/api/client"
import { uploadContactsIDcard } from "@/api/uploadOss";

export default {
  props: {
    userId: String,
    isLook: Boolean,
  },
  data() {
    return {
      contactsInfoSaveAndUpdateVos: [
        {
          birthday: 0, //生日
          email: "", //邮箱
          fullName: "", //姓名
          gender: "", // 性别：0=保密，1=男，2=女
          im: "", //微信/QQ
          mobile: "", //手机
          position: "", //负责内容
          tel: "", //座机
          idCard: "", //身份证号
          idCardHolding: "", //身份证照片（手持）
          idCardObverse: "", //身份证照片（正面）
          idCardReverse: "", //身份证照片（反面）
        },
      ],
      contactsInfoList: [
        {
          email: "", //邮箱
          fullName: "", //姓名
          gender: "", //性别：0=保密，1=男，2=女
          im: "", //微信/QQ
          mobile: "", //手机
          position: "", //负责内容
          tel: "", //座机
          idCard: "", //身份证号
          idCardHolding: "", //身份证照片（手持）
          idCardObverse: "", //身份证照片（正面）
          idCardReverse: "", //身份证照片（反面）
        },
      ],
      dataSource: dataSource.properties,
      tempEnterpriseType: "", //企业性质
      contactInfoFlag: false,
      isEditContacts: false,
      closeMethodList: [],
    }
  },
  created() {
    console.log('客户联系人信息')
    this.tempEnterpriseType = this.$route.query.enterpriseType || ''
    this.init()
  },
  methods: {
    uploadContactsIDcard,
    init() {
      getContactsInfoListById(this.userId).then((res) => {
        this.contactsInfoSaveAndUpdateVos = res
      })
    },
    clearContactInfo() {
      this.isEditContacts = false
      this.contactInfoFlag = true
      this.contactsInfoList[0]["id"] = ""
      this.contactsInfoList[0]["fullName"] = ""
      this.contactsInfoList[0]["gender"] = ""
      this.contactsInfoList[0]["im"] = ""
      this.contactsInfoList[0]["mobile"] = ""
      this.contactsInfoList[0]["position"] = ""
      this.contactsInfoList[0]["tel"] = ""
      this.contactsInfoList[0]["email"] = ""
      this.contactsInfoList[0]["idCard"] = ""
      this.contactsInfoList[0]["idCardHolding"] = ""
      this.contactsInfoList[0]["idCardObverse"] = ""
      this.contactsInfoList[0]["idCardReverse"] = ""
      this.contactsInfoList[0]["closeMethod"] = ""
    },
    editContactsInfo(item) {
      item.row["id"] += ""
      item.row["baseInfoId"] += ""
      let copy = _.cloneDeep(item.row)
      this.contactsInfoList = [copy]
      this.contactInfoFlag = !this.contactInfoFlag
      this.isEditContacts = true
    },
    delContactsInfo(item) {
      this.$confirm(`确认删除吗？`).then(() => {
        delContactsInfoById(item.id).then((res) => {
          this.$message({ message: "删除成功", type: "success" })
          this.init()
        })
      })
    },
    onSubmit() {
      if (this.isEditContacts) {
        this.upateContactsInfo()
      } else {
        this.addContactsInfo()
      }
    },
    upateContactsInfo() {
      let params = _.cloneDeep(this.contactsInfoList[0]);
      if (
        !(params.fullName && params.gender && params.mobile && params.position)
      ) {
        this.$message({
          message: !params.fullName
            ? "客户联系人姓名不能为空"
            : !params.gender
            ? "客户联系人性别不能为空"
            : !params.mobile
            ? "客户联系人电话不能为空"
            : "客户联系人负责内容不能为空",
          type: "warning",
        });
        return false;
      }
      /* 个人用户不再强制要求填身份证信息
      if (
        this.tempEnterpriseType == "1" &&
        !(
          params.idCard &&
          params.idCardHolding &&
          params.idCardObverse &&
          params.idCardReverse
        )
      ) {
        this.$message({
          message: !params.idCard
            ? "身份证号不能为空"
            : !params.idCardHolding
            ? "身份证照片（手持）不能为空"
            : !params.idCardObverse
            ? "身份证照片（正面）不能为空"
            : "身份证照片（反面）不能为空",
          type: "warning",
        });
        return false;
      }
      const reg = /^[0-9a-zA-Z]{18}$/;
      if (this.tempEnterpriseType == "1" && !reg.test(params.idCard)) {
        this.$message({
          message: "请输入正确的身份证号（18位）",
          type: "warning",
        });
        return false;
      }
      */
      updateContactsInfoById(params).then((res) => {
        this.$message({ message: "修改客户联系人信息成功", type: "success" });
        this.contactInfoFlag = !this.contactInfoFlag
        this.isEditContacts = !this.isEditContacts
        this.init()
      });
    },
    addContactsInfo() {
      this.contactsInfoList[0]["baseInfoId"] = this.userId;
      if (
        !(
          this.contactsInfoList[0].fullName &&
          this.contactsInfoList[0].gender &&
          this.contactsInfoList[0].mobile &&
          this.contactsInfoList[0].position
        )
      ) {
        this.$message({
          message: !this.contactsInfoList[0].fullName
            ? "客户联系人姓名不能为空"
            : !this.contactsInfoList[0].gender
            ? "客户联系人性别不能为空"
            : !this.contactsInfoList[0].mobile
            ? "客户联系人电话不能为空"
            : "客户联系人负责内容不能为空",
          type: "warning",
        });
        return false;
      }
      console.log(this.contactsInfoList, 'contactsInfoList')
      /* 个人用户不再强制要求填身份证信息
      if (
        this.tempEnterpriseType == "1" &&
        !(
          this.contactsInfoList[0].idCard &&
          this.contactsInfoList[0].idCardHolding &&
          this.contactsInfoList[0].idCardObverse &&
          this.contactsInfoList[0].idCardReverse
        )
      ) {
        this.$message({
          message: !this.contactsInfoList[0].idCard
            ? "身份证号不能为空"
            : !this.contactsInfoList[0].idCardHolding
            ? "身份证照片（手持）不能为空"
            : !this.contactsInfoList[0].idCardObverse
            ? "身份证照片（正面）不能为空"
            : "身份证照片（反面）不能为空",
          type: "warning",
        });
        return false;
      }
      const reg = /^[0-9a-zA-Z]{18}$/;
      if (
        this.tempEnterpriseType == "1" &&
        !reg.test(this.contactsInfoList[0].idCard)
      ) {
        this.$message({
          message: "请输入正确的身份证号（18位）",
          type: "warning",
        });
        return false;
      }
      */
      addContactsInfoId(this.contactsInfoList[0]).then((res) => {
        this.$message.success("添加客户联系人信息成功")
        this.contactInfoFlag = !this.contactInfoFlag
        this.init()
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.must:before {
  content: "* ";
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: "* ";
  color: #ff1818;
}
</style>