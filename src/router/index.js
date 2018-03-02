import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AdminPage from '@/components/AdminPage'
import ResearchItemLayout from '@/components/ResearchItemLayout'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    }, {
        path: '/adminpage',
        name: 'Admin Page',
        component: AdminPage
    }, {
        path: '/researchItem',
        name: 'Research Item Layout',
        component: ResearchItemLayout
    }]
})
