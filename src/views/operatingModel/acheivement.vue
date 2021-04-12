<template>
  <div>
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button type="primary" @click="add" v-permission-button="'add'">新增</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="type" label="目标类型"></el-table-column>
        <el-table-column prop="date" label="目标日期"></el-table-column>
        <el-table-column label="业绩目标">
          <template slot-scope="scope">{{ scope.row.target | toThousandFilter}}万元</template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          sortable
          :formatter="(row)=>$formatDate(row.updateTimestamp, 'Y/M/D h:m:s')"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-permission-button="'delete'" type="text" @click="remove(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="saveForm.id?'编辑':'添加'"
      width="800px"
      max-height
      @close="closeDialogForm"
    >
      <el-form :model="saveForm" :rules="saveRules" ref="saveForm" label-width="120px" inline>
        <el-form-item label="业绩类型" prop="type">
          <el-select v-model="saveForm.type" filterable placeholder="请选择业绩类型">
            <el-option
              v-for="(item, index) in achievementType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业绩目标" prop="target">
          <el-input-number :precision="2" :min="0" v-model="saveForm.target" placeholder="业绩目标">
            <span slot="suffix">万元</span>
          </el-input-number>
        </el-form-item>
        <el-form-item label="目标日期" prop="date">
          <el-date-picker
            v-model="saveForm.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="display: block; text-align: left; padding-left: 80px">
          <el-button type="primary" :loading="saveLoading" @click="submitForm()">保存</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
  </div>
</template>

<script>
import {
  saveAchievement,
  pageAchievement,
  removeAchievement
} from "@/api/operatingModel";
import { type as achievementType } from "@/const/achievement";

export default {
  name: "Achievement",
  components: {},
  data() {
    return {
      searchForm: [
        {
          key: "date",
          placeholder: "目标日期",
          format: "yyyy-MM",
          valueFormat: "yyyy-MM",
          type: "date_picker",
          pickerType: "month"
        },
        {
          key: "type",
          placeholder: "目标类型",
          options: achievementType.properties,
          clearable: true,
          type: "select"
        }
      ],
      tableLoading: false,
      searchQuery: {
        type: "",
        date: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      tableData: [], // 表格数据
      saveForm: {
        id: null,
        type: null,
        date: null,
        target: null
      },
      saveRules: {
        type: [{ required: true, message: "请选择目标类型", trigger: "blur" }],
        target: [
          { required: true, message: "请输入目标业绩", trigger: "blur" }
        ],
        date: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      dialogVisible: false,
      saveLoading: false
    };
  },
  async created() {
    this.fetchTableData();
  },
  computed: {
    achievementType() {
      return achievementType.properties;
    }
  },
  methods: {
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      return pageAchievement(this.searchQuery)
        .then(res => {
          this.searchQuery.total = res.total; // 总条数
          this.tableData = res.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    showDialogForm() {
      this.dialogVisible = true;
    },
    closeDialogForm() {
      this.dialogVisible = false;
      this.resetForm();
    },
    add() {
      this.showDialogForm();
    },
    edit(row) {
      this.saveForm = row;
      this.showDialogForm();
    },
    remove(row) {
      this.$confirm("是否确认删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeAchievement(row.id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fetchTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm() {
      this.$refs.saveForm.validate(valid => {
        if (!valid) return;
        this.saveLoading = true;
        saveAchievement(this.saveForm)
          .then(res => {
            this.closeDialogForm();
            this.fetchTableData();
          })
          .finally(() => {
            this.saveLoading = false;
          });
      });
    },
    resetForm() {
      this.saveForm = {
        id: null,
        type: null,
        date: null,
        target: null
      };
    }
  }
};
</script>
