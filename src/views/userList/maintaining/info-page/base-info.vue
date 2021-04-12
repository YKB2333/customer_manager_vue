

<template>
  <div class="adduser-page">
    <h4>客户基本信息</h4>
    <el-form
      ref="form1"
      :model="baseinfo"
      :disabled="isLook"
      label-width="140px"
      :rules="rules"
      readonly
    >
      <div class="row max-width">
        <div class="flex-2">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="baseinfo.name" :placeholder="!isLook?'请输入客户名称':''"></el-input>
            <el-input
              class="mHis"
              v-if="baseinfoOther.name && baseinfo.name !=baseinfoOther.name"
              v-model="baseinfoOther.name"
              disabled
            ></el-input>
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
            :rules="[{ required: baseinfo.enterpriseType == '0', message: '请上传logo', trigger: 'blur' }]"
          >
            <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerLogo`"
              :type="true"
              :isUrl="[baseinfo.logo]"
              @onSuccessUpload="onSuccessUpload"
            ></upload>
            <div class="tip">只能上传jpg/png文件，且不超过500kb；企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="企业总部地址" prop="address">
            <el-input v-model="baseinfo.address" :placeholder="!isLook ? '请输入企业总部地址':''"></el-input>
            <template v-if="baseinfoOther.address  &&  baseinfo.address != baseinfoOther.address ">
              <el-input class="mHis" v-model="baseinfoOther.address" disabled></el-input>
            </template>
          </el-form-item>
          <el-form-item label="渠道大类" prop="channelCategorys">
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
            <el-select
              v-model="baseinfoOther.customerGrade"
              v-if="baseinfoOther.customerGrade && baseinfo.customerGrade != baseinfoOther.customerGrade"
              disabled
              class="mHis"
            >
              <el-option class="mHis" label="一般客户" value="1"></el-option>
              <el-option class="mHis" label="战略客户" value="2"></el-option>
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
            <el-input v-model="baseinfo.financialOrg" :placeholder="!isLook ? '内部单位，才需要填':''"></el-input>
            <div class="tip">客户类型为内部单位时请选择财务组织</div>
          </el-form-item>
          <el-form-item label="客户简介">
            <el-input
              type="textarea"
              v-model="baseinfo.intro"
              :placeholder="!isLook ? '请输入客户简介':''"
            ></el-input>
          </el-form-item>
          <el-form-item label="介绍资料">
            <upload
              ref="upload"
              :action="`${baseURL}/uploadCustomerAtta`"
              :type="false"
              @onSuccessUpload="onIntroduceUploadFile"
              :isUrl="this.baseinfo.introduceAtta"
              @handleClose="onIntroduceAttaHand"
            ></upload>
            <div class="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-form-item>
        </div>
        <div class="flex-2 ml50">
          <br />
          <el-form-item
            label="客户简称（渠道）"
            prop="simpleName"
            :rules="[{ required: baseinfo.enterpriseType == '0', message: '请输入客户简称（渠道）', trigger: 'blur' }]"
          >
            <el-input v-model="baseinfo.simpleName" :placeholder="!isLook ? '请输入客户简称（渠道）':''"></el-input>
            <div class="tip">例如屈臣氏、云集…，企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="企业法人" prop="legalPerson">
            <el-input v-model="baseinfo.legalPerson" prop="name" :placeholder="!isLook?'请输入法人':''"></el-input>
            <el-input
              class="mHis"
              v-if="baseinfoOther.legalPerson && baseinfo.legalPerson != baseinfoOther.legalPerson"
              v-model="baseinfoOther.legalPerson"
              disabled
            ></el-input>
            <div class="tip">企业性质为个人时非必填</div>
          </el-form-item>
          <el-form-item label="国家/地区" prop="area" v-if="baseinfo.isTempData">
            <!-- <el-cascader
              v-if="!baseinfo.area "
              :props="area"
              expand-trigger="hover"
              @change="setArea"
            ></el-cascader>-->
            <country-select v-if="!baseinfo.area " v-model="baseinfo.area" checkStrictly></country-select>
            <el-input v-else v-model="baseinfo.area"></el-input>
            <el-input
              class="mHis"
              v-if="baseinfo.area != baseinfoOther.area && baseinfoOther.area"
              v-model="baseinfoOther.area"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="国家/地区" prop="area" v-if="!baseinfo.isTempData">
            <el-input v-model="baseinfo.area" v-if="baseinfo.area"></el-input>
            <!-- <el-cascader v-else :props="area" expand-trigger="hover" @change="setArea"></el-cascader> -->
            <country-select v-model="baseinfo.area" v-else checkStrictly></country-select>
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="baseinfo.industry" :placeholder="!isLook?'请输入所属行业':''"></el-input>
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
            <el-select
              v-model="baseinfoOther.channelType"
              placeholder="请选择"
              v-if="baseinfoOther.channelType  &&  baseinfo.channelType != baseinfoOther.channelType"
              @change="getchannelType"
              class="mHis"
              disabled
            >
              <el-option
                class="mHis"
                v-for="(item,index) in options"
                :key="item.value"
                :label="item.label"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="e-mail地址" prop="email">
            <el-input v-model="baseinfo.email" :placeholder="!isLook ? '请输入e-mail地址':''"></el-input>
            <el-input
              class="mHis"
              v-if="baseinfoOther.email && baseinfo.email != baseinfoOther.email"
              v-model="baseinfoOther.email"
              disabled
            ></el-input>
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
            <el-input
              class="mHis"
              v-if="baseinfoOther.paymentDay && baseinfo.paymentDay !=baseinfoOther.paymentDay"
              v-model="baseinfoOther.paymentDay"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="企业文化">
            <el-input
              type="textarea"
              v-model="baseinfo.companyCulture"
              :placeholder="!isLook ? '请输入客户企业文化':''"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="baseinfo.remark"
              :placeholder="!isLook ? '请输入客户备注':''"
            ></el-input>
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
            <div class="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <h4>客户财务信息</h4>
    <el-form
      ref="form2"
      :model="baseinfo.financeInfoSaveAndUpdateVos[0]"
      label-width="140px"
      :rules="rules2"
      :disabled="isLook"
    >
      <div class="row max-width">
        <div class="row max-width">
          <div class="flex-2">
            <el-form-item label="开户名" prop="accountName">
              <el-input
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].accountName"
                :placeholder="!isLook ? '请输入开户名':''"
              ></el-input>
              <el-input
                class="mHis"
                v-if="baseinfoOther.financeInfoSaveAndUpdateVos[0].accountName && baseinfo.financeInfoSaveAndUpdateVos[0].accountName != baseinfoOther.financeInfoSaveAndUpdateVos[0].accountName"
                v-model="baseinfoOther.financeInfoSaveAndUpdateVos[0].accountName"
                disabled
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
                onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].bankAccount"
                :placeholder="!isLook ? '请输入银行账号':''"
              ></el-input>
              <el-input
                class="mHis"
                v-if="baseinfoOther.financeInfoSaveAndUpdateVos[0].bankAccount && baseinfo.financeInfoSaveAndUpdateVos[0].bankAccount !== baseinfoOther.financeInfoSaveAndUpdateVos[0].bankAccount"
                v-model="baseinfoOther.financeInfoSaveAndUpdateVos[0].bankAccount"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div class="flex-2">
            <el-form-item label="开户银行" prop="bank">
              <el-input
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].bank"
                :placeholder="!isLook ? '请输入开户银行':''"
              ></el-input>
              <el-input
                class="mHis"
                v-if="baseinfoOther.financeInfoSaveAndUpdateVos[0].bank && baseinfo.financeInfoSaveAndUpdateVos[0].bank !== baseinfoOther.financeInfoSaveAndUpdateVos[0].bank"
                v-model="baseinfoOther.financeInfoSaveAndUpdateVos[0].bank"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="纳税人登记号" prop="taxNumber">
              <el-input
                maxlength="20"
                v-model="baseinfo.financeInfoSaveAndUpdateVos[0].taxNumber"
                :placeholder="!isLook ? '请输入纳税人登记号':''"
              ></el-input>
              <el-input
                class="mHis"
                v-if="baseinfoOther.financeInfoSaveAndUpdateVos[0].taxNumber && baseinfo.financeInfoSaveAndUpdateVos[0].taxNumber !== baseinfoOther.financeInfoSaveAndUpdateVos[0].taxNumber"
                v-model="baseinfoOther.financeInfoSaveAndUpdateVos[0].taxNumber"
                disabled
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <br />
    <br />
    <el-button
      type="success"
      size="medium"
      style="padding:15px 30px 15px 30px"
      @click="updateBase"
      v-if="!isLook"
    >修改客户信息</el-button>
    <el-button size="medium" style="padding:15px 30px 15px 30px" @click="$router.go(-1)">返回列表</el-button>
  </div>
</template>

<script>
import {
  selectPage,
  getAllNcCusCategory,
  getDistrictList,
  findAll,
  getBaseInfoById,
  getEcologyUserByMobile,
  getAllEcologyUsers,
  getJobTitleById,
  getAllCompanyInfo,
  addCoopInfo,
  updateCoopInfoById,
  deleteCoopInfoById,
  getCoopInfoListByBaseInfoId,
  getBaseInfoTempById,
  findAllBankCategory,
  getNcCloseMethod,
  updateBaseInfo,
} from '@/api/client'
import {
  getMaxNumber,
  generateCategoryCascader,
  deepClone,
  checkEmail,
} from '@/utils'
import Upload from '@/components/upload'
import CountrySelect from '@/components/form/CountrySelect'
import { baseURL } from '@/config'

export default {
  components: { Upload, CountrySelect },
  props: {
    businessList: Array,
    userId: String,
    isLook: Boolean,
  },
  data() {
    let validateCustomerName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入客户名称'))
      } else {
        // 判断是否重复
        selectPage({
          neId: this.userId,
          eqName: value,
          pageIndex: 1,
          pageSize: 1,
        }).then((res) => {
          if (this.baseinfo.enterpriseType == '0' && res.total > 0) {
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
      AllNcBankCategory: [],
      department: '',
      departments: [], //所属公司
      selectedOptions: '',
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
      },
      innerPersonOptions: [], // 内部跟进人信息
      innerPersonLoading: false, // 内部跟进人信息搜索判断
      states: [], // 内部跟进人信息,名字列表
      uploadLoading: false, //上传判断
      baseURL: baseURL,
      attachmenList: [], // 附件列表
      //新增用户信息
      baseinfo: {
        logo: '', //客户头像
        tel: '', // 电话
        areaCode: '', //地区编码 地区分类的时候,手动赋值
        name: '', //客户名称
        address: '', // 企业总部地址
        legalPerson: '', // 法人
        industry: '', // 所属行业
        email: '', // e-mail 地址
        entNature: '', // 企业性质: 国营/民营
        financialOrg: '', // 对应财务组织 内部单位才要填
        type: '', // 客户类型
        enName: '', // 客户英文名
        regCapital: '', //注册资金
        simpleName: '', //客户简称
        annualSalesVolume: null, //客户年度销售额
        area: '', //国家/地区
        shopCount: null, //终端门店数量
        fax: '', //传真
        ownBrandCount: null, // 自由品牌数量
        webSite: '', // web网址
        entPersonCount: null, //公司人数
        strategy: '', //公司战略规划-销售/采购
        memberCount: null, // 会员数
        business: '', // 业务基本构成
        onSaleCategory: '', //客户在售商品品类
        manageModel: '', //客户管理模式
        onSaleProportion: '', //在售品类销售占比（护肤/彩妆/百货/个护）
        ourAdvantage: '', //对应客户我们的优势
        remark: '', //备注
        customerDept: '', //客户所属部门
        // 客户财务信息
        financeInfoSaveAndUpdateVos: [
          {
            accountName: '', //开户名
            bank: '', //开户银行
            bankAccount: '', //银行账号
            bankCategory: '', //银行分类
            capitalProfile: '', //资本概况，如：9月完成融资1亿元
            creditCode: '', //社会统一信用代码
            entTaxRate: '', //企业税率：普通纳税人，小规模纳税人
            taxCategory: '', //客户税类：增值税
            taxNumber: '', //纳税人登记号
            ncBankPk: '',
          },
        ],
        // 客户联系人信息
        contactsInfoSaveAndUpdateVos: [
          {
            birthday: 0, //生日
            email: '', //邮箱
            fullName: '', //姓名
            gender: '', //性别：0=保密，1=男，2=女
            id: null, //客户联系人信息id(修改时传入)
            im: '', //微信/QQ
            mobile: '', //手机
            position: '', //负责内容
            tel: '', //座机
          },
        ],
        //合作信息
        coopInfoSaveAndUpdateVos: [
          {
            //	用于新增客户合作信息附件
            baseInfoId: '', //客户id
            businessId: '',
            cusAttachmentSaveVos: [],
            contractAttaName: '', //合同附件名 到时候获取
            contractAttaUrl: '', // 到时候获取
            channelCategory: '', //渠道大类：线上渠道/线下渠道
            channelCategorys: '', //渠道大类：线上渠道/线下渠道是 多选  实际展示数据
            channelType: '', //渠道类型：传统电商/社交电商/合作平台等
            contractDayCount: '', //账期（合同）天数
            contractTerm: '', //合同期限
            contractType: '', //账期（合同）类型：货到/票到
            deptIds: [], // 通过泛微获取
            deptId: '', // 通过泛微获取
            companyId: '', // 通过泛微获取
            deptName: '', //所属部门
            coopModel: '', //客户合作模式：自营/分销/直供
            // id:null ,//	客户合作信息id(修改时传入)
            ncCategoryCode: '', // nc客户分类编码
            ncCategoryName: '', //nc客户分类
            riskAssessment: '', //与客户合作风险评估
            serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
            settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
            signSubject: '', //签约主体
            supplyTypes: [], //供货类型：一件代发、寄售，购销
            //departments:[],//所属部门
          },
        ],
        // 内部跟进人员
        innerPersonInfoSaveAndUpdateVos: [
          {
            deptId: '', //所属部门id
            deptName: '', //所属部门
            email: '', //邮箱
            fullName: '', //姓名
            tel: '', //电话
            jobTitleId: '',
            jobTitle: '',
          },
        ],
        // 客户介绍资料附件
        introduceAtta: [],
        // 营业执照
        businessLicenseAtta: [],
        proposalAtta: [],
        isTempData: null, //数据是否来源临时表
      },
      baseinfoOther: {
        logo: '', //客户头像
        tel: '', // 电话
        areaCode: '', //地区编码 地区分类的时候,手动赋值
        name: '', //客户名称
        address: '', // 企业总部地址
        legalPerson: '', // 法人
        industry: '', // 所属行业
        email: '', // e-mail 地址
        entNature: '', // 企业性质: 国营/民营
        financialOrg: '', // 对应财务组织 内部单位才要填
        type: '', // 客户类型
        enName: '', // 客户英文名
        regCapital: '', //注册资金
        simpleName: '', //客户简称
        annualSalesVolume: null, //客户年度销售额
        area: '', //国家/地区
        shopCount: null, //终端门店数量
        fax: '', //传真
        ownBrandCount: null, //自由品牌数量
        webSite: '', // web网址
        entPersonCount: null, //公司人数
        strategy: '', //公司战略规划-销售/采购
        memberCount: null, // 会员数
        business: '', // 业务基本构成
        onSaleCategory: '', //客户在售商品品类
        manageModel: '', //客户管理模式
        onSaleProportion: '', //在售品类销售占比（护肤/彩妆/百货/个护）
        ourAdvantage: '', //对应客户我们的优势
        remark: '', //备注
        customerDept: '', //客户所属部门
        customerGrade: '', //客户等级
        paymentDay: '', //账期天数
        closeMethod: '', //结算方式
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
          },
        ],
        // 客户联系人信息
        contactsInfoSaveAndUpdateVos: [
          {
            birthday: 0, //生日
            email: '', //邮箱
            fullName: '', //姓名
            gender: '', //性别：0=保密，1=男，2=女
            id: null, //客户联系人信息id(修改时传入)
            im: '', //微信/QQ
            mobile: '', //手机
            position: '', //负责内容
            tel: '', //座机
          },
        ],
        //合作信息
        coopInfoSaveAndUpdateVos: [
          {
            //	用于新增客户合作信息附件
            baseInfoId: '', //客户id
            businessId: '',
            cusAttachmentSaveVos: [],
            contractAttaName: '', //合同附件名 到时候获取
            contractAttaUrl: '', // 到时候获取
            channelCategory: '', //渠道大类：线上渠道/线下渠道
            channelCategorys: '', //渠道大类：线上渠道/线下渠道是 多选  实际展示数据
            channelType: '', //渠道类型：传统电商/社交电商/合作平台等
            contractDayCount: '', //账期（合同）天数
            contractTerm: '', //合同期限
            contractType: '', //账期（合同）类型：货到/票到
            deptIds: [], // 通过泛微获取
            deptId: '', // 通过泛微获取
            companyId: '', // 通过泛微获取
            deptName: '', //所属部门
            coopModel: '', //客户合作模式：自营/分销/直供
            ncCategoryCode: '', // nc客户分类编码
            ncCategoryName: '', //nc客户分类
            riskAssessment: '', //与客户合作风险评估
            serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
            settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
            signSubject: '', //签约主体
            supplyTypes: [], //供货类型：一件代发、寄售，购销
          },
        ],
        // 内部跟进人员
        innerPersonInfoSaveAndUpdateVos: [
          {
            deptId: '', //所属部门id
            deptName: '', //所属部门
            email: '', //邮箱
            fullName: '', //姓名
            tel: '', //电话
            jobTitleId: '',
            jobTitle: '',
          },
        ],
        // 客户介绍资料附件
        introduceAtta: [],
        // 营业执照
        businessLicenseAtta: [],
        proposalAtta: [],
        isTempData: null, //数据是否来源临时表
      },
      channelTypeCode: '', // 渠道类型编码
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'change' },
          { validator: validateCustomerName, trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请选择国家/地区', trigger: 'change' },
          { required: true, message: '请选择国家/地区', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择客户基本类型', trigger: 'change' },
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        industry: [
          { required: true, message: '请输入所属行业', trigger: 'change' },
        ],
        channelCategorys: [
          { required: true, message: '请选择渠道大类', trigger: 'change' },
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'change' },
        ],
        channelType: [
          { required: true, message: '请选择客户渠道类型', trigger: 'change' },
        ],
        ncCategoryName: [
          { required: true, message: '请选择客户基本分类', trigger: 'change' },
        ],
        customerGrade: [
          { required: true, message: '请选择客户等级', trigger: 'change' },
        ],
        closeMethod: [
          { required: true, message: '请选择结算方式', trigger: 'change' },
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
          { required: true, message: '请输开户名', trigger: 'change' },
        ],
        bankAccount: [
          { required: true, message: '请输银行账号', trigger: 'change' },
        ],
        bank: [
          { required: true, message: '请输入开户银行', trigger: 'change' },
        ],
        taxNumber: [
          { required: true, message: '请输入纳税人登记号', trigger: 'change' },
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
        deptName: '', //所属部门
        email: '', //邮箱
        fullName: '', //姓名
        id: null, // 客户内部跟进人员id(修改时传入)
        position: '', //负责内容
        tel: '', //电话
      },
      // 内部合作信息 赋值对象
      copyCooInfo: {
        //	用于新增客户合作信息附件
        cusAttachmentSaveVos: [{}],
        channelCategory: '', //渠道大类：线上渠道/线下渠道
        channelType: '', //渠道类型：传统电商/社交电商/合作平台等
        deptId: '', // 通过泛微获取部门id
        deptIds: [], // 通过泛微获取部门id
        companyId: '', // 通过泛微获取公司id
        deptName: '', //所属部门
        coopModel: '', //客户合作模式：自营/分销/直供
        serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
        settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
        signSubject: '', //签约主体
        supplyTypes: [], //供货类型：一件代发、寄售，购销
      },
      area: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let level = 'province'
          let padcode = ''
          // console.log("node",node)
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
      areaTwo: {
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
          getDistrictList({
            level: level,
            padcode: padcode,
          }).then((res) => {
            if (res.length == 0 && node.data.adcode != 1) {
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
      shoArea: {
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
          getDistrictList({
            level: level,
            padcode: padcode,
          }).then((res) => {
            res.forEach((item) => {
              item['value'] = item.name
              item['label'] = item.name
              if (node.level == 3) {
                item['leaf'] = true
              }
              this.shopInfoList[0].areaCode = res[0].hasOwnProperty('adcode')
                ? res[0].adcode
                : null
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
      //	客户合作信息
      coopInfoSaveAndUpdateVos: [
        {
          cusAttachmentSaveVos: [{}],
          contractAttaName: '', //合同附件名 到时候获取
          contractAttaUrl: '', // 到时候获取
          channelCategory: '', //渠道大类：线上渠道/线下渠道
          channelType: '', //渠道类型：传统电商/社交电商/合作平台等
          deptId: '', // 通过泛微获取部门id
          deptIds: [], // 通过泛微获取部门id
          companyId: '', // 通过泛微获取公司id
          deptName: '', //所属部门
          coopModel: '', //客户合作模式：自营/分销/直供
          ncCategoryCode: '', // nc客户分类编码
          ncCategoryName: '', //nc客户分类
          serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
          settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
          supplyTypes: [], //供货类型：一件代发、寄售，购销
        },
      ],
      ShopInfoIndex: 0, // 客户店铺索引
      shopInfoFlag: false, // 添加店铺开关
      coopInfoFlag: false, // 合作信息开关
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
      coopInfoList: [
        {
          baseInfoId: '',
          businessId: '',
          contractAttaName: '', //合同附件名 到时候获取
          contractAttaUrl: '', // 到时候获取
          channelCategory: '', //渠道大类：线上渠道/线下渠道
          channelCategorys: [], //渠道大类：线上渠道/线下渠道 实际展示的数据
          channelType: '', //渠道类型：传统电商/社交电商/合作平台等
          contractDayCount: '', //账期（合同）天数
          contractTerm: '', //合同期限
          contractType: '', //账期（合同）类型：货到/票到
          deptId: '', // 通过泛微获取部门id
          deptIds: [], // 通过泛微获取部门id
          companyId: '', // 通过泛微获取公司id
          deptName: '', //所属部门
          coopModel: '', //客户合作模式：自营/分销/直供
          ncCategoryCode: '', // nc客户分类编码
          ncCategoryName: '', //nc客户分类
          riskAssessment: '', //与客户合作风险评估
          serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
          settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
          signSubject: '', //签约主体
          supplyTypes: [], //供货类型：一件代发、寄售，购销
          enterpriseType: '',
        },
      ],
      isEditCoo: false, // 弹窗是修改的状态
      imageUrl: '', // 头像图片
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
        },
      ],
      // 客户联系人信息
      contactsInfoSaveAndUpdateVos: [
        {
          birthday: 0, //生日
          email: '', //邮箱
          fullName: '', //姓名
          gender: '', //性别：0=保密，1=男，2=女
          id: null, //客户联系人信息id(修改时传入)
          im: '', //微信/QQ
          mobile: '', //手机
          position: '', //负责内容
          tel: '', //座机
        },
      ],
      //合作信息
      coopInfoSaveAndUpdateVos: [
        {
          //	用于新增客户合作信息附件
          baseInfoId: '', //客户id
          cusAttachmentSaveVos: [{}],
          contractAttaName: '', //合同附件名 到时候获取
          contractAttaUrl: '', // 到时候获取
          channelCategory: '', //渠道大类：线上渠道/线下渠道
          channelType: '', //渠道类型：传统电商/社交电商/合作平台等
          contractDayCount: '', //账期（合同）天数
          contractTerm: '', //合同期限
          contractType: '', //账期（合同）类型：货到/票到
          deptId: '', // 通过泛微获取部门id
          deptIds: [], // 通过泛微获取部门id
          companyId: '', // 通过泛微获取公司id
          deptName: '', //所属部门
          coopModel: '', //客户合作模式：自营/分销/直供
          // id:null ,//	客户合作信息id(修改时传入)
          ncCategoryCode: '', // nc客户分类编码
          ncCategoryName: '', //nc客户分类
          riskAssessment: '', //与客户合作风险评估
          serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
          settleMethod: '', //结算方式（账期）：现款现货/月结/14天等
          signSubject: '', //签约主体
          supplyTypes: [], //供货类型：一件代发、寄售，购销
        },
      ],
      // 内部跟进人员
      innerPersonInfoSaveAndUpdateVos: [
        {
          deptId: '', //所属部门id
          deptName: '', //所属部门
          email: '', //邮箱
          fullName: '', //姓名
          tel: '', //电话
          jobTitleId: '',
          jobTitle: '',
        },
      ],
    }
  },
  created() {
    this.$loading({ fullscreen: true })
    this.init()
    this.isLook
      ? (this.$route.meta.title = '查看客户详情')
      : (this.$route.meta.title = '修改客户详情')
    this.getBaseInfoByIds() // id获取客户信息
    this.getFindAll() // 获取渠道类型
    this.getAllNcBankCategory()
    this.getAllNcCusCategory()
    this.getCloseMethod()
  },
  methods: {
    changeNc(e) {
      this.AllNcCusCategory.map((item) => {
        if (item.code === e) {
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
    //添加合作客户信息
    clearPro(type) {
      this.coopInfoList = [
        {
          baseInfoId: '',
          supplyType: '',
          serviceType: '',
          companyId: '',
          deptId: '',
        },
      ]
      if (
        this.coopInfoSaveAndUpdateVos[0] &&
        this.coopInfoSaveAndUpdateVos[0].id &&
        type == 'edit'
      ) {
        if (this.coopInfoSaveAndUpdateVosRulesList() == false) return
      }
      this.isEditCoo = false
      this.coopInfoFlag = true
      this.coopInfoList[0]['deptId'] = ''
      this.coopInfoList[0]['deptName'] = ''
      this.coopInfoList[0]['email'] = ''
      this.coopInfoList[0]['tel'] = ''
      this.coopInfoList[0]['jobTitleId'] = ''
      this.coopInfoList[0]['jobTitle'] = ''
    },
    getchannelType(res) {
      this.baseinfo.channelTypeCode = this.options[res].code
      this.baseinfo.channelType = this.options[res].value
    },
    getCloseMethodType(res) {
      this.baseinfo.closeMethod = this.closeMethodList[res].name
    },
    setCustomerNumber(e) {
      this.baseinfo.ncCategoryName = e.join('/')
    },
    // 文件删除
    handleClose(item) {
      let arr = this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos
        ? this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos
        : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos.splice(
            index,
            1
          )
        }
      })
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
          item.deptName = stateslist.departmentname //所属部门
          item.deptId = stateslist.departmentid //所属部门id
          item.email = stateslist.email //邮箱
          item.fullName = stateslist.lastname //姓名
          item.tel = stateslist.mobile //电话
          getJobTitleById(stateslist.jobtitle).then((res) => {
            item.jobTitleId = res._jobtitleid
            item.jobTitle = res._fullname
          })
        }
      })
    },
    // 获取名字信息
    async init() {
      getAllEcologyUsers().then((res) => {
        this.states = res.map((item) => {
          return { value: item.lastname, label: item.lastname, userlist: item }
        })
        this.$loading().close()
      })
      getAllCompanyInfo().then((res) => {
        let data = deepClone(res)
        data.forEach((ele) => {
          ele['_departmentid'] = ele._subcompanyid
        })
        this.departments = data
      })
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
    },
    //  客户介绍附件
    onIntroduceUploadFile(res, file) {
      let IntroduceUploadFild = {
        //	用于赋值 新增客户合作信息附件
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        size: res.size,
      }
      if (!this.baseinfo.introduceAtta) {
        this.baseinfo.introduceAtta = []
      }
      this.baseinfo.introduceAtta.push(IntroduceUploadFild)
      console.info(this.baseinfo.introduceAtta)
    },
    // 客户介绍附件文件删除
    onIntroduceAttaHand(item) {
      let arr = this.baseinfo.introduceAtta ? this.baseinfo.introduceAtta : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          this.baseinfo.introduceAtta.splice(index, 1)
        }
      })
    },
    //  运营执照
    onBusinessLicenseUploadFile(res, file) {
      let uploadFile = {
        //	用于赋值 新增客户合作信息附件
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        size: res.size,
      }
      if (!this.baseinfo.businessLicenseAtta) {
        this.baseinfo.businessLicenseAtta = []
      }
      this.baseinfo.businessLicenseAtta.push(uploadFile)
    },
    // 运营执照文件删除
    onBusinessLicenseAttaHand(item) {
      let arr = this.baseinfo.businessLicenseAtta
        ? this.baseinfo.businessLicenseAtta
        : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          this.baseinfo.businessLicenseAtta.splice(index, 1)
        }
      })
    },
    onSuccessUploadFild(res, file) {
      let copyCusAttachmentSaveVos = {
        //
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        size: res.size,
      }
      this.baseinfo.coopInfoSaveAndUpdateVos[0].hasOwnProperty(
        'cusAttachmentSaveVos'
      )
        ? this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos.push(
            copyCusAttachmentSaveVos
          )
        : null
    },
    onMessagesUploadFild(res, file) {
      let copyCusAttachmentSaveVos = {
        //
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        size: res.size,
      }
      this.baseinfo.coopInfoSaveAndUpdateVos[0].hasOwnProperty(
        'cusAttachmentSaveVos'
      )
        ? this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos.push(
            copyCusAttachmentSaveVos
          )
        : null
    },
    // id获取客户信息，客户店铺，
    async getBaseInfoByIds() {
      //先获取临时表里的数据
      let res = await getBaseInfoById(this.userId)
      let resTemp = await getBaseInfoTempById(this.userId)
      if (resTemp.id) {
        //判断是否是临时表数据
        this.baseinfo = resTemp
        this.baseinfo.isTempData = true
        this.baseinfoOther = res
      } else {
        this.baseinfo = res
        this.baseinfo.introduceAtta = res.introduceAttas || []
        this.baseinfo.businessLicenseAtta = res.businessLicenseAttas || []
        this.baseinfo.isTempData = false
      }
      // 为什么有两个 因为后端返回的字段不叫这个名字手动赋值
      // console.log("date",this.baseinfo)
      if (this.baseinfo.isTempData) {
        //客户简称
        this.baseinfo.simpleName = res.simpleName
        //客户渠道大类channelCategorys
        this.baseinfo.channelCategorys = res.channelCategorys
        //结算方式
        this.baseinfo.closeMethod = res.closeMethod
        //所属行业
        this.baseinfo.industry = res.industry
        // 客户基本分类
        this.baseinfo.ncCategoryName = res.ncCategoryName
        this.baseinfo.ncCategoryCode = res.ncCategoryCode
        // 对应财务组织
        this.baseinfo.financialOrg = res.financialOrg
        //客户企业文化
        this.baseinfo.companyCulture = res.companyCulture
        //客户简介
        this.baseinfo.intro = res.intro
        //备注
        this.baseinfo.remark = res.remark
        // 客户介绍资料
        this.baseinfo.introduceAtta = res.introduceAttas
        // 营业执照
        this.baseinfo.businessLicenseAtta = res.businessLicenseAttas
        // 客户类型
        this.baseinfo.type = res.type
        this.baseinfo.enterpriseType = res.enterpriseType
        this.baseinfo.customerType = res.customerType
        // 客户LOGO
        this.baseinfo.logo = res.logo
        this.baseinfo.name = resTemp.name
        this.baseinfo.financeInfoSaveAndUpdateVos =
          resTemp.financeInfos.length != 0
            ? resTemp.financeInfos
            : this.financeInfoSaveAndUpdateVos
        this.baseinfo.contactsInfoSaveAndUpdateVos =
          resTemp.contactsInfoslength != 0
            ? resTemp.contactsInfos
            : this.contactsInfoSaveAndUpdateVos
        this.baseinfo.coopInfoSaveAndUpdateVos =
          resTemp.coopInfos != 0
            ? resTemp.coopInfos
            : this.coopInfoSaveAndUpdateVos
        this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos =
          resTemp.coopInfos.length != 0
            ? resTemp.coopInfos[0].cusAttachments
            : []
        this.baseinfoOther.financeInfoSaveAndUpdateVos =
          res.financeInfos.length != 0
            ? res.financeInfos
            : this.financeInfoSaveAndUpdateVos
        this.baseinfoOther.contactsInfoSaveAndUpdateVos =
          res.contactsInfoslength != 0
            ? res.contactsInfos
            : this.contactsInfoSaveAndUpdateVos
        this.baseinfoOther.coopInfoSaveAndUpdateVos =
          res.coopInfos != 0 ? res.coopInfos : this.coopInfoSaveAndUpdateVos
        this.baseinfoOther.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos =
          res.coopInfos.length != 0 ? res.coopInfos[0].cusAttachments : []
      } else {
        this.baseinfo.financeInfoSaveAndUpdateVos =
          res.financeInfos.length != 0
            ? res.financeInfos
            : this.financeInfoSaveAndUpdateVos
        this.baseinfo.contactsInfoSaveAndUpdateVos =
          res.contactsInfoslength != 0
            ? res.contactsInfos
            : this.contactsInfoSaveAndUpdateVos
        this.baseinfo.coopInfoSaveAndUpdateVos =
          res.coopInfos != 0 ? res.coopInfos : this.coopInfoSaveAndUpdateVos
        this.baseinfo.coopInfoSaveAndUpdateVos[0].cusAttachmentSaveVos =
          res.coopInfos.length != 0 ? res.coopInfos[0].cusAttachments : []
      }
      this.baseinfo.coopInfoSaveAndUpdateVos.forEach((item) => {
        item.deptIds = []
        item.deptIds.push(item.companyId + '')
        item.deptIds.push(item.deptId + '')
      })
      this.coopInfoSaveAndUpdateVos = this.baseinfo.coopInfoSaveAndUpdateVos
      // 获取合作信息手机
      getEcologyUserByMobile(this.$store.getters.userInfo.mobile).then(
        (mobile) => {
          this.baseinfo.coopInfoSaveAndUpdateVos[0].deptId = mobile.departmentid
          this.baseinfo.coopInfoSaveAndUpdateVos[0].deptName =
            mobile.departmentname
        }
      )
      this.baseinfo.innerPersonInfoSaveAndUpdateVos = res.innerPersonInfos
      /* 返台返回的数据 contactsInfos可能是空数据，页面渲染又要用到第一个节点，所以赋一个空对象用于渲染 */
      if (
        !this.baseinfo.contactsInfoSaveAndUpdateVos ||
        this.baseinfo.contactsInfoSaveAndUpdateVos.length <= 0
      ) {
        this.baseinfo.contactsInfoSaveAndUpdateVos = [{}]
      }

      console.info(this.baseinfo)
    },
    // 添加店铺信息
    addCooInfo() {
      if (this.isEditCoo) {
        this.coopInfoList[0]['baseInfoId'] = this.userId
        this.coopInfoList[0]['supplyType'] = this.coopInfoList[0]['supplyTypes']
        this.coopInfoList[0]['serviceType'] = this.coopInfoList[0][
          'serviceTypes'
        ]
        this.coopInfoList[0]['companyId'] = this.coopInfoList[0]['deptIds'][0]
        this.coopInfoList[0]['deptId'] = this.coopInfoList[0]['deptIds'][1]
        // console.log("添加的合作信息",this.coopInfoList[0])
        updateCoopInfoById(this.coopInfoList[0]).then((res) => {
          this.$message({ message: '修改合作信息成功', type: 'success' })
          getCoopInfoListByBaseInfoId(this.userId).then((res) => {
            this.coopInfoSaveAndUpdateVos = res
            this.coopInfoSaveAndUpdateVos.forEach((item) => {
              item.deptIds = []
              item.deptIds.push(item.companyId + '')
              item.deptIds.push(item.deptId + '')
            })
            this.coopInfoList = [
              {
                baseInfoId: '',
                supplyType: '',
                serviceType: '',
                companyId: '',
                deptId: '',
              },
            ]
          })
          this.coopInfoFlag = !this.coopInfoFlag
        })
        return
      }
      this.coopInfoList[0]['baseInfoId'] = this.userId
      this.coopInfoList[0]['supplyType'] = this.coopInfoList[0]['supplyTypes']
      this.coopInfoList[0]['serviceType'] = this.coopInfoList[0]['serviceTypes']
      this.coopInfoList[0]['companyId'] = this.coopInfoList[0]['deptIds'][0]
      this.coopInfoList[0]['deptId'] = this.coopInfoList[0]['deptIds'][1]
      // console.log("添加的合作信息",this.coopInfoList[0])
      addCoopInfo(this.coopInfoList[0])
        .then((res) => {
          this.$message({ message: '添加合作信息成功', type: 'success' })
          // 添加成功后刷新数据
          getCoopInfoListByBaseInfoId(this.userId).then((res) => {
            this.coopInfoSaveAndUpdateVos = res
            this.coopInfoSaveAndUpdateVos.forEach((item) => {
              item.deptIds = []
              item.deptIds.push(item.companyId + '')
              item.deptIds.push(item.deptId + '')
            })
            this.coopInfoList = [
              {
                baseInfoId: '',
                supplyType: '',
                serviceType: '',
                companyId: '',
                deptId: '',
              },
            ]
          })
        })
        .catch((error) => {
          console.error(error)
        })
      this.coopInfoFlag = !this.coopInfoFlag
    },
    // 关闭添加店铺弹窗时
    shopInfoClose(done) {
      done()
    },
    // 客户店铺
    setAreaTwo(e) {
      this.shopInfoSaveAndUpdateVos[this.ShopInfoIndex].province = e[0]
        ? e[0]
        : '' // 省
      this.shopInfoSaveAndUpdateVos[this.ShopInfoIndex].city = e[1] ? e[1] : '' // 市
      this.shopInfoSaveAndUpdateVos[this.ShopInfoIndex].area = e[2] ? e[2] : '' // 区
    },
    // 获取点击客户店铺时候的索引
    setAreaTwoId(index) {
      this.ShopInfoIndex = index
    },
    // 基本信息地图 获取选中的地址
    setArea(e) {
      this.baseinfo.area = e.join('/')
    },
    // 基本信息地图 获取选中的部门
    setDepartments(e) {
      this.baseinfo.coopInfoSaveAndUpdateVos.departments.push(e)
    },
    // 添加商品窗口，获取选中添加地址
    setShopArea(e) {
      this.shopInfoList[0].province = e[0] ? e[0] : '' // 省
      this.shopInfoList[0].city = e[1] ? e[1] : '' // 市
      this.shopInfoList[0].area = e[2] ? e[2] : '' // 区
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
    coopInfoSaveAndUpdateVosRules() {
      //合作信息规则
      for (let i = 0; i < this.baseinfo.coopInfoSaveAndUpdateVos.length; i++) {
        if (
          this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptIds'] &&
          this.baseinfo.coopInfoSaveAndUpdateVos[i].deptIds.length > 0
        ) {
          if (
            this.baseinfo.coopInfoSaveAndUpdateVos[i].serviceTypes &&
            this.baseinfo.coopInfoSaveAndUpdateVos[i].serviceTypes.length > 0
          ) {
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'companyId'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptIds'][0]
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'deptId'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['deptIds'][1]
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'supplyType'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['supplyTypes']
            this.baseinfo.coopInfoSaveAndUpdateVos[i][
              'serviceType'
            ] = this.baseinfo.coopInfoSaveAndUpdateVos[i]['serviceTypes']
          }
        }
      }
    },
    coopInfoSaveAndUpdateVosRulesList() {
      //合作信息规则
      for (let i = 0; i < this.coopInfoSaveAndUpdateVos.length; i++) {
        if (
          this.coopInfoSaveAndUpdateVos[i]['deptIds'] &&
          this.coopInfoSaveAndUpdateVos[i].deptIds.length > 0 &&
          this.coopInfoSaveAndUpdateVos[i]['deptIds'][0] != 'null' &&
          this.coopInfoSaveAndUpdateVos[i]['deptIds'][1] != 'null'
        ) {
          if (!this.coopInfoSaveAndUpdateVos[i].businessId) {
            this.$message({ message: '业务板块不能为空', type: 'warning' })
            return false
          }
          if (
            this.coopInfoSaveAndUpdateVos[i].serviceTypes &&
            this.coopInfoSaveAndUpdateVos[i].serviceTypes.length > 0
          ) {
            this.coopInfoSaveAndUpdateVos[i][
              'companyId'
            ] = this.coopInfoSaveAndUpdateVos[i]['deptIds'][0]
            this.coopInfoSaveAndUpdateVos[i][
              'deptId'
            ] = this.coopInfoSaveAndUpdateVos[i]['deptIds'][1]
            this.coopInfoSaveAndUpdateVos[i][
              'supplyType'
            ] = this.coopInfoSaveAndUpdateVos[i]['supplyTypes']
            this.coopInfoSaveAndUpdateVos[i][
              'serviceType'
            ] = this.coopInfoSaveAndUpdateVos[i]['serviceTypes']
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
    // 修改用户信息
    updateBase() {
      this.$refs[`form1`].validate((valid) => {
        if (valid) {
          this.$refs[`form2`].validate((valid_) => {
            if (valid_) {
              if (this.baseinfo.email) {
                if (!checkEmail(this.baseinfo.email)) {
                  this.$message.error({ message: '邮箱格式不正确' })
                  return
                }
              }
              !this.baseinfo.contactsInfoSaveAndUpdateVos[0].birthday
                ? (this.baseinfo.contactsInfoSaveAndUpdateVos[0].birthday = 0)
                : ''
              this.baseinfo.coopInfoSaveAndUpdateVos = this.coopInfoSaveAndUpdateVos
              this.baseinfo.channelCategory = this.baseinfo.channelCategorys
              if (this.coopInfoSaveAndUpdateVosRules() != false) {
                this.$confirm(
                  `信息变更如涉及名称,地址,法人,客户渠道类型,客户等级,账期天数,结算方式,财务信息,邮箱，需要提交OA审批后生效，确认更新吗?`
                ).then(() => {
                  this.$loading({ fullscreen: true })
                  updateBaseInfo(this.baseinfo)
                    .then((res) => {
                      this.$message({
                        message: '修改成功',
                        type: 'success',
                      })
                      this.$eventHub.$emit(
                        this.$eventName.CUSTOMER_LIST_REFLUSH
                      )
                      this.$loading().close()
                      this.$router.go(-1)
                    })
                    .catch(() => {
                      this.$loading().close()
                    })
                })
              } else {
                this.$loading().close()
              }
            } else {
              this.$message({
                message: '保存失败，请填写必填内容',
                type: 'warning',
              })
              return false
            }
          })
        } else {
          this.$loading().close()
          this.$message({
            message: '保存失败，请填写必填内容',
            type: 'warning',
          })
          return false
        }
      })
    },
    // 修改合作信息
    editShopInfo(item) {
      // console.log(item)
      item.row['id'] += ''
      item.row['baseInfoId'] += ''
      let copy = deepClone(item.row)
      this.coopInfoList = [copy]
      this.coopInfoFlag = !this.coopInfoFlag
      this.isEditCoo = true // 弹窗时修改的状态
    },
    // 删除客户店铺
    delShopInfo(item) {
      this.$confirm(`确认删除吗？`)
        .then((_) => {
          this.$loading({ fullscreen: true })
          deleteCoopInfoById(item.id).then((res) => {
            getCoopInfoListByBaseInfoId(this.userId).then((res) => {
              this.coopInfoSaveAndUpdateVos = res
              this.coopInfoSaveAndUpdateVos.forEach((item) => {
                item.deptIds = []
                item.deptIds.push(item.companyId + '')
                item.deptIds.push(item.deptId + '')
              })
            })
            this.$loading().close()
            this.$message({ message: '删除成功', type: 'success' })
          })
        })
        .catch((_) => {})
    },
    //判断2个数组是否相等
    isQeual() {
      let arr1 = this.baseinfo.channelCategorys
      let arr2 = this.baseinfoOther.channelCategorys
      // console.log("arr1",arr1)
      // console.log("arr2",arr2)
      if (!arr1 || !arr2) {
        return false
      }
      if (arr1.length != arr2.length) {
        return false
      }
      for (var i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
          return false
        }
      }
      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) == -1) {
          return false
        }
      }
      return true
    },
    onClickHand(item) {
      console.info('附件被点击了', item)
      const link = document.createElement('a')
      link.setAttribute('download', item.fileName) //下载的文件名
      link.setAttribute('target', '_blank')
      link.href = item.attaUrl //文件url
      link.click()
    },
  },
}
</script>

<style lang='scss' scoped>
.max-width {
  max-width: 80%;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
/deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #888;
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
.mHis {
  input.el-input__inner {
    color: #ff1818 !important;
  }
}
.custormerClasssify {
  /deep/ .el-select__tags-text {
    color: red !important;
  }
}
.tip {
  color: rgba($color: #000000, $alpha: 0.35);
}
</style>

