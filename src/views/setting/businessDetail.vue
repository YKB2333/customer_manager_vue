<template>
  <div>
    <div style="padding:20px;background:#fff;">
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" class="mr10" type="primary" @click="add">新建组织</el-button>
          所属业务板块：{{name}}
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="组织">
          <template
            slot-scope="scope"
          >{{ scope.row.fullBmname ? (scope.row.zzname + '-' + scope.row.fullBmname) : '' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-permission-button="'delete'" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      title="新建组织"
      width="600px"
      max-height
      @close="closeDialog"
    >
      <Organization @onChangeCas="onChangeCas" :saveForm="saveForm" />
      <div slot="footer" class="align-center">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import { getList, saveOrganization, deleteOrganization } from "@/api/business";
import { getNcOrgs, getNcOrgsDepartment } from "@/api/client";
import { deepClone } from "@/utils";
import { department as departmentValidator } from "@/utils/validator";
import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
import Organization from "@/components/Organization";
export default {
  name: "businessDetail",
  data() {
    return {
      defaultParams: {
        checkStrictly: true,
        label: "bmname",
        value: "bmcode",
        children: "childrenList"
      },
      id: "",
      name: "",
      saveForm: {},//初始组织数据
      dialogVisible: false,
      tableLoading: false,
      tableData: [], // 表格数据
      valid: false //验证规则状态
    };
  },
  components: {
    Organization
  },
  async created() {
    this.id = this.$route.query.id;
    if (!this.id) {
      this.$message({ message: "所属业务板块为空", type: "warning" });
      return;
    }
    this.name = this.$route.query.name;
    this.init();
  },
  computed: {},
  methods: {
    async init() {
      // getNcOrgs().then(res => {
      //   this.ncOrgs = res;
      // });
      // this.saveForm
      await this.fetchTableData();
      // this.getDepart();
    },
    onChangeCas(data) {
      this.saveForm = data.saveForm;
      this.valid = data.valid;
      // if(data){
      //   console.log(this.$refs["cascaderDepartment"].getCheckedNodes()[0].pathNodes)
      // }
    },
    getDepart() {
      // getOAThreeSub().then(
      //   res=>{
      //     console.log(res);
      //     let data = deepClone(res)
      //     data.forEach(ele => {
      //       ele['_departmentid'] = ele._subcompanyid
      //     });
      //     this.departments = data
      //   }
      // )
      getNcOrgsDepartment().then(res => {
        this.allDepartments = res;
      });
    },
    // 加载表格数据
    add() {
      this.saveForm = {};
      this.dialogVisible = true;
    },
    fetchTableData() {
      this.tableLoading = true;
      return getList({ id: this.id })
        .then(res => {
          this.tableData = res[0].businessOrganizationDtos || [];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    submit() {
      this.saveForm.businessId = this.id;
      if (this.valid) {
        saveOrganization(this.saveForm).then(res => {
          this.dialogVisible = false;
          this.fetchTableData();
          this.$message({ message: "保存成功", type: "success" });
        });
      }
      
    },
    del(id) {
      this.$confirm(`确认删除吗？`)
        .then(_ => {
          deleteOrganization(id).then(res => {
            this.$message({ message: "删除成功", type: "success" });
            this.fetchTableData();
          });
        })
        .catch(_ => {
          this.$message({ message: "操作失败" });
          this.fetchTableData();
        });
    }
  }
};
</script>
