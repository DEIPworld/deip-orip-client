import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import auth from './../components/auth/store/index'
import feed from './../components/research-feed/store/index'
import researchGroup from './../components/research-group-details/store/index'
import rd from './../components/research-details/store/index'
import rcd from './../components/research-content-details/store/index'
import userDetails from './../components/user-details/store/index.js'
import userWallet from './../components/user-wallet/store/index.js'
import layout from './../components/layout/store/index.js'
import claimExpertise from './../components/claim-expertise/store/index.js'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        auth,
        feed,
        researchGroup,
        rd,
        rcd,
        userDetails,
        userWallet,
        layout,
        claimExpertise
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
