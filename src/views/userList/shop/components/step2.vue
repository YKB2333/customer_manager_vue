<template>
  <div>
    <el-form
      :model="shopInfo"
      ref="ruleForm"
      label-width="200px"
      :disabled="disabled"
      :rules="rules"
      class="newform2 top"
    >
      <el-form-item prop="operateType" label="运营类型:" width="90px">
        <el-select v-model="shopInfo.operateType">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item, index) in operateType"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营团队:" prop="operateTeam">
        <el-input maxlength="20" v-model="shopInfo.operateTeam" placeholder="请输入运营团队"></el-input>
      </el-form-item>
      <el-form-item :required="shopInfo.type==='1'" label="打卡范围(米):" prop="clockInDistance">
        <el-select v-model="shopInfo.clockInDistance">
          <el-option v-for="item in 10" :key="item" :value="item * 100 " :label="item * 100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="官网是否展示:" prop="isShowOs">
        <template>
          <el-radio v-model="shopInfo.isShowOs" :label="true">是</el-radio>
          <el-radio v-model="shopInfo.isShowOs" :label="false">否</el-radio>
        </template>
      </el-form-item>

      <el-form-item label="行业类目:" prop="industryCategory">
        <el-select
          v-model="industryCategory"
          filterable
          multiple
          allow-create
          default-first-option
          placeholder="可输入后回车自定义行业类目"
        >
          <el-option v-for="item in industryCategoryList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :rules="[{required: shopInfo.type == '2', message:'请选择销售组织', trigger: 'change'}]"
        label="销售组织:"
        prop="salesOrg"
      >
        <el-cascader :props="defaultParams" :options="departments" v-model="shopInfo.salesOrg"></el-cascader>
      </el-form-item>
      <el-form-item label="签约主体:" prop="contractCompanyId">
        <el-select v-model="shopInfo.contractCompanyId" placeholder="请选择">
          <el-option
            v-for="item in departments"
            :key="item._departmentid"
            :label="item._fullname"
            :value="item._departmentid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序:" prop="sortNum">
        <el-input type="number" v-model="shopInfo.sortNum" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="区域:" prop="district">
        <el-input maxlength="20" v-model="shopInfo.district" placeholder="请输入区域"></el-input>
      </el-form-item>
      <el-form-item label="概况:" prop="generalSituatuion">
        <el-input maxlength="20" v-model="shopInfo.generalSituatuion" placeholder="请输入概况"></el-input>
      </el-form-item>
      <el-form-item label="附件:">
        <shopUpload
          class="h32"
          ref="upload"
          :type="false"
          @onSuccessUpload="shopAttaUploadFild"
          :isUrl="shopInfo.shopAttas"
          @handleClose="shopAttaHand"
        ></shopUpload>
      </el-form-item>
      <el-form-item label="业绩归属:" :required="shopInfo.type === '2'" prop="hasAscription">
        <el-switch v-model="shopInfo.hasAscription"></el-switch>
      </el-form-item>
      <div v-show="shopInfo.hasAscription" class="mlr40 mb20">
        <achievement
          v-model="shopInfo.shopBizBelongInfos"
          :customer-id="shopInfo.baseInfoId"
          :shop-id="shopInfo.id"
          :departments="departments"
        ></achievement>
      </div>
      <el-form-item prop="teamLeader" label="负责人:" v-if="!shopInfo.hasAscription">
        <el-select
          v-model="shopInfo.teamLeader"
          filterable
          remote
          reserve-keyword
          placeholder="请输入负责人"
          :remote-method="remoteMethod"
          :loading="teamLeaderLoading"
          @change="getTeamLeaders"
        >
          <el-option
            v-for="item in teamLeaderOptions"
            :key="item.userlist.workcode"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { operateType } from '@/const/goods'
import {
  getAllEcologyUsers,
  getJobTitleById,
  getAllCompanyInfo,
} from '@/api/client'
import shopUpload from '@/components/shopUpload'
import Achievement from './achievement.vue'

export default {
  name: 'step2',
  components: { shopUpload, Achievement },
  props: {
    value: {
      type: Object,
      default: () => ({
        operateType: '',
        operateTeam: '',
        teamLeader: '',
        industryCategory: [],
        type: '',
        deptIds: '',
        shopAttas: [],
        clockInDistance: 500,
        isShowOs: false,
        sortNum: '',
        district: '',
        generalSituatuion: '',
        hasAscription: false,
        saleCompanyId: null,
        saleDepartmentId: null,
        contractCompanyId: null,
        shopBizBelongInfos: [],
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const clockInDistancePass = (rule, value, callback) => {
      if (this.shopInfo.type === '1' && !value) {
        callback(new Error('打卡范围为必填项'))
      }
      callback()
    }
    return {
      shopInfo: {
        operateType: '',
        operateTeam: '',
        teamLeader: '',
        industryCategory: [],
        type: '',
        deptIds: '',
        shopAttas: [],
        clockInDistance: 500,
        isShowOs: false,
        sortNum: '',
        district: '',
        generalSituatuion: '',
        hasAscription: false,
        saleCompanyId: null,
        saleDepartmentId: null,
        contractCompanyId: null,
        shopBizBelongInfos: [],
      },
      rules: {
        clockInDistance: [
          { validator: clockInDistancePass, trigger: 'change' },
        ],
        industryCategory: [
          {
            required: true,
            message: '行业类目为必填项',
            trigger: ['blur', 'change'],
          },
        ],
      },
      operateType,
      teamLeaderLoading: false,
      teamLeaderOptions: [],
      states: [],
      industryCategoryList: [
        '美妆',
        '个人护理',
        '日用百货',
        '食品',
        '3C',
        '健康医疗',
        '宠物',
        '母婴',
      ],
      defaultParams: {
        // 销售组织
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
      },
      departments: [],
    }
  },
  computed: {
    industryCategory: {
      get() {
        if (typeof this.shopInfo.industryCategory === 'string') {
          if (!this.shopInfo.industryCategory) {
            return ''
          }
          return this.shopInfo.industryCategory.split('|')
        }
        return ''
      },
      set(val) {
        if (Array.isArray(val)) {
          this.shopInfo.industryCategory = val.join('|')
        } else {
          this.shopInfo.industryCategory = ''
        }
      },
    },
  },
  watch: {
    value: {
      deep: true,
      handler: function (val) {
        this.shopInfo = val
      },
      immediate: true,
    },

    shopInfo: {
      deep: true,
      handler: function (val) {
        this.$emit('input', val)
      },
    },
    // shopInfo
    'shopInfo.salesOrg': {
      handler: function (val) {
        if (Array.isArray(val) && val.length === 2) {
          this.shopInfo.saleCompanyId = val[0]
          this.shopInfo.saleDepartmentId = val[1]
        } else {
          this.shopInfo.saleCompanyId = null
          this.shopInfo.saleDepartmentId = null
        }
      },
    },
    'shopInfo.hasAscription': {
      handler: function (val) {
        if (val) {
          this.shopInfo.teamLeader = ''
        } else {
          this.shopInfo.shopBizBelongInfos = []
        }
      },
    },
  },
  created() {
    this.initTeamLeaders()
    this.getDepartments()
  },
  methods: {
    // #region 负责人选择相关
    // 通过值筛选负责人
    remoteMethod(query) {
      if (query !== '') {
        this.teamLeaderLoading = true
        setTimeout(() => {
          this.teamLeaderLoading = false
          this.teamLeaderOptions = this.states.filter(
            (item) => item.label.indexOf(query) > -1
          )
        }, 200)
      } else {
        this.teamLeaderOptions = []
      }
    },
    // 选中时获取负责人信息 并赋值
    getTeamLeaders(user) {
      console.log(user)
      this.shopInfo.teamLeader = user
      // let stateslist = null
      // this.states.forEach((item) => {
      //   if (item.label == user) {
      //     stateslist = item.userlist
      //   }
      // })
      // this.teamLeaderList.forEach((item) => {
      //   if (item.fullName == user) {
      //     item.deptName = stateslist.departmentname //所属部门
      //     item.deptId = stateslist.departmentid //所属部门id
      //     item.email = stateslist.email //邮箱
      //     item.fullName = stateslist.lastname //姓名
      //     item.tel = stateslist.mobile //电话
      //     getJobTitleById(stateslist.jobtitle).then((res) => {
      //       item.jobTitleId = res._jobtitleid
      //       item.jobTitle = res._fullname
      //     })
      //   }
      // })
    },
    // 获取所有可选负责人
    initTeamLeaders() {
      getAllEcologyUsers().then((res) => {
        this.states = res
          .filter((item, index) => {
            return !res.some(
              (v, i) =>
                i !== index &&
                v.lastname === item.lastname &&
                v.workcode === item.workcode
            )
          })
          .map((item) => {
            return {
              value: item.lastname,
              label: item.lastname,
              userlist: item,
            }
          })
      })
    },
    // #endregion 负责人选择相关

    getDepartments() {
      getAllCompanyInfo().then((res) => {
        res.forEach((ele) => {
          ele['_departmentid'] = ele._subcompanyid
        })
        this.departments = res
      })
    },

    // #region 附件相关
    //  店铺附件
    shopAttaUploadFild(res, file) {
      let attaUploadFild = {
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        // id:null,//客户附件自增id,新增时不必传值,当id不为空时,忽略保存
        size: res.size,
      }
      this.shopInfo.shopAttas = Array.isArray(this.shopInfo.shopAttas)
        ? [...this.shopInfo.shopAttas, attaUploadFild]
        : [attaUploadFild]
      // this.shopInfo.hasOwnProperty('shopAttas')
      //   ? this.shopInfo.shopAttas.push(attaUploadFild)
      //   : null
    },
    // 客户介绍附件文件删除
    shopAttaHand(item) {
      let arr = this.shopInfo.shopAttas ? this.shopInfo.shopAttas : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          // stateslist =item.userlist;
          this.shopInfo.shopAttas.splice(index, 1)
        }
      })
    },
    // #endregion附件相关

    validaForm() {
      console.log('step2 validaForm')
      if (!this.$refs['ruleForm']) {
        console.error('前端报错了')
        return Promise.reject(false)
      }
      return this.$refs['ruleForm'].validate()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-card__header {
  padding: 0;
}
.label {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.85);
}
</style>