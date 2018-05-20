import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import auth from './../components/auth/store/index'
import researchFeed from './../components/research-feed/store/index'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        researchFeed,
        auth
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})