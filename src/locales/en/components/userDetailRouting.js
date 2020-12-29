import { project } from './basicWords';

export default {
  teams: 'Teams:',
  addGroup: 'Add group',
  claimExpertiseDialog: {
    incorrectUrl: 'Incorrect url format',
    title: 'Claim for Expertise Tokens',
    selectDiscipline: 'Select your discipline',
    beAccurate: 'Please be accurate, you will need the community assistance to change the disciplines',
    addLinks: 'Add links to your relevant publications in this discipline',
    addLink: 'Add a link to a publication',
    letterField: 'Provide a cover letter',
    linkField: 'Link to publication',
    submitBtn: 'Claim Expertise Tokens',
    postedSucc: 'You have posted the claim successfully! Please wait for community approval before you obtain the expertise tokens'
  },
  detailsEducation: {
    title: 'Education',
    add: 'Add',
    deleteBtn: 'Confirm',
    sureDelete: 'Are you sure you want to delete this entry ?',
    success: '"{educationalInstitution}" Institute has been deleted successfully!',
    err: 'An error occurred while deleting "{educationalInstitution}" details, please try again later',
    present: 'present'
  },
  detailsEmployment: {
    title: 'Employment',
    add: 'Add',
    deleteBtn: 'Confirm',
    sureDelete: 'Are you sure you want to delete this entry ?',
    success: '"{company}" employment has been deleted successfully!',
    err: 'An error occurred while deleting "{company}" employment details, please try again later',
    present: 'present'
  },
  profileInfo: {
    location: 'Add location info',
    regSince: 'Member since:',
    email: 'Add your email here',
    bio: 'Add short bio',
    about: 'About',
    noDetails: 'No additional details to show'
  },
  sidebar: {
    invites: 'Invites',
    invitedYou: 'invited you to join them',
    viewBtn: 'View',
    acceptBtn: 'Accept',
    rejectBtn: 'Reject',
    reviewReq: 'Reviews',
    reqYouReview: `requests your review for "{title}" ${project()}`,
    eci: 'Expertise Contribution Index',
    inviteApprSucc: 'Invite has been approved successfully !',
    inviteRejSucc: 'Invite has been rejected successfully !',
    inviteApprFail: 'An error occurred while accepting invite, please try again later',
    inviteRejFail: 'An error occurred while rejecting invite, please try again later'
  },
  educationDialog: {
    title: 'Education',
    educationalBlock: {
      title: 'Educational institution',
      educationalField: 'Educational institution'
    },
    datesBlock: {
      title: 'Dates attended',
      fromField: 'From',
      toField: 'To',
      inProgressField: 'In progress'
    },
    obtainedBlock: {
      title: 'Degree obtained',
      obtainedField: 'Degree obtained'
    },
    studyBlock: {
      title: 'Area of study',
      studyField: 'Area of study'
    },
    descriptionBlock: {
      title: 'Description (optional)',
      descriptionField: 'Description'
    },
    cancel: 'Cancel',
    submitBtn: 'Save',
    instSaveSucc: '"{institution}" Institute has been saved successfully!',
    instSaveFail: 'An error occurred while saving "{institution}" details, please try again later'
  },
  employmentDialog: {
    title: 'Employment',
    companyBlock: {
      title: 'Company',
      companyField: 'Company'
    },
    locationBlock: {
      title: 'Location',
      cityField: 'City',
      countryField: 'Country'
    },
    periodBlock: {
      title: 'Period',
      fromField: 'From',
      toField: 'To',
      isPresentField: 'Is present'
    },
    positionBlock: {
      title: 'Position',
      positionField: 'Position'
    },
    descriptionBlock: {
      title: 'Description (optional)',
      descriptionField: 'Description'
    },
    cancel: 'Cancel',
    submitBtn: 'Save',
    emplSaveSucc: '"{company}" employment has been saved successfully!',
    emplSaveFail: 'An error occurred while saving "{company}" details, please try again later'
  }
};
