export default {
  categories: {
    title: 'Project categories',
    create: 'Create catergory',
    categoriesTable: {
      name: 'Name',
      projects: 'Assigned projects'
    },
    deleteDialog: {
      title: 'Delete category?',
      description: `Category  will be deleted permanently.
        Assigned projects will stay without category`,
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
      description: `Attribute will be set for each project and will appear on:
        - project page,
        - project application form,
        - explore page.
        `,
      submitBtn: 'publish'

    },
    unpublishDialog: {
      title: 'Unpublish attribute?',
      description: `Attribute will be removed from:
        - project page,
        - project application form,
        - explore page.
        `,
      submitBtn: 'unpublish'

    },
    deleteDialog: {
      title: 'Delete attribute?',
      description: `Attribute will be deleted permanently and will be removed from:
        - project page,
        - project application form,
        - explore page.
        `,
      submitBtn: 'delete'

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
    title: 'Projects',
    allTab: 'All projects',
    waitingTab: 'Waiting for approval',
    publicTable: {
      title: 'Title',
      created: 'Created'
    },

    pendingTable: {
      title: 'Title',
      created: 'Created',
      innovator: 'Project innovator'
    },
    researchDialog: {
      reject: 'Reject',
      submitBtn: 'Approve'
    },
    approveDialog: {
      title: 'Approve request?',
      description: 'Project request will be approved and project will be published.',
      submitBtn: 'Approve'
    },
    rejectDialog: {
      title: 'Reject request?',
      description: 'Project request will not be approved and project will not be published.',
      submitBtn: 'Reject'
    },
    deleteDialog: {
      title: 'Delete project?',
      description: 'Project will be hidden from platform permanently.',
      submitBtn: 'Delete'
    }
  },
  settings: {
    title: 'Settings',
    change: 'Change banner on Explore page',
    update: 'Update banner',
    success: 'Banner image has been updated successfully ! Refresh the page to see thr changes',
    err: 'Sorry, an error occurred while uploading banner image, please try again later'
  },
  sidebar: {
    members: 'Members',
    projects: 'Projects',
    criteria: 'Attributes',
    categories: 'Layouts',
    model: 'Review model',
    faq: 'FAQ',
    settings: 'Settings'
  }
};
