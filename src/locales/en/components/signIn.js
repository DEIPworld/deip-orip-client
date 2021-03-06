import { project } from './basicWords';

export default {
  toolbarButton: 'Explorer',
  title: 'Open Research and Innovation Platform',
  collaboration: 'Collaboration',
  tokenization: `${project(true)} tokenization`,
  licensing: 'Licensing of intellectual property',
  investing: 'Crowd investing',
  form: {
    logo: 'Technology Transfer Office',
    title: 'Sign in to your account',
    titleAdmin: 'Sign in to your admin account',
    usernameField: 'Username',
    passwordField: 'Password/Private Key',
    rules: {
      invalidAccount: 'Invalid account name',
      invalidKey: 'Invalid private key format'
    },
    submitBtn: 'Sign in',
    bottomText: 'Want become a member?',
    bottomTextLink: 'Sign Up now'
  }
};
