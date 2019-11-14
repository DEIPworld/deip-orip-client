import Vue from 'vue';
import Router from 'vue-router';

import SignIn from '@/components/auth/SignIn';
import SignUp from '@/components/auth/SignUp';
import Dashboard from '@/components/dashboard/Dashboard';
import EmailSendingRegistration from '@/components/auth/EmailSendingRegistration';
import DataFillingRegistration from '@/components/auth/DataFillingRegistration';
import ClaimExpertiseRegistration from '@/components/auth/ClaimExpertiseRegistration';

import GrantStartCreating from '@/components/grant-create/GrantStartCreating';
import CreateDisciplineGrant from '@/components/grant-create/CreateDisciplineGrant';
import CreateDirectGrant from '@/components/grant-create/CreateDirectGrant';
import AgencyPrograms from '@/components/agency-programs/AgencyPrograms';
import AgencyProgramDetails from '@/components/agency-program-details/AgencyProgramDetails';

import CreateResearchGroup from '@/components/research-group-create/CreateResearchGroup';
import ResearchGroupDetails from '@/components/research-group-details/ResearchGroupDetails';
import ResearchGroupWallet from '@/components/research-group-wallet/ResearchGroupWallet';

import ResearchFeed from '@/components/research-feed/ResearchFeed';
import ResearchFeedOld from '@/components/research-feed/ResearchFeedOld';
import ResearchDetails from '@/components/research-details/ResearchDetails';
import ResearchEdit from '@/components/research-edit/ResearchEdit';
import ResearchContentDetails from '@/components/research-content-details/ResearchContentDetails';
import ResearchApplicationDetails from '@/components/research-application-details/ResearchApplicationDetails';
import ResearchApplicationReview from '@/components/research-application-details/ResearchApplicationReview';
import ResearchApplicationAddReview from '@/components/research-application-details/ResearchApplicationAddReview';
import ResearchContentMetadata from '@/components/research-content-details/ResearchContentMetadata';
import ResearchContentReview from '@/components/research-content-details/ResearchContentReview';
import ResearchContentAddReview from '@/components/research-content-details/ResearchContentAddReview';
import ResearchStartCreating from '@/components/research-create/ResearchStartCreating';
import CreateNewResearch from '@/components/research-create/CreateNewResearch';
import CreateTokenSale from '@/components/token-sale-create/CreateTokenSale';

import UserDetails from '@/components/user-details/UserDetails';
import UserWallet from '@/components/user-wallet/components/UserWallet';
import UserWalletOld from '@/components/user-wallet/components/UserWalletOld';

import ClaimUserExpertiseDetails from '@/components/claim-expertise-details/ClaimUserExpertiseDetails';
import ClaimUserExpertiseList from '@/components/claim-expertise-list/ClaimUserExpertiseList';

import SetExpertisePage from '@/components/SetExpertisePage';
import NoAccessPage from '@/components/NoAccessPage';
import CreateAccountTestNet from '@/components/auth/CreateAccountTestNet';
import VotingForBlockProducers from '@/components/voting-for-block-producers/VotingForBlockProducers';
import CreateFundingOpportunityAnnouncement from '@/components/funding-opportunity-announcement-create/CreateFundingOpportunityAnnouncement';
import LegacyInvestorDashboard from '@/components/investor-legacy-flow/dashboard/InvestorDashboard';
import InvestorDashboard from '@/components/investor-dashboard/InvestorDashboard';


import store from './../store/index';
import usersService from './../services/http/users';
import { isLoggedIn } from './../utils/auth';
import preliminaryDataLoader from './utils/preliminaryDataLoader';

Vue.use(Router);

const router = new Router({
	routes: [{
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
	}, /* {
		path: '/dataFillingRegesitration',
		name: 'DataFillingRegesitration',
		component: DataFillingRegistration
	}, */	{
		path: '/claimExpertiseRegesitration',
		name: 'ClaimExpertiseRegesitration',
		component: ClaimExpertiseRegistration
	}, {
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
	}, {
		path: '/:agency/programs',
		name: 'AgencyPrograms',
		component: AgencyPrograms,
		beforeEnter: (to, from, next) => {
			let loadPagePromise = store.dispatch('agencyPrograms/loadAgencyProgramsPage', { 
				agency: decodeURIComponent(to.params.agency), 
				areaCode: to.query.areaCode, 
				subAreaCode: to.query.subAreaCode 
			});
			loadPage(loadPagePromise, next);
		}
	}, {
		path: '/:agency/programs/:foa',
		name: 'AgencyProgramDetails',
		component: AgencyProgramDetails,
		beforeEnter: (to, from, next) => {
			let loadPagePromise = store.dispatch('agencyProgramDetails/loadAgencyProgramDetailsPage', { 
				agency: decodeURIComponent(to.params.agency), 
				foaId: decodeURIComponent(to.params.foa) 
			});
			loadPage(loadPagePromise, next);
		}
	}, {
		path: '/:research_group_permlink/group-details',
		name: 'ResearchGroupDetails',
		component: preliminaryDataLoader(ResearchGroupDetails, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('researchGroup/loadResearchGroup', {
					permlink: decodeURIComponent(to.params.research_group_permlink) 
				});
				loadPage(loadPagePromise, next);
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
				let loadPagePromise = store.dispatch('rgWallet/loadGroupWallet', {
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
			let loadPagePromise = store.dispatch('dashboard/loadDashboardPage', {
				username: decodeURIComponent(store.getters['auth/user'].username)
			});
			// loadDashboardPage
			loadPage(loadPagePromise, next);
		}
		}, {
			path: '/research-feed',
			name: 'ResearchFeed',
			component: preliminaryDataLoader(ResearchFeed, {
				beforeEnter: (to, from, next) => {
					let loadPagePromise = store.dispatch('feed/loadResearchFeed', {});
					loadPage(loadPagePromise, next);
				}
			})
		}, {
			path: '/legacy-research-feed',
			name: 'ResearchFeedOld',
			component: preliminaryDataLoader(ResearchFeedOld, {
				beforeEnter: (to, from, next) => {
					let loadPagePromise = store.dispatch('feed/loadResearchFeed', {});
					loadPage(loadPagePromise, next);
				}
			})
		}, {
		path: '/:research_group_permlink/research/:research_permlink',
		name: 'ResearchDetails',
		component: preliminaryDataLoader(ResearchDetails, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('rd/loadResearchDetails', {
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
					let loadPagePromise = store.dispatch('re/loadResearchEditPage', {
						group_permlink: decodeURIComponent(to.params.research_group_permlink),
						research_permlink: decodeURIComponent(to.params.research_permlink)
					});
					loadPage(loadPagePromise, next);
				}
			})
		}, {
		path: '/:research_group_permlink/research/:research_permlink/:content_permlink',
		name: 'ResearchContentDetails',
		component: preliminaryDataLoader(ResearchContentDetails, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
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
				let loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
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
				let loadPagePromise = store.dispatch('rcd/loadResearchContentMetadata', {
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
				let loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
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
				let loadPagePromise = store.dispatch('rcd/loadResearchContentDetails', {
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
				let loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
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
				let loadPagePromise = store.dispatch('rad/loadResearchApplicationDetails', {
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
				let loadPagePromise = store.dispatch('userDetails/loadUserDetailsPage', {
					username: decodeURIComponent(to.params.account_name)
				});
				loadPage(loadPagePromise, next);
			}
		})
	}, {
		path: '/user-wallet',
		name: 'UserWallet',
		component: preliminaryDataLoader(UserWallet, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('userWallet/loadWallet');
				loadPage(loadPagePromise, next);
			}
		})
		}, {
		path: '/legacy-user-wallet',
		name: 'UserWalletOld',
		component: preliminaryDataLoader(UserWalletOld, {
				beforeEnter: (to, from, next) => {
					let loadPagePromise = store.dispatch('userWallet/loadWallet');
					loadPage(loadPagePromise, next);
				}
			})
		}, {
		path: '/claim-user-experience',
		name: 'ClaimUserExpertiseList',
		component: preliminaryDataLoader(ClaimUserExpertiseList, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('claimExpertiseList/loadAllClaims', {});
				loadPage(loadPagePromise, next);
			}
		})
	}, {
		path: '/claim-user-experience/:account_name/:claim_id',
		name: 'ClaimUserExpertiseDetails',
		component: preliminaryDataLoader(ClaimUserExpertiseDetails, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('claimExpertiseDetails/loadClaimer', {
					username: to.params.account_name,
					claimId: to.params.claim_id
				});
				loadPage(loadPagePromise, next);
			}
		})
	}, {
		path: '/set-expertise',
		name: 'SetExpertisePage',
		component: SetExpertisePage,
	}, {
		path: '/no-access-page',
		name: 'NoAccessPage',
		component: NoAccessPage,
		meta: {
			withoutHeader: true
		}
	}, /* {
			// page for test net only
			path: '/create-testnet-account',
			name: 'create-testnet-account',
			component: CreateAccountTestNet
	}, */ {
		path: '/voting-for-block-producers',
		name: 'VotingForBlockProducers',
		component: preliminaryDataLoader(VotingForBlockProducers, {
			beforeEnter: (to, from, next) => {
				let loadPagePromise = store.dispatch('votingForBlockProducers/loadProducers', {});
				loadPage(loadPagePromise, next);
			}
		})
	}, {
		path: '/legacy-investor-dashboard',
		name: 'LegacyInvestorDashboard',
		component: LegacyInvestorDashboard
	}, {
		path: '/investor-dashboard',
		name: 'InvestorDashboard',
		component: InvestorDashboard,
		beforeEnter: (to, from, next) => {
			let loadPagePromise = store.dispatch('investorDashboard/loadInvestmentPortfolioPage', {
				username: decodeURIComponent(store.getters['auth/user'].username)
			});
			loadPage(loadPagePromise, next);
		}
	}, {
		path: '/create-funding-opportunity-announcement',
		name: 'CreateFundingOpportunityAnnouncement',
		component: CreateFundingOpportunityAnnouncement
	}, {
		path: '*',
		name: 'Default',
		beforeEnter: (to, from, next) => {
			const user = store.getters['auth/user'];
			const rolePromise = user.profile 
				? Promise.resolve(user.profile.agencies || []) 
				: usersService.getUserProfile(user.username).then((p) => { return p.agencies });
			
			rolePromise.then((agencies) => {

				// spb demo
				if (user.username == "bob") {
					next({ name: 'Dashboard' });
				} else {
					next({ name: 'ResearchFeed' });
				}
				return;


				if (!agencies || !agencies.length) {
					next({ name: 'ResearchFeed' });
					return;
				}
				
				const sub = window.env.TENANT || "";
				const agency = agencies.find(a => a.name.toLowerCase() === sub.toLowerCase());

				if (agency) {
					next({ name: 'AgencyPrograms', params: { agency: agency.name } });
				} else {
					next({ name: 'ResearchFeed' });
				}
			});
		}
	}],
	
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

function loadPage(loadPagePromise, next) {
	store.dispatch('layout/setGlobalLoader');
	loadPagePromise
		.then(next)
		.finally(() => { store.dispatch('layout/hideGlobalLoader'); })
}

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
