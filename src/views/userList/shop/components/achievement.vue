<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="padding: 8px">
        <span style="line-height: 34px">业绩归属信息</span>
        <div style="float: right; padding: 3px 0">
          <el-button type="text" @click="openDialog">选择</el-button>
          <log
            v-if="shopId"
            class="ml10"
            :id="shopId"
            logType="customerShopBizBelong"
            title="归属信息操作日志"
          ></log>
        </div>
      </div>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="businessName" label="业务板块"></el-table-column>
        <el-table-column prop="bizCompanyName" label="业务主体"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="100px"></el-table-column>
        <el-table-column prop="coopModel" label="合作信息" width="100px"></el-table-column>
        <el-table-column prop="director" label="负责人" width="100px"></el-table-column>
        <el-table-column label="生效时间" width="100px">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.isLongTerm">长期合作</span>
              <span
                v-else
              >{{scope.row.effectiveStartTime | formatDate('Y-M-D')}}至{{scope.row.effectiveEndTime | formatDate('Y-M-D')}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="业绩归属"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="dialogBeforeClose"
    >
      <div class="ml20">
        <span class="label">
          组织部门
          <el-tooltip class="item" effect="dark" content="关联所属客户的合作信息" placement="top">
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </span>
        <el-table
          class="mtb10"
          ref="t1"
          :data="coopInfoList"
          style="width: 100%"
          highlight-current-row
          @current-change="handleDeptChange"
        >
          <template slot="empty">
            暂无合作信息，请到
            <el-button type="text" @click="editCustomer">客户档案</el-button>中添加…
          </template>
          <el-table-column width="30">
            <template slot-scope="scope">
              <el-radio v-model="selectCoopId" :label="scope.row.id"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="businessId" label="业务板块" :formatter="businessNameFormat"></el-table-column>
          <el-table-column
            prop="companyId"
            label="业务主体"
            min-width="120"
            :formatter="companyNmaeFormat"
          ></el-table-column>
          <el-table-column prop="deptId" label="所属部门" :formatter="deptNameFormat"></el-table-column>
          <el-table-column prop="coopModel" label="合作信息"></el-table-column>
        </el-table>

        <span class="label">
          店铺负责人
          <el-tooltip class="item" effect="dark" content="关联所选合作信息的内部联系人" placement="top">
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </span>
        <el-table
          class="mtb10"
          ref="t2"
          :data="innerPersonList"
          style="width: 100%"
          highlight-current-row
          @current-change="handleInnerPersonChange"
        >
          <template slot="empty">
            暂无部门内部联系人信息，请到
            <el-button type="text" @click="editCustomer">客户档案</el-button>中添加…
          </template>
          <el-table-column width="30">
            <template slot-scope="scope">
              <el-radio v-model="selectInnerPersonId" :label="scope.row.id"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="fullName" label="姓名"></el-table-column>
          <el-table-column prop="tel" label="电话"></el-table-column>
          <el-table-column prop="jobTitle" label="岗位"></el-table-column>
        </el-table>
        <div class="mt10">
          <span class="label" style="width:80px;display: inline-block;">生效时间</span>
          <el-radio v-model="achievement.isLongTerm" :label="true">长期</el-radio>
        </div>
        <div class="ml80 mt10">
          <div>
            <el-radio v-model="achievement.isLongTerm" :label="false">自定义时间</el-radio>
            <el-date-picker
              v-if="!achievement.isLongTerm"
              v-model="dateRange"
              :picker-options="options"
              value-format="timestamp"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCoopInfoListByBaseInfoId,
  getInnerPersonInfoListByBId,
  getDepartment,
  getBaseInfoById,
} from '@/api/client'
import { listBusiness } from '@/api/business'

import log from '@/components/log'
// 业绩归属
export default {
  name: 'achievement',
  components: { log },
  props: {
    customerId: '',
    shopId: '',
    departments: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deptList: [], // 用于过滤
      list: [],
      dialogVisible: false,
      currentCoopInfo: null,
      coopInfoList: [],
      innerPersonList: [],
      allInnerPersonList: [],
      businessList: [],
      achievement: {
        departmentId: '',
        bizCompanyId: '',
        businessId: '',
        coopModel: '',
        director: '',
        isLongTerm: false,
        effectiveStartTime: null,
        effectiveEndTime: null,
        bizCompanyName: '',
        businessName: '',
        departmentName: '',
        workCode: '',
      },
      options: {
        disabledDate: this.disabledDate,
      },
      isdofilter: true,
      editIndex: -1,
      selectCoopId: '',
      selectInnerPersonId: '',
    }
  },
  computed: {
    dateRange: {
      get() {
        if (
          this.achievement.effectiveStartTime &&
          this.achievement.effectiveEndTime
        ) {
          return [
            this.achievement.effectiveStartTime,
            this.achievement.effectiveEndTime,
          ]
        }
        return []
      },
      set(val) {
        this.achievement.effectiveStartTime = (val && val[0]) || null
        this.achievement.effectiveEndTime = (val && val[1]) || null
        // if (Array.isArray(val) && val.length === 2) {
        // }
      },
    },
  },
  watch: {
    customerId: {
      handler: async function (val) {
        if (val) {
          this.$nextTick(async () => {
            await this.init()
          })
        }
      },
    },
    'achievement.departmentId': {
      handler: function (val) {
        if (this.isdofilter) {
          this.selectInnerPersonId = ''
          this.achievement.director = ''
          this.achievement.workCode = ''
          // this.$nextTick(() => {
          // })
        }
        this.filterInnerPerson()
        this.isdofilter = true
      },
      deep: true,
      immediate: true,
    },

    'achievement.isLongTerm': {
      handler: function (val) {
        if (val) {
          this.achievement.effectiveEndTime = null
          this.achievement.effectiveStartTime = null
        }
      },
      deep: true,
      immediate: true,
    },

    list: {
      handler: function (val) {
        this.$emit('input', val)
      },
      deep: true,
    },

    value: {
      handler: function (val) {
        this.list = Array.isArray(val) ? val : []
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    listBusiness().then((res) => {
      this.businessList = res
    })
    if (this.customerId) {
      await this.init()
    }
  },
  methods: {
    init() {
      // getInnerPersonInfoListByBId(this.customerId).then((res) => {
      //   this.allInnerPersonList = res || []
      //   this.filterInnerPerson()
      // })
      return new Promise((resolve, rej) => {
        getCoopInfoListByBaseInfoId(this.customerId)
          .then((res) => {
            this.coopInfoList = []
            if (res) {
              this.coopInfoList = res.filter((c) => c.companyId)
            }

            Promise.all(
              this.coopInfoList
                .filter(
                  (v, i) =>
                    i ===
                    this.coopInfoList.findIndex(
                      (c) => c.companyId === v.companyId
                    )
                )
                .map((v) => getDepartment(v.companyId))
            ).then((arr) => {
              this.deptList = [].concat(...arr)
              resolve()
              // _subcompanyid
            })
          })
          .catch((e) => {
            rej()
          })
      })
    },
    // getParentList(cid, allList, pIdList = []) {
    //   pIdList.push(Number(cid))
    //   const dept = allList.find((v) => v._departmentid == cid)
    //   if (dept) {
    //     return this.getParentList(dept._supdepartmentid, allList, pIdList)
    //   }
    //   return pIdList
    // },
    filterInnerPerson() {
      // this.innerPersonList = this.allInnerPersonList.filter((v) => {
      //   if (!this.achievement.departmentId) {
      //     return false
      //   }
      //   const pList = this.getParentList(v.deptId, this.deptList, [])
      //   return pList.includes(this.achievement.departmentId)
      // })

      const coopInfo = this.coopInfoList.find(
        (v) =>
          v.deptId == this.achievement.departmentId &&
          v.businessId == this.achievement.businessId
      )

      this.innerPersonList = []
      if (coopInfo && coopInfo.innerPersonInfos) {
        this.innerPersonList = coopInfo.innerPersonInfos
      }
      console.info('tessssst:', this.innerPersonList)
      if (this.innerPersonList.length === 1) {
        this.selectInnerPersonId = this.innerPersonList[0].id
        this.achievement.director = this.innerPersonList[0].fullName
        this.achievement.workCode = this.innerPersonList[0].workCode
      }
    },

    async openDialog() {
      // 打开弹窗 添加
      if (!this.customerId) {
        this.$message.error('请选择客户后再添加业绩归属信息')
        return
      }
      if (this.list.some((v) => v.isLongTerm)) {
        this.$message.error(
          '当业绩归属生效时间为长期时，业绩主体关系只能有一条'
        )
        return
      }
      await this.init()
      this.resetAachievement()
      if (this.coopInfoList.length === 1) {
        this.setAchievementFromCoop(this.coopInfoList[0])
      }
      this.dialogVisible = true
    },

    resetAachievement() {
      this.editIndex = -1
      // 重置弹窗表单
      this.achievement = {
        departmentId: '',
        bizCompanyId: '',
        businessId: '',
        coopModel: '',
        director: '',
        isLongTerm: false,
        effectiveStartTime: null,
        effectiveEndTime: null,
        bizCompanyName: '',
        businessName: '',
        departmentName: '',
        workCode: '',
      }
      if (this.$refs.t1 && this.$refs.t2) {
        this.$refs.t1.setCurrentRow()
        this.$refs.t2.setCurrentRow()
      }
    },

    dialogBeforeClose(done) {
      this.resetAachievement()
      done()
    },

    save() {
      if (!this.achievement.departmentId) {
        this.$message.error('组织部门不能为空!')
        return
      }
      if (!this.achievement.director) {
        this.$message.error('负责人不能为空不能为空!')
        return
      }
      if (!this.achievement.isLongTerm) {
        if (
          !(
            this.achievement.effectiveStartTime &&
            this.achievement.effectiveEndTime
          )
        ) {
          this.$message.error('请填写生效时间!')
          return
        }
        const isIllegal = this.list.some((v, i) => {
          if (v.isLongTerm) {
            return false
          }
          if (i === this.editIndex) {
            return false
          }
          if (
            this.achievement.effectiveStartTime <= v.effectiveStartTime &&
            this.achievement.effectiveEndTime >= v.effectiveEndTime
          ) {
            return true
          }
        })
        if (isIllegal) {
          this.$message.error('业绩归属时间冲突，请检查')
          return
        }
      } else {
        if (this.list.some((v, i) => i !== this.editIndex)) {
          this.$message.error(
            '当业绩归属生效时间为长期时，业绩主体关系只能有一条'
          )
          return
        }
      }
      if (this.editIndex < 0) {
        this.list = [...this.list, _.cloneDeep(this.achievement)]
      } else {
        this.list.splice(this.editIndex, 1, _.cloneDeep(this.achievement))
      }
      this.editIndex = -1
      this.dialogVisible = false
    },

    handleDeptChange(val) {
      this.setAchievementFromCoop(val)
    },
    setAchievementFromCoop(val) {
      this.selectCoopId = val && val.id
      this.achievement.departmentId = val && val.deptId
      this.achievement.bizCompanyId = val && val.companyId
      this.achievement.bizCompanyName = this.companyNmaeFormat(
        null,
        null,
        val && val.companyId,
        null
      )
      this.achievement.businessId = val && val.businessId
      this.achievement.businessName = this.businessNameFormat(
        null,
        null,
        val && val.businessId,
        null
      )
      this.achievement.coopModel = val && val.coopModel
      this.achievement.departmentName = this.deptNameFormat(
        null,
        null,
        val && val.deptId,
        null
      )
    },
    handleInnerPersonChange(val) {
      this.selectInnerPersonId = val && val.id
      this.achievement.director = val && val.fullName
      this.achievement.workCode = val && val.workCode
    },

    businessNameFormat(row, column, cellValue, index) {
      const business = this.businessList.find((b) => b.id === cellValue)
      return (business && business.name) || ''
    },

    companyNmaeFormat(row, column, cellValue, index) {
      const dept = this.departments.find((b) => b._departmentid == cellValue)
      return (dept && dept._fullname) || ''
    },

    deptNameFormat(row, column, cellValue, index) {
      const list = [].concat(
        ...this.departments.map((d) => d.departmentBeanList)
      )
      const dept = list.find((d) => d._departmentid == cellValue)
      return (dept && dept._fullname) || ''
    },

    edit(row) {
      this.editIndex = this.list.indexOf(row)
      // editIndex

      this.init().then(() => {
        this.isdofilter = false
        this.achievement = _.cloneDeep(row)
        this.dialogVisible = true
        this.setCurrentRow()
      })
    },

    setCurrentRow() {
      this.$nextTick(() => {
        if (this.$refs.t1 && this.$refs.t2) {
          const coop1 = this.coopInfoList.find(
            (v) => v.deptId == this.achievement.departmentId
          )
          const coop2 = this.coopInfoList.find(
            (v) =>
              v.deptId == this.achievement.departmentId &&
              v.businessId == this.achievement.businessId
          )
          this.$refs.t1.setCurrentRow(coop2 || coop1)
          this.$refs.t2.setCurrentRow(
            this.innerPersonList.find((v) => {
              return v.fullName === this.achievement.director
            })
          )
        }
      })
    },

    remove(row) {
      this.$confirm('是否确认删除该业绩归属信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.list = this.list.filter((v) => v !== row)
      })
    },

    disabledDate(date) {
      return this.list
        .filter((v, i) => i !== this.editIndex)
        .some((v) => {
          if (v.effectiveStartTime && v.effectiveEndTime) {
            return v.effectiveStartTime <= date && v.effectiveEndTime >= date
          }
          return false
        })
    },

    editCustomer() {
      getBaseInfoById(this.customerId).then((res) => {
        if (!res) {
          return
        }
        this.dialogVisible = false
        this.$router.push({
          path: '/userlist/edit',
          query: {
            id: this.customerId,
            isLook: res.checkedStatus === '2',
            checkedStatus: res.checkedStatus,
            enterpriseType: res.enterpriseType,
          },
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>