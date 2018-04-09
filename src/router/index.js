import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AdminPage from '@/components/AdminPage'
import ResearchItemLayout from '@/components/ResearchItemLayout'

import ResearchFeed from '@/components/research/components/ResearchFeed'
import ResearchDetails from '@/components/research/components/ResearchDetails'
import ResearchStartCreating from '@/components/research/components/ResearchStartCreating'
import ResearchCreating from '@/components/research/components/ResearchCreating'
import ResearchGroupDetails from '@/components/research/components/ResearchGroupDetails'
import UserDetails from '@/components/user/components/UserDetails'

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
        path: '/researchDetails',
        name: 'ResearchDetails',
        component: ResearchDetails
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
        path: '/researchGroupDetails',
        name: 'ResearchGroupDetails',
        component: ResearchGroupDetails
    }]
})
