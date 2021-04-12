<template>
  <span>
    <el-button type="primary" @click="showDialog" >添加客户</el-button>
    <el-dialog
      :title="'选择客户'"
      :visible.sync="isChoiceCustomer"
      custom-class="compact"
      width="70%"
      :before-close="customerClose"
    >
      <my-table
        v-model="customerSearchQuery"
        :searchForm="customerSearchForm"
        @change="onChangeCustomer"
      >
        <el-table ref="t" class="mt10" max-height="400px" :data="customers" align="center"  @selection-change="selectChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="NC客户编码" prop="ncCode"></el-table-column>
          <el-table-column prop="name" label="客户名称"> </el-table-column>
          <el-table-column prop="channelType" label="渠道类型"> </el-table-column>
          <el-table-column align="center" label="企业性质行业">
            <template slot-scope="scope">
              <span v-if="scope.row.enterpriseType === '0'">企业</span>
              <span v-else>个人</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === '0'">外部单位</span>
              <span v-else>内部单位</span>
            </template>
          </el-table-column>
        </el-table>
       
      </my-table>
      <span slot="footer"> 
        <el-button @click="customerClose" >取消</el-button>
        <el-button type="primary" @click="addCustomer">确定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>

// getCustomersPages 
import {   selectPage as getCustomersPages, findAll } from '@/api/client'
import { addCust } from '@/api/activity'
import { listBusiness } from '@/api/business'
export default {
  name: 'addCustomer',
  props: {
    activityId: null
  },
  created() {
    listBusiness().then((res) => {
      if (!Array.isArray(res)) {
        return;
      }
      let arr =  res.map((entity) => ({label: entity.name, value:  entity.id}) );
      this.customerSearchForm.find(item => item.key == 'businessId').options = [{ label: '全部', value: null }].concat(arr)
    });
    findAll().then((res) => {
      if (!Array.isArray(res)) {
        return;
      }
      let arr = res.map(v => ({value: v.name, label: v.name }));
      this.customerSearchForm.find(item => item.key == 'channelType').options = [{ label: '全部', value: null }].concat(arr)
    })
  },
  data() {
    return {
      isChoiceCustomer: false,
      customers: [],
      customerSearchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: '',
        total: 0 // 总条数
      },
      selectList: [],
      customerSearchForm: [
        {
          key: 'ncCode',
          label: 'NC客户编码:',
          placeholder: '请输入内容',
          type: 'input'
        },
        {
          key: 'name',
          label: '客户名称:',
          placeholder: '客户名称',
          type: 'input'
        },
        {
          key: 'channelType',
          label: '客户渠道类型',
          placeholder: '客户渠道类型',
          options: [{ label: '全部', value: null }],
          type: 'select',
          clearable:true
        },
        {
          key: 'businessId',
          label: '业务板块',
          placeholder: '业务板块',
          options: [{ label: '全部', value: null }],
          type: 'select',
          clearable:true
        },
      ]
    }
  },
  methods: {
    // #region 模态框
    showDialog() { // 打开
      this.isChoiceCustomer = true;
      this.onChangeCustomer();
    },
    customerClose() { // 关闭弹窗
      this.isChoiceCustomer = false
      this.customerSearchQuery = {
        pageIndex: 1,
        pageSize: 10,
        orderStr: '',
        total: 0 // 总条数
      }
    },
    addCustomer() { // 确认操作
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error('未选中客户');
        return;
      }
      let pam = {
        activityId: this.activityId,
        baseInfoId: this.selectList.map(v => v.id)
      }
      addCust(pam)
        .then(res => {
          this.$message.success('添加活动客户成功');
          this.$emit('afterSuccess', res);
          this.customerClose();
        })
    },
    // #endregion
    // #region 获取数据与选中
    onChangeCustomer() {
      this.selectList = [];
      getCustomersPages(this.customerSearchQuery).then((res) => {
        this.isChoiceCustomer = true
        this.customers = res && res.records || [];
        this.customerSearchQuery.total = res.total || 0;
        let arr = JSON.parse(JSON.stringify(this.selectList)) 
        this.reSelect(arr)
      })
    },
    selectChange(e) {
      let arr = this.selectList.filter(v => !this.customers.some(item => item.id === v.id));
      this.selectList = arr.concat(e)
    },
    reSelect(selectTempList){
      this.$nextTick(()=> {
        this.customers.forEach(i=> {
            selectTempList.forEach(v => {
                if(v.id===i.id){
                  this.$refs['t'].toggleRowSelection(i);
                }
            });
          })
      });
    },
    // #endregion

  }


}
</script>

<style lang="scss" scoped>
/deep/ .compact{
  & > .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
}
</style>