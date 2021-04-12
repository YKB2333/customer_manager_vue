import Table from './Table'
import TableCheckbox from './Table/TableCheckbox.vue'
import Dialog from './Dialog'
import FileList from './FileList'
import SimpleFile from './SimpleFile'
import PopoverButton from './PopoverButton'

export default {
  install(Vue) {
    Vue.component('MyTable', Table)
    Vue.component('FileList', FileList)
    Vue.component('SimpleFile', SimpleFile)
    Vue.component('MyTableCheckbox', TableCheckbox)
    Vue.component('MyDialog', Dialog)
    Vue.component('MyPopoverButton', PopoverButton)
  }
}