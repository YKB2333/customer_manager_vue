<template>
  <el-form
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    label-width="120px"
    inline
    ref="curForm"
    :model="curForm"
    :rules="rules"
  >
    <el-form-item label="选择组织" prop="zzcodeObj">
      <el-select
        v-model="curForm.zzcodeObj"
        @change="changeOrgs"
        placeholder="请选择"
        filterable
        value-key="code"
      >
        <el-option v-for="item in ncOrgs" :key="item.code" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择部门" prop="bmcodes">
      <el-cascader
        ref="cascaderDepartment"
        :props="defaultParams"
        :options="departments"
        v-model="curForm.bmcodes"
        @change="changeCascader"
        :disabled="departments == null || departments.length <= 0"
      ></el-cascader>
    </el-form-item>
  </el-form>
</template>

<script>
import { getNcOrgs, getNcOrgsDepartment } from "@/api/client";
import { department as departmentValidator } from "@/utils/validator";

export default {
  props: ["saveForm"],
  watch: {
    saveForm: {
      handler: function(newObj, oldObj) {
        console.log("watch");
        this.curForm = newObj;
      },
      deep: true
      // immediate: true
    }
  },
  data() {
    return {
      curForm: {
        bmcodes: []
      },
      defaultParams: {
        checkStrictly: true,
        label: "bmname",
        value: "bmcode",
        children: "childrenList"
      },
      ncOrgs: [],
      departments: [],
      allDepartments: [],
      currNcOrg: null,

      rules: {
        zzcodeObj: [
          { required: true, message: "请选择组织", trigger: "change" }
        ],
        bmcodes: [
          {
            type: "array",
            required: true,
            message: "请选择部门",
            trigger: "change"
          },
          {
            validator: departmentValidator,
            message: "请选择部门",
            trigger: "change"
          }
        ]
      },
      loading: true
    };
  },
  async created() {
    console.log(666);
    this.init();
  },
  methods: {
    async init() {
      getNcOrgs().then(res => {
        console.log(res);
        this.ncOrgs = res;
      });
      this.getDepart();
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
        this.loading = false;
      });
    },
    changeOrgs(item) {
      this.currNcOrg = item;
      this.curForm.bmcodes = [];

      if (this.currNcOrg) {
        this.curForm.zzcode = this.currNcOrg.code;
        this.curForm.zzname = this.currNcOrg.name;
        this.departments = this.departmentParser(this.currNcOrg.code);
      } else {
        this.curForm = {};
        this.departments = [];
      }

      console.info("组织部门=>", this.departments);
      this.validatorEvent();
    },
    changeCascader() {
      console.log("changeCascader", this.curForm);
      this.validatorEvent();
    },
    validatorEvent() {
      this.$refs["curForm"].validate(valid => {
        if (valid) {
          let checkedNodes = this.$refs[
            "cascaderDepartment"
          ].getCheckedNodes()[0].pathNodes;
          let fullBmcode = "";
          let fullBmname = "";
          for (let i in checkedNodes) {
            let node = checkedNodes[i];
            if (i > 0) {
              fullBmcode = fullBmcode + '-' +node.value;
              fullBmname = fullBmname + '-' +node.label;
            }else {
              fullBmcode = node.value;
              fullBmname = node.label;
            }
            if (i == checkedNodes.length - 1) {
              this.curForm.bmcode = node.value;
              this.curForm.bmname = node.label;
            }
          }
          this.curForm.fullBmcode = fullBmcode;
          this.curForm.fullBmname = fullBmname;
          console.log(this.curForm);
        }
        this.$emit("onChangeCas", { saveForm: this.curForm, valid });
      });
    },
    departmentParser(zzcode) {
      //获取一级部门
      let oneLevel = this.allDepartments.filter(
        depart =>
          depart.bmcode != null &&
          depart.sjbm == null &&
          depart.zzcode == zzcode
      );
      for (let i in oneLevel) {
        this.departmentHandler(oneLevel[i]);
      }
      return oneLevel;
    },
    departmentHandler(sjbm) {
      let twoLevel = this.allDepartments.filter(
        depart =>
          depart.bmcode != null &&
          depart.sjcode == sjbm.bmcode &&
          depart.zzcode == this.currNcOrg.code
      );
      if (twoLevel != null && twoLevel.length > 0) {
        sjbm["childrenList"] = twoLevel;
        for (let i in twoLevel) {
          this.departmentHandler(twoLevel[i]);
        }
      }
    }
  }
};
</script>

<style>
</style>
