import Vue from 'vue';
import { project } from './basicWords';

export default {
  all: 'All',
  moreDetails: 'More details',
  info: 'Info',
  apply: 'Apply',
  clear: 'Clear',
  cancel: 'Cancel',
  confirm: 'Confirm',
  eciShort: 'ECI',
  percentile: 'Percentile rank',
  growthRate: 'Growth rate',
  eciDetailed: 'Expertise Contribution Index detailed overview',
  growthRateOver: 'Growth rate overview',
  contributions: 'Contributions',
  citations: 'Citations',
  hIndex: 'H-index',
  noData: 'No data availale',
  projects: () => `${project(true, true)}`,
  noProjects: () => `No ${project(false, true)} found for specified criteria`,
  yourDomain: 'Your domain',
  allDomain: 'All domains',
  time: {
    months: 'months',
    days: 'days',
    hours: 'hours',
    mins: 'mins',
    secs: 'secs'
  },
  forms: {
    researchRequest: {
      start: `Start a ${project(false)}`,
      successReq: `${project(true)} request has been applied successfully. We will notify you as soon as your ${project(false)} form will be approved.`,
      errReq: `An error occurred while creating ${project(false)}, please try again later`,
      successUpdate: `${project(true)} "{title}" has been updated successfully`,
      basicBlock: {
        title: 'Basics',
        nameField: `${project(true)} name`,
        ideaField: 'What is your idea?',
        domainField: 'Domain',
        locationField: `${project(true)} location`,
        areaField: 'What area are you trying to impact?',
        solveField: 'How will this solve a current problem?'
      },
      readinesBlock: {
        title: `${project(true)} readines level`
      },
      fundingBlock: {
        title: 'Funding',
        fundingField: 'How much funding are you expecting?',
        estimateField: `What is your ${project(true)} estimate?`
      },
      addInfBlock: {
        title: 'Additional information',
        budgetInfField: 'Budget information',
        planField: 'Business plan',
        cvField: 'Resume/CV',
        documentField: 'Market research document'
      },
      cancel: 'Cancel',
      submitBtn: 'Apply request'
    }
  },
  filters: {
    domainField: 'Domain',
    periodField: 'Period',
    contributionType: 'Contribution Type',
    assessmentCriteria: 'Assessment criteria'
  },
  fieldRules: {
    required: 'This field is required',
    startDate: 'Start date should be smaller than end date',
    endDate: 'End date should be greater than start date',
    masterPasswordMinLength: 'Master password should be at least 10 symbols',
    masterPasswordMaxLength: 'Master password max length is 100 symbols',
    reEnterMasterPassword: 'Password didn\'t match. Try again.',
    titleMax: 'Title max length is {maxTitleLength} symbols',
    descriptionMax: 'Description max length is {maxDescriptionLength} symbols'
  },
  tables: {
    type: 'Type',
    title: 'Title',
    date: 'Date',
    rewardEci: 'Reward ECI',
    totalEci: 'Total ECI'
  },
  eci: {
    eciShort: 'ECI',
    eci: 'Expertise Contribution Index',
    percentileRank: 'Percentile rank',
    totalECI: 'Total ECI',
    growthRate: 'Growth rate',
    overview: 'Overview',

  }
};
