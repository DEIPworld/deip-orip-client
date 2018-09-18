import Vue from 'vue'
import Router from 'vue-router'
import SetExpertisePage from '@/components/SetExpertisePage'

import ResearchFeed from '@/components/research-feed/ResearchFeed'
import ResearchDetails from '@/components/research-details/ResearchDetails'
import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails'
import ResearchContentMetadata from '@/components/research-content-details/ResearchContentMetadata'
import ResearchStartCreating from '@/components/research-create/ResearchStartCreating'
import CreateNewResearch from '@/components/research-create/CreateNewResearch'
import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale'

import CreateResearchGroup from '@/components/research-group-create/CreateResearchGroup'
import ResearchGroupDetails from '@/components/research-group-details/ResearchGroupDetails'

import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import EmailSendingRegistration from '@/components/auth/EmailSendingRegistration'
import DataFillingRegistration from '@/components/auth/DataFillingRegistration'
import ClaimExpertiseRegistration from '@/components/auth/ClaimExpertiseRegistration'
import CreateAccountTestNet from '@/components/auth/CreateAccountTestNet'
import VotingForBlockProducers from '@/components/voting-for-block-producers/VotingForBlockProducers'

import UserDetails from '@/components/user-details/UserDetails'
import UserWallet from '@/components/user-wallet/components/UserWallet'

import GrantStartCreating from '@/components/grand-create/GrantStartCreating'
import CreateDisciplineGrant from '@/components/grand-create/CreateDisciplineGrant'
import CreateDirectGrant from '@/components/grand-create/CreateDirectGrant'

import { isLoggedIn } from './../utils/auth';

Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/set-expertise',
        name: 'SetExpertisePage',
        component: SetExpertisePage,
        // meta: {
        //     withoutHeader: true
        // }
    }, {
        path: '/sign-in',
        name: 'SignIn',
        component: SignIn
    }, {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUp
    }, {
        // page for test net only
        path: '/create-testnet-account',
        name: 'create-testnet-account',
        component: CreateAccountTestNet
    }, {
        path: '/voting-for-block-producers',
        name: 'voting-for-block-producers',
        component: VotingForBlockProducers
    }, {
        path: '/research-feed',
        name: 'ResearchFeed',
        component: ResearchFeed
    }, {
        path: '/:research_group_permlink/research/:research_permlink',
        name: 'research-details',
        component: ResearchDetails
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink',
        name: 'ResearchContentDetails',
        component: ResearchContentDetails
    }, {
        path: '/:research_group_permlink/research/:research_permlink/:content_permlink/metadata',
        name: 'ResearchContentMetadata',
        component: ResearchContentMetadata
    }, {
        path: '/create-research',
        name: 'StartCreateResearch',
        component: ResearchStartCreating
    }, {
        path: '/create-new-research',
        name: 'CreateResearch',
        component: CreateNewResearch
    }, {
        path: '/user-details/:account_name',
        name: 'UserDetails',
        component: UserDetails
    }, {
        path: '/:research_group_permlink/create-token-sale/:research_permlink',
        name: 'CreateTokenSale',
        component: CreateTokenSale
    }, {
        path: '/emailSendingRegesitration',
        name: 'EmailSendingRegesitration',
        component: EmailSendingRegistration
    }, {
        path: '/dataFillingRegesitration',
        name: 'DataFillingRegesitration',
        component: DataFillingRegistration
    }, {
        path: '/claimExpertiseRegesitration',
        name: 'ClaimExpertiseRegesitration',
        component: ClaimExpertiseRegistration
    }, {
        path: '/:research_group_permlink/group-details',
        name: 'ResearchGroupDetails',
        component: ResearchGroupDetails
    }, {
        path: '/:account_name/create-research-group',
        name: 'CreateResearchGroup',
        component: CreateResearchGroup
    }, {
        path: '/user-wallet',
        name: 'UserWallet',
        component: UserWallet
    }, {
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
        path: '*',
        redirect: '/research-feed'
    }]
})


router.beforeEach((to, from, next) => {
    if (to.path === '/sign-in' || to.path === '/sign-up' || to.path === '/create-test-net-account') {
        if (isLoggedIn()) {
            next('/') // if token is already presented redirect user to home page
        } else {
            next(); // otherwise redirect to sign-in page
        }
    } else {
        if (isLoggedIn()) {
            next() // if there is a token allow to visit requested route
        } else {
            next('/sign-up') // otherwise redirect to sign-in page
        }
    }
})


export default router;
