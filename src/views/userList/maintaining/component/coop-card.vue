<template>
  <div>
    <el-form
      ref="f"
      :disabled="disabled || isLock"
      :model="model"
      :rules="rules"
      label-width="200px"
    >
      <el-card>
        <div slot="header">
          <h4 style="display: inline">
            {{title}}
            <el-tooltip v-if="isLock" effect="dark" content="该数据为非法历史数据" placement="top">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </h4>
          <span style="float: right">
            <el-button v-if="baseInfoId && !isLock" @click="saveCoop">保存</el-button>
            <el-button v-if="!isLock" @click="delCoop">删除</el-button>
          </span>
        </div>
        <div>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="业务板块" prop="businessId">
                <el-select v-model="model.businessId">
                  <el-option
                    v-for="item in businessList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属公司" prop="companyId">
                <el-select :disabled="!!model.id" v-model="model.companyId" @change="companyChange">
                  <el-option
                    v-for="item in companyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属部门" prop="deptId">
                <el-cascader
                  :disabled="!!model.id"
                  :show-all-levels="false"
                  :props="defaultParams"
                  :options="deptList"
                  v-model="model.deptId"
                  @change="deptChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="商品服务类型" prop="serviceTypes">
                <el-select v-model="model.serviceTypes" multiple>
                  <el-option label="NB" value="NB"></el-option>
                  <el-option label="PB" value="PB"></el-option>
                  <el-option label="JVB" value="JVB"></el-option>
                  <el-option label="ODM" value="ODM"></el-option>
                  <el-option label="OEM" value="OEM"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供货类型" prop="supplyTypes">
                <el-select v-model="model.supplyTypes" multiple>
                  <el-option label="一件代发" value="一件代发"></el-option>
                  <el-option label="寄售" value="寄售"></el-option>
                  <el-option label="购销" value="购销"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合作模式" prop="coopModel">
                <el-select v-model="model.coopModel">
                  <el-option label="自营" value="自营"></el-option>
                  <el-option label="分销" value="分销"></el-option>
                  <el-option label="直供" value="直供"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="结算方式" prop="settleMethod">
                <el-select v-model="model.settleMethod" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in closeMethodList"
                    :key="item.value"
                    :label="item.label"
                    :value="index + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            v-if="!isLock && (model.companyId && model.deptId)"
            type="primary"
            @click="addInnerPerson"
          >添加内部联系人</el-button>
          <el-table :data="innerTabledata">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="fullName" label="姓名"></el-table-column>
            <el-table-column prop="tel" label="电话"></el-table-column>
            <el-table-column prop="jobTitle" label="岗位"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <a v-if="isLock && !disabled" style="color: #409EFF" @click="delPersonInfo(row)">删除</a>
                <el-button v-else type="text" :disabled="disabled" @click="delPersonInfo(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="model.innerPersonInfos.length > 3"
            :page-size="innerPager.size"
            :current-page="innerPager.index"
            :total="model.innerPersonInfos.length"
            :page-sizes="[3,5,10,15]"
            @current-change="innerPageIndexChange"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="innerPageSizeChange"
          ></el-pagination>
        </div>
      </el-card>
    </el-form>

    <el-dialog title="内部联系人" :visible.sync="dialogVisible" width="500">
      <div>
        <el-form :inline="true" ref="innerForm" :model="query" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="query.tel"></el-input>
          </el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form>
        <div class="mb10">当前选中数:{{selectList.length}}</div>
        <el-tag class="mr8 mb10" v-for="item in selectList" :key="item.fullName">{{item.fullName}}</el-tag>
        <el-table ref="t" @selection-change="handleSelectionChange" :data="tableData">
          <template slot="empty">
            <div>该部门下，并无相关员工</div>
          </template>
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="fullName" label="姓名"></el-table-column>
          <el-table-column prop="tel" label="电话"></el-table-column>
          <el-table-column prop="jobTitle" label="岗位"></el-table-column>
        </el-table>
        <el-pagination
          hide-on-single-page
          :page-size="query.pageSize"
          :current-page="query.pageIndex"
          :total="query.total"
          @current-change="pageIndexChange"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInnerPerson">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import {
  getJobTitleById,
  addCoopInfo,
  updateCoopInfoById,
  updateInnerPersonInfoById,
  addInnerPersonInfoById,
  delInnerPersonInfoById,
} from '@/api/client'

export default {
  name: 'CoopCard',
  props: {
    baseInfoId: '',
    isLock: false,
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '合作信息1',
    },
    value: {
      type: Object,
      default: () => ({
        businessId: '',
        companyId: '',
        deptId: '',
        coopModel: '',
        settleMethod: [],
        supplyTypes: [],
        serviceTypes: [],
        innerPersonInfos: [],
      }),
    },
    companyList: {
      type: Array,
      default: () => [],
    },
    allDepartmentLsit: {
      type: Array,
      default: () => [],
    },
    businessList: {
      type: Array,
      default: () => [],
    },
    closeMethodList: {
      type: Array,
      default: () => [],
    },
    states: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: {
        businessId: '',
        companyId: '',
        deptId: '',
        coopModel: '',
        settleMethod: [],
        supplyTypes: [],
        serviceTypes: [],
        innerPersonInfos: [],
      },
      jobMap: {},

      rules: {
        businessId: [
          { required: true, message: '请选择业务板块', trigger: 'change' },
        ],
        companyId: [
          { required: true, message: '请选择业务主体', trigger: 'change' },
        ],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        serviceTypes: [
          { required: true, message: '请选择商品服务类型', trigger: 'change' },
        ],
      },
      deptList: [],
      defaultParams: {
        label: '_fullname',
        value: '_departmentid',
        children: 'departmentBeanList',
        emitPath: false,
        checkStrictly: true,
      },
      businessId: [],
      innerPersonLoading: false,
      innerPersonOptions: [],
      // 内部跟进人 赋值对象
      copyInnerPersonInfo: {
        orgName: '', //所属组织
        deptName: '', //所属部门
        email: '', //邮箱
        fullName: '', //姓名
        position: '', //负责内容
        tel: '', //电话
        jobTitle: '',
      },
      innerPerson: {
        orgName: '', //所属组织
        deptName: '', //所属部门
        email: '', //邮箱
        fullName: '', //姓名
        position: '', //负责内容
        tel: '', //电话
        jobTitle: '',
      },
      dialogVisible: false,
      query: {
        name: '',
        tel: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      selectList: [],
      innerTabledata: [],
      innerPager: {
        index: 1,
        size: 3,
      },
    }
  },
  computed: {
    personstates() {
      if (this.model.deptId) {
        return this.states
          .filter((v) => v.userlist.departmentid == this.model.deptId)
          .map(({ userlist }) => {
            const res = {}
            res.deptId = userlist.departmentid
            res.deptName = userlist.departmentname
            res.businessId = this.model.businessId
            res.fullName = userlist.lastname
            res.orgId = userlist.subcompanyid1
            res.orgName = userlist.subcompanyname
            res.tel = userlist.mobile
            res.workCode = userlist.workcode
            res.jobTitleId = userlist.jobtitle

            return res
          })
      } else {
        return []
      }
    },
    personEmtyText() {
      if (!this.model.deptId) {
        return '请在合作信息中选择部门'
      } else {
        return '该部门下，并无相关员工'
      }
    },
  },
  watch: {
    'model.companyId'(val) {
      if (val) {
        this.deptList = this.allDepartmentLsit.filter(
          (v) => v._subcompanyid === val
        )
      } else {
        this.deptList = deepClone(this.allDepartmentLsit)
      }
    },
    allDepartmentLsit: {
      deep: true,
      handler: function (arr) {
        if (this.model.companyId) {
          this.deptList = arr.filter(
            (v) => v._subcompanyid === this.model.companyId
          )
        } else {
          this.deptList = deepClone(arr)
        }
      },
    },
    value: {
      deep: true,
      immediate: true,
      handler: function (v) {
        if (v) {
          v.innerPersonInfos = Array.isArray(v.innerPersonInfos)
            ? v.innerPersonInfos
            : []
          this.model = v
          this.getInnerTabledata()
        }
      },
    },
    model: {
      deep: true,
      handler: function (val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    getInnerTabledata() {
      const { size, index } = this.innerPager
      this.innerTabledata = this.model.innerPersonInfos.filter((v, i) => {
        return i >= (index - 1) * size && i < index * size
      })
    },
    innerPageIndexChange(e) {
      this.innerPager.index = e
      this.getInnerTabledata()
    },
    innerPageSizeChange(e) {
      this.innerPager.index = 1
      this.innerPager.size = e
      this.getInnerTabledata()
    },
    companyChange(e) {
      this.model.deptId = ''
      this.model.deptName = ''
    },
    deptChange(e) {
      this.model.innerPersonInfos = this.model.innerPersonInfos.filter((v) => {
        if (!v.deptId) {
          return true
        }
        return v.deptId == e
      })
    },

    delPersonInfo(item) {
      console.log(item)
      const index = this.model.innerPersonInfos.indexOf(item)
      this.$confirm(`确认删除内部联系人吗？`).then(() => {
        if (item.id) {
          delInnerPersonInfoById(item.id).then((res) => {
            this.model.innerPersonInfos.splice(index, 1)
            this.afterDelInner()
            this.$message({ message: '删除成功', type: 'success' })
          })
        } else {
          this.model.innerPersonInfos.splice(index, 1)
          this.afterDelInner()
        }
      })
    },

    afterDelInner() {
      console.log('afterDelInner')
      this.getInnerTabledata()
      if (!this.isLock) {
        return
      }
      this.$emit('onDeleteIslock', this.value)
    },

    delCoop() {
      Promise.all(
        this.model.innerPersonInfos.map((v) =>
          v.id ? delInnerPersonInfoById(v.id) : Promise.resolve(true)
        )
      ).then((res) => {
        this.$emit('onDelete', this.value)
      })
    },

    validate() {
      if (!this.$refs['f']) {
        return Promise.reject('找不到该表单')
      }
      if (
        !Array.isArray(this.model.innerPersonInfos) &&
        this.model.innerPersonInfos.length < 1
      ) {
        return Promise.reject('至少要添加一条记录')
      }
      return this.$refs['f'].validate()
    },
    addInnerPerson() {
      // personstates:Array
      this.resetInnerPerson()
      this.selectList = this.personstates.filter((v) =>
        this.model.innerPersonInfos.find(
          (i) => i.workCode == v.workCode && i.fullName == v.fullName
        )
      )
      this.dialogVisible = true
    },
    saveInnerPerson() {
      const arr = this.selectList.filter(
        (v) =>
          !this.model.innerPersonInfos.find(
            (i) => i.fullName == v.fullName && i.workCode == v.workCode
          )
      )
      this.model.innerPersonInfos = [
        ...arr,
        ...this.model.innerPersonInfos,
      ].map((v) => {
        v.baseInfoId = this.model.baseInfoId
        return v
      })
      this.dialogVisible = false
      this.getInnerTabledata()
    },
    resetInnerPerson() {
      if (this.$refs.innerForm) {
        this.$refs['innerForm'].resetFields()
      }
      this.getTableData()
    },
    handleSelectionChange(e) {
      // 非当前页的选中数据
      const arr = this.selectList.filter(
        (v) =>
          !this.tableData.find(
            (tb) => tb.workCode == v.workCode && tb.tel == v.tel
          )
      )
      this.selectList = [...arr, ...e]
    },
    getTableData() {
      const { pageIndex, pageSize } = this.query
      const arr = this.personstates.filter((v) => {
        if (this.query.name && this.query.tel) {
          return (
            v.fullName.includes(this.query.name) ||
            v.tel.includes(this.query.tel)
          )
        } else if (this.query.name) {
          return v.fullName.includes(this.query.name)
        } else if (this.query.tel) {
          return v.tel.includes(this.query.tel)
        }
        return true
      })
      this.query.total = arr.length
      this.tableData = arr.filter((v, i) => {
        return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize
      })
      this.toggleRowSelection()
      const pList = this.tableData.map((v) => {
        if (this.jobMap[v.jobTitleId]) {
          return Promise.resolve({ _fullname: this.jobMap[v.jobTitleId] })
        }
        return getJobTitleById(v.jobTitleId)
      })
      Promise.all(pList).then((arr) => {
        this.tableData = this.tableData.map((v, i) => {
          this.jobMap[v.jobTitleId] = arr[i]._fullname
          v.jobTitle = arr[i]._fullname
          return v
        })
        this.toggleRowSelection()
      })
    },
    pageIndexChange(e) {
      this.query.pageIndex = e
      this.getTableData()
    },
    saveCoop() {
      this.model.supplyType = this.model.supplyTypes
      this.model.serviceType = this.model.serviceTypes
      if (this.model.id) {
        updateCoopInfoById(this.model).then((v) => {
          this.saveInner().then(() => {
            this.$message({ message: '修改合作信息成功', type: 'success' })
            this.$emit('afterSave', v)
          })
        })
      } else {
        addCoopInfo(this.model).then((res) => {
          this.saveInner().then(() => {
            this.$message({ message: '添加合作信息成功', type: 'success' })
            this.$emit('afterSave', res)
          })
        })
      }
      // addCoopInfo
    },
    saveInner() {
      return Promise.all(
        this.model.innerPersonInfos.map((v) =>
          v.id ? updateInnerPersonInfoById(v) : addInnerPersonInfoById(v)
        )
      )
    },
    toggleRowSelection() {
      const arr = this.tableData.filter((v) =>
        this.selectList.find(
          (s) => v.workCode == s.workCode && v.fullName == s.fullName
        )
      )
      this.$nextTick(() => {
        if (this.$refs.t) {
          arr.forEach((v) => {
            this.$refs.t.toggleRowSelection(v, true)
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>