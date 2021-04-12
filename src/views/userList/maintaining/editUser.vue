

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="客户信息" lazy>
        <base-info :user-id="userId" :is-look="isLook" :business-list="businessList"></base-info>
      </el-tab-pane>
      <el-tab-pane label="客户联系人信息" :disabled="checkedStatus == '2' && !isLook" lazy>
        <contact-info :user-id="userId" :is-look="isLook"></contact-info>
      </el-tab-pane>
      <!-- v-permission-button="'viewDetails'" -->
      <!-- <el-tab-pane label="内部联系人信息" :disabled="checkedStatus == '2' && !isLook" lazy>
        <inner-info :user-id="userId" :is-look="isLook" :business-list="businessList"></inner-info>
      </el-tab-pane>-->
      <el-tab-pane label="合作信息" :disabled="checkedStatus == '2' && !isLook" lazy>
        <coop-info :user-id="userId" :is-look="isLook" :business-list="businessList"></coop-info>
      </el-tab-pane>
      <div class="diasbled-mask" @click="hint" v-if="isShowMask"></div>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from './info-page/base-info'
import ContactInfo from './info-page/contact-info'
import InnerInfo from './info-page/inner-info'
import CoopInfo from './info-page/coop-info'
import { listBusiness } from '@/api/business'
import { getEcologyUserByMobile } from '@/api/client'

export default {
  name: 'maintainingEditUser',
  components: {
    BaseInfo,
    ContactInfo,
    InnerInfo,
    CoopInfo,
  },
  data() {
    return {
      checkedStatus: '',
      userId: '',
      businessList: [],
      isLook: true,
      isShowMask: false,
    }
  },
  created() {
    this.checkedStatus = this.$route.query.checkedStatus
    this.userId = this.$route.query.id.toString()
    this.isLook = JSON.parse(this.$route.query.isLook)
    listBusiness().then((res) => {
      this.businessList = res || []
    })
    getEcologyUserByMobile(this.$store.getters.userInfo.mobile)
      .then((res) => {
        this.isShowMask = false
        // this.baseinfo.coopInfoSaveAndUpdateVos[0].deptId = res.departmentid
        // this.baseinfo.coopInfoSaveAndUpdateVos[0].deptName = res.departmentname
      })
      .catch((error) => {
        console.error('getEcologyUserByMobile', error)
        this.isShowMask = true
      })
  },
  methods: {
    hint() {
      this.$message.warning('不能编辑内容,请联系系统管理员')
    },
  },
}
</script>

<style lang='scss' scoped>
.diasbled-mask {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: rgb(214, 210, 210);
}
</style>

