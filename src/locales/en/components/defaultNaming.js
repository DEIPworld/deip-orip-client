import Vue from 'vue';

export default {
  all: 'All',
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
  projects: () => `${Vue.$env.DEMO === 'GRANT-DISTRIBUTION-TRANSPARENCY' ? 'Projects' : 'Technologies'}`,
  noProjects: 'No Projects found for specified criteria',
  yourDomain: 'Your domain',
  allDomain: 'All domain',
  time: {
    months: 'months',
    days: 'days',
    hours: 'hours',
    mins: 'mins',
    secs: 'secs'
  },
  forms: {
    researchRequest: {
      start: 'Start a project',
      successReq: 'Project request has been applied successfully. We will notify you as soon as your project form will be approved.',
      errReq: 'An error occurred while creating project, please try again later',
      successUpdate: 'Project "{title}" has been updated successfully',
      basicBlock: {
        title: 'Basics',
        nameField: 'Project name',
        ideaField: 'What is your idea?',
        domainField: 'Domain',
        locationField: 'Project location',
        areaField: 'What area are you trying to impact?',
        solveField: 'How will this solve a current problem?'
      },
      readinesBlock: {
        title: 'Project readines level'
      },
      fundingBlock: {
        title: 'Funding',
        fundingField: 'How much funding are you expecting?',
        estimateField: 'What is your project estimate?'
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
    reEnterMasterPassword: 'Password doesn\'t match',
    titleMax: 'Title max length is {maxTitleLength} symbols',
    descriptionMax: 'Description max length is {maxDescriptionLength} symbols'
  },
  tables: {
    type: 'Type',
    title: 'Title',
    date: 'Date',
    rewardEci: 'Reward ECI',
    totalEci: 'Total ECI'
  }
};
