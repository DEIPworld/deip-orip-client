import store from './../store/index';

import ResearchFeed from '@/components/research-feed/ResearchFeed';
import ResearchDetails from '@/components/research-details/ResearchDetails';
import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails';
import ResearchContentMetadata from '@/components/research-content-details/ResearchContentMetadata';
import ResearchContentReview from '@/components/research-content-details/ResearchContentReview';
import ResearchContentAddReview from '@/components/research-content-details/ResearchContentAddReview';
import ResearchStartCreating from '@/components/research-create/ResearchStartCreating';
import CreateNewResearch from '@/components/research-create/CreateNewResearch';
import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale';

const researchRoutes = [{
        path: '/research-feed',
        name: 'ResearchFeed',
        component: ResearchFeed,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            store.dispatch('feed/loadAllResearches')
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:research_group_permlink/research/:research_permlink',
        name: 'ResearchDetails',
        component: ResearchDetails,
        
        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            const permlinks = {
                group_permlink: decodeURIComponent(to.params.research_group_permlink),
                research_permlink: decodeURIComponent(to.params.research_permlink)
            };

            store.dispatch('rd/loadResearchDetails', permlinks)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink',
        name: 'ResearchContentDetails',
        component: ResearchContentDetails,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            const permlinks = {
                group_permlink: decodeURIComponent(to.params.research_group_permlink),
                research_permlink: decodeURIComponent(to.params.research_permlink),
                content_permlink: decodeURIComponent(to.params.content_permlink),
                ref: to.query.ref
            };

            store.dispatch('rcd/loadResearchContentDetails', permlinks)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink/metadata',
        name: 'ResearchContentMetadata',
        component: ResearchContentMetadata,

        beforeEnter: async (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            const permlinks = {
                group_permlink: decodeURIComponent(to.params.research_group_permlink),
                research_permlink: decodeURIComponent(to.params.research_permlink),
                content_permlink: decodeURIComponent(to.params.content_permlink),
                ref: to.query.ref
            };

            await store.dispatch('rcd/loadResearchContentMetadata', permlinks);

            store.dispatch('layout/hideGlobalLoader');
            next();
        }
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink/review/:review_id',
        name: 'ResearchContentReview',
        component: ResearchContentReview,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            const permlinks = {
                group_permlink: decodeURIComponent(to.params.research_group_permlink),
                research_permlink: decodeURIComponent(to.params.research_permlink),
                content_permlink: decodeURIComponent(to.params.content_permlink),
                ref: to.query.ref
            };

            store.dispatch('rcd/loadResearchContentDetails', permlinks)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink/add-review',
        name: 'ResearchContentAddReview',
        component: ResearchContentAddReview,

        beforeEnter: (to, from, next) => {
            store.dispatch('layout/setGlobalLoader');

            const permlinks = {
                group_permlink: decodeURIComponent(to.params.research_group_permlink),
                research_permlink: decodeURIComponent(to.params.research_permlink),
                content_permlink: decodeURIComponent(to.params.content_permlink),
                ref: to.query.ref
            };

            store.dispatch('rcd/loadResearchContentDetails', permlinks)
                .then(() => {
                    store.dispatch('layout/hideGlobalLoader');
                    next();
                });
        }
    }, {
        path: '/create-research',
        name: 'StartCreateResearch',
        component: ResearchStartCreating
    }, {
        path: '/create-new-research',
        name: 'CreateResearch',
        component: CreateNewResearch
    }, {
        path: '/:research_group_permlink/create-token-sale/:research_permlink',
        name: 'CreateTokenSale',
        component: CreateTokenSale
    }];

export default researchRoutes;
