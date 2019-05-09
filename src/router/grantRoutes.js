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

const grantRoutes =[{
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
            store.dispatch('agencyPrograms/loadAgencyProgramsPage', { agency: decodeURIComponent(to.params.agency), areaCode: to.query.areaCode, subAreaCode: to.query.subAreaCode })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:agency/programs/:foa',
        name: 'AgencyProgramDetails',
        component: AgencyProgramDetails,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('agencyProgramDetails/loadAgencyProgramDetailsPage', { agency: decodeURIComponent(to.params.agency), foaId: decodeURIComponent(to.params.foa) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:agency/programs/:foa/award-proposal',
        name: 'FundingOpportunityAwardProposal',
        component: FundingOpportunityAwardProposal,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('foa_award_proposal/loadProgramAwardProposalPage', { agency: decodeURIComponent(to.params.agency), foaId: decodeURIComponent(to.params.foa) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:agency/programs/:foa/award-details/:contractId',
        name: 'FundingOpportunityAwardDetails',
        component: FundingOpportunityAwardDetails,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('foa_award_details/loadProgramAwardDetailsPage', 
                { agency: decodeURIComponent(to.params.agency), foaId: decodeURIComponent(to.params.foa), contractId: decodeURIComponent(to.params.contractId) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/treasury/agencies-contracts',
        name: 'TreasuryDepartment',
        component: TreasuryDepartment,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('treasuryDepartment/loadTreasuryDepartmentPage')
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:agency/organizations/withdrawal-requests',
        name: 'AgencyProgramWithdrawalRequests',
        component: AgencyProgramWithdrawalRequests,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', 
            { agency: decodeURIComponent(to.params.agency) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }
];

export default grantRoutes;
