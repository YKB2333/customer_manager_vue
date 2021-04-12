<template>
  <div class="main">
    <div class="wapper pb30">
      <el-steps  :active="currentStep" finish-status="success" >
        <el-step title=" 活动内容" @click.native="stepClick(0)"></el-step>
        <el-step title=" 参与客户"  @click.native="stepClick(1)"></el-step>
        <el-step title=" 活动商品" @click.native="stepClick(2)"></el-step>
      </el-steps>
    </div>

    <!-- 步骤一 -->
    <step1  v-if="currentStep === 0" @goToList="goToList" :activityId="activityId" @after-save="afterSave" ></step1>
    <!-- 步骤二 -->
    <step2 v-if="currentStep === 1" :activityId="activityId" @pre="pre" @after-save="next" ></step2>
    <!-- 步骤三 -->
    <step3 v-if="currentStep === 2" :activityId="activityId" @pre="pre" @after-save="next" ></step3>

    <div v-if="currentStep === 3" >
      <div class="success" >
        <span style="font-size: 70px;color: #03bf16">
          <i class="el-icon-success"></i>
        </span>
        <span style=" font-size: 24px; margin-left: 10px; font-weight: 550;">
          {{ $route.query && $route.query.id ? '修改' : '创建' }}成功!
        </span>
      </div>
    </div>
    <div class="opt" v-if="currentStep !== 0" >
      <el-button size="medium" @click="goToList"  >返回列表</el-button>
      <el-button size="medium" @click="pre" v-if="currentStep!== 3">上一步</el-button>
      <el-button size="medium" type="primary" @click="next"  v-if="currentStep!== 3">{{ currentStep === 2 ? '保存' : '下一步' }}</el-button>
    </div>
  </div>
</template>

<script>
import step1 from '@/views/operatingModel/activity/step1'
import step2 from '@/views/operatingModel/activity/step2'
import step3 from '@/views/operatingModel/activity/step3'

export default {
  components: { step1, step2, step3 },
  name: 'addActivity',
  data() {
    return {
      currentStep: 0,
      activityId: null
    }
  },
  created() {
    this.activityId = this.$route.query && this.$route.query.id || null;
  },
  methods: {
    stepClick(e) {
      console.log(e);
      if (!this.activityId) {
        return ;
      }
      this.currentStep = e;
    },
    afterSave(activity) {
      this.activityId = activity.id;
      this.next();
    },
    next() { 
      this.currentStep++;
    },
    pre() {
      this.currentStep--;
    },
    goToList() {
      this.reset();
      this.$router.push('/activity')
    },
    reset() {
      this.currentStep = 0;
      this.activityId = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding-top: 30px;
  padding: 10px;
  width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  .wapper {
    width: 80%;
    min-width: 600px;
    margin: 0 auto;
  }
}
.success {
  margin-top: 100px;
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
}

.opt {
  width: 600px;
  margin: 0 auto;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 50px;
}
</style>