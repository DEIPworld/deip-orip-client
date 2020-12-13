import { project } from './basicWords';

export default {
  issueTokens: 'Issue tokens',
  create: {
    tokenDetails: `${project(true)} token details`,
    project: `${project(true)}`,
    totalNumber: 'Total number of tokens to issue',
    tickerAbbreviation: 'Ticker (abbreviation)',
    issued: `Note: 2,000 to 20,000 tokens are usualy issued per ${project()}.`,
    usedForFund: 'Note: Only tokens that belong to a team can be used for fundraising.',
    shareholder: 'Shareholder',
    tokens: 'Tokens',
    agree: 'I agree to the Terms and Conditions listed below',
    text: `I understand that issued tokens will be distributed among shareholders,
    effectively transferring ownership over the property related to the ${project()}.
    Holding a share does not grant access to participate on
    decisions related to the ${project()}.
    It’s not possible to undo this action.`,
    cancel: 'Cancel',
    submit: 'Submit'
  },
  widget: {
    shareholders: 'Shareholders',
    tokensIssued: 'Tokens issued',
    yTokens: 'Your tokens',
    yShare: 'Your share',
    name: 'Name',
    shares: 'Shares',
    tokens: 'Tokens'
  }

}