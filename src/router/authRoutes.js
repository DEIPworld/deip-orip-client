import store from './../store/index';

import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import EmailSendingRegistration from '@/components/auth/EmailSendingRegistration';
import DataFillingRegistration from '@/components/auth/DataFillingRegistration';
import ClaimExpertiseRegistration from '@/components/auth/ClaimExpertiseRegistration';

const authRoutes = [{
        path: '/sign-in',
        name: 'SignIn',
        component: SignIn
    }, {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUp
    }, {
        path: '/emailSendingRegesitration',
        name: 'EmailSendingRegesitration',
        component: EmailSendingRegistration
    },
    // {
    //     path: '/dataFillingRegesitration',
    //     name: 'DataFillingRegesitration',
    //     component: DataFillingRegistration
    // }, 
    {
        path: '/claimExpertiseRegesitration',
        name: 'ClaimExpertiseRegesitration',
        component: ClaimExpertiseRegistration
    }];


export default authRoutes;
