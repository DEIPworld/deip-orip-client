import Vue from 'vue'
import Router from 'vue-router'
import AdminPage from '@/components/AdminPage'
import ResearchItemLayout from '@/components/ResearchItemLayout'

import ResearchFeed from '@/components/research/components/ResearchFeed'
import ResearchDetails from '@/components/research/components/ResearchDetails'
import ResearchStartCreating from '@/components/research/components/ResearchStartCreating'
import ResearchCreating from '@/components/research/components/ResearchCreating'
import ResearchGroupCreating from '@/components/research/components/ResearchGroupCreating'
import ResearchGroupDetails from '@/components/research/components/ResearchGroupDetails'
import ResearchContentDetails from '@/components/research/components/ResearchContentDetails'

import UserDetails from '@/components/user/components/UserDetails'
import TokenSale from '@/components/user/components/TokenSale'
import UserAuthorization from '@/components/user/components/auth/UserAuthorization'
import EmailSendingRegesitration from '@/components/user/components/auth/EmailSendingRegesitration'
import DataFillingRegesitration from '@/components/user/components/auth/DataFillingRegesitration'
import ClaimExpertiseRegesitration from '@/components/user/components/auth/ClaimExpertiseRegesitration'
import PreliminaryRegistration from '@/components/user/components/auth/PreliminaryRegistration'
import UserWallet from '@/components/user/components/UserWallet'

import { isLoggedIn } from './../utils/auth';

Vue.use(Router)

const router = new Router({
    mode: 'history',
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
        component: UserAuthorization
    }, {
        path: '/sign-up',
        name: 'SignUp',
        component: PreliminaryRegistration
    }, {
        path: '/researchItem',
        name: 'ResearchItemLayout',
        component: ResearchItemLayout,
        meta: {
            withoutHeader: true
        }
    }, {
        path: '/researchFeed',
        name: 'ResearchFeed',
        component: ResearchFeed
    }, {
        path: '/researchDetails/:research_id',
        name: 'ResearchDetails',
        component: ResearchDetails
    }, {
        path: '/researchDetails/:research_id/:content_id',
        name: 'ResearchContentDetails',
        component: ResearchContentDetails
    }, {
        path: '/startCreateResearch',
        name: 'StartCreateResearch',
        component: ResearchStartCreating
    }, {
        path: '/createResearch',
        name: 'CreateResearch',
        component: ResearchCreating
    }, {
        path: '/userDetails',
        name: 'UserDetails',
        component: UserDetails
    }, {
        path: '/tokenSale',
        name: 'TokenSale',
        component: TokenSale
    }, {
        path: '/userAuthorization',
        name: 'UserAuthorization',
        component: UserAuthorization
    }, {
        path: '/emailSendingRegesitration',
        name: 'EmailSendingRegesitration',
        component: EmailSendingRegesitration
    }, {
        path: '/dataFillingRegesitration',
        name: 'DataFillingRegesitration',
        component: DataFillingRegesitration
    }, {
        path: '/preliminaryRegistration',
        name: 'PreliminaryRegistration',
        component: PreliminaryRegistration
    }, {
        path: '/claimExpertiseRegesitration',
        name: 'ClaimExpertiseRegesitration',
        component: ClaimExpertiseRegesitration
    }, {
        path: '/researchGroupDetails',
        name: 'ResearchGroupDetails',
        component: ResearchGroupDetails
    }, {
        path: '/researchGroupCreating',
        name: 'ResearchGroupCreating',
        component: ResearchGroupCreating
    }, {
        path: '/userWallet',
        name: 'UserWallet',
        component: UserWallet
    }, {
        path: '*',
        redirect: '/researchFeed'
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
            next('/sign-in') // otherwise redirect to sign-in page
        }
    }
})


export default router;