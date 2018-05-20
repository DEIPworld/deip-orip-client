import Vue from 'vue'
import Vuex from 'vuex'
import researchFeed from './modules/research-feed'
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        researchFeed
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})