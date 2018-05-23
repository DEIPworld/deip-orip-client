import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import auth from './../components/auth/store/index'
import feed from './../components/research-feed/store/index'
import researchGroup from './../components/research-group/store/index'
import rd from './../components/research-details/store/index'
import rcd from './../components/research-content-details/store/index'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        auth,
        feed,
        researchGroup,
        rd,
        rcd
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})