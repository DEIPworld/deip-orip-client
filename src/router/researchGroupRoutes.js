import store from './../store/index';

import preliminaryDataLoader from './utils/preliminaryDataLoader';

import CreateResearchGroup from '@/components/research-group-create/CreateResearchGroup';
import ResearchGroupDetails from '@/components/research-group-details/ResearchGroupDetails';
import ResearchGroupWallet from '@/components/research-group-wallet/ResearchGroupWallet';

const resesarchGrouproutes = [{
        path: '/:research_group_permlink/group-details',
        name: 'ResearchGroupDetails',
        
        component: preliminaryDataLoader(
            ResearchGroupDetails, {
            beforeEnter: (to, from, next) => {
                store.dispatch('layout/setGlobalLoader');

                store.dispatch('researchGroup/loadResearchGroup', decodeURIComponent(to.params.research_group_permlink))
                    .then(() => {
                        store.dispatch('layout/hideGlobalLoader');
                        next();
                    });
            }
        })
    }, {
        path: '/:account_name/create-research-group',
        name: 'CreateResearchGroup',
        component: CreateResearchGroup
    }, {
        path: '/research-group-wallet',
        name: 'ResearchGroupWallet',
        component: ResearchGroupWallet
    }];

export default resesarchGrouproutes;
