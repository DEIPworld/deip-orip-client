import en from 'vuetify/lib/locale/en';
import Vue from 'vue';
import { project } from './components/basicWords';

import defaultNaming from './components/defaultNaming';
import notifications from './components/notifications';
import userDetailRouting from './components/userDetailRouting';
import account from './components/account';
import adminRouting from './components/adminRouting';
import signUp from './components/signUp';
import userWallet from './components/userWallet';
import researchGroupDetails from './components/researchGroupDetails';
import researchTokenSale from './components/researchTokenSale';
import transactions from './components/transactions';
import researchDetails from './components/researchDetails';
import createResearch from './components/createResearch';
import signIn from './components/signIn';
import researchGroupSettings from './components/researchGroupSettings';
import createResearchGroup from './components/createResearchGroup';
import researchEdit from './components/researchEdit';
import topMenu from './components/topMenu';
import contents from './components/contents';
import researchContentDetails from './components/researchContentDetails';
import assets from './components/assets';

export default {
  $vuetify: en,

  participantstRouting: {
    title: 'Participants',
    searchNamesField: 'Search by names',
    na: 'N/A',
    tableHeader: {
      name: 'Name',
      totalECI: 'Total ECI',
      percentileRank: 'Percentile rank',
      growthRate: 'Growth rate',
      contributionsNumber: 'Сontributions number',
      projectsNumber: `${project(true, true)} number`
    }
  },
  overviewRouting: {
    subtitle: 'Updated today',
    eciValue: 'Expertise contribution index value',
    eciOverview: 'Expertise contribution index overview',
    distributionImpact: {
      title: 'Distribution impact',
      domainField: 'Domain'
    }
  },
  noAccessPage: {
    sorry: 'Sorry',
    noAccess: 'You have no access to this page'
  },
  faq: {
    title: 'Frequently Asked Questions',
    notFind: 'Didn’t find what you were looking for?',
    get: 'Get in touch.'
  },
  userApplicationAccepted: {
    thank: 'Thank you for your registration, we will notify you as soon as your request will be approved.',
    browse: `Browse ${project(false, true)}`
  },
  tenantSignIn: {
    form: {
      usernameField: 'Username',
      passwordField: 'Password / Private Key',
      rules: {
        invalidOrg: 'Invalid organization name',
        invalidKey: 'Invalid private key format'
      },
      submitBtn: 'Login'
    }
  },
  researchFeed: {
    title: () => `${Vue.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'Projects' : 'Technologies'}`,
    startProjectBtn: `Start a ${project()}`,
    signInBtn: 'Sign in',
    signInText: `After creating an account/log in you can add new ${project(false, true)} or enjoy shared materials`
  },
  researchDetailsPublic: {
    notLogged: 'You are not logged in',
    afterCreatingAcc: `After creating an account/log in you can add new ${project(false, true)} or enjoy shared materials`,
    signIn: 'Sign in'
  },
  transactionsPage: {
    signed: 'Signed',
    pending: 'Pending',
    declined: 'Declined',
    failed: 'Failed',
    expired: 'Expired'
  },
  reviews: {
    reviews: 'Reviews',
    seeReview: 'See review',
    assessment: 'Assessment',
    expertsSupp: 'experts supported this review',
    noReviews: 'No reviews yet.',
    suppRev: 'Support Review',
    onlyNotMembers: `Review can be supported only by members who have no relations to this ${project()} or team that leads this ${project()}.`,
    canSupport: 'Users with expertise in {disciplines} can support this review only',
    getForContribution: `You will get approximately {countEci} ECI reward in {disciplines} for your contribution to this ${project()}`,
    getForReview: `You will get approximately {countEci} ECI reward in {disciplines} for review on the materials associated with this ${project()}.`,
    once: 'Review can be supported once',
    needExpertise: `To add review you need expertise in {disciplines} and have no relations to this ${project()} or team that leads this ${project()}.`,
    reviewedAlready: 'You have reviewed this material already',
    request: 'Request expert review'
  },

  contents,
  topMenu,
  defaultNaming,
  notifications,
  userDetailRouting,
  account,
  adminRouting,
  signIn,
  signUp,
  researchGroupDetails,
  researchGroupSettings,
  createResearchGroup,
  researchDetails,
  researchEdit,
  createResearch,
  userWallet,
  transactions,
  researchTokenSale,
  researchContentDetails,
  assets
};
