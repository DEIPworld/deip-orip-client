import Vue from 'vue';
import Vuex from 'vuex';

import { authStore } from '@/components/auth/store';
import { accountStore } from '@/components/Account/store';
import { userDetailsStore } from '@/components/UserDetails/store';

import { feedStore } from '../components/research-feed/store';
import { researchGroupStore } from '../components/research-group-details/store';
import { rgWalletStore } from '../components/research-group-wallet/store';
import { rdStore } from '../components/research-details/store';
import { reStore } from '../components/research-edit/store';
import { rcdStore } from '../components/research-content-details/store';
import { radStore } from '../components/research-application-details/store';
import { userWalletStore } from '../components/user-wallet/store';
import { layoutStore } from '../components/layout/store';
import { claimExpertiseDetailsStore } from '../components/claim-expertise-details/store';
import { claimExpertiseListStore } from '../components/claim-expertise-list/store';
import { votingForBlockProducersStore } from '../components/voting-for-block-producers/store';
import { dashboardStore } from '../components/dashboard/store';
import { investorPortfolioStore } from '../components/investor-portfolio/store';
import { researchGroupSettingsStore } from '../components/research-group-settings/store';
import { participantsStore } from '../components/Participants/store';

import { agencyGrantProgramsStore } from '../components/agency-grant-programs/store';
import { agencyGrantProgramDetailsStore } from '../components/agency-grant-program-details/store';
import { agencyGrantProgramAwardsDashboardStore } from '../components/agency-grant-programs-awards-dashboard/store';
import { agencyGrantProgramAwardDetailsStore } from '../components/agency-grant-program-award-details/store';
import { agencyGrantProgramAwardWithdrawalDetailsStore } from '../components/agency-grant-program-award-withdrawal-details/store';
import { agencyGrantProgramAwardCreateStore } from '../components/agency-grant-program-award-create/store/index';

import { adminPanelStore } from '../components/AdminPanel/store';
import { dSnackbarStore } from '@/components/Deipify/DSnackbar/DSnackbarStore';
import { overviewStore } from '@/components/Overview/store';
import { disciplinesGrowthRateStore } from '@/components/DisciplinesGrowthRate/store';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    snackbar: dSnackbarStore,

    auth: authStore,
    account: accountStore,

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
    dashboard: dashboardStore,
    investorPortfolio: investorPortfolioStore,
    researchGroupSettings: researchGroupSettingsStore,
    participants: participantsStore,

    agencyGrantPrograms: agencyGrantProgramsStore,
    agencyGrantProgramDetails: agencyGrantProgramDetailsStore,
    agencyGrantProgramAwardCreate: agencyGrantProgramAwardCreateStore,
    agencyGrantProgramAwardsDashboard: agencyGrantProgramAwardsDashboardStore,
    agencyGrantProgramAwardDetails: agencyGrantProgramAwardDetailsStore,
    agencyGrantProgramAwardWithdrawalDetails: agencyGrantProgramAwardWithdrawalDetailsStore,

    adminPanel: adminPanelStore,
    overview: overviewStore,

    disciplinesGrowthRate: disciplinesGrowthRateStore,
  },
  strict: process.env.NODE_ENV !== 'production'
});
