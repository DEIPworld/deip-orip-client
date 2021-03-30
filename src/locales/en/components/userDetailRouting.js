import { project } from './basicWords';

export default {
  teams: 'Teams',
  addGroup: 'Add group',
  detailsEducation: {
    title: 'Education',
    deleteDialogTitle: 'Delete education ?',
    add: 'Add',
    deleteBtn: 'Delete',
    sureDelete: 'Education will be deleted permanently and will be removed from account page.',
    success: '"{educationalInstitution}" Institute has been deleted successfully!',
    err: 'An error occurred while deleting "{educationalInstitution}" details, please try again later',
    present: 'present'
  },
  detailsEmployment: {
    title: 'Employment',
    deleteDialogTitle: 'Delete employment ?',
    add: 'Add',
    deleteBtn: 'Delete',
    sureDelete: 'Position will be deleted permanently and will be removed from account page.',
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
      title: 'Occupation',
      positionField: 'Occupation'
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
