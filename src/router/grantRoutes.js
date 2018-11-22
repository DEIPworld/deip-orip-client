import store from './../store/index';

import GrantStartCreating from '@/components/grand-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grand-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grand-create/CreateDirectGrant';

const grantRoutes =[{
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
    }];


export default grantRoutes;
