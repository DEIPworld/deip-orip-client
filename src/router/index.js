import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AdminPage from '@/components/AdminPage'
import ResearchItemLayout from '@/components/ResearchItemLayout'

import ResearchFeed from '@/components/research/components/ResearchFeed'
import ResearchDetails from '@/components/research/components/ResearchDetails'
import ResearchStartCreating from '@/components/research/components/ResearchStartCreating'
import ResearchCreating from '@/components/research/components/ResearchCreating'

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
        name: 'startCreateResearch',
        component: ResearchStartCreating
    }, {
        path: '/createResearch',
        name: 'createResearch',
        component: ResearchCreating
    }]
})
