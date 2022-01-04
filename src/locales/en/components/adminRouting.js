import { project } from './basicWords';

export default {
  categories: {
    title: `${project(true)} categories`,
    create: 'Create catergory',
    categoriesTable: {
      name: 'Name',
      projects: `Assigned ${project(false, true)}`
    },
    deleteDialog: {
      title: 'Delete category?',
      description: `Category  will be deleted permanently.
        Assigned ${project(false, true)} will stay without category`,
      submitBtn: 'Delete'
    },
    categoryEdit: {
      title: 'Add new category',
      nameField: 'Category name',
      cancel: 'Cancel',
      submitBtn: 'Save'
    }
  },
  attributes: {
    title: 'Attributes',
    add: 'Add attribute',
    placementSettings: 'Placement settings',
    attributesTable: {
      type: 'Type',
      title: 'Title',
      shortTitle: 'Short Title'
    },
    publishDialog: {
      title: 'Publish attribute?',
      description: `Attribute will be set for each ${project()} and will appear on:
        - ${project()} page,
        - ${project()} application form,
        - explore page.
        `,
      submitBtn: 'Publish'

    },
    unpublishDialog: {
      title: 'Unpublish attribute?',
      description: `Attribute will be removed from:
        - ${project()} page,
        - ${project()} application form,
        - explore page.
        `,
      submitBtn: 'Unpublish'

    },
    deleteDialog: {
      title: 'Delete attribute?',
      description: `Attribute will be deleted permanently and will be removed from:
        - ${project()} page,
        - ${project()} application form,
        - explore page.
        `,
      submitBtn: 'Delete'

    },
    attributesEdit: {
      title: 'Add new attribute',
      typeField: 'Attribute type',
      nameField: 'Criterion name',
      shortNameField: 'Criterion short name',
      stepNameField: 'Step name',
      stepDescField: 'Step description',
      publishField: 'Publish Attribute',
      cancel: 'Cancel',
      submitBtn: 'Save'
    }
  },
  faq: {
    title: 'FAQ',
    add: 'Add question',
    publishDialog: {
      title: 'Publish Q&A?',
      description: 'Selected question and answer will be published on FAQ page.',
      submitBtn: 'Publish'
    },
    unpublishDialog: {
      title: 'Unpublish Q&A?',
      description: 'Selected question and answer will be removed from FAQ page.',
      submitBtn: 'Unpublish'
    },
    deleteDialog: {
      title: 'Delete Q&A?',
      description: 'Question and answer will be deleted permanently.',
      submitBtn: 'Delete Q&A '
    },
    faqEdit: {
      title: 'Add new question',
      questionField: 'Question',
      answerField: 'Answer',
      publishField: 'Publish on FAQ page',
      cancel: 'Cancel',
      submitBtn: 'Save'
    }
  },
  members: {
    addMembertitle: 'Add new member',
    title: 'Members',
    add: 'Add member',
    registeredTab: 'Registered',
    waitingTab: 'Waiting for approval',
    approveRequest: 'Account successfully created',
    registeredTable: {
      name: 'Name',
      since: 'Member since',
      category: 'Category',
      country: 'Country'
    },
    waitingTable: {
      name: 'Name',
      date: 'Request date'
    },
    approveDialog: {
      title: 'Approve request?',
      description: 'Request will be approved and person will become a member.',
      submitBtn: 'approve'
    },
    rejectDialog: {
      title: 'Reject request?',
      description: 'Request will be rejected and person will not published.',
      submitBtn: 'reject'
    },
    memberInfoDialog: {
      submitBtn: 'Approve',
      reject: 'Reject',
      name: 'Name:',
      lastName: 'Last name:',
      birth: 'Date of birth:',
      id: 'ID:',
      email: 'Email:',
      category: 'Category:',
      address: 'Address:',
      city: 'City:',
      country: 'Country:',
      phone: 'Phone number:',
      occupation: 'Occupation:',
      site: 'Web site:'
    }
  },
  projects: {
    title: `${project(true, true)}`,
    create: `Submit new ${project()}`,
    allTab: `All ${project(false, true)}`,
    waitingTab: 'Waiting for approval',
    publicTable: {
      title: 'Title',
      created: 'Created'
    },

    pendingTable: {
      title: 'Title',
      created: 'Created',
      innovator: `${project(true)} innovator`
    },
    projectDialog: {
      reject: 'Reject',
      submitBtn: 'Approve'
    },
    approveDialog: {
      title: 'Approve request?',
      description: `${project(true)} request will be approved and ${project()} will be published.`,
      submitBtn: 'Approve'
    },
    rejectDialog: {
      title: 'Reject request?',
      description: `${project(true)} request will not be approved and ${project()} will not be published.`,
      submitBtn: 'Reject'
    },
    deleteDialog: {
      title: `Remove ${project()} ?`,
      description: `${project(true)} will be deleted permanently and will be removed from the platform.`,
      submitBtn: 'Delete'
    }
  },
  settings: {
    title: 'Settings',
    changeBanner: 'Change banner on Explore page',
    changeLogo: 'Change logo in Top bar',
    changeTabTitle: 'Change title in Browser tab',
    update: 'Update settings',
    success: 'Settings has been updated successfully! Refresh the page to see the change',
    err: 'Sorry, an error occurred while updating settings, please try again later'
  },
  network: {
    title: 'Network settings',
    visibilitySectionTitle: 'Network visibility',
    visibility: 'Projects, users and teams from the global network are visible',
    update: 'Update settings',
    success: 'Settings has been updated successfully!',
    err: 'Sorry, an error occurred while updating settings, please try again later'
  },
  sidebar: {
    members: 'Members',
    projects: `${project(true, true)}`,
    criteria: 'Attributes',
    layouts: 'Layouts',
    reviewModel: 'Review model',
    faq: 'FAQ',
    settings: 'Settings',
    network: 'Network'
  },
  toolbarAdmin: {
    signOut: 'Sign Out',
    profile: 'Profile',
    accSettings: 'Account Settings',
    createGrantProgram: 'Create Grant Program',
    grantProgram: 'Grant Programs'
  }
};
