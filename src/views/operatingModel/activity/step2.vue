<template>
  <div>
    <div style="width: 90%;margin:0 auto">
      <div class="mb10">
        <!-- <el-button type="primary"  >添加客户</el-button> -->
        <add-customer class="mlr10" :activityId="activityId" @afterSuccess="getData" ></add-customer>
        <el-button type="danger"  plain @click="batchRemove" >删除</el-button>
        <el-button type="primary"  @click="exportData " :loading="expotLoading" >导出</el-button>
      </div>
    </div>

    <el-table ref="t" :data="tableList" width="100%" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="NC客户编码" prop="ncCode"></el-table-column>
      <el-table-column label="客户名称" prop="name"></el-table-column>
      <el-table-column label="所属行业" prop="industry"></el-table-column>
      <el-table-column label="渠道类型" prop="channelType" ></el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope" >
          <el-button type="text"  @click="remove(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <the-pagination
      :total="searchQuery.total"
      :pageSize="searchQuery.pageSize"
      :pageIndex="searchQuery.pageIndex"
      @onPageSizeChange="onPageSizeChange"
      @onPageIndexChange="onPageIndexChange"
    ></the-pagination>
  </div>
</template>

<script>
import { custPage, delCust, exportCust } from '@/api/activity'
import thePagination from '@/components/Pagination'
import { getMaxNumber, formatDate } from "@/utils";
import FileSaver from 'file-saver'
import AddCustomer from './addCustomer.vue';

export default {
  name: 'step2',
  components: { thePagination, AddCustomer, },
  data() {
    return {
      expotLoading: false,
      tableList: [],
      selectList: [],
      searchQuery: {
        total: 0,
        pageSize: 10,
        pageIndex: 1,
        activityId: null
      }
    }
  },
  props: {
    activityId: {
      type: [Number, String],
      default: 0
    }
  },
  watch: {
    activityId(val) {
      this.searchQuery.activityId = val;
      setTimeout(() => {
        this.getData()
      }, 10);
    }
  },
  mounted() {
    if (this.activityId) {
      this.getData()
    }
  },
  methods: {
    // #region 数据获取
    getData() {
      this.searchQuery.activityId = this.activityId;
      custPage(this.searchQuery)
        .then(res => {
          this.tableList = res && res.records || [];
          this.searchQuery.total = res.total || 0;
          let arr = JSON.parse(JSON.stringify(this.selectList)) 
          this.reSelect(arr)
          // if (res.total > 0 && res.records.length === 0) {
          //   this.searchQuery.pageIndex--;
          //   this.getData()
          // }
        })
    },

    onPageSizeChange(val) {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = val;
      this.getData();
    },
    onPageIndexChange(val) {
      this.searchQuery.pageIndex = val;
      this.getData()
    },
    // #endregion
    // #region 选中
    reSelect(selectTempList){
      this.$nextTick(()=> {
        this.tableList.forEach(i=> {
            selectTempList.forEach(v => {
                if(v.id===i.id){
                  this.$refs['t'].toggleRowSelection(i);
                }
            });
          })
      });
    },
    selectChange(e) {
      let arr = this.selectList.filter(v => !this.tableList.some(item => item.id === v.id));
      this.selectList = arr.concat(e)
    },
    // #endregion
    // #region 操作
    batchRemove() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error('未选中数据');
        return;
      }
      this.$confirm('确认删除已选中客户参与活动吗？', '删除参与客户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let  pam = this.selectList.map(v => v.id);
        delCust(pam)
          .then(res => {
            this.$message.success('删除成功！')
            this.getData();
          })
      })

    },
    remove(customer) { //删除
      // delCust
      this.$confirm('确认删除已选中客户参与活动吗？', '删除参与客户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let  pam = [customer.id];
        delCust(pam)
          .then(res => {
            this.$message.success('删除成功！')
            this.getData();
          })
      })
    },
    exportData() { // 导出功能
      exportCust(this.searchQuery)
        .then(blob => {
          let fileName = `活动客户${formatDate( new Date().getTime(), 'Y-M-D h:m')}`;
          FileSaver.saveAs(blob, fileName + '.xlsx')
          this.$message.success('导出成功!')
        })
    },
    goToList() {
      this.$router.push('/activity')
    },
    next() { // 下一步保存
      this.$emit('after-save', true);
    },
    pre() {
      this.$emit('pre', true)
    }
    // #endregion 
  },
}
</script>

<style ccoped >
.footer {
  text-align: center;
}
</style>