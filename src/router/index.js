import Vue from 'vue';
import Router from 'vue-router';

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
import ResearchGroupWallet from '@/components/research-group-wallet/ResearchGroupWallet';
import ResearchGroupSettings from '@/components/research-group-settings/ResearchGroupSettings';

import ResearchFeed from '@/components/research-feed/ResearchFeed';
import ResearchDetails from '@/components/research-details/ResearchDetails';
import ResearchDetailsPublic from '@/components/research-details/ResearchDetailsPublic';
import ResearchEdit from '@/components/research-edit/ResearchEdit';
import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails';
import ResearchApplicationDetails
  from '@/components/research-application-details/ResearchApplicationDetails';
import ResearchApplicationReview
  from '@/components/research-application-details/ResearchApplicationReview';
import ResearchApplicationAddReview
  from '@/components/research-application-details/ResearchApplicationAddReview';
import ResearchContentMetadata from '@/components/research-content-details/ResearchContentMetadata';
import ResearchContentReview from '@/components/research-content-details/ResearchContentReview';
import ResearchContentAddReview
  from '@/components/research-content-details/ResearchContentAddReview';
import ResearchStartCreating from '@/components/research-create/ResearchStartCreating';
import CreateNewResearch from '@/components/research-create/CreateNewResearch';
import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale';
import ResearchContentReferences
  from '@/components/research-content-details/ResearchContentReferences';

import AccountSettings from '@/components/account-settings/AccountSettings';
import ChangePassword from '@/components/account-settings/components/ChangePassword';
import PrivateKeyDownload from '@/components/account-settings/components/PrivateKeyDownload';
import UserDetails from '@/components/user-details/UserDetails';
import UserExpertiseDetails from '@/components/user-details/UserExpertiseDetails';
import UserWallet from '@/components/user-wallet/components/UserWallet';
import UserSettings from '@/components/user-settings/UserSettings';

import ClaimUserExpertiseDetails
  from '@/components/claim-expertise-details/ClaimUserExpertiseDetails';
import ClaimUserExpertiseList from '@/components/claim-expertise-list/ClaimUserExpertiseList';

import NoAccessPage from '@/components/NoAccessPage';
import VotingForBlockProducers
  from '@/components/voting-for-block-producers/VotingForBlockProducers';
import InvestorPortfolio from '@/components/investor-portfolio/InvestorPortfolio';
import ReviewSetup from '@/components/review-setup/ReviewSetup';

import FAQ from '@/components/faq/FAQ';

import AdminPanel from '@/components/AdminPanel/AdminPanel';
import AdminMembers from '@/components/AdminPanel/AdminMembers';


import { store } from '@/store/index';

import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';
import { AppConfigService } from '@deip/app-config-service';
import AdminProjects from '@/components/AdminPanel/AdminProjects';
import AdminCriteria from '@/components/AdminPanel/AdminCriteria';
import AdminFAQ from '@/components/AdminPanel/AdminFAQ';
import AdminSettings from '@/components/AdminPanel/AdminSettings';
import preliminaryDataLoader from './utils/preliminaryDataLoader';
import UserRegistration from '@/components/auth/UserRegistration';

const accessService = AccessService.getInstance();
const usersService = UsersService.getInstance();
const appConfigService = AppConfigService.getInstance();

Vue.use(Router);

const RouterViewNestedWatcher = {
  template: '<router-view></router-view>'
};

const router = new Router({
  routes: [{
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    beforeEnter: (to, from, next) => {
      const env = appConfigService.get('env');
      if (env.DEMO == 'GRANT-DISTRIBUTION-TRANSPARENCY') {
        const agency = store.getters['auth/tenant'];
        if (!agency) {
          throw new Error('Granting agency must be specified for the Demo');
        }
        next({ name: 'TenantSignIn' });
      } else {
        next();
      }
    }
  }, {
    path: '/org-sign-in',
    name: 'TenantSignIn',
    component: TenantSignIn
  }, {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: {
      viewTitle: 'Sign Up'
    }
  }, {
    path: '/:agency/grants/dashboard',
    name: 'GrantProgramsAwardsDashboard',
    component: GrantProgramsAwardsDashboard,
    beforeEnter: (to, from, next) => {
      const loadPagePromise = store.dispatch('agencyGrantProgramAwardsDashboard/loadAgencyAwardsDashboardPage', {
        permlink: decodeURIComponent(to.params.agency)
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
        organization: decodeURIComponent(to.params.agency),
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
        organization: decodeURIComponent(to.params.agency),
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
        organization: decodeURIComponent(to.params.agency),
        foaId: decodeURIComponent(to.params.foa)
      });
      loadPage(loadPagePromise, next);
    }
  }, {
    path: '/:research_group_permlink/group-details',
    name: 'ResearchGroupDetails',
    component: preliminaryDataLoader(ResearchGroupDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('researchGroup/loadResearchGroup', {
          permlink: decodeURIComponent(to.params.research_group_permlink)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/group-details/group-settings',
    name: 'ResearchGroupSettings',
    component: preliminaryDataLoader(ResearchGroupSettings, {
      beforeEnter: (to, from, next) => {
        if (store.getters['auth/user'].groups.find((item) => encodeURIComponent(item.permlink) == to.params.research_group_permlink)) {
          const loadPagePromise = store.dispatch('researchGroupSettings/loadResearchGroup', {
            permlink: decodeURIComponent(to.params.research_group_permlink)
          });
          loadPage(loadPagePromise, next);
        } else {
          next({
            name: 'ResearchGroupDetails',
            params: {
              research_group_permlink: to.params.research_group_permlink
            }
          });
        }
      }
    })
  }, {
    path: '/:account_name/create-research-group',
    name: 'CreateResearchGroup',
    component: CreateResearchGroup
  }, {
    path: '/:research_group_permlink/wallet',
    name: 'ResearchGroupWallet',
    component: preliminaryDataLoader(ResearchGroupWallet, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rgWallet/loadGroupWallet', {
          permlink: decodeURIComponent(to.params.research_group_permlink)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const loadPagePromise = store.dispatch('dashboard/loadDashboardPage', {
        username: decodeURIComponent(store.getters['auth/user'].username)
      });
      loadPage(loadPagePromise, next);
    }
  }, {
    path: '/research-feed',
    name: 'ResearchFeed',
    component: preliminaryDataLoader(ResearchFeed, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('feed/loadResearchFeed', {});
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink',
    name: 'ResearchDetails',
    component: preliminaryDataLoader(ResearchDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rd/loadResearchDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research-public/:research_permlink',
    name: 'ResearchDetailsPublic',
    component: preliminaryDataLoader(ResearchDetailsPublic, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rd/loadResearchDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/edit-research/:research_permlink',
    name: 'ResearchEdit',
    component: preliminaryDataLoader(ResearchEdit, {
      beforeEnter: (to, from, next) => {
        if (store.getters['auth/user'].groups.find((item) => encodeURIComponent(item.permlink) == to.params.research_group_permlink)) {
          const loadPagePromise = store.dispatch('re/loadResearchEditPage', {
            group_permlink: decodeURIComponent(to.params.research_group_permlink),
            research_permlink: decodeURIComponent(to.params.research_permlink)
          });
          loadPage(loadPagePromise, next);
        } else {
          next({
            name: 'ResearchDetails',
            params: {
              research_group_permlink: to.params.research_group_permlink,
              research_permlink: to.params.research_permlink
            }
          });
        }
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/:content_permlink',
    name: 'ResearchContentDetails',
    component: preliminaryDataLoader(ResearchContentDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          content_permlink: decodeURIComponent(to.params.content_permlink),
          ref: to.query.ref
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/application/:application_id',
    name: 'ResearchApplicationDetails',
    component: preliminaryDataLoader(ResearchApplicationDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          application_id: to.params.application_id
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/:content_permlink/metadata',
    name: 'ResearchContentMetadata',
    component: preliminaryDataLoader(ResearchContentMetadata, {
      beforeEnter: async (to, from, next) => {
        const loadPagePromise = store.dispatch('rcd/loadResearchContentMetadata', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          content_permlink: decodeURIComponent(to.params.content_permlink),
          ref: to.query.ref
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/:content_permlink/review/:review_id',
    name: 'ResearchContentReview',
    component: preliminaryDataLoader(ResearchContentReview, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          content_permlink: decodeURIComponent(to.params.content_permlink),
          ref: to.query.ref
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/:content_permlink/add-review',
    name: 'ResearchContentAddReview',
    component: preliminaryDataLoader(ResearchContentAddReview, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          content_permlink: decodeURIComponent(to.params.content_permlink),
          ref: to.query.ref
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/eci-model-setup',
    name: 'ReviewSetup',
    component: ReviewSetup
  }, {
    path: '/:research_group_permlink/research/:research_permlink/:content_permlink/references',
    name: 'ResearchContentReferences',
    component: preliminaryDataLoader(ResearchContentReferences, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          content_permlink: decodeURIComponent(to.params.content_permlink),
          ref: to.query.ref
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/application/:application_id/review/:review_id',
    name: 'ResearchApplicationReview',
    component: preliminaryDataLoader(ResearchApplicationReview, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          application_id: to.params.application_id,
          review_id: to.params.review_id
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/:research_group_permlink/research/:research_permlink/application/:application_id/add-review',
    name: 'ResearchApplicationAddReview',
    component: preliminaryDataLoader(ResearchApplicationAddReview, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
          group_permlink: decodeURIComponent(to.params.research_group_permlink),
          research_permlink: decodeURIComponent(to.params.research_permlink),
          application_id: to.params.application_id
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/create-research',
    name: 'StartCreateResearch',
    component: ResearchStartCreating
  }, {
    path: '/create-new-research',
    name: 'CreateResearch',
    component: CreateNewResearch
  }, {
    path: '/:research_group_permlink/create-fundraise/:research_permlink',
    name: 'CreateTokenSale',
    component: CreateTokenSale
  }, {
    path: '/user-details/:account_name',
    name: 'UserDetails',
    component: preliminaryDataLoader(UserDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('userDetails/loadUserDetailsPage', {
          username: decodeURIComponent(to.params.account_name)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/user-details/:account_name/expertise',
    name: 'UserExpertiseDetails',
    component: preliminaryDataLoader(UserExpertiseDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('userDetails/loadAccountExpertiseDetailsPage', {
          username: decodeURIComponent(to.params.account_name)
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/user-details/:account_name/user-settings',
    name: 'UserSettings',
    component: preliminaryDataLoader(UserSettings, {
      beforeEnter: (to, from, next) => {
        if (store.getters['auth/user'].username !== to.params.account_name) {
          next({
            name: 'UserDetails',
            params: {
              account_name: to.params.account_name
            }
          });
        } else {
          const loadPagePromise = store.dispatch('userSettings/loadUserSettingsPage', {
            username: decodeURIComponent(to.params.account_name)
          });
          loadPage(loadPagePromise, next);
        }
      }
    })
  }, {
    path: '/account-settings',
    component: RouterViewNestedWatcher,
    children: [{
      path: '/',
      name: 'AccountSettings',
      component: AccountSettings
    }, {
      path: '/personal-info',
      name: 'ProfileSettings',
      redirect: () => {
        const user = store.getters['auth/user'];
        return {
          name: 'UserSettings',
          params: { account_name: user.username }
        };
      }
    }, {
      path: 'change-password',
      name: 'ChangePassword',
      component: ChangePassword
    }, {
      path: 'private-key',
      name: 'PrivateKeyDownload',
      component: PrivateKeyDownload
    }]
  }, {
    path: '/user-wallet',
    name: 'UserWallet',
    component: preliminaryDataLoader(UserWallet, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('userWallet/loadWallet');
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/claim-user-experience',
    name: 'ClaimUserExpertiseList',
    component: preliminaryDataLoader(ClaimUserExpertiseList, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('claimExpertiseList/loadAllClaims', {});
        loadPage(loadPagePromise, next);
      }
    })
  }, {
    path: '/claim-user-experience/:account_name/:claim_id',
    name: 'ClaimUserExpertiseDetails',
    component: preliminaryDataLoader(ClaimUserExpertiseDetails, {
      beforeEnter: (to, from, next) => {
        const loadPagePromise = store.dispatch('claimExpertiseDetails/loadClaimer', {
          username: to.params.account_name,
          claimId: to.params.claim_id
        });
        loadPage(loadPagePromise, next);
      }
    })
  }, {
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
  }, {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    children: [
      {
        path: 'members',
        name: 'admin.members',
        component: AdminMembers,
        children: [
          {
            path: 'add',
            name: 'admin.members.add',
            components: {
              dialog: UserRegistration
            },
            props: {
              dialog: {
                title: 'Add new member'
              }
            }
          }
        ]
      },
      {
        path: '/projects',
        name: 'admin.projects',
        component: AdminProjects
      },
      {
        path: '/criteria',
        name: 'admin.criteria',
        component: AdminCriteria
      },
      {
        path: '/faq',
        name: 'admin.faq',
        component: AdminFAQ
      },
      {
        path: '/settings',
        name: 'admin.settings',
        component: AdminSettings
      }
    ]
  }, {
    path: '/',
    name: 'Default',
    beforeEnter: (to, from, next) => {
      const user = store.getters['auth/user'];
      const rolePromise = user.profile
        ? Promise.resolve(user.profile.roles || [])
        : usersService.getUserProfile(user.username)
          .then((p) => p.roles || []);

      rolePromise.then((roles) => {
        const env = appConfigService.get('env');
        if (env.DEMO == 'GRANT-DISTRIBUTION-TRANSPARENCY') {
          const agency = store.getters['auth/tenant'];
          if (!agency) {
            throw new Error('Granting agency must be specified for the Demo');
          }
          next({
            name: 'GrantProgramsAwardsDashboard',
            params: { agency: agency.permlink }
          });
        } else {
          next({ name: 'ResearchFeed' });
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

function loadPage(loadPagePromise, next) {
  store.dispatch('layout/setGlobalLoader');
  loadPagePromise
    .then(next)
    .finally(() => { store.dispatch('layout/hideGlobalLoader'); });
}

router.beforeEach((to, from, next) => {
  const PUBLIC_PAGES_NAMES = [
    'ResearchFeed',
    'ResearchDetailsPublic',
    'NoAccessPage'
  ];
  if (to.path === '/sign-in' || to.path === '/sign-up' || to.path === '/org-sign-in') {
    if (accessService.isLoggedIn()) {
      next('/'); // if token is already presented redirect user to home page
    } else {
      next(); // otherwise redirect to sign-in page
    }
  } else if (PUBLIC_PAGES_NAMES.includes(to.name)) {
    next();
  } else if (accessService.isLoggedIn()) {
    next(); // if there is a token allow to visit requested route
  } else {
    next({ name: 'ResearchFeed' }); // otherwise redirect to sign-in page
  }
});


export {
  router
};
