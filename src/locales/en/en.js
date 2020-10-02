import en from 'vuetify/lib/locale/en';

import defaultNaming from './components/defaultNaming';
import notifications from './components/notifications';
import userDetailRouting from './components/userDetailRouting';
import account from './components/account';
import adminRouting from './components/adminRouting';
import signUp from './components/signUp';
import userWallet from './components/userWallet';
import researchGroupDetails from './components/researchGroupDetails';
import researchDetails from './components/researchDetails';
import createResearch from './components/createResearch';
import signIn from './components/signIn';
import researchGroupSettings from './components/researchGroupSettings';
import createResearchGroup from './components/createResearchGroup';
import researchEdit from './components/researchEdit';
import topMenu from './components/topMenu';
import contents from './components/contents';

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
      projectsNumber: 'Projects number'
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
    browse: 'Browse projects'
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
    title: 'Technologies',
    startProjectBtn: 'Start a project',
    signInBtn: 'Sign in',
    signInText: 'After creating an account/log in you can add new projects or enjoy shared materials'
  },
  researchDetailsPublic: {
    notLogged: 'You are not logged in',
    afterCreatingAcc: 'After creating an account/log in you can add new projects or enjoy shared materials',
    signIn: 'Sign in'
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
  userWallet
};
