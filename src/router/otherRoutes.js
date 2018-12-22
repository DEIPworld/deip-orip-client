import store from './../store/index';

import preliminaryDataLoader from './utils/preliminaryDataLoader';

import SetExpertisePage from '@/components/SetExpertisePage';
import NoAccessPage from '@/components/NoAccessPage';
import CreateAccountTestNet from '@/components/auth/CreateAccountTestNet';
import VotingForBlockProducers from '@/components/voting-for-block-producers/VotingForBlockProducers';
import InvestorDashboard from '@/components/investor-flow/dashboard/InvestorDashboard';

const otherRoutes = [{
        path: '/set-expertise',
        name: 'SetExpertisePage',
        component: SetExpertisePage,
    }, {
        path: '/no-access-page',
        name: 'no-access-page',
        component: NoAccessPage,
        meta: {
            withoutHeader: true
        }
    }, 
    // {
    //     // page for test net only
    //     path: '/create-testnet-account',
    //     name: 'create-testnet-account',
    //     component: CreateAccountTestNet
    // }, 
    {
        path: '/voting-for-block-producers',
        name: 'voting-for-block-producers',

        component: preliminaryDataLoader(
            VotingForBlockProducers, {
            beforeEnter: (to, from, next) => {
                store.dispatch('layout/setGlobalLoader');

                store.dispatch('votingForBlockProducers/loadProducers')
                    .then(() => {
                        store.dispatch('layout/hideGlobalLoader');
                        next();
                    });
            }
        })
    }, {
        path: '/investor-dashboard',
        name: 'investor-dashboard',
        component: InvestorDashboard
    }];


export default otherRoutes;
