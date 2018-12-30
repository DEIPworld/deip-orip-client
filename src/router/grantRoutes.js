import store from './../store/index';

import GrantStartCreating from '@/components/grant-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grant-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grant-create/CreateDirectGrant';
import AgencyProfile from '@/components/agency-profile/AgencyProfile';

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
        path: '/agency-profile/:agency',
        name: 'AgencyProfile',
        component: AgencyProfile,
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');
            store.dispatch('agency/loadAgencyProfile', { agency: decodeURIComponent(to.params.agency) })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }];


export default grantRoutes;
