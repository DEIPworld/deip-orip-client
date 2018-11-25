import store from './../store/index';

import CreateResearchGroup from '@/components/research-group-create/CreateResearchGroup';
import ResearchGroupDetails from '@/components/research-group-details/ResearchGroupDetails';

const resesarchGrouproutes = [{
        path: '/:research_group_permlink/group-details',
        name: 'ResearchGroupDetails',
        component: ResearchGroupDetails,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('researchGroup/loadResearchGroup', decodeURIComponent(to.params.research_group_permlink))
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:account_name/create-research-group',
        name: 'CreateResearchGroup',
        component: CreateResearchGroup
    }];

export default resesarchGrouproutes;
