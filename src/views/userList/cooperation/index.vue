<template>
  <div class="shop-page">
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div v-if="tableData.length > 0" class="shopClass">
        <el-table
          :data="tableData"
          border
          stripe
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column prop="ncCode" label="客户编码"></el-table-column>
          <el-table-column
            width="400"
            :show-overflow-tooltip="true"
            prop="name"
            label="客户名称"
          >
            <template slot-scope="scope">
              {{ scope.row.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="dataSourceName" label="客户来源" ></el-table-column>
          <el-table-column  label="企业性质" >
            <template slot-scope="scope">
              <span v-if="scope.row.enterpriseType == '0'">企业</span>
              <span v-else-if="scope.row.enterpriseType == '1'">个人</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="合作商品数" ></el-table-column>

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button
                v-permission-button="'viewCoopGoods'"
                :disabled="isDisabled"
                type="text"
                @click="viewGoods(scope.row)"
                >查看商品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <span >暂无数据</span>
      </div>
    </my-table>

    <el-dialog title="客户商品" :visible="showDialog" width="70%" :close-on-click-modal="false" @close="close" custom-class="dialogBody" destroy-on-close>
      <coop-goods ref="coop-goods" :customerId="customerId" ></coop-goods>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialog = false">返回列表</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {baseInfoPage} from '@/api/coopGoods'
import coopGoods from './coopGoods'


export default {
  name: 'cooperation',
  components: {coopGoods},
  data() {
    return {
      showDialog: false,
      customerId: 0,

      isDisabled: false,
      tableData: [],
      tableLoading: false,
      searchForm: [
        {
          key: 'ncCode',
          label: '客户编码',
          placeholder: '客户编码',
          type: 'input',
          clearable:true
        },
        {
          key: 'name',
          label: '客户名称',
          placeholder: '客户名称',
          type: 'input',
          clearable:true
        },
      ],
      searchQuery: {
        name: '',
        ncCode: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
    }
  },
  mounted() {
    this.fetchTableData()
  },
  methods: {
    //获取列表数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        console.log(this.searchQuery,'searchQuery')
        baseInfoPage(this.searchQuery).then((res) => {
          let list = res.records
          this.searchQuery.total = res.total // 总条数
          this.tableData = list;
        })
      } catch (error) {
      } finally {
        this.tableLoading = false
      }
    },
    onChange() {
      this.fetchTableData()
    },
    viewGoods(row) {
      this.showDialog = true;
      this.customerId = row.id;
      // coop-goods
      setTimeout(() => {
        this.$refs['coop-goods'].getData();
      }, 10);
    },


    // #region 模态框相关
    close() {
      this.fetchTableData();
      this.showDialog = false;
    }
    // #endregion
  },
}
</script>

<style lang="scss" scoped>
/deep/ .dialogBody{
  & > .el-dialog__body {
    padding-top: 8px;
    padding-bottom: 0;
  }
  
}
</style>
