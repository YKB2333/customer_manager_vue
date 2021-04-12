<template>
  <div>
    <el-form
      :model="shopDeliverInfo"
      ref="f"
      :validate-on-rule-change="false"
      label-width="200px"
      :rules="rules"
      :disabled="disabled"
      class="newform2 top"
    >
      <el-form-item label="发货人" prop="deliverer">
        <el-input v-model="shopDeliverInfo.deliverer"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="shopDeliverInfo.phone"></el-input>
      </el-form-item>
      <el-form-item label="业务类型" prop="bizType">
        <el-select v-model="shopDeliverInfo.bizType">
          <el-option v-for="item in bizTypes" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单获取方式" prop="source">
        <el-select v-model="shopDeliverInfo.source">
          <el-option v-for="item in sources" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="耗材（封箱胶/气泡膜/缠绕膜）" prop="consumables">
        <el-select v-model="shopDeliverInfo.consumables">
          <el-option v-for="item in consumablesList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="外包材" prop="outsourcingMaterial">
        <el-select v-model="shopDeliverInfo.outsourcingMaterial">
          <el-option v-for="item in outsourcingMaterials" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递选择" prop="expressDelivery">
        <el-select v-model="shopDeliverInfo.expressDelivery">
          <el-option v-for="item in expressDeliveries" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货仓库" prop="warehouse">
        <el-select v-model="shopDeliverInfo.warehouse">
          <el-option v-for="item in warehouseList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货时效" prop="deliveryTimeLimit">
        <template slot="label">
          发货时效
          <el-tooltip
            class="item"
            effect="dark"
            content="请具体写明，下单多少小时内上传快递单号，多少小时内上传物流信息。"
            placement="top"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </template>
        <el-input v-model="shopDeliverInfo.deliveryTimeLimit"></el-input>
      </el-form-item>
      <el-form-item label="关联合同附件" prop="deliverAttas">
        <shop-upload
          ref="upload"
          :type="false"
          @onSuccessUpload="shopAttaUploadFild"
          :isUrl="shopDeliverInfo.deliverAttas"
          @handleClose="shopAttaHand"
        ></shop-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import shopUpload from '@/components/shopUpload'
export default {
  name: 'Step3',
  components: { shopUpload },
  props: {
    type: {
      // 店铺类型
      type: String,
      require: true,
    },
    value: {
      type: Object,
      default: () => ({
        deliverer: '',
        phone: '',
        bizType: '',
        consumables: '',
        deliverAttas: [],
        deliverer: '',
        deliveryTimeLimit: '',
        expressDelivery: '',
        outsourcingMaterial: '',
        source: '',
        warehouse: '',
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      shopDeliverInfo: {
        deliverer: '',
        phone: '',
        bizType: '',
        consumables: '',
        deliverAttas: [],
        deliverer: '',
        deliveryTimeLimit: '',
        expressDelivery: '',
        outsourcingMaterial: '',
        source: '',
        warehouse: '',
      },
      bizTypes: ['B2B', 'B2C'],
      sources: ['手工导单', '系统抓单'],
      consumablesList: ['众上集团', '客供'],
      outsourcingMaterials: ['众上集团', '客供'],
      expressDeliveries: ['京东', '顺丰', '韵达'],
      warehouseList: ['独占仓', '共享仓', '独占仓和共享仓'],
    }
  },
  computed: {
    rules() {
      const isRequire = this.type === '2'
      return {
        deliverer: [
          {
            required: isRequire,
            message: '请填写发货人',
            trigger: 'blur',
          },
        ],
        bizType: [
          {
            required: isRequire,
            message: '请填选择业务类型',
            trigger: ['blur', 'change'],
          },
        ],
        consumables: [
          {
            required: isRequire,
            message: '请选择耗材',
            trigger: ['blur', 'change'],
          },
        ],
        deliverAttas: [
          {
            required: isRequire,
            message: '请上传附件',
            trigger: ['blur', 'change'],
          },
        ],
        deliveryTimeLimit: [
          {
            required: isRequire,
            message: '请填写发货时效',
            trigger: 'blur',
          },
        ],
        expressDelivery: [
          {
            required: isRequire,
            message: '请选择快递方式',
            trigger: 'blur',
          },
        ],
        outsourcingMaterial: [
          {
            required: isRequire,
            message: '请选择外包材',
            trigger: 'blur',
          },
        ],
        phone: [
          {
            required: isRequire,
            message: '请填写联系方式',
            trigger: 'blur',
          },
        ],
        source: [
          {
            required: isRequire,
            message: '请选择订单获取方式',
            trigger: 'blur',
          },
        ],
        warehouse: [
          {
            required: isRequire,
            message: '请选择仓库类型',
            trigger: 'blur',
          },
        ],
      }
    },
  },
  watch: {
    shopDeliverInfo: {
      handler: function (v) {
        this.$emit('input', v)
      },
      immediate: true,
      deep: true,
    },

    value: {
      handler: function (v) {
        console.log(v)
        if (v) {
          this.shopDeliverInfo = v
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // #region 附件相关
    //  店铺附件
    shopAttaUploadFild(res, file) {
      let attaUploadFild = {
        attaUrl: res.url, //附件地址
        fileName: res.fileName, //附件原名
        fileType: res.fileType, //附件类型（后缀）
        // id:null,//客户附件自增id,新增时不必传值,当id不为空时,忽略保存
        size: res.size,
      }
      this.shopDeliverInfo.deliverAttas = Array.isArray(
        this.shopDeliverInfo.deliverAttas
      )
        ? [...this.shopDeliverInfo.deliverAttas, attaUploadFild]
        : [attaUploadFild]
    },
    // 客户介绍附件文件删除
    shopAttaHand(item) {
      let arr = this.shopDeliverInfo.deliverAttas
        ? this.shopDeliverInfo.deliverAttas
        : []
      arr.forEach((i, index) => {
        if (i.id == item.id) {
          // stateslist =item.userlist;
          this.shopDeliverInfo.deliverAttas.splice(index, 1)
        }
      })
    },
    // #endregion附件相关
    validaForm() {
      console.log('step2 validaForm')
      if (!this.$refs['f']) {
        console.error('前端报错了')
        return Promise.reject(false)
      }
      return this.$refs['f'].validate()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>