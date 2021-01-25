import { project } from './basicWords';

export default {
  title: 'Fundraising',
  fundraisingControlSection: {
    collected: 'Already fundraised:',
    softCap: 'Min Goal:',
    hardCap: 'Max Goal:'
  },
  fundraisingStatsSection: {
    startTime: 'Start:',
    endTime: 'End:'
  },
  contributionsHistorySection: {
    title: 'Fundraising contributions',
  },
  neverFund: `${project(true)} has never fundraised before. `,
  please: 'Please',
  issueTokens: `issue ${project(false, true)} tokens`,
  toStart: 'to start Fundraising.',
  startNew: 'Start new fundraise',
  finished: 'Fundraising was finished. To know more about the results click on more details.',
  alreadyCollected: 'Already collected',
  amountOfInvest: 'Amount of investment',
  agreeLabel: 'I agree to the Terms and Conditions listed below',
  termsAndCond: 'Terms and Conditions',
  invest: 'Invest',
  investment: 'Investment',
  doYouConfirm: 'Do you confirm the investment of funds from your account?',
  table: {
    sender: 'Sender',
    date: 'Date',
    fundPhase: 'Fundraising Phase',
    amount: 'Amount'
  },
  goalNotAchiev: 'Goal is not achieved',
  minGoalReached: 'Min goal reached!',
  contributedSucc: 'You have contributed to "{project}" fundraise successfully !',
  contributedFail: 'An error occurred while contributing to fundraise, please try again later',
  start: 'Start',
  end: 'End',
  totalInvestment: 'Total investment',
  minGoal: 'Min Goal',
  maxGoal: 'Max Goal'
};
