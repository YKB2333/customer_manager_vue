<template>
  <div>
    <my-table v-model="query" :searchForm="searchForm" @change="onChange">
      <!-- 表格数据 -->
      <el-table
        id="table"
        :data="tableData"
        :height="600"
        border
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column prop="rank" label="排名" width="60">
          <template slot-scope="scope">{{scope.row.rank | toOrdinalFilter}}</template>
        </el-table-column>
        <el-table-column prop="cateName" label="品类名称" width="250"></el-table-column>
        <el-table-column label="销量">
          <el-table-column prop="amt" label="金额" width="150">
            <template slot-scope="scope">￥{{scope.row.amt | toThousandFilter}}</template>
          </el-table-column>
          <el-table-column label="占比" width="80">
            <template slot-scope="scope">{{scope.row.amt/totalAmt | toPercentFilter}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="销售占比">
          <el-table-column label="服务类型占比" width="350">
            <template slot-scope="scope">
              <div
                v-for="(brandCagegory,index) in scope.row.brandCagegoryRate"
                :key="'brandCagegory'+index"
              >
                <el-tag type="success">{{brandCagegory.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{brandCagegory.brandCategory}}</el-tag>
                <el-tag type="danger">￥{{brandCagegory.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{brandCagegory.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品牌占比" width="350">
            <template slot-scope="scope">
              <div v-for="(brand,index) in scope.row.brandRate" :key="'category'+index">
                <el-tag type="success">{{brand.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{brand.brandName}}</el-tag>
                <el-tag type="danger">￥{{brand.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{brand.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品占比" width="600">
            <template slot-scope="scope">
              <div v-for="(goods,index) in scope.row.goodsRate" :key="'category'+index">
                <el-tag type="success">{{goods.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{goods.spuName}}</el-tag>
                <el-tag type="danger">￥{{goods.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{goods.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="销售组织占比" width="500">
            <template slot-scope="scope">
              <div v-for="(org,index) in scope.row.salesOrgRate" :key="'org'+index">
                <el-tag type="success">{{org.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{org.orgName}}</el-tag>
                <el-tag type="danger">￥{{org.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{org.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="客户渠道占比" width="350">
            <template slot-scope="scope">
              <div v-for="(channel,index) in scope.row.channelRate" :key="'channel'+index">
                <el-tag type="success">{{channel.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{channel.qdName}}</el-tag>
                <el-tag type="danger">￥{{channel.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{channel.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="客户占比" width="600">
            <template slot-scope="scope">
              <div v-for="(customer,index) in scope.row.customerRate" :key="'customer'+index">
                <el-tag type="success">{{customer.rank | toOrdinalFilter}}</el-tag>
                <el-tag>{{customer.csName}}</el-tag>
                <el-tag type="danger">￥{{customer.amt | toThousandFilter}}</el-tag>
                <el-tag type="warning">{{customer.amt/scope.row.amt | toPercentFilter}}</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-row class="table-footer">销售总额: <span style="color: #f56c6c;">￥{{totalAmt | toThousandFilter}}</span></el-row>
    </my-table>
  </div>
</template>

<script>
import { getMaxNumber, deepClone, generateCategoryCascader } from "@/utils";
import { brandCategory } from "@/const/goods";
import { getCategorySales,getTotalAmt } from "@/api/report";
export default {
  name: "SalesReportByCategory",
  data() {
    return {
      tableLoading: false,
      query: {
        orgName: null,
        qdName: null,
        csName: null,
        brandCategory: null,
        brandId: null,
        cateCode: null,
        spuName: null,
        time: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: [
        {
          key: "orgName",
          label: "销售组织",
          type: "input"
        },
        {
          key: "qdName",
          label: "客户渠道",
          type: "input"
        },
        {
          key: "csName",
          label: "客户",
          type: "input"
        },
        {
          key: "brandCategory",
          label: "商品服务类型",
          type: "select",
          options: brandCategory.properties
        },
        {
          key: "brandId",
          label: "品牌",
          options: [],
          type: "brand_select"
        },
        {
          key: "cateCode",
          label: "商品分类",
          options: [],
          type: "cate_cascader",
          expandTrigger: true
        },
        {
          key: "spuName",
          label: "商品名称",
          type: "input"
        },
        {
          key: "time",
          label: "时间",
          type: "date_picker",
          pickerType: "monthrange",
          clearable: false,
          format: "yyyy-MM",
          valueFormat: "timestamp",
          defaultTime:['00:00:00', '23:59:59'],
          startPlaceholder: "开始月份",
          endPlaceholder: "结束月份",
          pickerOptions: {
            shortcuts: [
              {
                text: "本月",
                onClick(picker) {
                  picker.$emit("pick", [new Date(), new Date()]);
                }
              },
              {
                text: "今年至今",
                onClick(picker) {
                  const end = new Date();
                  const start = new Date(new Date().getFullYear(), 0);
                  picker.$emit("pick", [start, end]);
                }
              },
              {
                text: "最近六个月",
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setMonth(start.getMonth() - 6);
                  picker.$emit("pick", [start, end]);
                }
              }
            ]
          }
        }
      ],
      tableData: [],
      totalAmt:null
    };
  },
  mounted() {
  },
  methods: {
    fetchReportData() {
      this.tableLoading = true;
      let params = this.$lodash.cloneDeep(this.query);
      params.startTime = params.time[0];
      params.endTime = params.time[1];
      return getCategorySales(params)
        .then(res => {
          this.tableData = res.records;
          this.query.total = res.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    fetchTotalAmt() {
      let params = this.$lodash.cloneDeep(this.query);
      params.startTime = params.time[0];
      params.endTime = params.time[1];
      return getTotalAmt(params).then(res => {
        this.totalAmt = res;
      });
    },
    onChange() {
      this.fetchReportData();
      this.fetchTotalAmt();
    }
  },
  async created() {
    this.query.time[0] = this.$dayjs().startOf('month').valueOf();
    this.query.time[1] = this.$dayjs().endOf('month').valueOf();
    await this.fetchReportData();
    this.fetchTotalAmt();
  }
};
</script>
