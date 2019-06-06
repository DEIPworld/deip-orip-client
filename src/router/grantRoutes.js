import store from './../store/index';

import GrantStartCreating from '@/components/grant-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grant-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grant-create/CreateDirectGrant';
import AgencyPrograms from '@/components/agency-programs/AgencyPrograms';
import AgencyProgramDetails from '@/components/agency-program-details/AgencyProgramDetails';
import FundingOpportunityAwardProposal from '@/components/funding-opportunity-award-proposal/FundingOpportunityAwardProposal';
import FundingOpportunityAwardDetails from '@/components/funding-opportunity-award-details/FundingOpportunityAwardDetails';
import TreasuryDepartment from '@/components/treasury-department/TreasuryDepartment';
import AgencyProgramWithdrawalRequests from '@/components/agency-program-withdrawal-requests/AgencyProgramWithdrawalRequests';
import OrganizationFinanceDashboard from '@/components/organization-finance-dashboard/OrganizationFinanceDashboard';
import AwardDetails from '@/components/award-details/AwardDetails';
import PaymentDetails from '@/components/payment-details/PaymentDetails';

const grantRoutes = [{
  path: '/create-grant',
  name: 'CreateGrant',
  component: GrantStartCreating
}, {
  path: '/create-discipline-grant',
  name: 'CreateDisciplineGrant',
  component: CreateDisciplineGrant
}, {
  path: '/create-direct-grant',
  name: 'CreateDirectGrant',
  component: CreateDirectGrant
}, {
  path: '/:agency/programs',
  name: 'AgencyPrograms',
  component: AgencyPrograms,
  beforeEnter: (to, from, next) => {
    store.dispatch('layout/setGlobalLoader');
    let loadPagePromise = store.dispatch('agencyPrograms/loadAgencyProgramsPage', { 
      agency: decodeURIComponent(to.params.agency), 
      areaCode: to.query.areaCode, 
      subAreaCode: to.query.subAreaCode 
    });
    loadPage(loadPagePromise, next);
  }
}, {
  path: '/:agency/programs/:foa',
  name: 'AgencyProgramDetails',
  component: AgencyProgramDetails,
  beforeEnter: (to, from, next) => {
    let loadPagePromise = store.dispatch('agencyProgramDetails/loadAgencyProgramDetailsPage', { 
      agency: decodeURIComponent(to.params.agency), 
      foaId: decodeURIComponent(to.params.foa) 
    });
    loadPage(loadPagePromise, next);
  }
}, {
  path: '/:agency/programs/:foa/award-proposal',
  name: 'FundingOpportunityAwardProposal',
  component: FundingOpportunityAwardProposal,
  beforeEnter: (to, from, next) => {
    let loadPagePromise = store.dispatch('foa_award_proposal/loadProgramAwardProposalPage', { 
      agency: decodeURIComponent(to.params.agency), 
      foaId: decodeURIComponent(to.params.foa) 
    });
    loadPage(loadPagePromise, next);
  }
}, {
  path: '/:agency/programs/:foa/award-details/:contractId',
  name: 'FundingOpportunityAwardDetails',
  component: FundingOpportunityAwardDetails,
  beforeEnter: (to, from, next) => {
    let loadPagePromise = store.dispatch('foa_award_details/loadProgramAwardDetailsPage', {
      agency: decodeURIComponent(to.params.agency),
      foaId: decodeURIComponent(to.params.foa),
      contractId: decodeURIComponent(to.params.contractId)
    });
    loadPage(loadPagePromise, next);
  }
}, {
  path: '/treasury/agencies-contracts',
  name: 'TreasuryDepartment',
  component: TreasuryDepartment,
  beforeEnter: (to, from, next) => {
    let loadPagePromise = store.dispatch('treasuryDepartment/loadTreasuryDepartmentPage');
    loadPage(loadPagePromise, next);
  }
}, {
  path: '/:agency/organizations/withdrawal-requests',
  name: 'AgencyProgramWithdrawalRequests',
  component: AgencyProgramWithdrawalRequests,
  beforeEnter: (to, from, next) => {
    let loadPagePromise = store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', { 
      agency: decodeURIComponent(to.params.agency) 
    });
    loadPage(loadPagePromise, next);
  }
}, {
    path: '/:org/finance',
    name: 'OrganizationFinanceDashboard',
    component: OrganizationFinanceDashboard,
    beforeEnter: (to, from, next) => {
      let loadPagePromise = store.dispatch('org_finance_dashboard/loadOrganizationFinanceDashboardPage', {
        permlink: decodeURIComponent(to.params.org)
      });
      loadPage(loadPagePromise, next);
    }
  }, {
    path: '/:org/award-details/:contractId/:awardId',
    name: 'AwardDetails',
    component: AwardDetails,
    beforeEnter: (to, from, next) => {
      let loadPagePromise = store.dispatch('award_details/loadAwardDetailsPage', {
        orgPermlink: decodeURIComponent(to.params.org),
        contractId: decodeURIComponent(to.params.contractId),
        awardId: decodeURIComponent(to.params.awardId)
      });
      loadPage(loadPagePromise, next);
    }
  }, {
    path: '/:org/payment-details/:contractId/:awardId/:paymentId',
    name: 'PaymentDetails',
    component: PaymentDetails,
    beforeEnter: (to, from, next) => {
      let loadPagePromise = store.dispatch('payment_details/loadPaymentDetailsPage', {
        orgPermlink: decodeURIComponent(to.params.org),
        contractId: decodeURIComponent(to.params.contractId),
        awardId: decodeURIComponent(to.params.awardId),
        paymentId: decodeURIComponent(to.params.paymentId)
      });
      loadPage(loadPagePromise, next);
    }
  }
];

function loadPage(loadPagePromise, next) {
  store.dispatch('layout/setGlobalLoader');
  loadPagePromise.then(() => {
    store.dispatch('layout/hideGlobalLoader');
    next();
  })
}

export default grantRoutes;
