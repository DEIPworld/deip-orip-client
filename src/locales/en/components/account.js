import { project } from './basicWords';

export default {
  sidebar: {
    projectsBlock: {
      title: `${project(true, true)}`,
      pr: `${project(true, true)}`,
      myPr: `My ${project(false, true)}`,
      follPr: `Following ${project(false, true)}`,
      prReq: `${project(true)} requests`
    },
    groupsBlock: {
      title: 'Groups',
      teams: 'Teams'
    },
    securityBlock: {
      title: 'Security',
      password: 'Change password',
      privateKey: 'Private key'
    }
  },
  profile: {
    title: 'Edit personal info',
    form: {
      personalBlock: {
        title: 'Personal information:',
        firstNameFiled: 'First Name',
        lastNameFiled: 'Last Name',
        birthdayFiled: 'Birthday'
      },
      locationBlock: {
        title: 'Location:',
        cityFiled: 'City',
        countryFiled: 'Country'
      },
      contactBlock: {
        title: 'Contact Information:',
        emailFiled: 'Email'
      },
      bioBlock: {
        title: 'Bio:',
        bioFiled: 'Tell about yourself'
      },
      // addInfBlock: {
      //   title: 'Additional information:',
      //   categoryField: 'Category',
      //   occupationField: 'Occupation',
      //   webSiteField: 'Web site'
      // },
      submitBtn: 'Update Info'
    }
  },
  projects: {
    notFollPr: `You’re not following any ${project()} yet`,
    aLotOfPr: `We have a lot of incredible ${project(false, true)} on our platform. Take a look`,
    browseBtn: `Browse ${project(false, true)}`,
    teamsTech: `Team's ${project(false, true)}`,
    myTech: `My ${project(false, true)}`,
    follTech: `Following ${project(false, true)}`
  },
  groups: {
    teams: 'Teams',
    addNewTeam: 'Add new team'
  },
  projectRequests: {
    waiting: 'Waiting for approval',
    declined: 'Declined',
    tableHeader: {
      title: 'Title',
      created: 'Created'
    },
    deleteDialog: {
      title: 'Delete request?',
      description: `${project(true)} will be hidden from platform permanently.`,
      submitBtn: 'Delete'
    }
  },
  password: {
    title: 'Change password',
    oldPasswordField: 'Old password / Private Key',
    newPasswordField: 'New password',
    reEnterPasswordField: 'Re-Enter New password',
    submitBtn: 'Change Password'
  },
  privateKey: {
    title: 'Download private key',
    passwordField: 'Password / Private Key',
    downloadBtn: 'Download Private Key (PDF)'
  }
};
