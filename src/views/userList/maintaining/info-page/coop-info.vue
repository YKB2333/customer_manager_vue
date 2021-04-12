<template>
  <div>
    <!-- <el-table :data="coopInfoSaveAndUpdateVos">
      <div slot="append" v-if="!isLook">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onAdd"
          size="small"
          style="width: 100%"
          >请点击添加客户合作信息</el-button
        >
      </div>
      <el-table-column label="序号" width="60" type="index">
      </el-table-column>
      <el-table-column class-name="must" label="业务板块">
        <template slot-scope="scope">
          <el-select v-model="scope.row.businessId" disabled>
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column class-name="must" label="所属部门">
        <template slot-scope="scope">
          <el-cascader
            v-model="scope.row.deptIds"
            :props="defaultParams"
            :options="departments"
            disabled>
          </el-cascader>
        </template>
      </el-table-column>
      <el-table-column class-name="must" label="商品服务类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.serviceTypes" multiple disabled>
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
          <el-select v-model="scope.row.coopModel" disabled>
            <el-option label="自营" value="自营"></el-option>
            <el-option label="分销" value="分销"></el-option>
            <el-option label="直供" value="直供"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="供货类型">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.supplyTypes" multiple disabled>
            <el-option label="一件代发" value="一件代发"></el-option>
            <el-option label="寄售" value="寄售"></el-option>
            <el-option label="购销" value="购销"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="settleMethod" label="结算方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.settleMethod" placeholder="请选择" disabled>
            <el-option
              v-for="(item,index) in closeMethodList"
              :key="item.value"
              :label="item.label"
              :value="index">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" v-if="!isLook">
        <template slot-scope="scope">
          <el-button type="text" @click="editCoopInfo(scope.row)" v-if="scope.row.id">修改</el-button>
          <el-button type="text" @click="delCoopInfo(scope.row)" v-if="scope.row.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <p>
      <el-button type="primary" @click="addCoop" v-if="!isLook">添加合作信息</el-button>
    </p>
    <div v-for="(item, index) in coopInfoSaveAndUpdateVos" :key="item.id">
      <coop-card
        class="mt20"
        :ref="'coop' + index"
        :disabled="isLook"
        :isLock="item.isLock"
        :title="'合作信息-' + (index + 1)"
        v-model="coopInfoSaveAndUpdateVos[index]"
        :states="states"
        :companyList="companyList"
        :allDepartmentLsit="allDepartmentLsit"
        :businessList="businessList"
        :closeMethodList="closeMethodList"
        :baseInfoId="userId"
        @onDelete="delCoopInfo"
        @onDeleteIslock="delIslockCoopInfo"
        @after-save="init"
      ></coop-card>
    </div>
    <el-button size="medium" class="mt20" @click="$router.go(-1)">返回列表</el-button>
  </div>
</template>

<script>
import {
  getAllCompanyInfo,
  deleteCoopInfoById,
  updateCoopInfoById,
  addCoopInfo,
  getCoopInfoListByBaseInfoId,
  getNcCloseMethod,
  getAllEcologyUsers,
  getInnerPersonInfoListByBId,
  getOAThreeSub,
} from '@/api/client'
import coopCard from '../component/coop-card.vue'
import { deepClone } from '@/utils'
export default {
  components: { coopCard },
  props: {
    businessList: Array, //业务板块
    userId: String,
    isLook: Boolean,
  },
  data() {
    return {
      states: [],
      companyList: [],
      allDepartmentLsit: [],
      closeMethodList: [],
      //合作信息
      coopInfoSaveAndUpdateVos: [],
      innerPersonInfoSaveAndUpdateVos: [],
      coopFlag: false,
      isEditCoo: false,
      coopInfoList: [
        {
          baseInfoId: '',
          businessId: '',
          deptId: '', // 通过泛微获取部门id
          deptIds: [], // 通过泛微获取部门id
          companyId: '', // 通过泛微获取公司id
          deptName: '', //所属部门
          coopModel: '', //客户合作模式：自营/分销/直供
          serviceTypes: [], //商品服务类型：NB/PB/JVB/ODM/OEM
          supplyTypes: [], //供货类型：一件代发、寄售，购销
          innerPersonInfos: [],
        },
      ],
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
      },
      departments: [], //所属公司
    }
  },
  created() {
    this.init()
    this.getData()
    // getAllCompanyInfo().then((res) => {
    //   let data = _.cloneDeep(res)
    //   data.forEach((ele) => {
    //     ele['_departmentid'] = ele._subcompanyid
    //   })
    //   this.departments = data
    // })
  },
  methods: {
    init() {
      getCoopInfoListByBaseInfoId(this.userId).then((coops) => {
        console.log(coops)
        coops.forEach((item) => {
          item.isLock = !item.id
          item.companyId += ''
          item.deptId += ''
          item.deptIds = []
          item.deptIds.push(item.companyId + '')
          item.deptIds.push(item.deptId + '')
        })
        this.coopInfoSaveAndUpdateVos = coops
      })
    },
    getData() {
      getAllEcologyUsers().then((res) => {
        this.states = res.map((item) => {
          return { value: item.lastname, label: item.lastname, userlist: item }
        })
      })
      getOAThreeSub().then((res) => {
        let data = deepClone(res || [])
        data.forEach((v) =>
          this.allDepartmentLsit.push(...v.departmentBeanList)
        )
        this.departments = deepClone(this.allDepartmentLsit)
        this.companyList = data.map((v) => {
          return {
            label: v._fullname,
            value: v._subcompanyid,
          }
        })
      })
      this.getCloseMethod()
    },
    addCoop() {
      const item = {
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
        baseInfoId: this.userId,
      }
      // coopInfoSaveAndUpdateVos:Array
      this.coopInfoSaveAndUpdateVos = [...this.coopInfoSaveAndUpdateVos, item]
    },
    onAdd() {
      this.coopInfoList = [
        {
          baseInfoId: '',
          supplyType: '',
          serviceType: '',
          companyId: '',
          deptId: '',
        },
      ]
      this.isEditCoo = false
      this.coopFlag = true
      this.coopInfoList[0]['deptId'] = ''
      this.coopInfoList[0]['deptName'] = ''
      this.coopInfoList[0]['email'] = ''
      this.coopInfoList[0]['tel'] = ''
      this.coopInfoList[0]['jobTitleId'] = ''
      this.coopInfoList[0]['jobTitle'] = ''
    },
    delCoopInfo(item) {
      console.log(item)
      this.$confirm(`确认删除吗？`).then((_) => {
        this.$loading({ fullscreen: true })

        if (item.id) {
          deleteCoopInfoById(item.id).then((res) => {
            this.$loading().close()
            this.$message({ message: '删除成功', type: 'success' })
            this.init()
          })
        } else {
          this.coopInfoSaveAndUpdateVos = this.coopInfoSaveAndUpdateVos.filter(
            (v) => v !== item
          )
          // const index = this.coopInfoSaveAndUpdateVos.indexOf(item)
          // this.coopInfoSaveAndUpdateVos.splice(index, 1)
        }
      })
    },
    delIslockCoopInfo(item) {
      console.log('delIslockCoopInfo')
      console.log(item)
      this.$loading({ fullscreen: true })
      if (item.id) {
        deleteCoopInfoById(item.id)
          .then((res) => {
            this.$loading().close()
            this.$message({ message: '删除成功', type: 'success' })
            this.init()
          })
          .catch((e) => {
            this.$loading().close()
          })
      } else {
        this.coopInfoSaveAndUpdateVos = this.coopInfoSaveAndUpdateVos.filter(
          (v) => v !== item
        )
        // console.log(item)
        // const index = this.coopInfoSaveAndUpdateVos.indexOf(item)
        // console.log(index)
        // this.coopInfoSaveAndUpdateVos.splice(index, 1)
        this.$loading().close()
      }
    },
    // 修改合作信息
    editCoopInfo(item) {
      // console.log("合作信息" + item)
      item['id'] += ''
      item['baseInfoId'] += ''
      let copy = _.cloneDeep(item)
      this.coopInfoList = [copy]
      this.coopFlag = !this.coopFlag
      this.isEditCoo = true
    },

    // 添加合作信息
    onSubmit() {
      if (this.isEditCoo) {
        this.coopInfoList[0]['baseInfoId'] = this.userId
        this.coopInfoList[0]['supplyType'] = this.coopInfoList[0]['supplyTypes']
        this.coopInfoList[0]['serviceType'] = this.coopInfoList[0][
          'serviceTypes'
        ]
        this.coopInfoList[0]['companyId'] = this.coopInfoList[0]['deptIds'][0]
        this.coopInfoList[0]['deptId'] = this.coopInfoList[0]['deptIds'][1]
        updateCoopInfoById(this.coopInfoList[0]).then((res) => {
          this.$message({ message: '修改合作信息成功', type: 'success' })
          this.init()
          this.coopFlag = !this.coopFlag
        })
        return
      }
      this.coopInfoList[0]['baseInfoId'] = this.userId
      this.coopInfoList[0]['supplyType'] = this.coopInfoList[0]['supplyTypes']
      this.coopInfoList[0]['serviceType'] = this.coopInfoList[0]['serviceTypes']
      this.coopInfoList[0]['companyId'] = this.coopInfoList[0]['deptIds'][0]
      this.coopInfoList[0]['deptId'] = this.coopInfoList[0]['deptIds'][1]
      addCoopInfo(this.coopInfoList[0]).then((res) => {
        this.$message({ message: '添加合作信息成功', type: 'success' })
        this.init()
        this.coopFlag = !this.coopFlag
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
    // #region

    // #endregion
  },
}
</script>
<style lang="scss" scoped>
</style>