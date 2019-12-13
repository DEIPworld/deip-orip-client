import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import auth from './../components/auth/store/index'
import feed from './../components/research-feed/store/index'
import researchGroup from './../components/research-group-details/store/index'
import rgWallet from './../components/research-group-wallet/store/index'
import rd from './../components/research-details/store/index'
import re from './../components/research-edit/store/index'
import rcd from './../components/research-content-details/store/index'
import rad from './../components/research-application-details/store/index'
import userDetails from './../components/user-details/store/index'
import userWallet from './../components/user-wallet/store/index'
import layout from './../components/layout/store/index'
import claimExpertiseDetails from './../components/claim-expertise-details/store/index'
import claimExpertiseList from './../components/claim-expertise-list/store/index'
import votingForBlockProducers from './../components/voting-for-block-producers/store/index'
import agencyPrograms from './../components/agency-programs/store/index'
import agencyProgramDetails from './../components/agency-program-details/store/index'
import dashboard from './../components/dashboard/store/index'
import dashboard_gsk_demo from './../components/dashboard-gsk-demo/store/index'
import investorDashboard from './../components/investor-dashboard/store/index'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        feed,
        researchGroup,
        rgWallet,
        rd,
        re,
        rcd,
        rad,
        userDetails,
        userWallet,
        layout,
        claimExpertiseDetails,
        claimExpertiseList,
        votingForBlockProducers,
        agencyPrograms,
        agencyProgramDetails,
        dashboard,
        dashboard_gsk_demo,
        investorDashboard
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
});
