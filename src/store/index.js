import Vue from 'vue';
import Vuex from 'vuex';

import { authStore } from '@/components/auth/store';
import { accountStore } from '@/components/Account/store';
import { userDetailsStore } from '@/components/UserDetails/store';

import { snackbarStore } from '@/components/Deipify/DSnackbar/store';
import { overviewStore } from '@/components/Overview/store';
import { disciplinesGrowthRateStore } from '@/components/DisciplinesGrowthRate/store';
import { researchGroupStore } from '../components/research-group-details/store';
import { rcdStore } from '../components/research-content-details/store';
import { layoutStore } from '../components/layout/store';
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

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    snackbar: snackbarStore,

    auth: authStore,
    account: accountStore,

    researchGroup: researchGroupStore,
    rcd: rcdStore,
    userDetails: userDetailsStore,
    layout: layoutStore,
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

    disciplinesGrowthRate: disciplinesGrowthRateStore
  },
  strict: process.env.NODE_ENV !== 'production'
});
