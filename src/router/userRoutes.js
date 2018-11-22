import store from './../store/index';

import UserDetails from '@/components/user-details/UserDetails';
import UserWallet from '@/components/user-wallet/components/UserWallet';
import ClaimUserExpertiseDetails from '@/components/claim-expertise-details/ClaimUserExpertiseDetails';
import ClaimUserExpertiseList from '@/components/claim-expertise-list/ClaimUserExpertiseList';

const userRoutes = [{
        path: '/user-details/:account_name',
        name: 'UserDetails',
        component: UserDetails,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('userDetails/loadUser', to.params.account_name)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/user-wallet',
        name: 'UserWallet',
        component: UserWallet,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('userWallet/loadWallet', store.getters['auth/user'].username)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/claim-user-experience',
        name: 'claim-user-expertise-list',
        component: ClaimUserExpertiseList,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('claimExpertiseList/loadAllClaims')
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/claim-user-experience/:account_name/:claim_id',
        name: 'claim-user-expertise-details',
        component: ClaimUserExpertiseDetails,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('claimExpertiseDetails/loadClaimer', {
                username: to.params.account_name,
                claimId: to.params.claim_id
            })
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }];


export default userRoutes;
