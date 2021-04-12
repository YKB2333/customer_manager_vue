<template>
  <!-- 渠道报价查询 -->
  <div class="channelPriceQuery-page">
    <!-- 表单 -->
    <el-form :model="searchQuery" label-width="auto" size="mini" :inline="true">
      <el-form-item label="客户名称:">
        <el-select
          :disabled="isDisabled"
          v-model="searchQuery.baseInfoId"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
        <el-tooltip effect="dark" :content="tip">
          <span style="color: #888">
            <span style="font-size: 5px"> 查不到客户 </span>
            <i class="el-icon-question ml6;"></i>
          </span>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="店铺名称:">
        <el-select
          
          v-model="searchQuery.shopId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in shopOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报价类型:">
        <el-select
          :disabled="true"
          v-model="searchQuery.archivesType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in archivesTypeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道类型:">
        <el-select
          :disabled="isDefault"
          v-model="searchQuery.channelTypeCode"
          placeholder="请选择"
        >
          <el-option
            v-for="item in channelTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户等级:">
        <el-select
          :disabled="isDefault"
          v-model="searchQuery.customerGrade"
          placeholder="请选择"
        >
          <el-option
            v-for="item in customerGradeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合作方式:">
        <el-select
          :disabled="isDisabled"
          v-model="searchQuery.coopType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in coopTypeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="before-table">
      <div class="pb10">
        <el-button type="primary" v-permission-button="'add'" @click="addGoods"
          >添加商品</el-button
        >
        <el-button
          :disabled="!tableData.length > 0"
          v-permission-button="'delete'"
          type="danger"
          @click="delChoice"
          >删除</el-button
        >
        <el-button
          :disabled="!tableData.length > 0"
          v-permission-button="'export'"
          type="success"
          @click="exportData"
          >导出</el-button
        >
        <el-button
          type="info"
          v-permission-button="'history'"
          @click="historyRecord"
          >历史记录</el-button
        >
        <el-button type="warning" v-permission-button="'reSet'" @click="reSet"
          >重置</el-button
        >
      </div>
    </div>
    {{ brandCategory }}
    <el-table
      :data="tableData"
      style="width: 100%"
      height="700"
      border
      stripe
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      @selection-change="tableDataSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="skuSn" label="规格编码"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="codeBar" label="商品条码"></el-table-column>
      <el-table-column
        prop="goodsAttribute"
        label="主/副属性"
      ></el-table-column>
      <el-table-column prop="brandName" label="品牌"></el-table-column>
      <el-table-column prop="wholesaleSpec" label="箱规"></el-table-column>
      <el-table-column prop="brandCategory" label="商品服务类型">
        <template slot-scope="scope">
          <div
            v-for="(brandCagegory, index) in brandCategoryOption"
            :key="'brandCagegory' + index"
          >
            <el-tag v-if="scope.row.brandCategory == brandCagegory.value">{{brandCagegory.label}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="msrp" label="建议零售价"></el-table-column>
      <el-table-column prop="historyChannelPrice" label="历史合作价">
      </el-table-column>
      <el-table-column width="180px" prop="propChannelPrice">
        <template slot="header">
          <el-tooltip
            effect="dark"
            :content="propChannelPriceTooltip"
            placement="top"
          >
            <span>建议渠道报价<i class="el-icon-info ml6"></i></span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input-number
            style="width: 130px"
            size="small"
            v-model="scope.row.propChannelPrice"
            controls-position="right"
            :precision="2"
            :step="0.1"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="tip" label="备注">
        <template slot-scope="scope">
          <div v-if="scope.row.tips && scope.row.tips.length > 0">
            <span v-for="item in scope.row.tips" :key="item">
              <el-tag v-if="item !== ''" type="danger">{{ item }}</el-tag>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div><span>总记录数:</span>{{ tableData.length || 0 }}</div>
    <!-- 添加商品弹框 -->
    <el-dialog
      :title="'添加商品'"
      :visible.sync="channelGoodsFlag"
      width="70%"
      top="2%"
      :before-close="channelGoodsClose"
    >
      <the-search @onSearch="onChange" @onReset="onResetQuery">
        <el-form
          :model="searchQuery"
          ref="searchQuery"
          label-width="100px"
          inline
          size="mini"
        >
          <el-form-item label="商品分类:">
            <template>
              <el-cascader
                clearable
                v-model="cateCode"
                :options="cateCodeOptions"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              >
              </el-cascader>
            </template>
          </el-form-item>
          <el-form-item label="品牌:" prop="brandId">
            <el-select
              @change="onSelect"
              v-model="searchQuery.brandId"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in brandsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="skuSnStr">
            <template slot="label">
              <el-tooltip
                class="item"
                effect="dark"
                content="NC编码"
                placement="top"
              >
                <span>规格编码:<i class="el-icon-info ml6"></i></span>
              </el-tooltip>
            </template>
            <template>
              <div style="width: 165px" class="row center-y relative">
                <el-input
                  @input="onInput()"
                  v-model="searchQuery.skuSnStr"
                  placeholder="请输入"
                  clearable
                  @clear="onChange"
                  @keyup.enter.native="onChange"
                  style="width: 140px"
                ></el-input>
                <span class="iclass">
                  <i
                    class="el-icon-more"
                    @click="showSkuSnDialog = true"
                    style="right: 10px"
                  ></i>
                </span>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="商品名称:" prop="name">
            <el-input
              v-model="searchQuery.name"
              placeholder="请输入商品名称"
              clearable
              @clear="onChange"
              @keyup.enter.native="onChange"
              @input="onInput()"
              style="width: 140px"
            ></el-input>
          </el-form-item>
          <el-form-item label="建议零售价:">
            <template>
              <span
                ><el-input-number
                  v-model="searchQuery.minMsrp"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                ></el-input-number
              ></span>
              ~
              <span
                ><el-input-number
                  v-model="searchQuery.maxMsrp"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="searchQuery.minMsrp"
                ></el-input-number
              ></span>
            </template>
          </el-form-item>
        </el-form>
      </the-search>
      <el-table
        ref="channelGoodsTableData"
        v-loading="channelGoodsTableDataLoading"
        :data="channelGoodsTableData"
        @selection-change="channelGoodsHandleSelectionChange"
        height="550"
        border
        stripe
        element-loading-text="拼命加载中"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="skuSn" label="规格编码"></el-table-column>
        <el-table-column
          prop="codeBar"
          width="150px"
          label="商品条码"
        ></el-table-column>
        <el-table-column
          prop="name"
          width="200px"
          label="商品名称"
        ></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column
          prop="goodsAttribute"
          label="主/副属性"
        ></el-table-column>
        <el-table-column prop="msrp" label="建议零售价"></el-table-column>
        <el-table-column prop="scopeAuthoriza" label="授权渠道范围">
          <template slot-scope="scope">
            <div
              v-if="scope.row.channelTypes && scope.row.channelTypes.length > 0"
            >
              <span v-for="item in scope.row.channelTypes" :key="item">
                <el-tag type="info">{{ item }}</el-tag>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <the-pagination
        :pageIndex="searchQuery.pageIndex"
        :pageSize="searchQuery.pageSize"
        :total="searchQuery.total"
        @onPageSizeChange="handleSizeChange"
        @onPageIndexChange="handleCurrentChange"
      />
      <div style="display: block; text-align: auto; padding-left: 80px">
        <span style="width: 1247px" v-if="channelGoodsTableData.length > 0">
          <el-button @click="addChannelGoods" type="primary"
            >保存</el-button
          ></span
        >
        <el-button @click="closeDialog">关闭</el-button>
      </div>
      <!-- 规格编码输入弹框 -->
      <my-dialog
        v-model="showSkuSnDialog"
        :close-on-click-modal="false"
        :title="'规格编码'"
        width="500px"
        max-height
        @close="closeSkuSnDialog"
      >
        <div>
          <el-input
            @input="onInput()"
            v-model="searchQuery.skuSnStr"
            type="textarea"
            :rows="8"
            placeholder="请输入数据进行查询"
          ></el-input>
        </div>
        <div style="margin-top: 5px; margin-bottom: 10px">
          批量搜索的数据支持英文“,” 或换行隔开，最多查询1000条数据
        </div>
        <div style="margin-left: 390px">
          <el-button type="primary" @click="selectBySkuSn">确定</el-button>
        </div>
      </my-dialog>
    </el-dialog>
    <!-- 历史记录弹框 -->
    <el-dialog
      :title="'历史记录'"
      :visible.sync="channelPriceExportLogsFlag"
      width="70%"
      :before-close="channelPriceExportLogsClose"
    >
      <my-table v-model="exportLogssearchQuery" @change="exportLogsOnChange">
        <el-table
          :data="channelPriceExportLogs"
          border
          stripe
          v-loading="exportLogsTableLoading"
          element-loading-text="拼命加载中"
        >
          <el-table-column prop="fileName" label="文件名"></el-table-column>
          <el-table-column prop="url" label="文件链接"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scpoe">
              <span v-if="scpoe.row.id">
                <el-link @click="downloadFile(scpoe.row)" type="primary"
                  >下载</el-link
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </el-dialog>
  </div>
</template>
<script>
import { findAll as findAllChannelType } from '@/api/client'
import TheSearch from '@/components/SearchForm'
import { brandCategory } from '@/const/goods'
import ThePagination from '@/components/Pagination'
import FileSaver from 'file-saver'
import {
  getchoiceShopInfos,
  getchoiceCustomers,
  getchoicebrands,
  getchoiceCategorys,
  getChannelPriceQueryGoodsPages,
  getServiceFee,
  channelPriceQueryexport,
  getChannelPriceExportLogPages,
  download,
  getchoicebrandsByCateCode
} from '@/api/channelPrice'
export default {
  name: 'channelPriceQuery',
  components: { TheSearch, ThePagination },
  data() {
    return {
      brandCategory: null,
      archivesTypeDisabled: true,
      isDisabled: false,
      exportLogsTableLoading: false,
      channelGoodsTableDataLoading: false,
      channelPriceExportLogs: [], //导出日志列表
      channelPriceExportLogsFlag: false,
      isDefault: false,
      // isEditPropChannelPrice:false,//是否编辑建议渠道报价
      channelGoodsTableData: [{ channelTypes: [] }], //弹框列表数据
      cateCode: [], //弹框分类code
      showSkuSnDialog: false,
      channelGoodsFlag: false,
      tableData: [], //列表数据
      shopChoice: true, //是否可以选择店铺
      brandsOptions: [], //可选择品牌
      cateCodeOptions: [{ children: [] }], //可选择分类
      shopOptions: [], //可选择客户
      customerOptions: [], //可选择客户
      channelTypeOptions: [], //可选择渠道类型
      tableLoading: false,
      exportLogssearchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      searchQuery: {
        skuSns: [],
        archivesType: '0',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      archivesTypeOptions: [
        {
          name: '标准报价',
          value: '0'
        },
        {
          name: '定制报价',
          value: '1'
        }
      ],
      customerGradeOptions: [
        {
          name: '一般客户',
          value: '1'
        },
        {
          name: '战略客户',
          value: '2'
        }
      ],
      coopTypeOptions: [
        {
          name: '采购分销',
          value: '0'
        },
        {
          name: '一件代发',
          value: '1'
        }
      ],
      channelGoodsSelectAllList: [],
      serviceFee: {},
      existServiceFee: false,
      tip:
        '您不是该客户的负责人，没有查看权限；\n若想了解客户报价信息，请在“客户中心--客户档案”维护内部联系人信息,\n或联系运营（黄蕴琳）授权；',
      propChannelPriceTooltip:
        '建议渠道报价计算规则\n1、合作方式为采购分销：成本价 / （ 1 - 利润率 - 服务费【运输费（定额）不参与】）\n2、合作方式为一件代发：（成本价 + 运输费（定额）） / （ 1 - 利润率 - 服务费【运输费（百分比、定额）不参与】）',

      tableDataSelectAllList: [],
      brandCategoryOption: []
    }
  },
  computed: {},
  created() {
    this.brandCategoryOption = brandCategory.properties
    console.log('brandCategoryOption', this.brandCategoryOption)
    this.getCustomers()
    this.getchannelType()
  },
  mounted() {},
  methods: {
    // 历史记录
    historyRecord() {
      this.exportLogsTableLoading = true
      this.channelPriceExportLogsFlag = true
      getChannelPriceExportLogPages(this.exportLogssearchQuery).then((res) => {
        this.channelPriceExportLogs = res.list.map((r) => {
          if(r.fileUrl){
            let url =
            '/' +
            r.fileUrl.substr(
              r.fileUrl.indexOf(r.creator) + r.creator.toString().length
            )
          r.url = url
          }          
          return r
        })
        this.exportLogssearchQuery.total = res.count
        this.exportLogsTableLoading = false
      })
    },
    // 下载
    downloadFile(item) {
      var start = new Date().getTime()
      this.$store.commit('SHOW_EXPORTING')
      download(item)
        .then((blob) => {
          let fileName = item.fileName
          FileSaver.saveAs(blob, fileName)
          var end = new Date().getTime()
          this.$message.success('下载成功,耗时' + (end - start) / 1000 + '秒')
        })
        .finally(() => {
          this.$store.commit('SHOW_EXPORTING', false)
        })
    },
    exportLogsOnChange() {
      this.historyRecord()
    },
    // 删除
    delChoice() {
      if (
        this.tableDataSelectAllList &&
        this.tableDataSelectAllList.length > 0
      ) {
        this.$confirm('是否确认删除已选数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.tableDataSelectAllList.filter((s) => {
              this.tableData.filter((t, index) => {
                if (s.skuSn === t.skuSn) {
                  this.tableData.splice(index, 1)
                }
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message.warning('请先勾选需要删除的数据')
      }
    },

    // 导出
    exportData() {
      if (
        this.tableDataSelectAllList &&
        this.tableDataSelectAllList.length > 0
      ) {
        this.$confirm('本次导出只会导出已勾选的数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            //导出勾选数据
            if (this.tableDataSelectAllList.length > 0) {
              let params = {}
              if (this.searchQuery.baseInfoId) {
                params.baseInfoId = this.searchQuery.baseInfoId
              }
            let channelTypeName =""
            this.channelTypeOptions.forEach((ct) => {
            if (ct.value ===  this.searchQuery.channelTypeCode) {
              channelTypeName= ct.label
            }
            })
              params.datas = this.tableDataSelectAllList.map(item=>{
                   item.channelTypeName=channelTypeName
                   return item
              })
              
              channelPriceQueryexport(params)
                .then(() => {
                  this.$message.success('导出成功，请到历史记录中下载')
                })
                .catch(() => {
                  this.$message.error('导出失败')
                })
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$confirm(
          '未发现数据勾选项，本次导出将导出列表的所有数据，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            let params = {}
            if (this.searchQuery.baseInfoId) {
              params.baseInfoId = this.searchQuery.baseInfoId
            }
            let channelTypeName =""
            this.channelTypeOptions.forEach((ct) => {
            if (ct.value ===  this.searchQuery.channelTypeCode) {
              channelTypeName= ct.label
            }
            })
            params.datas = this.tableData.map(item=>{
                  item.channelTypeName=channelTypeName
                  return item
            })
            params.datas = this.tableData
            //导出列表
            channelPriceQueryexport(params)
              .then(() => {
                this.$message.success('导出成功，请到历史记录中下载')
              })
              .catch(() => {
                this.$message.error('导出失败')
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    // 主列表多选
    tableDataSelectionChange(selection) {
      this.tableDataSelectAllList = selection
    },
    async addGoods() {
      await this.checkServiceFee()
      // 检查服务费信息是否已维护
      if (!this.existServiceFee) {
        return
      }
      // if (this.searchQuery.baseInfoId) {
      //   if (!this.searchQuery.shopId) {
      //     this.$message.warning('请选择店铺')
      //     return
      //   }
      // }
      this.getBrands()
      this.getCategorys()
      this.getChannelGoodsTableData()
      this.channelGoodsFlag = true
      this.channelGoodsSelectAllList = []
    },
    // 获取可选择分类
    getCategorys() {
      getchoiceCategorys().then((res) => {
        this.cateCodeOptions = res
          .filter((firstCate) => firstCate.superId === 0)
          .map((firstCate) => {
            return {
              value: firstCate.id,
              label: firstCate.name,
              children: res
                .filter((secondCate) => secondCate.superId === firstCate.id)
                .map((secondCate) => {
                  return {
                    value: secondCate.id,
                    label: secondCate.name,
                    children: res
                      .filter(
                        (thirdCate) => thirdCate.superId === secondCate.id
                      )
                      .map((thirdCate) => {
                        return {
                          value: thirdCate.id,
                          label: thirdCate.name
                        }
                      })
                  }
                })
            }
          })
      })
    },
    // 检查服务费信息是否已维护
    async checkServiceFee() {
      if (!this.searchQuery.channelTypeCode) {
        this.$message.warning('请选择渠道类型')
        return
      }
      if (!this.searchQuery.customerGrade) {
        this.$message.warning('请选择客户等级')
        return
      }
      if (!this.searchQuery.coopType) {
        this.$message.warning('请选择合作方式')
        return
      }
     
      let param = {
        coopType: this.searchQuery.coopType,
        customerGrade: this.searchQuery.customerGrade,
        channelTypeCode: this.searchQuery.channelTypeCode,
        archivesType: this.searchQuery.archivesType
      }
      if (this.searchQuery.archivesType === '1') {
        param.ncCode = this.searchQuery.ncCode
        param.shopId = this.searchQuery.shopId
      }
      await getServiceFee(param)
        .then((res) => {
          if (res) {
            this.existServiceFee = true
          } else {
            this.$message.warning('此客户未维护对应的服务费档案,先前往"服务费档案"进行维护!')
            // if (this.searchQuery.archivesType === '1') {
            //   this.$message.warning(
            //     '此客户未维护对应的服务费档案,先前往"服务费档案"进行维护!'
            //   )
            // } else {
            //   let channelTypeName = this.channelTypeOptions.filter((ct) => {
            //     if (ct.value === this.searchQuery.channelTypeCode) {
            //       return ct.label
            //     }
            //   })
            //   this.$message.warning(
            //     '服务费档案（档案类型:标准档案/渠道类型:' +
            //       channelTypeName[0].label +
            //       '/客户等级:' +
            //       `${
            //         this.searchQuery.customerGrade === '1'
            //           ? '一般客户'
            //           : '战略客户'
            //       }` +
            //       '/合作方式:' +
            //       `${
            //         this.searchQuery.coopType === '0' ? '采购分销' : '一件代发'
            //       }` +
            //       '）未维护,请先前往"服务费档案"进行维护!'
            //   )
            // }
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    // 获取可选择渠道类型
    getchannelType() {
      findAllChannelType().then((res) => {
        this.channelTypeOptions = res.map((item) => {
          return { value: item.code, label: item.name }
        })
      })
    },
    //获取可选择品牌
    getBrands() {
      getchoicebrands().then((res) => {
        this.brandsOptions = res.map((item) => {
          return {
            value: item.id.toString(),
            label: item.name
          }
        })
      })
    },
    //获取可选择客户
    getCustomers() {
      getchoiceCustomers().then((res) => {
        this.customerOptions = res.map((item) => {
          return {
            value: item.baseInfoId,
            label: `${item.ncCode}:${item.name}`,
            name: item.name,
            ncCode: item.ncCode,
            customerGrade: item.customerGrade,
            channelTypeCode: item.channelTypeCode
          }
        })
      })
    },
    //关闭弹窗
    channelGoodsClose(done) {
      this.existServiceFee=false;
      this.clearQuery()
      done()
    },
    // 关闭历史记录弹框
    channelPriceExportLogsClose(done) {
      done()
    },
    // 弹窗change
    onChange() {
      this.searchQuery['pageIndex'] = 1
      this.getChannelGoodsTableData()
    },
    // 弹框搜索栏重置
    onResetQuery() {
      this.cateCode = ''
      this.clearQuery()
      this.onChange()
    },
    // 强制刷新
    onInput() {
      this.$forceUpdate()
    },
    // 强制刷新
    onSelect() {
      this.$forceUpdate()
      this.getChannelGoodsTableData()
    },
    clearQuery() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.searchQuery['cateCode'] = ''
      this.searchQuery['brandId'] = ''
      this.searchQuery['skuSnStr'] = ''
      this.searchQuery['skuSns'] = []
      this.searchQuery['name'] = ''
      this.searchQuery['maxMsrp'] = undefined
      this.searchQuery['minMsrp'] = undefined
    },
    // 弹框分类选择
    handleChange(value) {
      console.log(value, 'cateCode')
      let cateCode = ''
      if (value.length) {
        value.forEach((element) => {
          cateCode += element + '-'
        })
        if(cateCode){
           this.searchQuery.cateCode = cateCode.substr(0, cateCode.length - 1)
        }
        this.choicebrandsByCateCode()
      } else {
        this.searchQuery.cateCode = cateCode
        this.getBrands()
      }
      this.getChannelGoodsTableData()
    },
    choicebrandsByCateCode() {
      getchoicebrandsByCateCode(this.searchQuery.cateCode).then((res) => {
        this.brandsOptions = res.map((item) => {
          return {
            value: item.id.toString(),
            label: item.name
          }
        })
      })
    },

    // 弹窗列表数据
    getChannelGoodsTableData() {
      if (this.searchQuery.skuSnStr) {
        let str = this.searchQuery.skuSnStr.trim()
        this.searchQuery.skuSnStr = str.replace(/\n/g, ',')
        let skuSns = this.searchQuery.skuSnStr.split(',')
        this.searchQuery.skuSns = skuSns
      } else {
        this.searchQuery.skuSns = []
      }
      this.channelGoodsTableDataLoading = true
      getChannelPriceQueryGoodsPages(this.searchQuery).then((res) => {
        if (
          this.tableData.length > 0 &&
          this.channelGoodsSelectAllList.length === 0
        ) {
          this.channelGoodsSelectAllList = this.tableData
        }
        let selectTempList = _.cloneDeep(this.channelGoodsSelectAllList)
        this.channelGoodsTableData = res.list.map((item) => {
          item.channelTypes = []
          return item
        })
        this.channelGoodsTableData.forEach((r) => {
          if (r.scopeAuthoriza) {
            r.scopeAuthoriza.split(',').forEach((item) => {
              this.channelTypeOptions.filter((t) => {
                if (t.value == item) {
                  r.channelTypes.push(t.label)
                }
              })
            })
          }
        })
        this.reSelectChannelGoods(selectTempList)
        this.searchQuery.total = res.count
        this.channelGoodsTableDataLoading = false
      })
    },
    // 弹框多选的回显
    reSelectChannelGoods(selectTempList) {
      this.$nextTick(() => {
        if (selectTempList && selectTempList.length > 0) {
          this.channelGoodsTableData.forEach((item) => {
            selectTempList.forEach((item2) => {
              if (item2.skuId.toString() === item.skuId.toString()) {
                this.$refs['channelGoodsTableData'].toggleRowSelection(item)
              }
            })
          })
          selectTempList = []
        }
      })
    },
    // 重置
    reSet() {
      this.searchQuery = {
        skuSns: [],
        archivesType: '0',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      }
      this.tableData = []
      this.channelGoodsTableData = [{ channelTypes: [] }]
      this.isDisabled = false
      this.shopChoice = false
      this.isDefault = false
      this.isDisabled = false
    },
    handleSizeChange(val) {
      // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.getChannelGoodsTableData()
    },
    handleCurrentChange(val) {
      // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.getChannelGoodsTableData()
    },
    // 弹框多选
    channelGoodsHandleSelectionChange(selection) {
      let arr = this.channelGoodsSelectAllList.filter((item) => {
        return !this.channelGoodsTableData.find(
          (e) => e.skuId.toString() === item.skuId.toString()
        )
      })
      this.channelGoodsSelectAllList = arr

      if (selection && selection.length > 0) {
        selection.forEach((item) => {
          this.channelGoodsSelectAllList.push(item)
        })
      }
    },
    //弹框商品编码的输入
    selectBySkuSn() {
      this.showSkuSnDialog = false
    },
    // 关闭规格编码输入弹窗
    closeSkuSnDialog() {
      this.showSkuSnDialog = false
    },
    // 关闭弹窗
    closeDialog() {
      this.channelGoodsFlag = false
      this.channelGoodsSelectAllList = []
    },
    // 弹框保存
    addChannelGoods() {
      if (!this.channelGoodsSelectAllList.length > 0) {
        this.$message.warning('请勾选要添加的商品！')
        return
      }
      this.channelGoodsSelectAllList.forEach((item) => {
        if (this.tableData.length > 0) {
          let entity = this.tableData.filter((t) => {
            return t.skuId.toString() === item.skuId.toString()
          })
          if (entity.length === 0) {
            this.tableData.push(item)
          }
        } else {
          this.tableData.push(item)
        }
      })
      this.clearQuery()
      this.channelGoodsFlag = false
      this.tableData.forEach((r) => {
        if (r.tip) {
          r.tips = r.tip.split(',')
        }
      })
      this.isDisabled = true
      this.shopChoice = true
      this.isDefault = true
      console.log(this.tableData, 'tableData')
    }
  },
  watch: {
    'searchQuery.shopId': function (newValue) {
      if (newValue) {
        this.archivesTypeDisabled = false
      }
    },
    'searchQuery.baseInfoId': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$set(this.searchQuery, 'shopId', '')
      }
      if (!newValue) {
        this.searchQuery.archivesType = '0'
        this.shopOptions = []
        this.shopChoice = true
        return
      }
      this.searchQuery.archivesType = '1'
      this.isDefault = true
      let customer = this.customerOptions.filter((item) => {
        return item.value.toString() === newValue.toString()
      })
      if (!customer||customer.length<=0) {
          return 
      }

      this.searchQuery.ncCode = customer[0].ncCode
      this.searchQuery.customerGrade = customer[0].customerGrade
      this.searchQuery.channelTypeCode = customer[0].channelTypeCode
      if(!this.searchQuery.customerGrade||!this.searchQuery.channelTypeCode){
         this.$message.warning('此客户未维护渠道类型或客户等级信息，请先前往"客户档案"进行维护!')
      }
      // 通过客户信息获取可选择店铺
      getchoiceShopInfos(this.searchQuery.baseInfoId).then((res) => {
        this.shopOptions = res.map((item) => {
          this.shopChoice = false
          return {
            value: item.id.toString(),
            label: `${item.code}:${item.name}`,
            name: item.name
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.el-button + .el-button {
  margin-left: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #888;
}
.must:before {
  content: '* ';
  color: #ff1818;
}
/deep/ table th.must div:before {
  content: '* ';
  color: #ff1818;
}
.btn {
  width: 18%;
  padding-top: 20px;
}
.add-btn {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin: auto;
}
.iclass {
  border: 1px solid#DCDFE6;
}
.inputs {
  width: 200px;
}
.content {
  width: 450px;
}
.contents {
  width: 300px;
}
.div-one {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
/deep/
  .el-calendar__button-group
  .el-button-group
  .el-button:nth-child(2)
  span {
  color: transparent !important;
  &::after {
    content: '本月';
    color: #606266;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
