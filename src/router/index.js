import Vue from 'vue';
import Router from 'vue-router';

import { store } from '@/store/index';
import { loadPage } from '@/router/utils/loadPage';

import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import TenantSignIn from '@/components/auth/TenantSignIn';
import Dashboard from '@/components/dashboard/DashboardNew';

import GrantPrograms from '@/components/agency-grant-programs/GrantPrograms';
import GrantProgramDetails from '@/components/agency-grant-program-details/GrantProgramDetails';
import CreateGrantProgramAward
  from '@/components/agency-grant-program-award-create/CreateGrantProgramAward';
import CreateGrantProgram from '@/components/agency-grant-program-create/CreateGrantProgram';
import GrantProgramsAwardsDashboard
  from '@/components/agency-grant-programs-awards-dashboard/GrantProgramsAwardsDashboard';
import GrantProgramAwardDetails
  from '@/components/agency-grant-program-award-details/GrantProgramAwardDetails';
import GrantProgramAwardWithdrawalDetails
  from '@/components/agency-grant-program-award-withdrawal-details/GrantProgramAwardWithdrawalDetails';

import CreateResearchGroup from '@/components/research-group-create/CreateResearchGroup';
import ResearchGroupDetails from '@/components/research-group-details/ResearchGroupDetails';
import ResearchGroupSettings from '@/components/research-group-settings/ResearchGroupSettings';


import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails';
import ResearchContentMetadata from '@/components/research-content-details/ResearchContentMetadata';

import ResearchContentReferences from '@/components/research-content-details/ResearchContentReferences';

import NoAccessPage from '@/components/NoAccessPage';
import VotingForBlockProducers from '@/components/voting-for-block-producers/VotingForBlockProducers';
import InvestorPortfolio from '@/components/investor-portfolio/InvestorPortfolio';


import FAQ from '@/components/faq/FAQ';
import UserApplicationAccepted from '@/components/user-application-accepted/UserApplicationAccepted';

import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';

import { accountRouting } from '@/components/Account/router';
import { userDetailRouting } from '@/components/UserDetails/router';
import { adminRouting } from '@/components/AdminPanel/router';
import { ParticipantstRouting } from '@/components/Participants/router';
import ResearchRequestFormCreate from '@/components/ResearchRequest/ResearchRequestFormCreate';
import { awaitStore } from '@/utils/helpers';
import { overviewRouting } from '@/components/Overview/router';
import { preliminaryDataLoader } from './utils/preliminaryDataLoader';
import { sandboxRouting } from '@/components/_Sandbox/router';
import { projectRouting } from '@/features/Projects/router';
import { groupRouting } from '@/components/Group/router';
import { landingRouting } from '@/components/Landing/router';
import { TransactionsRouting } from '@/components/Transactions/router';

import { exploreRouter } from '@/features/Explore/router';
import { WalletRouting } from '@/components/Wallet/router';

const accessService = AccessService.getInstance();
const usersService = UsersService.getInstance();

Vue.use(Router);

const router = new Router({
  routes: [

    ...exploreRouter,

    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      beforeEnter: (to, from, next) => {
        if (Vue.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY') {
          const tenant = store.getters['auth/tenant'];
          if (!tenant) {
            throw new Error('Granting agency must be specified for the Demo');
          }
          next({ name: 'TenantSignIn' });
        } else {
          next();
        }
      },
      meta: {
        withoutHeader: true
      }
    },
    {
      path: '/org-sign-in',
      name: 'TenantSignIn',
      component: TenantSignIn
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      meta: {
        withoutHeader: true,
        viewTitle: 'Sign Up'
      }
    }, {
      path: '/:agency/grants/dashboard',
      name: 'GrantProgramsAwardsDashboard',
      component: GrantProgramsAwardsDashboard,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantProgramAwardsDashboard/loadAgencyAwardsDashboardPage', {
          orgExternalId: to.params.agency
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/grants/award/:award_number/:subaward_number',
      name: 'GrantProgramAwardDetails',
      component: GrantProgramAwardDetails,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantProgramAwardDetails/loadAwardDetailsPage', {
          awardNumber: decodeURIComponent(to.params.award_number),
          subawardNumber: decodeURIComponent(to.params.subaward_number)
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/grants/award/:award_number/:subaward_number/withdrawal/:payment_number',
      name: 'GrantProgramAwardWithdrawalDetails',
      component: GrantProgramAwardWithdrawalDetails,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantProgramAwardWithdrawalDetails/loadWithdrawalDetailsPage', {
          awardNumber: decodeURIComponent(to.params.award_number),
          subawardNumber: decodeURIComponent(to.params.subaward_number),
          paymentNumber: decodeURIComponent(to.params.payment_number)
        });
        loadPage(loadPagePromise, next);
      }
    },
    {
      path: '/:agency/programs',
      name: 'GrantPrograms',
      component: GrantPrograms,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantPrograms/loadGrantProgramsPage', {
          orgExternalId: to.params.agency,
          areaCode: to.query.areaCode,
          subAreaCode: to.query.subAreaCode
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/:agency/programs/:foa',
      name: 'GrantProgramDetails',
      component: GrantProgramDetails,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantProgramDetails/loadGrantProgramDetailsPage', {
          orgExternalId: to.params.agency,
          foaId: decodeURIComponent(to.params.foa)
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/:agency/programs/:foa/award-proposal',
      name: 'CreateGrantProgramAward',
      component: CreateGrantProgramAward,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('agencyGrantProgramAwardCreate/loadProgramAwardProposalPage', {
          orgExternalId: to.params.agency,
          foaId: decodeURIComponent(to.params.foa),
          awardee: to.query.awardee ? JSON.parse(to.query.awardee) : null
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/:teamId/group-details',
      name: 'teamDetails',
      component: ResearchGroupDetails
    }, {
      path: '/:teamId/group-details/group-settings',
      name: 'teamSettings',
      component: ResearchGroupSettings
    }, {
      path: '/:account_name/create-research-group',
      name: 'CreateResearchGroup',
      component: CreateResearchGroup
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('dashboard/loadDashboardPage', {
          username: decodeURIComponent(store.getters['auth/user'].username)
        });
        loadPage(loadPagePromise, next);
      }
    },

    // {
    //   path: '/:teamId/research/:projectId/:contentId/metadata',
    //   name: 'ResearchContentMetadata',
    //   component: preliminaryDataLoader(ResearchContentMetadata, {
    //     beforeEnter: async (to, from, next) => {
    //       const loadPagePromise = store.dispatch('rcd/loadResearchContentMetadata', {
    //         teamId: decodeURIComponent(to.params.teamId),
    //         projectId: decodeURIComponent(to.params.projectId),
    //         contentId: decodeURIComponent(to.params.contentId),
    //         ref: to.query.ref
    //       });
    //       loadPage(loadPagePromise, next);
    //     }
    //   })
    // },
    {
      path: '/research/:projectId/:contentId/references',
      name: 'ResearchContentReferences',
      component: preliminaryDataLoader(ResearchContentReferences, {
        beforeEnter: (to, from, next) => {
          const loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
            projectId: to.params.projectId,
            contentId: to.params.contentId,
            ref: to.query.ref
          });
          loadPage(loadPagePromise, next);
        }
      })
    }, {
      path: '/propose-research',
      name: 'CreateResearchProposal',
      component: ResearchRequestFormCreate,
      meta: {
        withoutHeader: true
      }
    },

    ...sandboxRouting,

    ...projectRouting,
    ...groupRouting,

    ...userDetailRouting,
    ...accountRouting,
    ...adminRouting,
    ...ParticipantstRouting,
    ...overviewRouting,
    ...landingRouting,
    ...TransactionsRouting,
    ...WalletRouting, 
    
    {
      // TODO: deprecated
      path: '/no-access-page',
      name: 'NoAccessPage',
      component: NoAccessPage,
      meta: {
        withoutHeader: true
      }
    }, {
      path: '/voting-for-block-producers',
      name: 'VotingForBlockProducers',
      component: preliminaryDataLoader(VotingForBlockProducers, {
        beforeEnter: (to, from, next) => {
          const loadPagePromise = store.dispatch('votingForBlockProducers/loadProducers', {});
          loadPage(loadPagePromise, next);
        }
      })
    }, {
      path: '/investor-portfolio',
      name: 'InvestorPortfolio',
      component: InvestorPortfolio,
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('investorPortfolio/loadInvestmentPortfolioPage', {
          username: decodeURIComponent(store.getters['auth/user'].username)
        });
        loadPage(loadPagePromise, next);
      }
    }, {
      path: '/create-funding-opportunity-announcement',
      name: 'CreateGrantProgram',
      component: CreateGrantProgram
    }, {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    },
    {
      path: '/user-application-accepted',
      name: 'UserApplicationAccepted',
      component: UserApplicationAccepted
    },
    {
      path: '/',
      name: 'Default',
      beforeEnter: (to, from, next) => {
        const user = store.getters['auth/user'];
        const rolePromise = user.profile
          ? Promise.resolve(user.profile.roles || [])
          : usersService.getUser(user.username)
            .then((u) => u.profile.roles || []);

        rolePromise.then((roles) => {
          if (Vue.$env.DEMO == 'GRANT-DISTRIBUTION-TRANSPARENCY') {
            const tenant = store.getters['auth/tenant'];
            if (!tenant) {
              throw new Error('Granting agency must be specified for the Demo');
            }
            next({
              name: 'GrantProgramsAwardsDashboard',
              params: { agency: tenant.account.external_id }
            });
          } else {
            next({ name: 'landing' });
          }
        });
      }
    }, {
      path: '*',
      redirect: { name: 'Default' }
    }],

  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // TODO: Remove this timeout after router\loader refactoring
      setTimeout(() => {
        const anchor = document.querySelector(to.hash);
        if (anchor) {
          return window.scrollTo({
            top: anchor.offsetTop,
            behavior: 'smooth'
          });
        }
      }, 500);
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});

const authDataLoad = () => Promise.all([
  // ...[Object.keys(store.state.auth.user).map((key) => awaitStore('auth/user', key))],
  awaitStore('auth/loaded'),
  // awaitStore('auth/user', 'account'),
  awaitStore('auth/tenant'),
  awaitStore('auth/assets')
]);

router.beforeEach((to, from, next) => {
  const PUBLIC_PAGES_NAMES = [
    'landing',
    'explore',

    'NoAccessPage',
    'FAQ',
    'UserApplicationAccepted',
    'project.details'
  ];

  const loginPages = [
    '/sign-in',
    '/sign-up',
    '/org-sign-in',
    '/admin/sign-in'
  ];

  // TODO: sheetcode with multiple entries
  // need router rebuild

  if (loginPages.includes(to.path)) {
    if (accessService.isLoggedIn()) {
      authDataLoad()
        .then(() => { next(to.path === '/admin/sign-in' ? '/admin' : '/'); }); // if token is already presented redirect user to home page
    } else {
      next(); // otherwise redirect to sign-in page
    }
  } else if (PUBLIC_PAGES_NAMES.includes(to.name)) {
    next();
  } else if (accessService.isLoggedIn()) {
    authDataLoad()
      .then(() => { next(); }); // if there is a token allow to visit requested route
  } else {
    next(!to.path.includes('admin') ? { name: 'landing' } : { name: 'admin.login' }); // otherwise redirect to sign-in page
  }
});

export {
  router
};
