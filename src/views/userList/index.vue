<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div class="pb10">
          <el-button
            v-permission-button="'add'"
            type="primary"
            @click="$router.push({ name: 'maintainingAddUser' })"
            >新增客户</el-button
          >
          <el-button
            v-permission-button="'downLoad'"
            type="warning"
            @click="download"
            >导出</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="ncCode" label="NC编码"></el-table-column>
        <el-table-column label="客户名称/简称" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.name + '/' +  scope.row.simpleName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="baseInfoRate" width="180">
          <template slot="header">
            <el-tooltip
              effect="dark"
              :content="customerCateTooltip"
              placement="top"
            >
              <span>客户信息完善率<i class="el-icon-info ml6"></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div class="pointer" @click="go2RateList(scope.row.name)">
              <span>基础信息完善率</span>
              <el-progress
                class="row center-y"
                :percentage="Number(scope.row.baseInfoPerfectionRate || 0)"
                :color="customColors"
              ></el-progress>
              <span>客户信息整体完善率</span>
              <el-progress
                class="row center-y"
                :percentage="Number(scope.row.totalPerfectionRate || 0)"
                :color="customColors"
              ></el-progress>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务版块" width="100">
          <template slot-scope="scope">
            <template v-for="coopInfo in scope.row.coopInfos">
              <el-tag v-if="coopInfo.businessName" :key="coopInfo.id">{{coopInfo.businessName}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="channelType" label="渠道类型"></el-table-column>
        <el-table-column prop="industry" label="所属行业"></el-table-column>
        <el-table-column label="客户类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type == 0 ? '外部单位' : '内部单位' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="82">
          <template slot-scope="scope">
            <approve-timeline :id="scope.row.id" :list="timelineList" :request-id="requestId" :is-loading="isLoading" @hoverCheckedStatus="onHoverCheckedStatus">
              <!-- <span v-if="!scope.row.checkedStatus || scope.row.isDataInTemp === ''">未审核</span>
              <span v-else-if="scope.row.checkedStatus == 1">审核通过</span>
              <span v-else-if="scope.row.checkedStatus == 0">审核未通过</span>
              <span v-else-if="scope.row.checkedStatus == 2">审核中</span> -->

               <el-tag v-if="!scope.row.checkedStatus || scope.row.isDataInTemp === ''">未审核</el-tag>
                <el-tag
                  type="warning"
                  v-if="scope.row.checkedStatus && scope.row.checkedStatus == 2"
                >审核中</el-tag>
                <el-tag
                  type="success"
                  v-if="scope.row.checkedStatus && scope.row.checkedStatus == 1"
                >审核通过</el-tag>
                <el-tag
                  type="danger"
                  v-if="scope.row.checkedStatus && scope.row.checkedStatus == 0"
                >审核未通过</el-tag>
                
            </approve-timeline>
          </template>
        </el-table-column>
        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <span>{{
              scope.row.enableStatusCustomer == 1
                ? '未启用'
                : scope.row.enableStatusCustomer == 2
                ? '已启用'
                : '已停用'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人"></el-table-column>
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope" v-if="scope.row.createTimestamp">
            <span>{{ scope.row.createTimestamp | formatDate('Y/M/D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次审批时间" width="100">
          <template slot-scope="scope" v-if="scope.row.approvalTimestamp">
            <span>{{ scope.row.approvalTimestamp | formatDate('Y/M/D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                v-permission-button="'approve'"
                type="text"
                v-if="scope.row.enableStatusCustomer == 1"
                disabled
                >{{ '未核准' }}</el-button
              >
              <el-button
                v-permission-button="'cease'"
                type="text"
                v-else
                @click="startUser(scope.row.id, scope.row.enableStatusCustomer)"
                >{{
                  scope.row.enableStatusCustomer == '3' ? '启用' : '停用'
                }}
              </el-button>
              <el-button
                v-permission-button="'edit'"
                type="text"
                @click="onUserInfo(scope.row)"
                :disabled="scope.row.checkedStatus === '2'"
                >编辑</el-button
              >
              <el-button
                v-permission-button="'viewDetails'"
                type="text"
                @click="onUserInfo(scope.row, true)"
                >查看</el-button
              >
              <el-button
                v-permission-button="'storeInformation'"
                type="text"
                @click="getShop(scope.row)"
                >客户店铺</el-button
              >
              <!-- :disabled="scope.row.checkedStatus === '2'" -->
              <el-button
                v-permission-button="'LabelManagement'"
                type="text"
                @click="manageTag(scope.row.id)"
                :disabled="scope.row.checkedStatus === '2'"
                >标签管理</el-button
              >
              <el-button
                v-permission-button="'addApprove'"
                type="text"
                @click="sendApproval(scope.row.id)"
                :disabled="!isEnableApply(scope.row)"
                >建档审批</el-button
              >
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <el-dialog title="提示" :visible.sync="shopFlag" width="80%">
      <h4>客户店铺信息</h4>
      <el-table class="mt10" :data="shopInfoSaveAndUpdateVos">
        <div slot="append">
          <br />
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="clearPro('shopInfo')"
            size="small"
            style="width: 100%"
            >请点击添加客户店铺信息</el-button
          >
        </div>
        <el-table-column prop="date" label="平台/店铺" width="100px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" :disabled="true">
              <el-option label="平台" value="平台"></el-option>
              <el-option label="店铺" value="店铺"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="平台/店铺名">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入店铺名"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺号">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.code"
              placeholder="请输入店铺号"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺地址/网址">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.shopAddress"
              placeholder="请输入店铺地址/网址"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="区域" width="180px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.district" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="概况">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.generalSituatuion"
              placeholder="请输入概况"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营类型" width="100px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.operateType" :disabled="true">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in operateType"
                :key="index"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运营团队">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.operateTeam"
              placeholder="请输入运营团队"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="负责人">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.teamLeader"
              placeholder="请输入运营团队"
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="附件">
          <template slot-scope="scope">
            <el-tag class="pointer" @click="showScheduleDialog(scope.row)">
              {{ scope.row.attaCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editShopInfo(scope), (isEditSho = true)"
              >修改</el-button
            >
            <el-button type="text" @click="delShopInfo(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopFlag = false">取 消</el-button>
        <el-button type="primary" @click="shopFlag = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改店铺 -->
    <el-dialog
      :title="isEditSho ? '修改店铺信息' : '店铺信息'"
      :visible.sync="shopInfoFlag"
      width="70%"
      :before-close="shopInfoClose"
    >
      <el-table class="mt10" :data="shopInfoList">
        <el-table-column
          class-name="must"
          prop="date"
          label="平台/店铺"
          width="90px"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.type">
              <el-option label="平台" value="平台"></el-option>
              <el-option label="店铺" value="店铺"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="平台/店铺名">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入店铺名"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="店铺号">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.code"
              placeholder="请输入店铺号"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column class-name="must" prop="date" label="店铺地址/网址">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.shopAddress"
              placeholder="请输入店铺地址/网址"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :class-name="
            shopInfoList.length > 0 && shopInfoList[0].type == '店铺'
              ? 'must'
              : ''
          "
          prop="date"
          label="区域"
          width="190px"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.district"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="概况">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.generalSituatuion"
              placeholder="请输入概况"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :class-name="
            shopInfoList.length > 0 && shopInfoList[0].type == '店铺'
              ? 'must'
              : ''
          "
          prop="operateType"
          label="运营类型"
          width="90px"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.operateType">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in operateType"
                :key="index"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          :class-name="
            shopInfoList.length > 0 && shopInfoList[0].type == '店铺'
              ? 'must'
              : ''
          "
          prop="operateTeam"
          label="运营团队"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.operateTeam"
              placeholder="请输入运营团队"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :class-name="
            shopInfoList.length > 0 && shopInfoList[0].type == '店铺'
              ? 'must'
              : ''
          "
          prop="teamLeader"
          label="负责人"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.teamLeader"
              filterable
              remote
              reserve-keyword
              placeholder="请输入负责人"
              :remote-method="remoteMethod"
              :loading="innerPersonLoading"
              @change="getInnerUser"
            >
              <el-option
                v-for="(item, i) in innerPersonOptions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopInfoFlag = false">取 消</el-button>
        <el-button type="primary" @click="addShopInfo">{{
          isEditSho ? '修 改' : '添 加'
        }}</el-button>
      </span>
    </el-dialog>

    <!--标签管理-->
    <el-dialog title="标签管理" :visible.sync="tagVisible" width="40%" center>
      <span slot="footer" class="dialog-footer">
        <el-form>
          <el-form-item label="标签" prop="tag">
            <tags title="添加标签" v-model="dynamicTags" />
            <el-tag
              @click="addTag_(item)"
              style="cursor: pointer; margin-top: 4px"
              size="medium"
              type="info"
              v-for="(item, index) in tagHistory"
              :key="index"
              >{{ item }}</el-tag
            >
          </el-form-item>
        </el-form>
        <el-button @click="tagVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTag('dynamicTags')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--附件管理-->
    <my-dialog
      title="客户附件"
      v-model="scheduleDialogVisible"
      @close="closeAttaDialog"
    >
      <file-list
        v-if="scheduleDialogVisible"
        v-model="scheduleAttaList"
        :uploadOss="uploadShopAtta"
        async
        :removePromise="delAtta"
        :uploadPromise="addAtta"
      ></file-list>
    </my-dialog>
  </div>
</template>

<script>
import { operateType } from '@/const/goods'
import { dataSource } from '@/const/customer'
import Tags from '@/components/Tags'
import ApproveTimeline from '@/components/approve-timeline'
import { listBusiness } from '@/api/business'
import {
  saveShopInfo,
  updateShopInfo,
  selectPage,
  openEnableStatus,
  closeEnableStatus,
  delShopInfo,
  getShopInfoListByBaseInfoId,
  getDistrictList,
  getTagListById,
  updateTagById,
  addShopAttachment,
  delAttachment,
  ShopAttaList,
  getDepartment,
  download as downloadHttp,
  getAllCompanyInfo,
  getAllEcologyUsers,
  getJobTitleById,
  applyByBaseInfoId,
  findAll,
  getWorkflow
} from '@/api/client'
import { uploadShopAtta } from '@/api/uploadOss'
import { deepClone, formatDate } from '../../utils'
import FileSaver from 'file-saver'
const customerCateTooltip =
  '客户信息完善率统计，详细规则请查看客户管理-客户信息完善率，点击完善率可以直接跳转至统计页面' +
  '\r\n基础信息完善率：表示客户基础信息是否填写完整' +
  '\r\n客户信息整体完善率：表示客户基础信息、运营信息是否填写完整' +
  '\r\n优秀绿色：大于80%-100%' +
  '\r\n良好橙色：大于40%-小于等于80%' +
  '\r\n较差红色：0%-小于等于40%'

export default {
  name: 'userlist',
  components: { Tags, ApproveTimeline },
  data() {
    return {
      checkedStatusMap: {
        0: '审核未通过',
        1: '审核通过',
        2: '审核中',
      },
      times: [],
      operateType: operateType,
      uploadShopAtta,
      scheduleDialogVisible: false,
      scheduleAttaList: [],
      tagVisible: false,
      spuData: [],
      dataSource: dataSource.properties,
      dynamicTags: [],
      inputValue: '',
      tagVo: {
        baseInfoId: '',
        tags: []
      },
      departments: [], //所属公司
      shopInfoSaveAndUpdateVos: [
        {
          baseInfoId: '',
          area: '', //区域
          city: '', //城市
          // code	:'',//店铺号(不允许修改，添加时有效，修改忽略该参数)
          id: null, //客户店铺信息id(修改时传入)
          name: '', //店铺名
          operateTeam: '', //运营团队
          operateType: '', //运营类型：外包/直营
          province: '', //省份
          generalSituatuion: '', //概况
          teamLeader: '', //运营团队负责人
          type: '', //类型 平台/店铺
          district: ''
          // shopAddress:""
        }
      ],
      innerPersonOptions: [], // 内部跟进人信息
      innerPersonLoading: false, // 内部跟进人信息搜索判断
      isEditSho: false,
      shopInfoList: [
        {
          id: '',
          area: '', //区域
          city: '', //城市
          code: '', //店铺号(不允许修改，添加时有效，修改忽略该参数)
          baseInfoId: '',
          name: '', //店铺名
          operateTeam: '', //运营团队
          operateType: '', //运营类型：外包/直营
          province: '', //省份
          generalSituatuion: '', //概况
          teamLeader: '', //运营团队负责人
          type: '', //类型 平台/店铺
          district: '',
          shopAddress: ''
        }
      ],
      innerPersonList: [
        {
          deptId: '', //所属部门id
          deptName: '', //所属部门
          email: '', //邮箱
          fullName: '', //姓名
          tel: '', //电话
          jobTitleId: '',
          jobTitle: ''
        }
      ],
      shoArea: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let level = 'province'
          let padcode = ''
          if (node.hasOwnProperty('data')) {
            switch (node.level) {
              case 1:
                level = 'city'
                padcode = node.data.adcode
                break
              case 2:
                level = 'district'
                padcode = node.data.adcode
                break
              case 3:
                level = 'street'
                padcode = node.data.adcode
                break
              default:
                level = 'city'
                padcode = node.data.adcode
                break
            }
          }
          getDistrictList({
            level: level,
            padcode: padcode
          }).then((res) => {
            res.forEach((item) => {
              item['value'] = item.name
              item['label'] = item.name
              if (node.level == 3) {
                item['leaf'] = true
              }
              this.shopInfoList[0].areaCode = res[0].adcode
            })
            resolve(res) // 返回数据
          })
        }
      },
      baseinfo: {},
      area: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          let level = 'province'
          let padcode = ''
          if (node.hasOwnProperty('data')) {
            switch (node.level) {
              case 1:
                level = 'city'
                padcode = node.data.adcode
                break
              case 2:
                level = 'district'
                padcode = node.data.adcode
                break
              case 3:
                level = 'street'
                padcode = node.data.adcode
                break
              default:
                level = 'city'
                padcode = node.data.adcode
                break
            }
          }
          getDistrictList({
            level: level,
            padcode: padcode
          }).then((res) => {
            res.forEach((item) => {
              item['value'] = item.name
              item['label'] = item.name
              if (node.level == 3) {
                item['leaf'] = true
              }
              this.baseinfo.areaCode = res[0].adcode
            })
            resolve(res) // 返回数据
          })
        }
      },
      searchForm: [
        {
          key: 'name',
          label: '客户名称/简称',
          placeholder: '客户名称/简称',
          type: 'input',
          clearable:true
        },
        {
          key: 'ncCode',
          label: '客户编码',
          placeholder: '客户编码',
          type: 'input',
          clearable:true
        },
        {
          key: 'channelType',
          label: '渠道类型',
          placeholder: '渠道类型',
          options: [{ label: '全部', value: null }],
          type: 'select',
          clearable:true
        },
        {
          key: 'tag',
          label: '标签',
          type: 'input',
          clearable:true
        },
        {
          key: 'businessId',
          label: '业务板块',
          placeholder: '业务板块',
          options: [{ label: '全部', value: null }],
          type: 'select',
          clearable:true
        },
        {
          key: 'checkedStatus',
          label: '审核状态',
          placeholder: '审核状态',
          options: [
            { label: '全部', value: null },
            { label: '审核通过', value: '1' },
            { label: '审核未通过', value: '0' },
            { label: '审核中', value: '2' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'enableStatusCustomer',
          label: '启用状态',
          placeholder: '启用状态',
          options: [
            { label: '全部', value: null },
            { label: '未启用（建档保存）', value: '1' },
            { label: '已启用（准入通过）', value: '2' },
            { label: '已停用（停用通过）', value: '3' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'enterpriseType',
          label: '企业性质',
          placeholder: '企业性质',
          options: [
            { label: '全部', value: null },
            { label: '企业', value: '0' },
            { label: '个人', value: '1' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'dataSource',
          label: '客户来源',
          placeholder: '客户来源',
          options: [
            { label: '全部', value: null },
            { label: '一件达', value: '2' },
            { label: '客户中心', value: '3' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'baseInfoRateLevel',
          label: '信息完善率',
          placeholder: '信息完善率',
          options: [
            { label: '优秀', value: 1 }, // ?>80-黑色进度
            { label: '良好', value: 2 }, // 40<?<=80-橙色进度
            { label: '较差', value: 3 } // ?<=40-红色进度
          ],
          type: 'select',
          clearable: true
        },
        {
          key: 'type',
          label: '客户类型',
          placeholder: '请选择',
          options: [
            { label: '全部', value: null },
            { label: '外部客户', value: '0' },
            { label: '内部客户', value: '1' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'customerType',
          label: '是否内部员工',
          placeholder: '请选择',
          options: [
            { label: '全部', value: null },
            { label: '是', value: '1' },
            { label: '否', value: '2' }
          ],
          type: 'select',
          clearable:true
        },
        {
          key: 'time',
          label: '创建时间',
          type: 'date_picker',
          pickerType: 'daterange',
          clearable: true,
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
      ],
      searchQuery: {
        businessId: '',
        channelType: '',
        name: '',
        time: [],
        isEnable: '',
        category: '',
        pageIndex: 1,
        pageSize: 10,
        orderStr: 'id desc',
        total: 0 // 总条数
      },
      tableData: [],
      tableLoading: false,
      shopFlag: false,
      ShopInfoIndex: 0, // 客户店铺索引
      shopInfoFlag: false, // 添加店铺开关
      userId: '', // 客户弹窗id
      shopId: '', //店铺id
      states: [], // 内部跟进人信息,名字列表
      customColors: [
        { color: '#FF7875', percentage: 40 },
        { color: '#FFC069', percentage: 80 },
        { color: '#95DE64', percentage: 100 }
      ],
      requestId: '',//审批流程id
      timelineList: [],//审批时间轴
      isLoading: false,
      customerCateTooltip
    }
  },
  computed: {
    tagHistory() {
      let arr = ['跨境客户', '一件代发客户', '联合公司']
      if (this.spuData.tag) {
        this.spuData.tag.forEach((items) => {
          arr.forEach((item, index) => {
            if (item == items) {
              arr.splice(index, 1)
            }
          })
        })
      }
      return arr
    }
  },
  created() {
    let source = this.$route.query.source
    if (source === 'shopPage') {
      let customerName = this.$route.query.customerName
      console.log('customerName', customerName)
      if (customerName) {
        this.searchQuery.name = customerName
      }
    }
    this.$eventHub.$off(this.$eventName.CUSTOMER_LIST_REFLUSH)
    this.$eventHub.$on(this.$eventName.CUSTOMER_LIST_REFLUSH, () =>
      this.fetchTableData()
    )
    this.fetchTableData() // 加载表格数据
  },
  mounted() {
    this.init()
  },
  methods: {
    download(item) {
      var start = new Date().getTime()
      this.$store.commit('SHOW_EXPORTING')
      let params = _.cloneDeep(this.searchQuery)
      params.startCreateTimestamp = params.time[0]
      params.endCreateTimestamp = params.time[1]
      downloadHttp(params)
        .then((blob) => {
          console.log('进去了')
          console.info(blob)
          let fileName = `客户信息明细表${formatDate(
            new Date().getTime(),
            'Y-M-D h:m'
          )}`
          FileSaver.saveAs(blob, fileName + '.xlsx')
          var end = new Date().getTime()
          this.$message.success('导出成功,耗时' + (end - start) / 1000 + '秒')
        })
        .finally(() => {
          this.$store.commit('SHOW_EXPORTING', false)
        })
    },
    initChannelTypeList() {
      findAll().then((res) => {
        res.forEach((item) => {
          let channelType = {}
          channelType.value = item.name
          channelType.label = item.name
          this.searchForm.filter(item => item.key == 'channelType')[0].options.push(channelType)
        })
      })
    },
    initSearchBusinessList() {
      //获取业务板块 业务板块
      listBusiness().then((res) => {
        var options = res
        options.forEach((entity) => {
          let business = {}
          business.label = entity.name
          business.value = entity.id
          this.searchForm.filter(item => item.key == 'businessId')[0].options.push(business)
        })
      })
    },
    clearPro(type) {
      if (type === 'shopInfo') {
        this.clearShopInfo()
      }
    },
    clearShopInfo() {
      this.shopInfoFlag = true
      this.isEditSho = false
      this.shopInfoList[0]['name'] = ''
      this.shopInfoList[0]['type'] = ''
      this.shopInfoList[0]['code'] = ''
      this.shopInfoList[0]['generalSituatuion'] = ''
      this.shopInfoList[0]['operateType'] = ''
      this.shopInfoList[0]['operateTeam'] = ''
      this.shopInfoList[0]['teamLeader'] = ''
      this.shopInfoList[0]['area'] = ''
      this.shopInfoList[0]['province'] = ''
      this.shopInfoList[0]['city'] = ''
      this.shopInfoList[0]['district'] = ''
      this.shopInfoList[0]['shopAddress'] = ''
    },
    // 获取所有内部人员名字信息
    init() {
      getAllEcologyUsers().then((res) => {
        this.states = res.map((item) => {
          return { value: item.lastname, label: item.lastname, userlist: item }
        })
      })
      getAllCompanyInfo().then((res) => {
        let data = deepClone(res)
        console.log(data)
        data.forEach((ele) => {
          ele['_departmentid'] = ele._subcompanyid
        })
        this.departments = data
        console.log('departments', this.departments)
      })
      this.initSearchBusinessList()
      this.initChannelTypeList()
    },
    // 选中时获取客户信息 并赋值
    getInnerUser(user) {
      let stateslist = null
      this.states.forEach((item) => {
        if (item.label == user) {
          stateslist = item.userlist
        }
      })
      console.info('item', stateslist)
      this.innerPersonList.forEach((item) => {
        if (item.fullName == user) {
          item.deptName = stateslist.departmentname //所属部门
          item.deptId = stateslist.departmentid //所属部门id
          item.email = stateslist.email //邮箱
          item.fullName = stateslist.lastname //姓名
          item.tel = stateslist.mobile //电话
          console.info('item', item)
          getJobTitleById(stateslist.jobtitle).then((res) => {
            item.jobTitleId = res._jobtitleid
            item.jobTitle = res._fullname
          })
        }
      })
    },
    // 判断选中的值存不存在
    remoteMethod(query) {
      if (query !== '') {
        this.innerPersonLoading = true
        setTimeout(() => {
          this.innerPersonLoading = false
          this.innerPersonOptions = this.states.filter((item) => {
            return item.label.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.innerPersonOptions = []
      }
    },
    closeAttaDialog() {
      this.currentRow = null
      this.scheduleDialogVisible = false
      //this.fetchTableData();
    },
    addAtta(atta) {
      return new Promise((resolve, reject) => {
        console.log('Shop', atta)
        atta.shopId = this.shopId
        addShopAttachment(atta)
          .then((res) => {
            ShopAttaList(this.shopId).then((res) => {
              resolve(res)
            })
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
    delAtta(atta) {
      return new Promise((resolve, reject) => {
        atta.shopId = this.shopId
        delAttachment(atta.id)
          .then((res) => {
            ShopAttaList(this.shopId).then((res) => {
              resolve(res)
            })
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
    showScheduleDialog(row) {
      this.currentRow = row
      this.shopId = row.id + ''
      row.baseInfoId += ''
      ShopAttaList(this.shopId).then((res) => {
        this.scheduleAttaList = res
        this.scheduleDialogVisible = true
      })
    },
    // 添加商品窗口，获取选中添加地址
    setShopArea(e) {
      this.shopInfoList[0].province = e[0] ? e[0] : '' // 省
      this.shopInfoList[0].city = e[1] ? e[1] : '' // 市
      this.shopInfoList[0].area = e[2] ? e[2] : '' // 区
    },
    // 添加店铺信息
    addShopInfo() {
      if (this.isEditSho) {
        this.shopInfoList[0]['baseInfoId'] = this.userId
        console.log(this.shopInfoList[0]['id'] + '')
        console.log(this.shopInfoList[0]['baseInfoId'] + '')
        let params = deepClone(this.shopInfoList)
        if (params[0].type) {
          //修改
          if (params[0].type == '店铺') {
            //选了店铺的情况
            if (
              !(
                params[0].type &&
                params[0].name &&
                params[0].code &&
                params[0].district &&
                params[0].operateType &&
                params[0].operateTeam &&
                params[0].teamLeader
              )
            ) {
              this.$message({
                message: !params[0].type
                  ? '店铺类型不能为空'
                  : !params[0].name
                  ? '店铺/平台名不能为空'
                  : !params[0].district
                  ? '区域不能为空'
                  : !params[0].operateType
                  ? '运营类型不能为空'
                  : !params[0].operateTeam
                  ? '运营团队不能为空'
                  : '负责人不能为空',
                type: 'warning'
              })
              return false
            } else {
              updateShopInfo(params[0]).then((res) => {
                this.$message({
                  message: '修改客户店铺信息成功',
                  type: 'success'
                })
                getShopInfoListByBaseInfoId(this.userId).then((res) => {
                  this.shopInfoSaveAndUpdateVos = res
                  this.shopInfoFlag = !this.shopInfoFlag
                })
              })
            }
          } else {
            if (!(params[0].type && params[0].name && params[0].shopAddress)) {
              this.$message({
                message: !params[0].type
                  ? '店铺类型不能为空'
                  : !params[0].name
                  ? '店铺/平台名不能为空'
                  : '店铺地址/网址不能为空',
                type: 'warning'
              })
              return false
            } else {
              updateShopInfo(params[0]).then((res) => {
                this.$message({
                  message: '修改客户店铺信息成功',
                  type: 'success'
                })
                getShopInfoListByBaseInfoId(this.userId).then((res) => {
                  this.shopInfoSaveAndUpdateVos = res
                  this.shopInfoFlag = !this.shopInfoFlag
                })
              })
            }
          }
        } else {
          this.$message({ message: '店铺类型不能为空', type: 'warning' })
          return false
        }
      } else {
        this.shopInfoList[0]['baseInfoId'] = this.userId
        console.info('id', this.shopInfoList[0])
        //添加
        if (this.shopInfoList[0].type) {
          if (this.shopInfoList[0].type == '店铺') {
            //选了店铺的情况
            if (
              !(
                this.shopInfoList[0].type &&
                this.shopInfoList[0].name &&
                this.shopInfoList[0].shopAddress &&
                this.shopInfoList[0].district &&
                this.shopInfoList[0].operateType &&
                this.shopInfoList[0].operateTeam &&
                this.shopInfoList[0].teamLeader
              )
            ) {
              this.$message({
                message: !this.shopInfoList[0].type
                  ? '店铺类型不能为空'
                  : !this.shopInfoList[0].name
                  ? '店铺/平台名不能为空'
                  : !this.shopInfoList[0].code
                  ? '店铺地址/网址不能为空'
                  : !this.shopInfoList[0].district
                  ? '区域不能为空'
                  : !this.shopInfoList[0].operateType
                  ? '运营类型不能为空'
                  : !this.shopInfoList[0].operateTeam
                  ? '运营团队不能为空'
                  : '负责人不能为空',
                type: 'warning'
              })
              return false
            } else {
              saveShopInfo(this.shopInfoList[0])
                .then((res) => {
                  this.$message({
                    message: '添加客户店铺信息成功',
                    type: 'success'
                  })
                  // 添加成功后刷新数据
                  getShopInfoListByBaseInfoId(this.userId).then((res) => {
                    this.shopInfoSaveAndUpdateVos = res
                    this.shopInfoFlag = !this.shopInfoFlag
                  })
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          } else {
            if (
              !(
                this.shopInfoList[0].type &&
                this.shopInfoList[0].name &&
                this.shopInfoList[0].code
              )
            ) {
              this.$message({
                message: !this.shopInfoList[0].type
                  ? '店铺类型不能为空'
                  : !this.shopInfoList[0].name
                  ? '店铺/平台名不能为空'
                  : '店铺地址/网址不能为空',
                type: 'warning'
              })
              return false
            } else {
              saveShopInfo(this.shopInfoList[0])
                .then((res) => {
                  this.$message({
                    message: '添加客户店铺信息成功',
                    type: 'success'
                  })
                  // 添加成功后刷新数据
                  getShopInfoListByBaseInfoId(this.userId).then((res) => {
                    this.shopInfoSaveAndUpdateVos = res
                    this.shopInfoFlag = !this.shopInfoFlag
                  })
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          }
        } else {
          this.$message({ message: '店铺类型不能为空', type: 'warning' })
          return false
        }
      }
    },
    // 关闭添加店铺弹窗时
    shopInfoClose(done) {
      done()
    },
    sendApproval(data) {
      // 弹窗确认
      this.$confirm('确认建档审批提交吗？', {
        type: 'warning'
      })
        .then(() => {
          this.$loading({ fullscreen: true })
          applyByBaseInfoId(data)
            .then((res) => {
              this.$message.success('提交成功')
              this.fetchTableData()
            })
            .finally(() => {
              this.$loading().close()
            })
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    // 获取点击客户店铺时候的索引
    setAreaTwoId(index) {
      this.ShopInfoIndex = index
    },
    // 基本信息地图 获取选中的地址
    setArea(e) {
      this.baseinfo.area = e.join('/')
    },
    // 修改客户店铺
    editShopInfo(item) {
      item.row['id'] += ''
      item.row['baseInfoId'] += ''
      let copy = deepClone(item.row)
      this.shopInfoList = [copy]
      console.log(this.shopInfoList)
      this.shopInfoFlag = !this.shopInfoFlag
    },
    // 删除客户店铺
    delShopInfo(item) {
      this.$confirm(`确认删除吗？`)
        .then((_) => {
          delShopInfo(item.id).then((res) => {
            getShopInfoListByBaseInfoId(this.userId).then((res) => {
              this.shopInfoSaveAndUpdateVos = res
            })
            this.$message({ message: '删除成功', type: 'success' })
          })
        })
        .catch((_) => {})
    },
    getShop(item) {
      let customerId = item.id
      let customerName = item.name
      // this.$eventHub.$emit(this.$eventName.CUSTOMER_SHOP_QUERY, { customerId: customerId, customerName: customerName })
      this.$router.push({
        name: 'Shop',
        query: { customerId: customerId, customerName: customerName }
      })
      
    },
    // 核准
    getCheckedStatus() {
      this.$message({ message: '客户信息未核准,请稍后~', type: 'warning' })
    },
    //启用客户
    startUser(id, flag) {
      console.log(flag)
      if (flag === '3') {
        // 启用
        openEnableStatus(id).then((res) => {
          this.onChange()
          console.log(res)
        })
      } else {
        // 停用
        closeEnableStatus(id).then((res) => {
          this.tableData = []
          this.onChange()
          console.log(res)
        })
      }
    },

    //修改客户信息
    onUserInfo(row, isLook = false) {
      this.$router.push({
        name: 'maintainingEditUser',
        query: {
          id: row.id,
          isLook: isLook,
          checkedStatus: row.checkedStatus,
          enterpriseType: row.enterpriseType
        }
      })
    },
    onChange() {
      this.fetchTableData()
    },
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchClientList()
        this.searchQuery.total = res.total // 总条数
        let brandList = res.records // 品牌数据
        console.log(brandList)
        this.tableData = brandList
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    fetchClientList() {
      return new Promise((resolve, reject) => {
        let params = this.$lodash.cloneDeep(this.searchQuery)
        params.startCreateTimestamp = params.time[0]
        params.endCreateTimestamp = params.time[1]
        selectPage(params).then((res) => {
          resolve(res)
        })
      })
    },
    manageTag(data) {
      getTagListById(data)
        .then((res) => {
          this.dynamicTags = res
          this.tagVo.baseInfoId = data
          resolve(res)
        })
        .catch((error) => {})
      this.tagVisible = !this.tagVisible
    },
    addTag_(item) {
      this.dynamicTags.push(item)
    },
    addTag(data) {
      this.tagVo.tags = this.dynamicTags
      this.tagVo.baseInfoId = this.tagVo.baseInfoId.toString()
      updateTagById(this.tagVo).then((res) => {
        this.tagVisible = false
      })
    },
    isEnableApply(obj) {
      if (obj.checkedStatus === '2') {
        return false
      } else if (obj.checkedStatus === '1' && !obj.isDataInTemp) {
        return false
      } else {
        return true
      }
    },
    go2RateList(name) {
      this.$router.push({
        path: '/userlist/perfectionRate',
        query: {
          name: name
        }
      })
    },
    onHoverCheckedStatus(id) {
      this.isLoading = true;
      getWorkflow(id).then(res => {
        this.timelineList = []
        this.requestId = res && res.requestId
        let arr = res && res.workflowRequestLogs.reverse()
        if(arr){
          arr.map(item => {
            let obj = {
              remark: item.remark ? `审批意见: ${item.remark}` : '',
              receivedPersons: `(接收人) ${item.receivedPersons}`,
              content: `(${item.operatorDept}) ${item.operatorName} ${item.operateType}`,
              timestamp: `${item.operateDate} ${item.operateTime}`,
            }
            item.operateType === '提交'
            ? (
              obj.size = 'large',
              obj.type = 'primary',
              obj.icon = 'el-icon-circle-plus'
            )
            : (item.operateType === '批准'
                ? (
                  obj.size = 'large',
                  obj.type = 'success',
                  obj.icon = 'el-icon-success'
                )
                : obj.type = 'warning'
              )
            this.timelineList.push(obj)
          })
        }
      }).finally(()=>{
        this.isLoading = false;
      })
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.el-button + .el-button {
  margin-left: 10px;
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
/deep/ .el-progress__text {
  font-size: 10px !important;
}
 ul.el-timeline {
  padding-inline-start: 10px;
  margin-bottom: -20px;
  .name {
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, .85);
  }
  .content {
    font-size: 13px;
    color: rgba(0, 0, 0, .45);
    margin-left: 10px;
  }
}
</style>
<style lang="scss"></style>
