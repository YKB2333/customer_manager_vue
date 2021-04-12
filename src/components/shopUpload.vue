<template>
  <div>
    <el-upload
      ref="upload"
      class="inline-block"
      :action="action"
      :on-success="(response, file) => onSuccessUpload(response, file)"
      :on-remove="file => onRemoveUpload(file)"
      :multiple="false"
      :show-file-list="false"
      :httpRequest="uploadRequest"
      :disabled="uploadLoading"
    >
      <div v-if="type">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i
          v-else
          class="el-icon-plus avatar-uploader-icon"
          style="border: 1px dashed #d9d9d9"
        ></i>
      </div>
      <div v-else>
        <el-tag
          size="medium"
          v-for="(item, index) in fileName"
          :key="index"
          closable
          @close="handleClose(item)"
          >{{ item.fileName }}</el-tag
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </div>
    </el-upload>
    <!-- 插糟 -->
    <slot></slot>
    <div v-show="uploadLoading">
      <el-button type="text" :loading="uploadLoading">上传中</el-button>
    </div>
    <div class="mt30"></div>
  </div>
</template>

<script>
import { uploadShopAtta, uploadShopLogo } from "@/api/uploadOss";
export default {
  name: "shopUpload",
  components: {},
  data() {
    return {
      uploadLoading: false, //上传判断
      dialogVisible: false,
      imageUrl: "",
      fileName: [] //
    };
  },
  computed: {},
  props: {
    action: {
      // 文件上传的地址
      type: String,
      default: ""
    },
    showUploadBtn: {
      type: Boolean,
      default: true
    },
    type: {
      // 用户头像或 合同
      type: Boolean,
      default: true
    },
    isUrl: {
      // 用户头像或 合同
      type: Array,
      default: () => ([])
    }
  },
  created() {},
  mounted() {},
  watch: {
    isUrl: {
      handler(newValue) {
        console.log(newValue, "newValue");
        this.getIsUrl();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 点击删除
    handleClose(item) {
      this.$emit("handleClose", item); //  文件删除
    },
    getIsUrl() {
      if (this.isUrl) {
        this.imageUrl = this.isUrl[0] ? this.isUrl[0] : "";
      }

      if (!this.type) {
        this.fileName = this.isUrl ? this.isUrl : "";
      }
    },
    // 文件上传成功时的钩子
    onSuccessUpload(res, file) {
      this.$emit("onSuccessUpload", res, file); //  文件上传成功时的钩子
    },
    // 文件列表移除文件时的钩子
    onRemoveUpload(file) {
      this.$emit("onSuccessUpload", res, file); //  文件列表移除文件时的钩子
      this.clearAttaForm();
    },
    clearAttaForm() {
      this.$refs["upload"].clearFiles(); // 组件方法
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    uploadRequest(data) {
      const _file = data.file;
      var formData = new FormData();
      formData.append("file", _file);
      return new Promise((resolve, reject) => {
        this.uploadLoading = true;
        if (this.type) {
          uploadShopLogo(formData)
            .then(res => {
              this.uploadLoading = false;
              this.imageUrl = res;
              resolve(res);
            })
            .catch(err => {
              reject();
            });
        } else {
          /*
            文件多上传 把文件变成数组循环显示
          */

          uploadShopAtta(formData)
            .then(res => {
              this.uploadLoading = false;
              this.imageUr = res.url;
              // this.fileName.push({'fileName':res.fileName});
              // console.log(this.fileName);
              resolve(res);
            })
            .catch(err => {
              reject();
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
