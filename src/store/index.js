import Vue from 'vue'
import Vuex from 'vuex'

import { authStore } from '../components/auth/store'
import { feedStore } from '../components/research-feed/store'
import { researchGroupStore } from '../components/research-group-details/store'
import { rgWalletStore } from '../components/research-group-wallet/store'
import { rdStore } from '../components/research-details/store'
import { reStore } from '../components/research-edit/store'
import { rcdStore } from '../components/research-content-details/store'
import { radStore } from '../components/research-application-details/store'
import { userDetailsStore } from '../components/user-details/store'
import { userWalletStore } from '../components/user-wallet/store'
import { layoutStore } from '../components/layout/store'
import { claimExpertiseDetailsStore } from '../components/claim-expertise-details/store'
import { claimExpertiseListStore } from '../components/claim-expertise-list/store'
import { votingForBlockProducersStore } from '../components/voting-for-block-producers/store'
import { organizationProgramsStore } from '../components/agency-programs/store'
import { organizationProgramDetailsStore } from '../components/agency-program-details/store'
import { foaAwardProposalStore } from './../components/funding-opportunity-award-proposal/store/index'
import { dashboardStore } from '../components/dashboard/store'
import { investorDashboardStore } from '../components/investor-dashboard/store'
import { userSettingsStore } from '../components/user-settings/store'
import { researchGroupSettingsStore } from '../components/research-group-settings/store'


Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: authStore,
    feed: feedStore,
    researchGroup: researchGroupStore,
    rgWallet: rgWalletStore,
    rd: rdStore,
    re: reStore,
    rcd: rcdStore,
    rad: radStore,
    userDetails: userDetailsStore,
    userWallet: userWalletStore,
    layout: layoutStore,
    claimExpertiseDetails: claimExpertiseDetailsStore,
    claimExpertiseList: claimExpertiseListStore,
    votingForBlockProducers: votingForBlockProducersStore,
    organizationPrograms: organizationProgramsStore,
    organizationProgramDetails: organizationProgramDetailsStore,
    foaAwardProposal: foaAwardProposalStore,
    
    dashboard: dashboardStore,
    investorDashboard: investorDashboardStore,
    userSettings: userSettingsStore,
    researchGroupSettings: researchGroupSettingsStore
  },
  strict: process.env.NODE_ENV !== 'production',
});
