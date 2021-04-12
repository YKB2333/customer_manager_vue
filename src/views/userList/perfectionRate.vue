<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <el-button v-permissionButton="'LevelACustomerMgr'" type="primary" @click="onBigCustomerList" class="mb20">重点客户名单维护</el-button>
      <el-button v-permissionButton="'reflush'" type="warning" @click="reflush" class="mb20">更新客户信息</el-button>
      <el-button v-permissionButton="'export'" type="success" @click="download" class="mb20">导出</el-button>
      <el-card class="box-card" style="font-size: 14px;color:darkgray;">
        <p>备注：数据更新频率：每周六5点自动更新一次</p>
      </el-card>
      <el-table
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        @sort-change="sortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="客户名称" fixed="left" width="100"></el-table-column>
        <el-table-column prop="simpleName" label="客户简称（渠道）"></el-table-column>
        <el-table-column prop="ncCode" label="NC编码" width="100"></el-table-column>
        <el-table-column prop="checkedStatus" label="审批状态" width="95">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.checkedStatus == '1'">审核通过</el-tag>
            <el-tag type="warning" v-else-if="scope.row.checkedStatus == '2'">审核中</el-tag>
            <el-tag type="danger" v-else-if="scope.row.checkedStatus == '0'">审核未通过</el-tag>
          </template>
        </el-table-column>
        <!-- 内容太多了，暂时不开放
        <el-table-column prop="bmCode" label="部门编码" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.bmCode">
              <el-tag :key="index" v-for="(bmCode, index) in scope.row.bmCode.split(',')">{{bmCode}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="bmName" label="所属部门" width="160">
          <template slot-scope="scope">
            <template v-if="scope.row.bmName">
              <el-tag :key="index" v-for="(bmName, index) in scope.row.bmName.split(',')">{{bmName}}</el-tag>
            </template>
          </template>
        </el-table-column>
        -->
        <el-table-column prop="businessName" label="业务板块" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.businessName">
              <el-tag :key="index" v-for="(businessName, index) in scope.row.businessName.split(',')">{{businessName}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="customerLevel" width="90">
          <template slot="header">
            <el-tooltip effect="dark" :content="customerLevelTooltip" placement="top">
              <span>客户分类<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.customerLevel == 'A'">山头客户</span>
            <span v-else-if="scope.row.customerLevel == 'B'">半年内有合作</span>
            <span v-else-if="scope.row.customerLevel == 'C'">超过半年没交易</span>
            <span v-else-if="scope.row.customerLevel == 'D'">从未合作</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPerfectionRate" sortable="custom" width="140">
          <template slot="header">
            <el-tooltip effect="dark" :content="customerCateTooltip" placement="top">
              <span>客户信息整体<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.totalPerfectionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="baseInfoPerfectionRate" width="120">
          <template slot="header">
            <el-tooltip effect="dark" content="客户基础信息完善率=已填写字段数/总字段数*100" placement="top">
              <span>客户基础信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`最后一次更新信息时间为：\r\n${scope.row.updateTimestamp ? $formatDate(scope.row.updateTimestamp, 'Y/M/D h:m') : ''}`" placement="right">
              <el-link type="primary" @click="onUserInfo(scope.row)">{{ scope.row.baseInfoPerfectionRate }}%</el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="financeCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>财务信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="coopCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>合作信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="innerPersonCount" width="130">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>内部跟进人信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="contactsCount" width="130">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>客户联系人信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="shopCount" width="130">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>客户店铺信息<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="activityCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>活动预先<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="operatingModelCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>运营方式<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="operatingStatusCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>经营状况<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="yearTargetCount" width="140">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>年度合作战略管理<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="contractCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>合同管理<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="productNewsCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>新品预告<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="proAnalyzeCount" width="90">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>竞品分析<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column prop="proposalsSuccessCount" width="130">
          <template slot="header" slot-scope="scope">
            <el-tooltip effect="dark" :content="commonFieldTips" placement="top">
              <span>提案与成功案例<i class="el-icon-info ml6"></i></span>
            </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column
          prop="modifyTimestamp"
          label="更新时间"
          :formatter="(row)=> row.modifyTimestamp ? $formatDate(row.modifyTimestamp, 'Y/M/D h:m') : ''"
          width="120"
        ></el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="saveForm.id?'编辑字典':'添加字典'"
      width="500px"
      max-height
      @close="closeDialog">
      <el-form
        :model="saveForm"
        :rules="rules"
        ref="saveForm"
        :label-width="labelWidth"
        class="mr30"
      >
        <el-form-item label="编号" prop="id">
          <el-input v-model="saveForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="saveForm.code" placeholder="请输入code"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="value">
          <el-input type="textarea" :rows="3" v-model="saveForm.value" placeholder="请输入标签"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="saveForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item style="display: block; text-align: left; padding-left: 80px">
          <el-button type="primary" :loading="saveBtnLoading" @click="submit">保存</el-button>
          <el-button @click="closeDialog()">关闭</el-button>
        </el-form-item>

        <!-- <div slot="footer" class="align-center">
          <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
          <el-button @click="closeDialog">关 闭</el-button>
        </div>-->
      </el-form>
    </my-dialog>

    <el-dialog title="提示" :visible.sync="delTip" width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTip = false">取 消</el-button>
        <el-button type="primary" @click="deleteItem">确 定</el-button>
      </span>
    </el-dialog>

    <big-customer-list 
      :visible.sync="isShowCustomerDialog"
      width="900px"
      custom-class="custom-super-dialog"
    />

  </div>
</template>

<script>
import { baseInfoRatePage, exportBaseInfoRate, reflushBaseInfoRatePage } from '@/api/baseInfo'
import FileSaver from "file-saver"
import { deepClone, formatDate } from "@/utils";
import BigCustomerList from './big-customer-list'
const customerLevelTooltip = '山头客户：重点合作客户'+
                        '\r\n半年内有合作：在NC近半年内有出库记录的客户'+
                        '\r\n超过半年没交易：在NC超过半年没有出库记录的客户'+
                        '\r\n从未合作：在NC没有出库记录的客户'
const customerCateTooltip = '客户信息整体完善率计算规则' +
                        '\r\n客户信息整体 =（基础信息每项完善率相加 + 运营信息每项完善率相加）/ 统计项 * 100'
const commonFieldTips = '指信息录入总数，如录入2条银行信息，则显示 2；' + 
                        '\r\n如录入5条内部联系人信息，则显示5。'

export default {
  name: "PerfectionRate",
  components: { BigCustomerList },
  data() {
    return {
      customerLevelTooltip,
      customerCateTooltip,
      commonFieldTips,
      tableLoading: false,
      tableData: [], // 表格数据
      searchForm: [
        {
          label: "客户名称",
          key: "name",
          placeholder: "请输入客户名称",
          type: "input",
        },
        {
          label: "客户简称",
          key: "simpleName",
          placeholder: "请输入客户简称",
          type: "input",
        },
        {
          label: "NC编码",
          key: "ncCode",
          placeholder: "请输入NC编码",
          type: "input",
        },
        {
          label: "客户分类",
          key: "customerLevel",
          placeholder: "请选择客户分类",
          options: [
            { label: "山头客户", value: 'A' },
            { label: "半年内有合作", value: 'B' },
            { label: "超过半年没交易", value: 'C' },
            { label: "从未合作", value: 'D' },
          ],
          type: "select",
          clearable: true,
          tooltip: customerLevelTooltip,
        },
        {
          label: "客户状态",
          key: "checkedStatus",
          placeholder: "请选择客户状态",
          options: [
            { label: "全部", value: '' },
            { label: "审核中", value: '2' },
            { label: "审核通过", value: '1' },
            { label: "审核未通过", value: '0' },
          ],
          type: "select",
          clearable: true,
        },
        {
          label: "更新时间",
          key: "updateTimestamp",
          type: "date_picker",
          pickerType: "daterange",
          clearable: true,
          format: "yyyy-MM-dd",  
          valueFormat: "timestamp",
          defaultTime: ["00:00:00", "23:59:59"],
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",         
        },
      ],
      searchQuery: {
        code: "", //code
        value: "", //标签
        pageIndex: 1,
        pageSize: 10,
        total: 0, // 总条数
      },
      saveForm: {},
      dialogVisible: false,
      rules: [],
      labelWidth: 800,
      saveBtnLoading: false,
      delTip: false,
      isShowCustomerDialog: false,
      selectIds: [],
    };
  },
  async created() {
    if(this.$route.query.name){
      this.searchQuery.name = this.$route.query.name
    }
    await this.fetchTableData();
  },
  methods: {
    // 查询列表
    fetchTableData() {
      this.tableLoading = true;
      return baseInfoRatePage(this.searchQuery)
        .then((res) => {
          this.searchQuery.total = parseInt(res.total); // 总条数
          this.tableData = res.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    onChange() {
      this.fetchTableData();
    },
    download() {
      // TODO 勾选下载
      this.searchQuery.inIds = this.selectIds

      this.$store.commit("SHOW_EXPORTING");
      exportBaseInfoRate(this.searchQuery)
        .then((blob) => {
          console.info(blob)
          let fileName = `客户信息完善率${formatDate(
            new Date().getTime(),
            "Y-M-D h:m"
          )}`;
          FileSaver.saveAs(blob, fileName + ".xlsx");
        })
        .finally(() => {
          this.$store.commit("SHOW_EXPORTING", false);
        });
    },
    reflush() {
      this.$confirm(this.selectIds && this.selectIds.length > 0 ? "您确定更新选中行客户信息吗？" : "您确定更新所有客户信息吗？", {
        type: "warning",
      })
        .then(() => {
          reflushBaseInfoRatePage(this.selectIds).then(res=>{
            this.$message.success("数据正在更新，请稍候回来查看");
            this.fetchTableData();
          })
        })
        .catch(() => { });
    }, 
    // A类客户名单维护
    onBigCustomerList() {
      this.isShowCustomerDialog = true
    },
    // 保存提交
    submit() {
      console.log(this.saveForm);
      if (this.saveForm.id) {
        this.update();
      } else {
        this.save();
      }
    },
    closeDialog() {

    },
    deleteItem() {

    },
    sortChange({ column, prop, order }) {
      console.log(column, prop, order)
      if (prop === 'totalPerfectionRate') { // 完整信息完善率
        if (order === 'ascending') { // 升序
          this.searchQuery.sortName = prop
          this.searchQuery.sortType = 'asc'
        } else if (order === 'descending') { // 降序
          this.searchQuery.sortName = prop
          this.searchQuery.sortType = 'desc'
        }else{
          this.searchQuery.sortName = ''
          this.searchQuery.sortType = ''
        }
        this.searchQuery.pageIndex = 1
        this.fetchTableData()
      }
    },
    handleSelectionChange(val) {
      this.selectIds = val.map(item => item.id)
      console.info(this.selectIds)
    },
    //修改客户信息
    onUserInfo(row, isLook = false) {
      this.$router.push({
        name: 'maintainingEditUser',
        query: {
          id: row.id,
          isLook: isLook,
          checkedStatus: row.checkedStatus,
          enterpriseType: row.enterpriseType
        }
      })
    },
  }
}
</script>

