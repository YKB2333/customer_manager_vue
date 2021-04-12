<template>
  <div id="wangeditor" style="height:100%;">
    <div ref="editor" style=""></div>
  </div> 
</template>
<script>
  import E from 'wangeditor'
  // import {UPLOADER} from '@/api/upload'
  import { uploadOperateOss, uploadGoodsImages } from "@/api/uploadOss";
  import { baseURL } from '@/config'
export default {
  data () {
    return {
      // UPLOADER,
      editor: null,
      baseURL
    }
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  watch: {
    // value(val) {
    //   this.editor.txt.html(this.value)
    // },
  },
  methods: {
    seteditor() {
        this.editor = new E(this.$refs.editor)
        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'justify', // 对齐方式
          'emoticon', // 表情
          'image', // 插入图片
          'undo', // 撤销
          'redo', // 重复
        ]
        this.editor.customConfig.customUploadImg = function (files, insert) {
          let form = new FormData()
          for (let i = 0; i < files.length; i++) {
            form.append('file', files[i])
          }
          uploadOperateOss(form).then(res=>{
            console.log(res);
            insert(res.url)
          })
        }
        this.editor.customConfig.onchange = html => {
            this.$emit('change', html) // 将内容同步到父组件中
        }
        this.editor.create()
    },
    htmlPut(){
      console.log(111,this.value);
      let v = this.value
      if(this.value == null){
        v = ''
      }
      this.editor.txt.html(v)
      // this.$emit('htmlPut')
    }
  },
  created(){
    
  },
  mounted () {
    console.log(111222)
    this.seteditor()
    // this.editor.config.customUploadInit = ''
    // this.editor.config.customUploadInit = this.UPLOADER(this.editor).init()
    // this.editor.txt.html(this.value)
  }
  
}
</script>

<style scoped lang="scss">
</style>
