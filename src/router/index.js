import Vue from 'vue'
import Router from 'vue-router'
import AdminPage from '@/components/AdminPage'

import ResearchFeed from '@/components/research-feed/ResearchFeed'
import ResearchDetails from '@/components/research-details/ResearchDetails'
import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails'
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

import UserDetails from '@/components/user-details/UserDetails'
import UserWallet from '@/components/user-wallet/components/UserWallet'

import { isLoggedIn } from './../utils/auth';

Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/adminpage',
        name: 'AdminPage',
        component: AdminPage,
        meta: {
            withoutHeader: true
        }
    }, {
        path: '/sign-in',
        name: 'SignIn',
        component: SignIn
    }, {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUp
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
        path: '*',
        redirect: '/research-feed'
    }]
})


router.beforeEach((to, from, next) => {
    if (to.path == '/sign-in' || to.path == '/sign-up') {
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