import store from './../store/index';

import GrantStartCreating from '@/components/grant-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grant-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grant-create/CreateDirectGrant';
import AgencyPrograms from '@/components/agency-programs/AgencyPrograms';
import AgencyProgramDetails from '@/components/agency-program-details/AgencyProgramDetails';
import FundingOpportunityContractProposal from '@/components/funding-opportunity-contract-proposal/FundingOpportunityContractProposal';
import FundingOpportunityContractDetails from '@/components/funding-opportunity-contract-details/FundingOpportunityContractDetails';
import TreasuryDepartment from '@/components/treasury-department/TreasuryDepartment';

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
        path: '/:agency/programs/:foa/contract-proposal',
        name: 'FundingOpportunityContractProposal',
        component: FundingOpportunityContractProposal,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('agencyProgramContractProposal/loadProgramContractProposalPage', { agency: decodeURIComponent(to.params.agency), foaId: decodeURIComponent(to.params.foa) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:agency/programs/:foa/contract-details/:contractId',
        name: 'FundingOpportunityContractDetails',
        component: FundingOpportunityContractDetails,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('agencyProgramContractDetails/loadProgramContractDetailsPage', 
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
    }
];

export default grantRoutes;
