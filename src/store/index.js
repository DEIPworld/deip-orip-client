import Vue from 'vue';
import Vuex from 'vuex';

import { authStore } from '@/components/auth/store';
import { accountStore } from '@/components/Account/store';

import { snackbarStore } from '@/components/Deipify/DSnackbar/store';
import { overviewStore } from '@/components/Overview/store';
import { domainsGrowthRateStore } from '@/components/DisciplinesGrowthRate/store';
import { rcdStore } from '../components/research-content-details/store';
import { layoutStore } from '../components/layout/store';
import { dashboardStore } from '../components/dashboard/store';
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

    rcd: rcdStore,
    layout: layoutStore,
    dashboard: dashboardStore,
    participants: participantsStore,

    agencyGrantPrograms: agencyGrantProgramsStore,
    agencyGrantProgramDetails: agencyGrantProgramDetailsStore,
    agencyGrantProgramAwardCreate: agencyGrantProgramAwardCreateStore,
    agencyGrantProgramAwardsDashboard: agencyGrantProgramAwardsDashboardStore,
    agencyGrantProgramAwardDetails: agencyGrantProgramAwardDetailsStore,
    agencyGrantProgramAwardWithdrawalDetails: agencyGrantProgramAwardWithdrawalDetailsStore,

    adminPanel: adminPanelStore,
    overview: overviewStore,

    domainsGrowthRate: domainsGrowthRateStore
  },
  strict: process.env.NODE_ENV !== 'production'
});
