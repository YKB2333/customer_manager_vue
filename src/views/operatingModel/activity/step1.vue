<template>
  <div class="body" >
    <el-form class="main " :model="saveForm" :rules="rules" ref="saveForm" label-width="100px" >
      <el-form-item label="活动标题" prop="title">
        <el-input style="width: 400px" v-model="saveForm.title" placeholder="请输入活动标题"  ></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="handler" >
        <el-select
          style="width:350px"
          v-model="saveForm.handler"
          filterable
          remote
          reserve-keyword
          placeholder="请输入姓名"
          :remote-method="remoteMethod"
          :loading="innerPersonLoading"
            @change="getuser">
          <el-option
            v-for="item in innerPersonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          v-model="saveForm.activityTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标题图片" prop="titleImage">
        <div  >
          <simple-file v-model="saveForm.titleImage" :uploadOss="uploadGoodsImages"></simple-file>
        </div>
      </el-form-item>
      <el-form-item label="活动案例" prop="programme">
        <wangeditor class="my_wangeditor" ref="wangeditor" v-model="saveForm.programme"></wangeditor>
      </el-form-item>
      <el-form-item label="活动目标" prop="objective" >
        <el-input type="textarea"
          style="width: 600px"
          :autosize="{ minRows: 3, }"
          placeholder="请输入内容"
          v-model="saveForm.objective"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="attas" >
                  <!-- :uploadPromise="addAtta" -->
                  <!-- async -->
        <file-list
          v-model="saveForm.attas"
          :uploadOss="uploadOperateOss"
          :removePromise="delAtta"
        ></file-list>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button size="medium" @click="goToList" >返回列表</el-button>
      <el-button size="medium" type="primary" @click="next" :loading="loading"  >下一步</el-button>
    </div>
  </div>
</template>

<script>
import {
  saveActivity,
  getAttaList,
  addAtta,
  deleteAtta,
  getActivityById,
  update
} from "@/api/activity";
import { getAllEcologyUsers} from '@/api/client'
import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
import wangeditor from '@/components/wangeditor'
import { formatDate } from '@/utils'

export default {
  components: {wangeditor},
  name: 'step1',
  created(){
    getAllEcologyUsers().then(res=>{
      this.states = res.map(item => {return { value: item.lastname, label: item.lastname,userlist:item };});
    })
    if (this.activityId) {
      this.getDetail();
    }
  },
  props: {
    activityId: null
  },
  watch: {
    activityId(val) {
      this.searchQuery.activityId = val;
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    uploadOperateOss,
    uploadGoodsImages,
    getDetail() {

      getActivityById(this.activityId)
        .then(res => {
          getAttaList(this.activityId) 
            .then(res => {
              this.saveForm.attas = res;
            });
          this.saveForm = res;
          // formatDate()
          // let arr = [ "2021-01-01 00:00:00", "2021-01-07 00:00:00" ]
          let arr = [ formatDate(res.startTime,'Y-M-D h:m:s'), formatDate(res.endTime,'Y-M-D h:m:s') ]
          this.saveForm.activityTime = arr;
          this.$nextTick(()=>{
            this.$refs.wangeditor.htmlPut()
          })
        })
    },
    // #region 列表
    goToList() {
      this.$emit('goToList', true)
    },
    next() { // 下一步保存
      this.$refs.saveForm.validate(valid => {
        if (!valid) return false;
        this.loading = true;
        if (this.activityId) {
          update(this.saveForm)
            .then(res => {
              this.$emit('after-save', this.saveForm);
            })
            .finally(() => {
              this.loading = false;
            })
        } else {
          saveActivity(this.saveForm)
            .then(res => {
              this.$emit('after-save', res);
            })
            .finally(() => {
              this.loading = false;
            })
        }
      })
    },
    // #endregion
    // #region 附件
    delAtta(atta) { // 删除
      return new Promise((resolve, reject) => {
        deleteAtta(atta.id).then(res => {
          getAttaList(atta.activityId)
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
        });
      });
    },
    addAtta(atta) {
      // this.saveForm.attas.push(atta)
      let arr = this.$lodash.cloneDeep(this.saveForm.attas) || [];
      // arr.push(atta)
      arr = arr.concat(atta)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(arr)
        }, 10);
      });
    },
    // #endregion
    // #region 负责人编辑框
    remoteMethod(query) {
      if (query !== '') {
        this.innerPersonLoading = true;
        setTimeout(() => {
          this.innerPersonLoading = false;
          this.innerPersonOptions = this.states.filter(item => {
            return item.label.indexOf(query) > -1;
          });
        }, 200);
      } else {
        this.innerPersonOptions = [];
      }
    },
    getuser(user){
      let stateslist = null;
      this.states.forEach(item=>{
        if(item.label == user){
          stateslist =item.userlist;
        }
      })
      this.saveForm.workCode = stateslist.workcode
    },
    // #endregion
  },
  data() {
    return {
      loading: false,
      states: [],
      innerPersonLoading: false,
      innerPersonOptions: [],
      saveForm: {
        attas: [] ,
        title: '',
        activityTime:  null,
        titleImage: '',
        content: '',
        handler: '',// 负责人姓名
        workCode: '', // 负责人
        objective: '',
      },
      rules: {
        title: [ {  required: true, message: '请输入活动名称', trigger: 'change'  } ],
        handler: [{  required: true, message: '请输入活动名称', trigger: 'change'  }],
        activityTime: [ {  required: true, message: '请选择活动时间', trigger: 'change'  } ],
        titleImage: [{  required: true, message: '请上传活动图片', trigger: 'change'  }],
      }
    }
  },
  
}
</script>



<style lang="scss" scoped>
.body{
  width: 80%;
  margin: 0 auto;
}
.footer {
  text-align: center;
  padding-bottom: 50px;
}
.my_wangeditor {
  /deep/ .w-e-toolbar {
    & > div {
      z-index: 1999 !important;
    }
  }
  /deep/ .w-e-text-container{
    z-index: 1998 !important;
  }
}
// w-e-text-container
</style>