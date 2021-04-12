<template>
  <div class="adduser-page">
    <!-- 权限管理必备 -->
    <div v-permission-button="'search'"></div>
    <div class="noSubmit" @click="hint" v-if="noSubmit"></div>
    <h4>客户基本信息</h4>
    <el-form ref="ruleForm1" :model="baseinfo" label-width="140px" :rules="rules">
      <div class="row max-width">
        <div class="flex-2">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="baseinfo.name" placeholder="请输入客户名称"></el-input>
            <div class="tip">客户名称需严格按照营业执照上的名称填写</div>
          </el-form-item>
          <el-form-item label="企业性质" prop="enterpriseType">
            <el-select v-model="baseinfo.enterpriseType">
              <el-option label="企业" value="0"></el-option>
              <el-option label="个人" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="客户LOGO"
            prop="logo"
            :rules="[
            { required: baseinfo.enterpriseType == '0', message: '请上传logo', trigger: 'blur' }
          ]"
          >
            <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerLogo`"
              :type="true"
              :isUrl="imageUrllist"
              @onSuccessUpload="onSuccessUpload"
            ></upload>
            <div class="tip">只能上传jpg/png文件，且不超过500kb；企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="企业总部地址" prop="address">
            <address-select v-model="baseinfo.address" placeholder="请输入企业总部地址"></address-select>
            <!-- <el-input v-model="baseinfo.address" placeholder="请输入企业总部地址"></el-input> -->
          </el-form-item>
          <el-form-item label="客户渠道大类" prop="channelCategorys">
            <el-select v-model="baseinfo.channelCategorys" multiple>
              <el-option label="线上渠道" value="线上渠道"></el-option>
              <el-option label="线下渠道" value="线下渠道"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合作等级" prop="customerGrade">
            <el-select v-model="baseinfo.customerGrade">
              <el-option label="一般客户" value="1"></el-option>
              <el-option label="战略客户" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基本分类" prop="ncCategoryName">
            <el-select @change="changeNc" v-model="baseinfo.ncCategoryCode">
              <el-option
                v-for="(item,index) in AllNcCusCategory"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            <div style="color:#999;padding-left:2px;">(除了千喜，其他部门都选 “其他”)</div>
          </el-form-item>
          <el-form-item label="客户类型" prop="type">
            <el-radio-group v-model="baseinfo.type">
              <el-radio label="0">外部单位</el-radio>
              <el-radio label="1">内部单位</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否内部员工" v-if="baseinfo.enterpriseType == '1'" prop="customerType">
            <el-radio-group v-model="baseinfo.customerType">
              <el-radio label="2">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="财务组织">
            <el-input v-model="baseinfo.financialOrg" placeholder="内部单位，才需要填"></el-input>
            <div class="tip">客户类型为内部单位时请选择财务组织</div>
          </el-form-item>
          <el-form-item label="客户简介">
            <el-input type="textarea" v-model="baseinfo.intro" placeholder="请输入客户企业文化"></el-input>
          </el-form-item>
          <el-form-item label="介绍资料">
            <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerAtta`"
              :type="false"
              @onSuccessUpload="onIntroduceUploadFile"
              :isUrl="this.baseinfo.introduceAtta"
              @handleClose="onIntroduceAttaHand"
              @handleClick="onClickHand"
            ></upload>
          </el-form-item>
        </div>
        <div class="flex-2 ml50">
          <el-form-item
            label="客户简称（渠道）"
            prop="simpleName"
            :rules="[
            { required: baseinfo.enterpriseType == '0', message: '请输入客户简称（渠道）', trigger: 'blur' }
          ]"
          >
            <el-input v-model="baseinfo.simpleName" placeholder="请输入客户简称（渠道）"></el-input>
            <div class="tip">例如屈臣氏、云集…，企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="企业法人" prop="legalPerson">
            <el-input v-model="baseinfo.legalPerson" prop="name" placeholder="请输入法人"></el-input>
            <div class="tip">企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="国家/地区" prop="area">
            <!-- <el-input v-model="baseinfo.area" v-if="baseinfo.area"></el-input> -->
            <!-- <el-cascader v-else :props="area" expand-trigger="hover" @change="setArea"></el-cascader> -->
            <country-select v-model="baseinfo.area" checkStrictly></country-select>
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="baseinfo.industry" placeholder="请输入所属行业"></el-input>
            <div class="tip">请填写企业所在行业，严格按照行业标准录入</div>
          </el-form-item>
          <el-form-item label="渠道类型" prop="channelType">
            <el-select v-model="baseinfo.channelType" placeholder="请选择" @change="getchannelType">
              <el-option
                v-for="(item,index) in options"
                :key="item.value"
                :label="item.label"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="e-mail地址" prop="email">
            <el-input v-model="baseinfo.email" placeholder="请输入正确的e-mail地址"></el-input>
          </el-form-item>
          <el-form-item label="结算方式" prop="closeMethod">
            <el-select
              v-model="baseinfo.closeMethod"
              placeholder="请选择"
              @change="getCloseMethodType"
            >
              <el-option
                v-for="(item,index) in closeMethodList"
                :key="item.value"
                :label="item.label"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账期天数(天)">
            <el-input
              type="number"
              v-model="baseinfo.paymentDay"
              :placeholder="!isLook ? '请输入账期天数':''"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户企业文化">
            <el-input type="textarea" v-model="baseinfo.companyCulture" placeholder="请输入客户企业文化"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="baseinfo.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="营业执照">
            <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerAtta`"
              :type="false"
              @onSuccessUpload="onBusinessLicenseUploadFile"
              :isUrl="this.baseinfo.businessLicenseAtta"
              @handleClose="onBusinessLicenseAttaHand"
              @handleClick="onClickHand"
            ></upload>
          </el-form-item>
          <el-form-item label="标签" prop="tag">
            <tags title="添加标签" v-model="baseinfo.tagList" />
            <el-tag
              @click="addTag_(item)"
              style="cursor:pointer;margin-top:4px;"
              size="medium"
              type="info"
              v-for="(item,index) in tagHistory"
              :key="index"
            >{{item}}</el-tag>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <h4>客户财务信息</h4>
    <el-form
      ref="ruleForm2"
      :model="baseinfo.financeInfoSaveAndUpdateVos[0]"
      label-width="140px"
      :rules="rules2"
    >
      <div class="row max-width">
        <div class="row max-width">
          <div class="flex-2">
            <el-form-item label="开户名" prop="accountName">
              <el-input
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].accountName"
                placeholder="请输入开户名"
              ></el-input>
            </el-form-item>

            <el-form-item label="银行类别" prop="bankCategory">
              <el-select
                @change="changeNcBank"
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].bankCategory"
              >
                <el-option
                  v-for="(item,index) in AllNcBankCategory"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].bankAccount"
                placeholder="请输入银行账号"
                controls-position="right"
              ></el-input>
            </el-form-item>
          </div>
          <div class="flex-2">
            <el-form-item label="开户银行" prop="bank">
              <el-input
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].bank"
                placeholder="请输入开户银行"
              ></el-input>
            </el-form-item>
            <el-form-item label="纳税人登记号" prop="taxNumber">
              <el-input
                maxlength="20"
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].taxNumber"
                placeholder="请输入纳税人登记号"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <!--<h4>合作信息</h4>
    <el-form ref="ruleForm3" :model="baseinfo.coopInfoSaveAndUpdateVos[0]" label-width="140px" :rules="rules" >
      <div class="row max-width">
        <div class="flex-2" >
          &lt;!&ndash;<el-form-item label="所属部门(?)" prop="channelType">
            <el-cascader
              :options="departments"
              :props="{ value: '_supsubcompanyid', label: '_fullname' }"
              :show-all-levels="false"
              :clearable="true"></el-cascader>
            &lt;!&ndash;<el-cascader :props="props" :clearable="true"></el-cascader>&ndash;&gt;
          </el-form-item>&ndash;&gt;
          <el-form-item label="合作模式" prop="coopModel">
            <el-select v-model="baseinfo.coopInfoSaveAndUpdateVos[0].coopModel">
              <el-option label="自营" value="自营"></el-option>
              <el-option label="分销" value="分销"></el-option>
              <el-option label="直供" value="直供"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-2" >
          <el-form-item label="商品服务类型" prop="serviceType">
            <el-select v-model="baseinfo.coopInfoSaveAndUpdateVos[0].serviceType" multiple >
              <el-option label="NB" value="NB"></el-option>
              <el-option label="PB" value="PB"></el-option>
              <el-option label="JVB" value="JVB"></el-option>
              <el-option label="ODM" value="ODM"></el-option>
              <el-option label="OEM" value="OEM"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供货类型" prop="supplyType">
            <el-select v-model="baseinfo.coopInfoSaveAndUpdateVos[0].supplyType" multiple >
              <el-option label="一件代发" value="一件代发"></el-option>
              <el-option label="寄售" value="寄售"></el-option>
              <el-option label="购销" value="购销"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>-->

    <el-button type="primary" @click="addCoop">添加合作信息</el-button>
    <div v-for="(item, index) in baseinfo.coopInfoSaveAndUpdateVos" :key="index">
      <coop-card
        class="mt20"
        :ref="'coop' + index"
        :title="'合作信息-' + (index + 1)"
        v-model="baseinfo.coopInfoSaveAndUpdateVos[index]"
        :states="states"
        :companyList="companyList"
        :allDepartmentLsit="allDepartmentLsit"
        :businessList="businessList"
        :closeMethodList="closeMethodList"
        @onDelete="delCoopInfo"
      ></coop-card>
    </div>

    <!-- <h4>合作信息</h4>
    <el-table class="mt10" :data="baseinfo.coopInfoSaveAndUpdateVos">
      <div slot="append">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addCoop"
          size="small"
          style="width:100%"
        >请点击添加合作信息</el-button>
      </div>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
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
      <el-table-column class-name="must" label="所属公司">
        <template slot-scope="scope">
          <el-select v-model="scope.row.companyId" @change="companyChange($event, scope.$index)">
            <el-option
              v-for="item in companyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column class-name="must" label="所属部门">
        <template slot-scope="scope">
          <el-cascader
            :show-all-levels="false"
            :props="defaultParams"
            :options="coopDeartmentList[scope.$index]"
            v-model="scope.row.deptId"
            @change="onChangeCas"
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column class-name="must" label="商品服务类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.serviceTypes" multiple>
            <el-option label="NB" value="NB"></el-option>
            <el-option label="PB" value="PB"></el-option>
            <el-option label="JVB" value="JVB"></el-option>
            <el-option label="ODM" value="ODM"></el-option>
            <el-option label="OEM" value="OEM"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="合作模式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.coopModel">
            <el-option label="自营" value="自营"></el-option>
            <el-option label="分销" value="分销"></el-option>
            <el-option label="直供" value="直供"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="供货类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.supplyTypes" multiple>
            <el-option label="一件代发" value="一件代发"></el-option>
            <el-option label="寄售" value="寄售"></el-option>
            <el-option label="购销" value="购销"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="settleMethod" label="结算方式">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.settleMethod"
            placeholder="请选择"
            @change="(index) => {
            scope.row.settleMethod = closeMethodList[index].name
          }"
          >
            <el-option
              v-for="(item,index) in closeMethodList"
              :key="item.value"
              :label="item.label"
              :value="index"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope" v-if="scope.$index>0">
          <el-button type="text" @click="delCoopInfo(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <!-- <h4>内部跟进人信息</h4>
    <el-table class="mt10" :data="baseinfo.innerPersonInfoSaveAndUpdateVos">
      <div slot="append">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addPerson"
          size="small"
          style="width:100%"
        >请点击添加内部跟进人信息</el-button>
      </div>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
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
            @change="getuser"
          >
            <el-option
              v-for="item in innerPersonOptions"
              :key="item.value"
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
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope" v-if="scope.$index>0">
          <el-button type="text" @click="delPersonInfo(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <h4>客户联系人信息</h4>
    <el-table class="mt10" :data="baseinfo.contactsInfoSaveAndUpdateVos" :default-expand-all="true">
      <div slot="append">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addCusterPerson"
          size="small"
          style="width:100%"
        >请点击添加客户联系人信息</el-button>
      </div>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
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

      <el-table-column type="expand" label="身份证" width="80" v-if="baseinfo.enterpriseType==='1'">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="scope.row.idCard" placeholder="身份证号"></el-input>
            </el-form-item>
            <el-form-item label="身份证（手持证件）" prop="idCardHolding">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardHolding" :uploadOss="uploadContactsIDcard"></simple-file>
              </div>
            </el-form-item>
            <el-form-item label="身份证（正面图）" prop="idCardObverse">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardObverse" :uploadOss="uploadContactsIDcard"></simple-file>
              </div>
            </el-form-item>
            <el-form-item label="身份证（反面图）" prop="idCardReverse">
              <div style="{width: 220px}">
                <simple-file v-model="scope.row.idCardReverse" :uploadOss="uploadContactsIDcard"></simple-file>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope" v-if="scope.$index>0">
          <el-button type="text" @click="delCusterPersonInfo(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <br />
    <br />
    <el-button
      type="success"
      size="medium"
      style="padding:15px 30px 15px 30px"
      @click="addClient()"
    >保存客户信息</el-button>
    <el-button size="medium" style="padding:15px 30px 15px 30px" @click="$router.go(-1)">返回列表</el-button>
  </div>
</template>

<script>
import { listBusiness } from '@/api/business'
import Tags from '@/components/Tags'
import {
  selectPage,
  getDistrictList,
  addSaveBaseInfo,
  findAll,
  getAllNcCusCategory,
  getEcologyUsersByDept,
  getEcologyUserByMobile,
  getAllEcologyUsers,
  getJobTitleById,
  getNcCusCategoryList,
  getAllCompanyInfo,
  findAllBankCategory,
  getNcCloseMethod,
  getOAThreeSub,
} from '@/api/client'
import { getMaxNumber, generateCategoryCascader, deepClone } from '@/utils'
import upload from '@/components/upload'
import { baseURL } from '@/config'
import { checkEmail, checkTaxId } from '@/utils'
import { uploadContactsIDcard } from '@/api/uploadOss'
import CountrySelect from '@/components/form/CountrySelect.vue'
import AddressSelect from '../../../components/form/AddressSelect.vue'
import CoopCard from './component/coop-card.vue'
export default {
  name: 'maintainingAddUser',
  components: { upload, Tags, CountrySelect, AddressSelect, CoopCard },
  data() {
    let validateCustomerName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入客户名称'))
      } else {
        // 判断是否重复
        selectPage({
          neId: 0,
          eqName: value,
          pageIndex: 1,
          pageSize: 1,
        }).then((res) => {
          if (res.total > 0) {
            callback(new Error('客户名称已存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      closeMethodList: [],
      AllNcCusCategory: [],
      AllNcBankCategory: [], //NC银行类别
      departments: [], //所属公司
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
        emitPath: false,
        checkStrictly: true,
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          console.log('level', level)
          var id = 0
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 }).map((item) => ({
              value: ++id,
              label: `选项${id}`,
              leaf: level >= 2,
            }))
            console.log('nodes', nodes)
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }, 1000)
        },
      },
      //departments:[],//所属部门
      innerPersonOptions: [], // 内部跟进人信息
      innerPersonLoading: false, // 内部跟进人信息搜索判断
      states: [], // 内部跟进人信息,名字列表

      uploadLoading: false, //上传判断
      baseURL: baseURL,
      attachmenList: [], // 附件列表
      //新增用户信息
      baseinfo: {
        tagList: [],
        logo: '', //客户头像
        ncCode: '', // NC客户编码
        tel: '', // 电话
        areaCode: '', //地区编码 地区分类的时候,手动赋值

        name: '', //客户名称
        address: '', // 企业总部地址
        legalPerson: '', // 法人
        industry: '', // 所属行业
        email: '', // e-mail 地址
        //entNature:'',// 企业性质: 国营/民营
        financialOrg: '', // 对应财务组织 内部单位才要填
        type: '', // 客户类型

        enName: '', // 客户英文名
        //regCapital:'',//注册资金
        simpleName: '', //客户简称
        //annualSalesVolume:null,//客户年度销售额
        area: '', //国家/地区
        //shopCount:null,//终端门店数量
        //fax:'',//传真
        ownBrandCount: null, //自由品牌数量
        //webSite:'', // web网址
        //entPersonCount:null,//公司人数
        //strategy:'',//公司战略规划-销售/采购
        //memberCount:null, // 会员数
        //business:'',  // 业务基本构成
        //onSaleCategory:'',//客户在售商品品类
        //manageModel:'', //客户管理模式
        //onSaleProportion:'',//在售品类销售占比（护肤/彩妆/百货/个护）
        //ourAdvantage:'',	//对应客户我们的优势
        remark: '', //备注
        customerDept: '',
        companyCulture: '', //企业文化
        intro: '', //客户简介
        customerGrade: '', //客户等级
        paymentDay: '', //账期天数
        closeMethod: '', //结算方式
        enterpriseType: '', //企业性质
        // 客户财务信息
        financeInfoSaveAndUpdateVos: [
          {
            accountName: '', //开户名
            bank: '', //开户银行
            bankAccount: '', //银行账号
            capitalProfile: '', //资本概况，如：9月完成融资1亿元
            creditCode: '', //社会统一信用代码
            entTaxRate: '', //企业税率：普通纳税人，小规模纳税人
            taxCategory: '', //客户税类：增值税
            taxNumber: '', //纳税人登记号
            bankCategory: '', //银行类别
          },
        ],
        // 客户联系人信息
        contactsInfoSaveAndUpdateVos: [
          {
            birthday: 0, //生日
            email: '', //邮箱
            fullName: '', //姓名
            gender: '', //性别：0=保密，1=男，2=女
            im: '', //微信/QQ
            mobile: '', //手机
            position: '', //负责内容
            tel: '', //座机
            idCard: '', //身份证号
            idCardHolding: '', //身份证照片（手持）
            idCardObverse: '', //身份证照片（正面）
            idCardReverse: '', //身份证照片（反面）
          },
        ],
        //合作信息
        coopInfoSaveAndUpdateVos: [
          {
            //	用于新增客户合作信息附件
            businessId: '',
            cusAttachmentSaveVos: [],
            // contractAttaName:'',//合同附件名 到时候获取
            // contractAttaUrl:'', // 到时候获取
            channelCategory: '', //渠道大类：线上渠道/线下渠道
            channelCategorys: [], //实际展示的渠道大类
            channelType: '', //渠道类型：传统电商/社交电商/合作平台等
            channelTypeCode: '', // 渠道类型编码
            contractDayCount: '', //账期（合同）天数
            contractTerm: '', //合同期限
            contractType: '', //账期（合同）类型：货到/票到
            companyId: '', // 通过泛微获取
            deptId: '', // 通过泛微获取
            deptName: '', //所属部门
            coopModel: '', //客户合作模式：自营/分销/直供
            ncCategoryCode: '', // nc客户分类编码
            ncCategoryName: '', //nc客户分类
            riskAssessment: '', //与客户合作风险评估
            serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
            settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
            signSubject: '', //签约主体
            supplyType: [], //供货类型：一件代发、寄售，购销
            innerPersonInfos: [
              // {
              //   orgId: '', //所属组织id
              //   orgName: '', //所属组织
              //   deptId: '', //所属部门id
              //   deptName: '', //所属部门
              //   email: '', //邮箱
              //   fullName: '', //姓名
              //   tel: '', //电话
              //   jobTitleId: '',
              //   jobTitle: '',
              //   workCode: '', //工号
              // },
            ],
          },
        ],
        // 内部跟进人员
        innerPersonInfoSaveAndUpdateVos: [
          {
            orgId: '', //所属组织id
            orgName: '', //所属组织
            deptId: '', //所属部门id
            deptName: '', //所属部门
            email: '', //邮箱
            fullName: '', //姓名
            tel: '', //电话
            jobTitleId: '',
            jobTitle: '',
            workCode: '', //工号
          },
        ],
        //  客户提案附件
        introduceAtta: [],
        //  营业执照
        businessLicenseAtta: [],
        // 客户介绍资料附件
        proposalAtta: [],
      },

      imageUrllist: [],
      imageUrllistTow: [],
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { validator: validateCustomerName, trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请选择国家/地区', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择客户基本类型', trigger: 'change' },
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        industry: [
          { required: true, message: '请输入所属行业', trigger: 'blur' },
        ],
        channelCategorys: [
          { required: true, message: '请选择渠道大类', trigger: 'change' },
        ],
        channelType: [
          { required: true, message: '请选择客户渠道类型', trigger: 'change' },
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' },
        ],
        ncCategoryName: [
          { required: true, message: '请选择客户基本分类', trigger: 'change' },
        ],
        customerGrade: [
          { required: true, message: '请选择客户等级', trigger: 'blur' },
        ],
        closeMethod: [
          { required: true, message: '请选择结算方式', trigger: 'blur' },
        ],
        enterpriseType: [
          { required: true, message: '请选择企业性质', trigger: 'blur' },
        ],
        customerType: [
          { required: true, message: '请选择是否内部员工', trigger: 'blur' },
        ],
      },
      rules2: {
        accountName: [
          { required: true, message: '请输开户名', trigger: 'blur' },
        ],
        bankAccount: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: '请输入纯数字的银行账号',
            trigger: 'blur',
          },
        ],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        taxNumber: [
          { required: true, message: '请输入纳税人登记号', trigger: 'blur' },
          // {
          //   required: true,
          //   pattern:  /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/,
          //   message: '请输入正确的15、18、20位纳税人登记号',
          //   trigger: 'blur'
          // }
        ],
      },
      // 内部跟进人 赋值对象
      copyInnerPersonInfo: {
        orgName: '', //所属组织
        deptName: '', //所属部门
        email: '', //邮箱
        fullName: '', //姓名
        position: '', //负责内容
        tel: '', //电话
      },
      // 合作信息 赋值对象
      copyCooInfo: {
        //	用于新增客户合作信息附件
        cusAttachmentSaveVos: [{}],
        channelCategory: '', //渠道大类：线上渠道/线下渠道
        channelType: '', //渠道类型：传统电商/社交电商/合作平台等
        deptId: '', // 通过泛微获取部门id
        deptIds: [], // 通过泛微获取部门id
        companyId: '', // 通过泛微获取公司id
        orgName: '', //所属组织
        deptName: '', //所属部门
        coopModel: '', //客户合作模式：自营/分销/直供
        // id:null ,//	客户合作信息id(修改时传入)
        serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
        settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
        signSubject: '', //签约主体
        supplyTypes: [], //供货类型：一件代发、寄售，购销
        innerPersonInfos: [],
      },
      //客户联系人 复制对象
      copyontactsInfo: {
        birthday: 0, //生日
        email: '', //邮箱
        fullName: '', //姓名
        gender: '', //性别：0=保密，1=男，2=女
        im: '', //微信/QQ
        mobile: '', //手机
        position: '', //负责内容
        tel: '', //座机
        idCard: '', //身份证号
        idCardHolding: '', //身份证照片（手持）
        idCardObverse: '', //身份证照片（正面）
        idCardReverse: '', //身份证照片（反面）
      },
      area: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let level = 'province'
          let padcode = ''
          if (node.hasOwnProperty('data')) {
            switch (node.level) {
              case 1:
                level = 'city'
                padcode = node.data.adcode
                break
              case 2:
                level = 'district'
                padcode = node.data.adcode
                break
              case 3:
                level = 'street'
                padcode = node.data.adcode
                break
              default:
                level = 'city'
                padcode = node.data.adcode
                break
            }
          }
          if (node.level == 4) {
            resolve(false) // 返回数据
            return
          }
          getDistrictList({
            level: level,
            padcode: padcode,
          }).then((res) => {
            if (res.length == 0 && node.data && node.data.adcode != 1) {
              getDistrictList({ level: 'street', padcode: padcode }).then(
                (street) => {
                  street.forEach((item) => {
                    item['value'] = item.name
                    item['label'] = item.name
                    item['leaf'] = true
                    this.baseinfo.areaCode = street[0].adcode
                  })
                  resolve(street) // 返回数据
                }
              )
            } else {
              res.forEach((item) => {
                item['value'] = item.name
                item['label'] = item.name
                if (node.level == 3) {
                  item['leaf'] = true
                }
                this.baseinfo.areaCode = res[0].adcode
              })
              resolve(res) // 返回数据
            }
          })
        },
      },
      customerNumber: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          console.log(node)
          let isOneLevel = true
          let parentId = ''
          if (node.hasOwnProperty('data')) {
            parentId = node.data.ncPk
            isOneLevel = false
          }
          getNcCusCategoryList({
            isOneLevel: isOneLevel,
            parentId: parentId,
          }).then((res) => {
            //  如果下一级没有空间则使用上一级的code与name
            if (res.length == 0) {
              this.baseinfo.ncCategoryCode = node.data.code
              this.baseinfo.ncCategoryName = node.data.name
              resolve(res) // 返回数据
              return
            }
            res.forEach((item) => {
              item['value'] = item.name
              item['label'] = item.name
            })
            resolve(res) // 返回数据
          })
        },
      },
      options: [],
      //	客户店铺信息
      shopInfoSaveAndUpdateVos: [
        {
          baseInfoId: '',
          area: '', //区域
          city: '', //城市
          // code	:'',//店铺号(不允许修改，添加时有效，修改忽略该参数)
          id: null, //客户店铺信息id(修改时传入)
          name: '', //店铺名
          operateTeam: '', //运营团队
          operateType: '', //运营类型：外包/直营
          province: '', //省份
        },
      ],
      ShopInfoIndex: 0, // 客户店铺索引
      shopInfoFlag: false, // 添加店铺开关
      businessList: [],
      shopInfoList: [
        {
          area: '', //区域
          city: '', //城市
          code: '', //店铺号(不允许修改，添加时有效，修改忽略该参数)
          baseInfoId: '',
          name: '', //店铺名
          operateTeam: '', //运营团队
          operateType: '', //运营类型：外包/直营
          province: '', //省份
        },
      ],
      isEditSho: false, // 弹窗是修改的状态
      isLook: false, //进入页面判断值
      imageUrl: '', // 头像图片
      formindex: 0,
      noSubmit: false, // 是否能点击编辑
      companyList: [],
      allDepartmentLsit: [],
      coopDeartmentList: [],
    }
  },
  computed: {
    areas: {
      get() {
        if (this.baseinfo.area) {
          return this.baseinfo.area.split('/')
        }
        return []
      },
      set(v) {
        this.baseinfo.area = Array.isArray(v) ? v.join('/') : ''
      },
    },
    tagHistory() {
      let arr = ['跨境客户', '一件代发客户', '联合公司']
      if (this.baseinfo.tagList) {
        this.baseinfo.tagList.forEach((items) => {
          arr.forEach((item, index) => {
            if (item == items) {
              arr.splice(index, 1)
            }
          })
        })
      }
      return arr
    },
  },
  created() {},
  mounted() {
    this.init()
    this.getFindAll() // 获取渠道类型
    this.listBusiness()
    this.getAllNcCusCategory()
    this.getAllNcBankCategory()
    this.getCloseMethod()
  },
  methods: {
    uploadContactsIDcard,
    delCusterPersonInfo(item) {
      this.baseinfo.contactsInfoSaveAndUpdateVos.splice(item, 1)
    },
    delPersonInfo(item) {
      this.baseinfo.innerPersonInfoSaveAndUpdateVos.splice(item, 1)
    },
    delCoopInfo(item) {
      console.log(item)
      const index = this.baseinfo.coopInfoSaveAndUpdateVos.indexOf(item)
      console.log(index)
      this.baseinfo.coopInfoSaveAndUpdateVos.splice(index, 1)
    },
    listBusiness() {
      //获取业务板块 业务板块
      listBusiness().then((res) => {
        this.businessList = res
      })
    },
    addTag_(item) {
      this.baseinfo.tagList.push(item)
    },
    changeNc(e) {
      this.AllNcCusCategory.map((item) => {
        if (item.code === e) {
          console.log(item.name)
          this.baseinfo.ncCategoryCode = item.code
          this.baseinfo.ncCategoryName = item.name
        }
      })
    },
    getAllNcCusCategory() {
      getAllNcCusCategory().then((res) => {
        this.AllNcCusCategory = res
      })
    },
    changeNcBank(e) {
      this.AllNcBankCategory.map((item) => {
        if (item.code === e) {
          this.baseinfo.financeInfoSaveAndUpdateVos[0].ncBankPk = item.ncPk
          this.baseinfo.financeInfoSaveAndUpdateVos[0].bankCategory = item.name
        }
      })
    },
    getAllNcBankCategory() {
      findAllBankCategory().then((res) => {
        this.AllNcBankCategory = res
      })
    },
    getCloseMethodType(res) {
      this.baseinfo.closeMethod = this.closeMethodList[res].name
    },
    //获取结算方式
    getCloseMethod() {
      getNcCloseMethod().then((res) => {
        res.forEach((item) => {
          item['value'] = item.name
          item['label'] = item.name
        })
        this.closeMethodList = res
      })
    },
    onChangeCas(e) {
      console.log(e)
    },
    hint() {
      this.$message({
        message: '不能编辑内容,请联系系统管理员',
        type: 'warning',
      })
    },
    getchannelType(res) {
      this.baseinfo.channelTypeCode = this.options[res].code
      this.baseinfo.channelType = this.options[res].value
    },
    // 选中时获取客户信息 并赋值
    getuser(user) {
      let stateslist = null
      this.states.forEach((item) => {
        if (item.label == user) {
          stateslist = item.userlist
        }
      })
      this.baseinfo.innerPersonInfoSaveAndUpdateVos.forEach((item) => {
        if (item.fullName == user) {
          console.log(stateslist)
          item.orgId = stateslist.subcompanyid1
          item.orgName = stateslist.subcompanyname //所属组织
          item.deptName = stateslist.departmentname //所属部门
          item.deptId = stateslist.departmentid //所属部门id
          item.email = stateslist.email //邮箱
          item.fullName = stateslist.lastname //姓名
          item.tel = stateslist.mobile //电话
          item.workCode = stateslist.workcode //工号
          getJobTitleById(stateslist.jobtitle).then((res) => {
            item.jobTitleId = res._jobtitleid
          })
        }
      })
    },
    // 获取名字信息
    init() {
      getAllEcologyUsers().then((res) => {
        this.states = res.map((item) => {
          return { value: item.lastname, label: item.lastname, userlist: item }
        })
      })
      getEcologyUserByMobile(this.$store.getters.userInfo.mobile)
        .then((res) => {
          // companyId
          this.baseinfo.coopInfoSaveAndUpdateVos[0].companyId =
            res.subcompanyid1
          this.baseinfo.coopInfoSaveAndUpdateVos[0].companyName =
            res.subcompanyname
          this.baseinfo.coopInfoSaveAndUpdateVos[0].deptId = res.departmentid
          this.baseinfo.coopInfoSaveAndUpdateVos[0].deptName =
            res.departmentname
        })
        .catch((error) => {
          this.noSubmit = true
          console.log(error)
        })
      getOAThreeSub().then((res) => {
        let data = deepClone(res)
        // data.forEach((ele) => {
        //   ele['_departmentid'] = ele._subcompanyid
        // })
        console.log(data)
        console.log('<<<<')
        console.log(this.allDepartmentLsit)
        data.forEach((v) =>
          this.allDepartmentLsit.push(...v.departmentBeanList)
        )
        this.departments = deepClone(this.allDepartmentLsit)
        this.coopDeartmentList[0] = deepClone(this.departments)
        this.companyList = data.map((v) => {
          return {
            label: v._fullname,
            value: v._subcompanyid,
          }
        })
      })
      // getAllCompanyInfo().then((res) => {
      //   let data = deepClone(res)
      //   data.forEach((ele) => {
      //     ele['_departmentid'] = ele._subcompanyid
      //   })
      //   this.departments = data
      //   console.log('departments', this.departments)
      // })
    },
    // 判断选中的值存不存在
    remoteMethod(query) {
      if (query !== '') {
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
    // 文件上传成功时的钩子
    onSuccessUpload(res, file) {
      this.baseinfo.logo = res
      this.imageUrllist = []
      this.imageUrllist.push(res)
    },
    // 基本信息地图 获取选中的地址
    setArea(e) {
      this.baseinfo.area = e.join('/')
    },
    setCustomerNumber(e) {
      this.baseinfo.ncCategoryName = e.join('/')
    },
    // 获取渠道分类
    getFindAll() {
      findAll().then((res) => {
        res.forEach((item) => {
          item['value'] = item.name
          item['label'] = item.name
        })
        this.options = res
      })
    },
    innerPersonInfoSaveAndUpdateVosRules() {
      //内部跟进人规则
      let params = this.baseinfo.innerPersonInfoSaveAndUpdateVos
      for (let i = 0; i < params.length; i++) {
        if (
          !(
            params[i].fullName &&
            params[i].tel &&
            params[i].deptName &&
            params[i].jobTitle &&
            params[i].businessId
          )
        ) {
          this.$message({
            message: !params[i].fullName
              ? '内部跟进人姓名不能为空'
              : !params[i].tel
              ? '内部跟进人电话不能为空'
              : !params[i].deptName
              ? '内部跟进人所属部门不能为空'
              : !params[i].businessId
              ? '内部跟进人业务板块不能为空'
              : '内部跟进人负责内容不能为空',
            type: 'warning',
          })
          return false
        }
      }
      return true
    },
    coopInfoSaveAndUpdateVosRules() {
      //合作信息规则
      console.log('aaa', this.baseinfo.coopInfoSaveAndUpdateVos)
      for (let i = 0; i < this.baseinfo.coopInfoSaveAndUpdateVos.length; i++) {
        if (
          this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptId'] &&
          this.baseinfo.coopInfoSaveAndUpdateVos[i]['companyId']
        ) {
          if (!this.baseinfo.coopInfoSaveAndUpdateVos[i].businessId) {
            this.$message({ message: '业务板块不能为空', type: 'warning' })
            return false
          }
          // if (
          //   this.baseinfo.coopInfoSaveAndUpdateVos[i].deptIds &&
          //   this.baseinfo.coopInfoSaveAndUpdateVos[i].deptIds.length > 0
          // ) {
          //   this.baseinfo.coopInfoSaveAndUpdateVos[i][
          //     'companyId'
          //   ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptIds'][0]
          //   this.baseinfo.coopInfoSaveAndUpdateVos[i][
          //     'deptId'
          //   ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptIds'][1]
          // } else {
          //   this.$message({ message: '合作部门不能为空', type: 'warning' })
          //   return false
          // }
          if (
            this.baseinfo.coopInfoSaveAndUpdateVos[i].serviceTypes &&
            this.baseinfo.coopInfoSaveAndUpdateVos[i].serviceTypes.length > 0
          ) {
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'supplyType'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['supplyTypes']
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'serviceType'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['serviceTypes']
          } else {
            this.$message({
              message: '合作部门商品服务类型不能为空',
              type: 'warning',
            })
            return false
          }
        } else {
          this.$message({ message: '合作部门不能为空', type: 'warning' })
          return false
        }
      }
      return true
    },
    contactsInfoSaveAndUpdateVosRules() {
      //客户联系人信息规则
      const reg = /^[0-9a-zA-Z]{18}$/
      let params = this.baseinfo.contactsInfoSaveAndUpdateVos
      for (let i = 0; i < params.length; i++) {
        if (
          !(
            params[i].fullName &&
            params[i].gender &&
            params[i].mobile &&
            params[i].position
          )
        ) {
          this.$message({
            message: !params[i].fullName
              ? '客户联系人姓名不能为空'
              : !params[i].gender
              ? '客户联系人性别不能为空'
              : !params[i].mobile
              ? '客户联系人电话不能为空'
              : '客户联系人负责内容不能为空',
            type: 'warning',
          })
          return false
        }
        /* 个人用户不再强制要求填身份证信息
        if(this.baseinfo.enterpriseType==='1'&&!(params[i].idCard&&params[i].idCardHolding&&params[i].idCardObverse&&params[i].idCardReverse)){
           this.$message({message: !params[i].idCard?'身份证号不能为空':!params[i].idCardHolding?'身份证照片（手持）不能为空':!params[i].idCardObverse?'身份证照片（正面）不能为空':'身份证照片（反面）不能为空',type: 'warning'});
          return false
        }
        if(this.baseinfo.enterpriseType==='1'&&!reg.test(params[i].idCard)) {
            this.$message({message:'请输入正确的身份证号（18位）',type: 'warning'});
             return false
        }
        */
      }
      return true
    },
    addClient() {
      const promiseList = this.baseinfo.coopInfoSaveAndUpdateVos.map(
        (v, index) => {
          const vueel = this.$refs['coop' + index]
          return (Array.isArray(vueel) ? vueel[0] : vueel).validate()
        }
      )
      this.$loading({ fullscreen: true })

      !this.baseinfo.contactsInfoSaveAndUpdateVos[0].birthday
        ? (this.baseinfo.contactsInfoSaveAndUpdateVos[0].birthday = 0)
        : ''

      this.$refs[`ruleForm1`].validate((valid) => {
        if (!valid) {
          this.$message({
            message: '保存失败，请填写客户基本信息必填内容',
            type: 'warning',
          })
          this.$loading().close()
        } else {
          this.$refs[`ruleForm2`].validate((valid) => {
            if (!valid) {
              this.$message({
                message: '保存失败，请填写客户财务信息必填内容',
                type: 'warning',
              })
              this.$loading().close()
              return
            }

            if (this.baseinfo.email && !checkEmail(this.baseinfo.email)) {
              this.$message.error({ message: '邮箱格式不正确' })
              this.$loading().close()
              return
            }

            this.baseinfo.channelCategory = this.baseinfo.channelCategorys

            if (this.contactsInfoSaveAndUpdateVosRules() != false) {
              Promise.all(promiseList)
                .then((pl) => {
                  const pam = deepClone(this.baseinfo)
                  pam.innerPersonInfoSaveAndUpdateVos = [].concat(
                    ...pam.coopInfoSaveAndUpdateVos.map(
                      (v) => v.innerPersonInfos
                    )
                  )
                  console.log(pam)
                  addSaveBaseInfo(pam).then((res) => {
                    this.$message({
                      message: '添加客户信息成功',
                      type: 'success',
                    })
                    this.$eventHub.$emit(this.$eventName.CUSTOMER_LIST_REFLUSH)
                    this.$loading().close()
                    this.$router.go(-1)
                  })
                })
                .catch((error) => {
                  this.$loading().close()
                  console.error(error)
                })
            } else {
              this.$loading().close()
            }
          })
        }
      })
    },
    // 添加更多内部联系人
    addPerson() {
      if (!this.innerPersonInfoSaveAndUpdateVosRules()) {
        return false
      } else {
        let item = deepClone(this.copyInnerPersonInfo)
        this.baseinfo.innerPersonInfoSaveAndUpdateVos.push(item)
      }
    },
    // 添加更多合作信息
    addCoop() {
      let item = deepClone(this.copyCooInfo)
      this.baseinfo.coopInfoSaveAndUpdateVos.push(item)
      // if (!this.coopInfoSaveAndUpdateVosRules()) {
      //   return false
      // } else {
      //   let item = deepClone(this.copyCooInfo)
      //   this.baseinfo.coopInfoSaveAndUpdateVos.push(item)
      // }
    },
    // 添加更多客户联系人
    addCusterPerson() {
      if (!this.contactsInfoSaveAndUpdateVosRules()) {
        return false
      } else {
        let item = deepClone(this.copyontactsInfo)
        this.baseinfo.contactsInfoSaveAndUpdateVos.push(item)
      }
    },
    //  客户介绍附件
    onIntroduceUploadFile(res, file) {
      let IntroduceUploadFild = {
        //	用于赋值 新增客户合作信息附件
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        // id:null,//客户附件自增id,新增时不必传值,当id不为空时,忽略保存
        size: res.size,
      }
      this.baseinfo.hasOwnProperty('introduceAtta')
        ? this.baseinfo.introduceAtta.push(IntroduceUploadFild)
        : null
    },
    // 客户介绍附件文件删除
    onIntroduceAttaHand(item) {
      let arr = this.baseinfo.introduceAtta ? this.baseinfo.introduceAtta : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          // stateslist =item.userlist;
          this.baseinfo.introduceAtta.splice(index, 1)
        }
      })
    },
    //  客户营业执照
    onBusinessLicenseUploadFile(res, file) {
      let uploadFile = {
        //	用于赋值 新增客户合作信息附件
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        // id:null,//客户附件自增id,新增时不必传值,当id不为空时,忽略保存
        size: res.size,
      }
      this.baseinfo.hasOwnProperty('businessLicenseAtta')
        ? this.baseinfo.businessLicenseAtta.push(uploadFile)
        : null
    },
    // 客户营业执照文件删除
    onBusinessLicenseAttaHand(item) {
      let arr = this.baseinfo.businessLicenseAtta
        ? this.baseinfo.businessLicenseAtta
        : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          // stateslist =item.userlist;
          this.baseinfo.businessLicenseAtta.splice(index, 1)
        }
      })
    },
    onClickHand(item) {
      console.info('附件被点击了', item)
      const link = document.createElement('a')
      link.setAttribute('download', item.fileName) //下载的文件名
      link.setAttribute('target', '_blank')
      link.href = item.attaUrl //文件url
      link.click()
    },
    companyChange(e, i = 0) {
      console.log(e, i)
      if (e) {
        this.coopDeartmentList.splice(
          i,
          1,
          this.allDepartmentLsit.filter((v) => v._subcompanyid === e)
        )
      } else {
        this.coopDeartmentList[i] = deepClone(this.allDepartmentLsit)
      }
    },
  },
  watch: {},
}
</script>

<style lang='scss' scoped>
.max-width {
  max-width: 80%;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.noSubmit {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: rgb(214, 210, 210);
}

.tip {
  color: rgba($color: #000000, $alpha: 0.35);
}
</style>

