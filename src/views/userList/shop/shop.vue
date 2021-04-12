<template>
  <div class="shop-page">
    <!-- @change="onChange" -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" @click="addShop" type="primary">新增客户店铺</el-button>
          <el-button
            v-permission-button="'approval'"
            @click="approvalShop"
            type="primary"
            style="margin-left:10px"
          >提交审批</el-button>
        </div>
      </div>
      <div v-if="tableData.length > 0" class="shopClass">
        <el-table
          :data="tableData"
          border
          stripe
          @selection-change="handleSelectionChange"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="customerName"
            label="客户名称"
            width="160"
          >
            <template slot-scope="scope">
              <el-link
                @click="gotoCustomerPage(scope.row.customerName)"
                type="info"
                class="el-link-ellipsis"
              >{{ scope.row.customerName || '-' }}</el-link>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="code" label="店铺号">
            <template slot-scope="scope">{{ scope.row.code || '-' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="店铺名称">
            <template slot-scope="scope">{{ scope.row.name || '-' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="type" label="店铺类型">
            <template slot-scope="scope">{{ scope.row.type==='1'?"线下门店":"线上平台" || '-' }}</template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" prop="type" label="销售渠道">
            <template slot-scope="scope">{{ scope.row.onLineName || '-' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="website" label="店铺网址">
            <template slot-scope="scope">{{ scope.row.website || '-' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="operateType" label="运营类型">
            <template slot-scope="scope">{{ scope.row.operateType || '-' }}</template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="operateTeam" label="运营团队">
            <template slot-scope="scope">{{ scope.row.operateTeam || '-' }}</template>
          </el-table-column>
          <el-table-column prop="shopbrandCount" label="经营品牌数"></el-table-column>
          <el-table-column prop="shopAttaCount" label="附件"></el-table-column>
          <el-table-column prop="sortNum" label="排序">
            <template slot-scope="scope">
              {{ scope.row.sortNum || 0
              }}
              <i
                class="el-icon-edit"
                v-permission-button="'editSort'"
                @click="editSortNum(scope.row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="isEnable" label="店铺状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isEnable">启用</el-tag>
              <el-tag type="info" v-if="!scope.row.isEnable">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审核状态">
            <template slot-scope="scope">
              <approve-timeline :id="scope.row.id" :list="timelineList" :request-id="requestId" :is-loading="isLoading" @hoverCheckedStatus="onHoverCheckedStatus">
                <el-tag v-if="scope.row.approvalStatus && scope.row.approvalStatus==='0'">未审核</el-tag>
                <el-tag
                  type="warning"
                  v-if="scope.row.approvalStatus && scope.row.approvalStatus==='1'"
                >审核中</el-tag>
                <el-tag
                  type="success"
                  v-if="scope.row.approvalStatus && scope.row.approvalStatus==='2'"
                >审核通过</el-tag>
                <el-tag
                  type="danger"
                  v-if="scope.row.approvalStatus && scope.row.approvalStatus==='3'"
                >审核未通过</el-tag>
              </approve-timeline>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人"></el-table-column>
          <el-table-column label="创建时间" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createTimestamp | formatDate('Y/M/D h:m:s') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-permission-button="'enable'"
                @click="enableOrDisable(scope.row)"
                :disabled="isDisabled"
                type="text"
              >{{ scope.row.isEnable ? '禁用' : '启用' }}</el-button>
              <el-button @click="view(scope.row.id)" type="text">查看</el-button>
              <el-button
                v-permission-button="'edit'"
                :disabled="scope.row.approvalStatus==='1'"
                @click="edit(scope.row.id)"
                type="text"
              >修改</el-button>
              <el-button
                :disabled="scope.row.approvalStatus==='1'"
                @click="deleteShop(scope.row.id)"
                type="text"
                v-permission-button="'delete'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <span v-if="this.customerId">
          <el-link @click="returnCustomerPage(-1)" type="info">暂无数据,点击返回</el-link>
        </span>
        <span v-else>暂无数据</span>
      </div>
    </my-table>
    <!-- 排序编辑 -->
    <el-dialog
      :title="'排序编辑'"
      :visible.sync="showShopSortNum"
      width="300px"
      :before-close="oneShopClose"
      class="brand-dialog"
    >
      <el-form ref="form" :model="oneShop" label-width="80px" inline>
        <div align="center">
          <el-form-item label="店铺名称:" props="name">{{ oneShop.name }}</el-form-item>
        </div>
        <div align="center">
          <el-form-item label="排序:" props="sortNum">
            <el-input-number
              v-model="oneShop.sortNum"
              @change="handleChange"
              :min="0"
              label="请输入排序"
            ></el-input-number>
          </el-form-item>
        </div>
        <div align="center">
          <el-button @click="oneShopClose" type="info">取消</el-button>&nbsp;&nbsp;
          <el-button @click="submitEditSortNum" type="success">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShopPages as getPages,
  enable,
  disable,
  deleteShop,
  editSort,
  getAllOnlineNames,
  approvalShop,
} from '@/api/shop'
import { getWorkflow } from '@/api/shop'
import ApproveTimeline from '@/components/approve-timeline'
export default {
  name: 'Shop',
  components: { ApproveTimeline },
  data() {
    return {
      showShopSortNum: false,
      oneShop: {},
      customerId: '',
      customerName: '',
      isDisabled: false,
      tableData: [],
      tableLoading: false,
      searchForm: [
        {
          key: 'customerName',
          label: '客户名称',
          placeholder: '客户名称',
          type: 'input',
          clearable: true,
        },
        {
          key: 'code',
          label: '店铺号',
          placeholder: '店铺号',
          type: 'input',
          clearable: true,
        },
        {
          key: 'name',
          label: '店铺名称',
          placeholder: '店铺名称',
          type: 'input',
          clearable: true,
        },
        {
          key: 'type',
          label: '店铺类型',
          placeholder: '店铺类型',
          options: [
            { label: '请选择', value: null },
            { label: '线下门店', value: '1' },
            { label: '线上平台', value: '2' },
          ],
          type: 'select',
          clearable: true,
        },
        {
          key: 'onLineName',
          label: '销售渠道',
          placeholder: '销售渠道',
          options: [
            // { label: '请选择', value: null },
            // { label: '京东', value: '京东' },
            // { label: '天猫', value: '天猫' },
            // { label: '淘宝', value: '淘宝' },
            // { label: '拼多多', value: '拼多多' },
            // { label: '抖音', value: '抖音' },
            // { label: '小红书', value: '小红书' },
            // { label: '网易考拉', value: '网易考拉' },
            // { label: '快手', value: '快手' },
            // { label: '洋码头', value: '洋码头' },
            // { label: '有赞', value: '有赞' },
            // { label: '其他', value: '其他' }
          ],
          type: 'select',
          clearable: true,
        },
        {
          key: 'operateType',
          label: '运营类型',
          placeholder: '运营类型',
          options: [
            { label: '请选择', value: null },
            { label: '外包', value: '外包' },
            { label: '直营', value: '直营' },
            { label: '客户', value: '客户' },
          ],
          type: 'select',
          clearable: true,
        },
        {
          key: 'creatorName',
          label: '创建人',
          placeholder: '',
          type: 'input',
          clearable: true,
        },
        {
          key: 'time',
          label: '创建时间',
          type: 'date_picker',
          pickerType: 'daterange',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          clearable: true,
        },
        {
          key: 'isEnable',
          label: '店铺状态',
          placeholder: '店铺状态',
          options: [
            { label: '请选择', value: null },
            { label: '启用', value: true },
            { label: '禁用', value: false },
          ],
          type: 'select',
          clearable: true,
        },
        {
          key: 'approvalStatus',
          label: '审核状态',
          placeholder: '审核状态',
          options: [
            { label: '全部', value: null },
            { label: '未审核', value: '0' },
            { label: '审核中', value: '1' },
            { label: '审核通过', value: '2' },
            { label: '审核未通过', value: '3' }
          ],
          type: 'select',
          clearable: true,
        }
      ],
      searchQuery: {
        customerName: '',
        code: '',
        name: '',
        type: '',
        operateType: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        creatorName: '',
        srartCreateDate: '',
        endCreateDate: '',
        time: [], // 创建时间
        total: 0, // 总条数
      },
      onLineNames: [],
      selectIds: [],
      requestId: '',//审批流程id
      timelineList: [],//审批时间轴
      isLoading: false,
    }
  },
  computed: {},
  created() {
    // SHOP_LIST_REFRESH
    this.$eventHub.$on(this.$eventName.SHOP_LIST_REFRESH, () => {
      this.fetchTableData()
    })
  },
  mounted() {
    this.searchQuery.customerName = ''
    if (this.$route.query.customerName) {
      this.searchQuery.customerName = this.$route.query.customerName
    }
    this.getOnLineNames()
    this.fetchTableData()
  },
  beforeDestroy() {
    this.$eventHub.$off(this.$eventName.SHOP_LIST_REFRESH)
  },
  methods: {
    async getOnLineNames() {
      getAllOnlineNames().then((res) => {
        this.onLineNames = res
        this.searchForm[4].options = res.map((o) => {
          return {
            label: o.text,
            value: o.code,
          }
        })
      })
    },
    //获取列表数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        console.log(this.searchQuery, 'searchQuery')
        let params = this.$lodash.cloneDeep(this.searchQuery)
        params.srartCreateDate = params.time[0]
        params.endCreateDate = params.time[1]
        getPages(params).then((res) => {
          this.tableLoading = false
          let list = res.list
          this.searchQuery.total = res.count // 总条数
          this.tableData = list.map((item) => {
            // item.brandCount = item.brands ? item.brands.length : 0
            // item.attaCount = item.shopAttas ? item.shopAttas.length : 0
            if (this.customerName) {
              item.customerName = this.customerName
            }
            if (item.onLineName) {
              let onLineName = this.onLineNames.filter((o) => {
                return o.code === item.onLineName
              })
              if (onLineName.length > 0) {
                item.onLineName = onLineName[0].text
              }
            }
            return item
          })
        })
      } catch (error) {
      } finally {
      }
    },
    //启用或者禁用
    enableOrDisable(item) {
      this.isDisabled = true
      let status = item.isEnable

      if (status) {
        //禁用
        disable(item.id)
          .then((_) => {
            this.$message.warning('禁用成功')
            this.fetchTableData()
          })
          .catch(() => {
            this.$message.error('禁用失败')
          })
      } else {
        //启用
        enable(item.id)
          .then((_) => {
            this.$message.success('启用成功')
            this.fetchTableData()
          })
          .catch(() => {
            this.$message.error('启用失败')
          })
      }
      this.isDisabled = false
    },
    //店铺新增
    addShop() {
      this.$router.push({
        name: 'ShopDetail',
        query: {
          type: 'add',
          isLook: false,
        },
      })
    },
    edit(id) {
      this.$eventHub.$emit(this.$eventName.SHOP_DETAIL_REFRESH, id)
      this.$router.push({
        name: 'ShopDetail',
        query: {
          type: 'edit',
          isLook: false,
          shopInfoId: id 
        }
      })
    },
    view(id) {
      this.$eventHub.$emit(this.$eventName.SHOP_DETAIL_REFRESH, id)
      this.$router.push({
        name: 'ShopDetail',
        query: {
          type: 'view',
          shopInfoId: id 
        }
      })
    },
    //店铺删除
    deleteShop(id) {
      this.$confirm('您确定要删除此店铺信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteShop(id)
          .then((res) => {
            this.$message.success('删除成功')
            this.fetchTableData()
          })
          .catch((e) => {
            this.$message.error(e)
          })
      })
    },
    onChange() {
      this.fetchTableData()
    },
    returnCustomerPage() {
      this.$router.push({
        name: 'userlist',
        query: {
          source: 'shopPage',
        },
      })
    },
    // 修改排序
    editSortNum(item) {
      this.oneShop.id = item.id
      this.oneShop.sortNum = item.sortNum
      this.oneShop.name = item.name
      this.showShopSortNum = true
    },
    oneShopClose() {
      this.showShopSortNum = false
      this.oneShop = {}
    },
    handleChange(value) {
      this.oneShop.sortNum = value
    },
    submitEditSortNum() {
      editSort(this.oneShop).then((res) => {
        this.$message.success('修改排序成功')
        this.showShopSortNum = false
        this.oneShop = {}
        this.fetchTableData()
      })
    },
    gotoCustomerPage(customerName) {
      this.$router.push({
        name: 'userlist',
        query: {
          customerName: customerName,
          source: 'shopPage',
        },
      })
    },
    handleSelectionChange(val) {
      // this.selectIds = val.map(item => item.id)
      this.selectIds = val
    },
    approvalShop() {
      if (!this.selectIds || this.selectIds.length === 0) {
        this.$message.error('未选中数据进行操作！')
        return
      }
      if (this.selectIds.length !== 1) {
        this.$message.error('只能选择一条数据进行操作!')
        return
      }
      let check1 = this.selectIds.find((v) => v.type === '1')
      if (check1) {
        this.$message.error(`"${check1.name}"为线下门店，无需发起开店申请流程，谢谢！`)
        return
      }
      let check2 = this.selectIds.find((v) => v.approvalStatus === '1')
      if (check2) {
        this.$message.error(`"${check2.name}"在审核中，请勿重复发起流程，谢谢！`)
        return
      }
      let check3 = this.selectIds.find((v) => v.approvalStatus === '2')
      if (check3) {
        this.$message.error(`"${check3.name}"开店申请已审核通过，请勿重复提交，谢谢！`)
        return
      }
      this.$store.commit('SHOW_LOADING')
      let ids = this.selectIds.map((item) => item.id)
      approvalShop(ids).then((res) => {
        this.$store.commit('SHOW_LOADING', false)
        this.$message.success('店铺提审成功')
        this.fetchTableData()
        })
    },
    onHoverCheckedStatus(id) {
      this.isLoading = true;
      getWorkflow(id).then(res => {
        this.timelineList = []
        this.requestId = res && res.requestId
        let arr = res && res.workflowRequestLogs.reverse()
        if(arr){
          arr.map((item,idx) => {
            let obj = {
              remark: item.remark ? `审批意见: ${item.remark}` : '',
              receivedPersons: `(接收人) ${item.receivedPersons}`,
              content: `(${item.operatorDept}) ${item.operatorName} ${item.operateType}`,
              timestamp: `${item.operateDate} ${item.operateTime}`,
            }
            item.operateType === '提交'
            ? (
              obj.size = 'large',
              obj.type = 'primary',
              obj.icon = 'el-icon-circle-plus'
            )
            : (item.operateType === '批准'
                ? (
                  obj.size = 'large',
                  obj.type = 'success',
                  obj.icon = 'el-icon-success'
                )
                : obj.type = 'warning'
              )
            this.timelineList.push(obj)
          })
        }
      }).finally(()=>{
        this.isLoading = false;
      })
    }
  },

  watch: {
    'searchQuery.customerName': function (newValue) {
      if (!newValue === this.customerName) {
        this.customerId = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
.must:before {
  content: '* ';
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}
/deep/ .brand-dialog .el-dialog__body {
  // height: 70vh;
  overflow-y: auto;
  overflow-x: auto;
}
.el-link-ellipsis {
  width: 100%;
  /deep/ .el-link--inner {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
