<template>
  <div :class="active==1?'newfrom newfromHeight':'newfrom'">
    <el-steps :active="active" style="margin-left:50px;margin-right:50px">
      <el-step title="基本信息" @click.native="active = 1"></el-step>
      <el-step title="运营信息" @click.native="active = 2"></el-step>
      <el-step title="发货信息" @click.native="active = 3"></el-step>
      <el-step title="经营品牌" @click.native="active = 4"></el-step>
    </el-steps>

    <step-1 v-show="active==1" v-model="shopInfo" ref="step1" :disabled="disabled"></step-1>
    <step-2 v-show="active==2" v-model="shopInfo" ref="step2" :disabled="disabled"></step-2>
    <step-3
      v-show="active==3"
      v-model="shopInfo.shopDeliverInfo"
      ref="step3"
      :type="shopInfo.type"
      :disabled="disabled"
    ></step-3>

    <div v-show="active==4">
      <div>
        <el-form
          :model="shopInfo"
          :disabled="disabled"
          ref="ruleForm3"
          label-width="200px"
          class="newform2"
        >
          <el-form-item label="品牌名称" props="name">
            <el-input v-model="brandName" placeholder="输入品牌名称"></el-input>

            <el-button type="primary" @click="searchShopInfoBrand" style="margin-left:10px">查询</el-button>
            <el-button
              type="danger"
              style="margin-left:10px"
              @click="
              brandChoiceSearchQuery.name = ''
              reset()
            "
            >重置</el-button>
            <el-button @click="choiceBrand" type="primary" style="margin-left:10px">添加经营品牌</el-button>
          </el-form-item>
        </el-form>

        <el-table
          class="mt10 brandTable"
          :max-height="400"
          :data="brandArr.length === 0 ? shopInfo.brands : brandArr"
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="品牌名称"></el-table-column>
          <el-table-column label="品牌图标">
            <template slot-scope="scope">
              <el-image
                style="width: 60px"
                :src="scope.row.icon || require('@/assets/images/logo.png')"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button :disabled="disabled" @click="delBrand(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="titleDiv">
      <el-button @click="cancelSubmit" type="info" style="margin-right:30px">返回列表</el-button>
      <el-button @click="active--" style="margin-right:30px" v-if="active != 1 ">上一步</el-button>
      <el-button @click="active++" v-if="active != 4 " style="margin-right:30px">下一步</el-button>
      <el-button :disabled="disabled" type="primary" @click="submitSave">保 存</el-button>
    </div>

    <!-- 添加品牌弹窗 -->
    <el-dialog
      :title="'选择品牌'"
      :visible.sync="isChoiceBrand"
      width="700px"
      :before-close="brandClose"
    >
      <el-form ref="form" :model="brandChoiceSearchQuery" label-width="80px" inline>
        <el-form-item label="品牌名称" props="name">
          <el-input v-model="brandChoiceSearchQuery.name" placeholder="输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBrand">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="
              brandChoiceSearchQuery.name = ''
              searchBrand()
            "
          >重置</el-button>
        </el-form-item>
      </el-form>

      <div style="height:500px">
        <el-table
          class="mt10 brandTable2"
          @selection-change="handleSelectionChange"
          :data="brands"
          ref="multipleTable"
          row-key="id"
          height="500px"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="品牌名称"></el-table-column>
          <el-table-column label="品牌图标">
            <template slot-scope="scope">
              <el-image
                style="width: 60px"
                :src="scope.row.icon || require('@/assets/images/logo.png')"
              ></el-image>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click="addBrands">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllEcologyUsers,
  getJobTitleById,
  getAllCompanyInfo,
} from '@/api/client'
import {
  getCustomersPages,
  getBrandPages,
  saveShopInfo,
  updateShopInfo,
  getAllOnlineNames,
  getShopDetail,
} from '@/api/shop'
import { uploadShopAtta } from '@/api/uploadOss'
import shopUpload from '@/components/shopUpload'
import { baseURL } from '@/config'
import { operateType } from '@/const/goods'
import Step1 from './components/step1'
import Step2 from './components/step2.vue'
import Step3 from './components/step3.vue'
export default {
  name: 'ShopDetail',
  components: { shopUpload, Step1, Step2, Step3 },
  data() {
    return {
      active: 1,
      brandArr: [],
      brandName: '',
      brandsSelections: [], //添加品牌命中
      brands: [], //品牌选择数据源
      isChoiceBrand: false, //是否显示选择品牌弹窗
      // isShowShopType: false, //是否显示店铺类型

      showPlatform: false, //是否显示线上平台选择项
      customer: { id: null, name: null },
      brandChoiceSearchQuery: {
        pageIndex: 1,
        pageSize: 9999999,
        orderStr: 'id desc',
        name: '',
      },
      brandChoiceSearchForm: [
        {
          key: 'name',
          label: '品牌名称:',
          placeholder: '品牌名称',
          type: 'input',
        },
      ],

      logos: [],
      operateType: operateType, //运营类型
      baseURL: baseURL,
      shopInfo: {
        area: '',
        baseInfoId: '',
        brands: [],
        name: '',
        code: '',
        customerName: '',
        type: '',
        openReason: '',
        onLineName: '',
        shopNatrue: '',
        shopAddress: '',
        website: '',
        logos: [],
        isEnable: true,
        operateType: '',
        operateTeam: '',
        teamLeader: '',
        industryCategory: [],
        type: '',
        deptIds: '',
        shopAttas: [],
        clockInDistance: 500,
        isShowOs: false,
        sortNum: '',
        district: '',
        generalSituatuion: '',
        hasAscription: false,
        saleCompanyId: null,
        saleDepartmentId: null,
        contractCompanyId: null,
        shopBizBelongInfos: [],
      },
      newshopInfo: {
        brands: [],
        shopAttas: [],
        isShowOs: false,
        isEnable: true,
        clockInDistance: 500,
        type: '',
        shopAddress: '',
        customerName: '',
      },
      states: [], // 负责人信息,名字列表
      teamLeaderList: [
        {
          deptId: '', //所属部门id
          deptName: '', //所属部门
          email: '', //邮箱
          fullName: '', //姓名
          tel: '', //电话
          jobTitleId: '',
          jobTitle: '',
        },
      ],
      pageType: '',
      customerId: '',
      customerName: '',
      searchQueryInfo: {},
      showMap: false,
      mapSrc:
        'https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp',
      maplocation: {},
    }
  },
  computed: {
    disabled() {
      return this.pageType === 'view'
    },
    title() {
      const titleMap = {
        add: '店铺新增',
        edit: '店铺修改',
        view: '查看店铺',
      }
      return titleMap[this.pageType] || '店铺新增'
    },
  },
  created() {
    console.log('create')
    this.pageType = this.$route.query.type
    if (this.$route.query.shopInfoId) {
      this.getShopInfo()
    }
    if (this.pageType === 'edit') {
      this.$eventHub.$on(this.$eventName.SHOP_DETAIL_REFRESH, (id) => {
        this.getShopInfo(id)
      })
    }
  },

  mounted() {},
  beforeDestroy() {
    this.$eventHub.$off(this.$eventName.SHOP_DETAIL_REFRESH)
  },
  methods: {
    getShopInfo(id = '') {
      getShopDetail(id || this.$route.query.shopInfoId)
        .then((res) => {
          if (res.logo) {
            res.logos = [res.logo]
            this.logos.push(res.logo)
          }
          res.salesOrg =
            res.saleCompanyId && res.saleDepartmentId
              ? [res.saleCompanyId, res.saleDepartmentId]
              : []
          res.hasAscription =
            Array.isArray(res.shopBizBelongInfos) &&
            res.shopBizBelongInfos.length > 0
          this.shopInfo = res
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    searchBrand() {
      this.getBrands()
    },
    // 弹出选择品牌窗口
    choiceBrand() {
      this.getBrands()
    },
    addBrands() {
      this.shopInfo.brands = this.brandsSelections
      this.isChoiceBrand = false
      this.brandName = ''
    },
    // 获取可关联的品牌
    getBrands() {
      getBrandPages(this.brandChoiceSearchQuery).then((res) => {
        this.brands = res.list
        this.isChoiceBrand = true
        if (this.pageType === 'edit') {
          if (this.shopInfo.brands.length > 0) {
            let ids = this.shopInfo.brands.map((b) => {
              return b.id
            })
            this.$nextTick(() => {
              this.brands.forEach((row) => {
                if (ids.includes(row.id)) {
                  this.$refs.multipleTable.toggleRowSelection(row, true)
                }
              })
            })
          }
        }
      })
    },
    //搜索已添加的品牌
    searchShopInfoBrand() {
      let brandArr = this.shopInfo.brands.filter((b) => {
        return b.name == this.brandName
      })
      this.brandArr = brandArr
      if (this.brandArr.length === 0) {
        this.$message.warning('查询的品牌不存在')
      }
    },

    brandClose() {
      this.brandChoiceSearchQuery = {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0, // 总条数
      }
      this.isChoiceBrand = false
    },
    //shopInfo的品牌列表搜索
    onChangebrandChoice() {
      this.getBrands()
    },
    //shopInfo的品牌列表重置
    reset() {
      this.brandName = ''
      this.brandArr = []
    },
    //shopInfo的品牌列表删除
    delBrand(brand) {
      this.$confirm('您确定要删除已关联的品牌信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let p = this.shopInfo.brands.filter((b, index) => {
          return b.id === brand.id
        })
        if (p.length) {
          let index = this.shopInfo.brands.indexOf(p[0])
          this.shopInfo.brands.splice(index, 1)
        }
        this.brandArr = []
        this.$message.success('删除成功')
      })
    },
    handleSelectionChange(selection) {
      this.brandsSelections = selection
    },
    //提交
    submitSave() {
      if (this.shopInfo.type === '店铺') {
        this.shopInfo.onLineName = null
      }
      Promise.all([
        this.$refs.step1.validaForm(),
        this.$refs.step2.validaForm(),
        this.$refs.step3.validaForm(),
      ])
        .then(() => {
          //保存
          if (this.pageType === 'edit') {
            this.update()
            return
          }
          this.save()
          //修改
        })
        .catch(() => {
          this.$message.error('保存失败，请复核店铺信息是否有误，谢谢！')
        })
    },
    update() {
      this.$store.commit('SHOW_LOADING', '店铺信息修改中')
      updateShopInfo(this.shopInfo)
        .then((res) => {
          this.$store.commit('SHOW_LOADING', false)
          this.$message.success('修改成功')
          this.$eventHub.$emit(this.$eventName.SHOP_LIST_REFRESH, true)
          this.$router.push({ name: 'Shop' })
        })
        .catch((e) => {
          this.$store.commit('SHOW_LOADING', false)
          this.$message.error('保存失败')
        })
    },
    save() {
      console.log(this.shopInfo)
      this.$store.commit('SHOW_LOADING', '店铺信息保存中')
      saveShopInfo(this.shopInfo)
        .then((res) => {
          this.$store.commit('SHOW_LOADING', false)
          this.$message.success('保存成功')
          this.$eventHub.$emit(this.$eventName.SHOP_LIST_REFRESH, true)
          this.$router.push({ name: 'Shop' })
        })
        .catch((e) => {
          this.$store.commit('SHOW_LOADING', false)
          this.$message.error('保存失败')
        })
    },
    cancelSubmit() {
      this.$router.push({ name: 'Shop' })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
  width: 300px;
}
/deep/ .el-input {
  width: 300px;
}
/deep/ .el-input.el-input--mini.el-pagination__editor.is-in-pagination {
  width: 50px;
}
.must:before {
  content: '* ';
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}

.max-width {
  max-width: 80%;
}
.newfrom {
  background-color: white;
  padding-top: 20px;
  border-radius: 10px;
  // text-align: center;
  width: 800px;
  // height: 800px;
  padding-bottom: 10px;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.newfromHeight {
  height: 100%;
}
/deep/ .newform2 {
  width: 100%;
  //margin-left: 50px;
  margin-top: 30px;
}
.stepOneLeft {
  margin-left: 50px;
}
.top {
  margin-top: 100px;
  margin-left: 50px;
  margin-bottom: 50px;
}
.titleDiv {
  text-align: center;
  //   width:800px;
  //     margin:0 auto;
  //     left:0;
  //     right:0;
}
.spnIn {
  color: #66b1ff;
}

.spnOut {
  color: #c0c4cc;
}
.brandTable {
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 30px;
  border: 1px solid #c0c4cc;
  border-radius: 10px;
  width: 780px;
}
.brandTable2 {
  // margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #c0c4cc;
  border-radius: 10px;
}
/deep/ .el-dialog.mapDialog {
  height: 95%;
}
/deep/ .el-dialog__body {
  height: 90%;
  margin-bottom: 10px;
}
</style>
<style lang="scss"></style>
