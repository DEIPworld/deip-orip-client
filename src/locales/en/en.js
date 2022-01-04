import en from 'vuetify/lib/locale/en';
import Vue from 'vue';
import { project } from './components/basicWords';

import defaultNaming from './components/defaultNaming';
import notifications from './components/notifications';
import userDetailRouting from './components/userDetailRouting';
import account from './components/account';
import adminRouting from './components/adminRouting';
import signUp from './components/signUp';
import wallet from './components/wallet';
import teamDetails from './components/researchGroupDetails';
import fundraising from './components/fundraising';
import transactions from './components/transactions';
import projectDetails from './components/researchDetails';
import createProject from './components/createResearch';
import signIn from './components/signIn';
import teamSettings from './components/researchGroupSettings';
import createTeam from './components/createResearchGroup';
import projectEdit from './components/researchEdit';
import topMenu from './components/topMenu';
import contents from './components/contents';
import projectContentDetails from './components/researchContentDetails';
import assets from './components/assets';
import notifier from './components/notifier';
import votingForBlockProducers from './components/votingForBlockProducers';
import transactionsList from './components/transactionsList';
import reviewSetup from './components/reviewSetup';
import memberList from './components/memberList';
import licensing from './components/licensing';
import attributes from './components/attributes';

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
      contributionsNumber: 'Contributions number',
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
  portalSignIn: {
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
  projectFeed: {
    title: () => `${project(true, true)}`,
    startProjectBtn: `Start a ${project()}`,
    signInBtn: 'Sign in',
    signInText: `After creating an account/log in you can add new ${project(false, true)} or enjoy shared materials`
  },
  projectDetailsPublic: {
    notLogged: 'You are not logged in',
    afterCreatingAcc: `After creating an account/log in you can add new ${project(false, true)} or enjoy shared materials`,
    signIn: 'Sign in'
  },
  reviews: {
    reviews: 'Reviews',
    seeReview: 'See review',
    selectExpert: 'Select expert',
    assessment: 'Assessment',
    expertsSupp: '{supportersCount} experts supported this review',
    noReviews: 'No reviews yet.',
    suppRev: 'Support Review',
    notMembers: `Review can be supported only by members who have no relations with this ${project()} or team that leads this ${project()}.`,
    canSupport: 'Users with expertise in {domains} can support this review',
    eciForContribution: `You will get ECI reward in {domains} for your contribution to this ${project()}`,
    eciForReview: `You will get ECI reward in {domains} for review of the materials associated with this ${project()}.`,
    once: 'Review can be supported once by the user',
    needExpertiseAndNotMembers: `To add review you need expertise in {domains} and have no relations with this ${project()} or team that leads this ${project()}.`,
    reviewedAlready: 'You have reviewed this material already',
    request: 'Request expert review',
    notSuppOwnRev: 'It\'s not allowed to support your own review',
    needNotMembers: `To add review you need to have no relations with this ${project()} or team that leads this ${project()}.`
  },
  landing: {
    searchByTech: `Search by ${project(false)}`,
    advancedSearch: 'Advanced Search',
    find: `Find ${project(false, true)}`
  },
  draftList: {
    draft: 'Draft',
    type: 'Type',
    title: 'Title'
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
  teamDetails,
  teamSettings,
  createTeam,
  projectDetails,
  projectEdit,
  createProject,
  wallet,
  transactions,
  fundraising,
  projectContentDetails,
  assets,
  notifier,
  votingForBlockProducers,
  transactionsList,
  reviewSetup,
  memberList,
  licensing,
  attributes
};
