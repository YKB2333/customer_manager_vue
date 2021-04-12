<template>
  <span style="width: 100%">
    <el-input
      style="width: calc(100% - 90px )"
      maxlength="500"
      v-model="address"
      :placeholder="placeholder"
      disabled
    ></el-input>
    <el-button @click="addressForMap" class="ml10">选择地址</el-button>
    <!-- 地图地址选择-->
    <el-dialog
      :title="'地址选择'"
      :visible.sync="showMap"
      width="850px"
      top="2vh"
      custom-class="mapDialog"
    >
      <iframe id="mapPage" style="width:100%;height:100%" frameborder="0" :src="mapSrc"></iframe>
      <div style="text-align:center">
        <el-button type="primary" @click="getMapLocation" style="margin-right:10px">确 认</el-button>
        <el-button type="danger" @click="showMap=false">取 消</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
// 通过地图选择地址
export default {
  name: 'AddressSelect',
  props: {
    placeholder: {
      type: String,
      default: '请输入地址',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showMap: false,
      lacation: {
        longitude: '',
        latitude: '',
      },
      address: '',
      // #region 地图
      showMap: false,
      baseMapSrc:
        'https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp',
      mapSrc:
        'https://apis.map.qq.com/tools/locpicker?search=1&mapdraggable=1&type=1&radius=1000&key=D4ZBZ-4B7K6-FR6SH-E5LUJ-CHRXH-FOBRF&referer=myapp',
      maplocation: {},
      // #endregion
    }
  },
  watch: {
    value(val) {
      this.address = val
    },

    address(value) {
      this.$emit('input', value)
      this.$emit('change', {
        value,
        lacation: this.lacation,
      })
    },
  },
  created() {
    this.mapResponse()
  },
  methods: {
    // #region 地图相关
    addressForMap() {
      this.showMap = true
      this.maplocation = null
      if (this.lacation.longitude) {
        let coord =
          'coord=' + this.lacation.latitude + ',' + this.lacation.longitude
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
      this.lacation.longitude = this.maplocation.latlng.lng
      this.lacation.latitude = this.maplocation.latlng.lat
      this.address = this.maplocation.poiaddress
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
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog.mapDialog {
  height: 95%;
}
/deep/ .el-dialog__body {
  height: 90%;
  margin-bottom: 10px;
}
</style>