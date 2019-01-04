import Vue from 'vue';
import Router from 'vue-router';
import _ from 'lodash';

import authRoutes from './authRoutes';
import grantRoutes from './grantRoutes';
import researchRoutes from './researchRoutes';
import researchGroupRoutes from './researchGroupRoutes';
import userRoutes from './userRoutes';
import otherRoutes from './otherRoutes';
import store from './../store/index';
import usersService from './../services/http/users';
import { isLoggedIn } from './../utils/auth';

Vue.use(Router);

const router = new Router({
    routes: [
        ...authRoutes,
        ...grantRoutes,
        ...researchRoutes,
        ...researchGroupRoutes,
        ...userRoutes,
        ...otherRoutes,
        {
            path: '*',
            name: 'Default',
            beforeEnter: (to, from, next) => {
                const user = store.getters['auth/user'];
                const rolePromise = user.profile 
                    ? Promise.resolve(user.profile.agencies || []) 
                    : usersService.getUserProfile(user.username).then((p) => { return p.agencies });
                
                rolePromise.then((agencies) => {
                    if (_.isEmpty(agencies)) {
                        next({ name: 'ResearchFeed' });
                        return;
                    }
                    
                    const sub = window.tenant;
                    const agency = agencies.find(a => a.name.toLowerCase() == sub.toLowerCase());

                    if (agency) {
                        // todo: replace with Grants list
                        next({ name: 'AgencyPrograms', params: { agency: agency.name } });
                    } else {
                        next({ name: 'ResearchFeed' });
                    }
                });
            }
        }
    ],
    
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            // TODO: Remove this timeout after router\loader refactoring
            setTimeout(() => {
                const anchor = document.querySelector(to.hash);
                if (anchor) {
                    return window.scrollTo({ top: anchor.offsetTop, behavior: 'smooth' });
                }
            }, 1000);
        } else {
            return { x: 0, y: 0 };
        }
    }
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
            next('/sign-in') // otherwise redirect to sign-in page
        }
    }
})


export default router;
