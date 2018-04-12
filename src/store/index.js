import Vue from 'vue'
import Vuex from 'vuex'

// 全局vuex方法
import Global from './global'

Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        Global
      },
  })
  