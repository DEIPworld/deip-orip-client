import store from './../store/index';

import GrantStartCreating from '@/components/grant-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grant-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grant-create/CreateDirectGrant';
import AgencyPrograms from '@/components/agency/AgencyPrograms';
import AgencyProgramDetails from '@/components/agency/AgencyProgramDetails';

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
            store.dispatch('agency/loadAgencyProgramsListingPage', { agency: decodeURIComponent(to.params.agency) })
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
            store.dispatch('agency/loadAgencyProgramDetailsPage', { agency: decodeURIComponent(to.params.agency), foaId: decodeURIComponent(to.params.foa) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }];

export default grantRoutes;
