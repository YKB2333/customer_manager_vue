<template>
  <span>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click">
      <div>
        <div class="notice-header">
          <el-radio v-model="query.readStatus" :label="null">全部消息</el-radio>
          <el-radio v-model="query.readStatus" :label="'0'">只看未读</el-radio>
          <span class="check" @click="setAllRead" v-if="isShowCheck">
            <i class="el-icon-check"></i>
          </span>
        </div>
        <div v-if="Array.isArray(list) && list.length > 0">
          <div class="notice" v-for="item in list" :key="item.id" @click="setReadById(item.msgId)">
            <div class="info-wapper">
              <div class="event">
                {{ item.title }}
                <div class="dot" v-if="!item.readStatus" ></div>
              </div>
              <div class="time">
                {{ item.createTimestamp | formatDate('Y/M/D h:m:s')}}
              </div>
            </div>
            <div class="content">
              {{ item.content }}
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next"
              :page-size="query.pageSize"
              @current-change="pageChange"
              :current-page="query.pageIndex"
              :total="query.count">
            </el-pagination>
          </div>
        </div>
        <div v-else style="height: 70px;line-height: 70px;text-align: center;color: #888">
          暂无数据
        </div>
      </div>
      <el-badge is-dot :hidden="isHidden" slot="reference" @click.native="getNoticePage">
        <i class="el-icon-message-solid notice-icon"></i>
      </el-badge>
    </el-popover>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNoticePage, getNoticeById } from '@/api/user'

export default {
  name: 'Notice',
  data() {
    return {
      list: [],
      query: {
        count: 0,
        pageSize: 5,
        pageIndex: 1,
        noticeType: 7,
        // noticeTypes: ['7'],
        // 0 未读 1 已读  null 全都
        readStatus: null,
        sysTag: 'customer',
        receiveUserId: ''
      },
      isHidden: true,
      timer: null
    }
  },

  computed: {
    ...mapGetters(['userInfo']),

    isShowCheck() {
      if (!Array.isArray(this.list)) {
        return false;
      }
      return this.list.some(v => !v.readStatus)
    }
  },

  watch: {
    'query.readStatus'(val) {
      this.getNoticePage()
    }
  },

  created() {
    this.getNotice()
    this.isHasUnRead();
    this.timer = setInterval(() => {
      this.isHasUnRead();
    }, 60 * 1000);
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    getNotice() {
      this.query.receiveUserId = this.userInfo.id
      getNoticePage(this.query)
        .then((res) => {
          this.list = res && res.list || [];
          this.query.count = res && res.count || 0;
        })
    },

    setAllRead() {
      this.list
        .filter(v => !v.readStatus)
        .forEach(v => {
          this.setReadById(v.msgId)
        })
    },

    setReadById(id) {
      getNoticeById(id)
        .then(() => {
          this.getNotice()
          // let notice = this.list.find(v => v.msgId === id)
          // notice.readStatus = 1
        })
    },

    getNoticePage() {
      this.query.pageIndex = 1;
      this.getNotice()
    },

    pageChange(e) {
      this.query.pageIndex = e
      this.getNotice()
    },

    isHasUnRead() {
      getNoticePage({
        pageSize: 1,
        pageIndex: 1,
        noticeType: 7,
        receiveUserId: this.userInfo.id,
        readStatus: 0,
        sysTag: 'customer',
      })
        .then((res) => {
          this.isHidden = !(res && res.count);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-header {
  padding: 5px 10px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, .45);
  .check {
    float: right;
    margin-right: 10px;
    font-size: 16px;
    color: #409EFF;
  }
}
.notice {
  padding: 12px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, .25);
  .info-wapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    .event {
      font-size: 15px;
      font-weight: 500;
      height: 25px;
      line-height: 25px;
      color: black;
      vertical-align: middle;
      .dot {
        margin-left: 2px;
        width: 8px;
        height: 8px;
        display: inline-block;
        background: red;
        border-radius: 50%;
      }
    }
    .time {
      font-size: 13px;
      color: rgba(0, 0, 0, .60);
    }
  }
  .content {
    color: rgba(0, 0, 0, .7);
    line-height: 1.3;
    font-size: 13px;
  }
}
.pagination {
  text-align: center;
}
.notice-icon {
  font-size: 20px;
  margin: 0 5px;
  color: rgba(0, 0, 0, .60)
}
</style>