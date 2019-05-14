import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import auth from './../components/auth/store/index'
import feed from './../components/research-feed/store/index'
import researchGroup from './../components/research-group-details/store/index'
import rgWallet from './../components/research-group-wallet/store/index'
import rd from './../components/research-details/store/index'
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
import foa_award_proposal from './../components/funding-opportunity-award-proposal/store/index'
import foa_award_details from './../components/funding-opportunity-award-details/store/index'
import agencyProgramWithdrawalRequests from './../components/agency-program-withdrawal-requests/store/index'
import treasuryDepartment from './../components/treasury-department/store/index'
import org_dashboard from './../components/organization-dashboard/store/index'
import org_finance_dashboard from './../components/organization-finance-dashboard/store/index'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        feed,
        researchGroup,
        rgWallet,
        rd,
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
        foa_award_proposal,
        foa_award_details,
        agencyProgramWithdrawalRequests,
        treasuryDepartment,
        org_dashboard,
        org_finance_dashboard
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
});
