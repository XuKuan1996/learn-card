/*
 * @note:
 * @date: Do not edit
 * @author: Xukuan <kuan.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router.js'
import CKEditor from '@ckeditor/ckeditor5-vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(CKEditor)

initDb()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

function initDb () {
  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
  } else {
    let db
    const request = window.indexedDB.open('db')
    request.onerror = function (e) {
      console.log(e)
    }
    request.onsuccess = function (e) {
      db = e.target.result
      Vue.prototype.$db = db
    }
  }
}
