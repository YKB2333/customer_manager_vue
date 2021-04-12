<template>
  <div>
    <el-form
      :model="shopInfo"
      :disabled="disabled"
      ref="ruleForm"
      label-width="200px"
      :rules="rule"
      class="newform2 stepOneLeft"
    >
      <el-form-item required label="客户名称:" prop="customerName">
        <el-input :disabled="true" v-model="shopInfo.customerName" placeholder="请选择客户名称"></el-input>

        <el-button @click="selectCustomer" style="margin-left:10px">选择客户</el-button>
      </el-form-item>
      <el-form-item required label="店铺类型:" prop="type">
        <el-select :disabled="!!shopInfo.id" v-model="shopInfo.type" placeholder="请选择">
          <el-option
            v-for="item in shopTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="shopInfo.type === '2'" label="平台类型" prop="onLineName">
        <el-select v-model="shopInfo.onLineName">
          <el-option
            v-for="item in onLineNames"
            :key="item.code"
            :value="item.code"
            :label="item.text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="shopInfo.type == 1" label="店铺号:" prop="code">
        <el-input maxlength="20" v-model="shopInfo.code" placeholder="请输入店铺号"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称:" prop="name">
        <el-input maxlength="20" v-model="shopInfo.name" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item :required="shopInfo.type == 1" label="店铺地址:" prop="shopAddress">
        <el-input maxlength="500" v-model="shopInfo.shopAddress" placeholder="请选择店铺地址" disabled></el-input>
        <el-button @click="addressForMap" class="ml10">选择地址</el-button>
      </el-form-item>
      <el-form-item label="店铺网址:" :required="shopInfo.type == 2" prop="website">
        <el-input maxlength="500" v-model="shopInfo.website" placeholder="请输入店铺网址"></el-input>
      </el-form-item>
      <el-form-item label="店铺logo:" prop="logo">
        <shopUpload
          ref="upload"
          :action="`${baseURL}/uploadShopLogo`"
          :type="true"
          :isUrl="shopInfo.logos"
          @onSuccessUpload="onSuccessUpload"
        ></shopUpload>
      </el-form-item>
      <el-form-item label="店铺状态:" prop="isEnable">
        <template>
          <el-radio v-model="shopInfo.isEnable" :label="false">禁用</el-radio>
          <el-radio v-model="shopInfo.isEnable" :label="true">启用</el-radio>
        </template>
      </el-form-item>
      <el-form-item v-if="shopInfo.type == 2" label="店铺性质:" prop="shopNatrue">
        <el-select v-model="shopInfo.shopNatrue">
          <el-option
            v-for="item in shopNatrueList"
            :key="item.label"
            :value="item.value "
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开店原因:" prop="openReason">
        <el-input v-model="shopInfo.openReason" style="width:390px" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <!-- 地图地址选择-->
    <el-dialog
      :title="'地址选择'"
      :visible.sync="showMap"
      width="850px"
      top="2vh"
      custom-class="mapDialog"
    >
      <!-- <div style="margin-bottom:5px;height:100%"> -->
      <iframe id="mapPage" style="width:100%;height:100%" frameborder="0" :src="mapSrc"></iframe>
      <!-- </div>  -->
      <div style="text-align:center">
        <el-button type="primary" @click="getMapLocation" style="margin-right:10px">确 认</el-button>
        <el-button type="danger" @click="showMap=false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'选择客户'"
      :visible.sync="isChoiceCustomer"
      width="70%"
      :before-close="customerClose"
    >
      <my-table
        v-model="customerSearchQuery"
        :searchForm="customerSearchForm"
        @change="onChangeCustomer"
      >
        <el-table class="mt10" :data="customers" align="center">
          <el-table-column align="center" width="50px">
            <template slot-scope="scope">
              <el-radio v-model="customer" :label="scope.row">
                <span></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户名称"></el-table-column>
          <el-table-column align="center" label="客户类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === '0'">外部单位</span>
              <span v-else>内部单位</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业性质行业">
            <template slot-scope="scope">
              <span v-if="scope.row.enterpriseType === '0'">企业</span>
              <span v-else>个人</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="industry" label="所属行业"></el-table-column>
        </el-table>
      </my-table>
      <div style="text-align:center">
        <el-button type="info" @click="customerClose" style="margin-right:20px;margin-top:10px">取消</el-button>
        <el-button type="primary" @click="addCustomer">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllOnlineNames, getCustomersPages } from '@/api/shop'
import { baseURL } from '@/config'
import shopUpload from '@/components/shopUpload'

export default {
  name: 'step1',
  components: { shopUpload },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({
        name: '',
        customerName: '',
        type: '',
        onLineName: '',
        shopNatrue: '',
        shopAddress: '',
        website: '',
        logos: [],
        isEnable: true,
      }),
    },
  },
  data() {
    var shopAddressPass = (rule, value, callback) => {
      if (this.shopInfo.type == 1 && !value) {
        callback(new Error('店铺地址为必填项'))
      }
      callback()
    }

    const websitePass = (rule, value, callback) => {
      if (this.shopInfo.type == 2 && !value) {
        callback(new Error('店铺网址为必填项'))
      }
      callback()
    }
    return {
      shopInfo: {
        name: '',
        customerName: '',
        type: '',
        onLineName: '',
        shopNatrue: '',
        shopAddress: '',
        website: '',
        logos: [],
        isEnable: true,
      },
      shopTypes: [
        { value: '1', label: '线下门店' },
        { value: '2', label: '线上平台' },
      ], //店铺类型
      shopNatrueList: [
        { value: '0', label: '自营店' },
        { value: '1', label: '分销商' },
        { value: '2', label: '3PL服务' },
      ],
      onLineNames: [],
      rule: {
        customerName: [
          { required: true, message: '客户名称为必填项', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '店铺类型为必填项', trigger: 'blur' },
        ],
        onLineName: [
          {
            required: true,
            message: '平台类型为必填项',
            trigger: 'change',
          },
        ],
        name: [
          { required: true, message: '店铺名称为必填项', trigger: 'blur' },
        ],
        shopNatrue: [
          { required: true, message: '店铺性质为必填项', trigger: 'change' },
        ],
        shopAddress: [{ validator: shopAddressPass, trigger: 'blur' }],
        website: [{ validator: websitePass, trigger: 'blur' }],
        isEnable: [
          { required: true, message: '店铺状态为必填项', trigger: 'blur' },
        ],
      },
      // #region 地图
      showMap: false,
      baseMapSrc:
        'https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp',
      mapSrc:
        'https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp',
      maplocation: {},
      // #endregion
      baseURL,
      // #region 选择客户相关
      customer: {},
      customerSearchQuery: {
        name:"",
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0, // 总条数
      },
      customerSearchForm: [
        {
          key: 'name',
          label: '客户名称:',
          placeholder: '客户名称',
          type: 'input',
        },
      ],
      isChoiceCustomer: false,
      customers: [],
      // #endregion
    }
  },
  watch: {
    shopInfo: {
      handler: function (val) {
        this.$emit('input', val)
      },
      deep: true,
    },

    value: {
      handler: function (val) {
        this.shopInfo = val
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.initOnLineNames()

    this.mapResponse()
  },
  methods: {
    initOnLineNames() {
      getAllOnlineNames().then((res) => {
        this.onLineNames = res
      })
    },

    onSuccessUpload(res, file) {
      this.shopInfo.logo = res
      this.shopInfo.logos = [res]
    },

    validaForm() {
      console.log('step1 validaForm')
      if (!this.$refs['ruleForm']) {
        console.error('前端报错了')
        return Promise.reject(false)
      }
      return this.$refs['ruleForm'].validate()
    },

    // #region 地图相关
    addressForMap() {
      this.showMap = true
      this.maplocation = null
      if (this.shopInfo.longitude) {
        let coord =
          'coord=' + this.shopInfo.latitude + ',' + this.shopInfo.longitude
        this.mapSrc = this.baseMapSrc + '&coord=' + coord
      }
    },
    getMapLocation() {
      if (
        !this.maplocation ||
        !this.maplocation.latlng ||
        !this.maplocation.latlng.lng
      ) {
        this.$message({ type: 'warning', message: '请选择地图地址' })
        return
      }
      this.shopInfo.longitude = this.maplocation.latlng.lng
      this.shopInfo.latitude = this.maplocation.latlng.lat
      this.shopInfo.shopAddress = this.maplocation.poiaddress
      this.showMap = false
    },
    mapResponse() {
      window.addEventListener(
        'message',
        (event) => {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data
          if (loc && loc.module == 'locationPicker') {
            //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            this.maplocation = event.data
          }
        },
        false
      )
    },
    // #endregion 地图相关

    // #region 选择客户
    selectCustomer() {
      this.customer.id = this.shopInfo.baseInfoId||''
      this.customer.name = this.shopInfo.customerName||''
     this.initCustomerSearchQuery()
      this.onChangeCustomer()
    },
    onChangeCustomer() {
      getCustomersPages(this.customerSearchQuery).then((res) => {
        this.isChoiceCustomer = true
        this.customers = res.list
        this.customerSearchQuery.total = res.count
        if (this.customer.id) {
          this.customers = this.customers.map((c) => {
            if (c.id == this.customer.id) {
              c = this.customer
            }
            return c
          })
        }
      })
    },
    addCustomer() {
      if (!this.customer || !this.customer.id) {
        this.$message.warning('请选择客户！！')
        return
      }
      this.shopInfo.baseInfoId = this.customer.id
      this.shopInfo.customerName = this.customer.name
      this.isChoiceCustomer = false
      this.initCustomerSearchQuery()
    },
    customerClose() {
      this.isChoiceCustomer = false
      this.customer = { id: null, name: null }
      this.initCustomerSearchQuery()
    },
    initCustomerSearchQuery(){
        this.customerSearchQuery.name=""
        this.customerSearchQuery.pageIndex=1
        this.customerSearchQuery.pageSize= 10
        this.customerSearchQuery.orderStr='id desc'
        this.customerSearchQuery.total=0 // 总条数
    }
    // #endregion
  },
}
</script>

<style lang="scss" scoped>
</style>