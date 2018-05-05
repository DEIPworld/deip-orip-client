import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
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

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld,
        meta: {
            withoutHeader: true
        }
    }, {
        path: '/adminpage',
        name: 'AdminPage',
        component: AdminPage,
        meta: {
            withoutHeader: true
        }
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
    }]
})