export default {
  title: 'Update team info',
  dataForm: {
    logoBlock: {
      title: 'Update team logo:'
    },
    nameBlock: {
      title: 'Team name',
      nameField: {
        label: 'Name',
        err: 'Team with the same name already exists'
      },
      descField: 'Description'
    },
    descBlock: {
      title: 'Team description:'
    },
    successLogo: 'Logo has been updated successfully! Please reload the page to see new logo',
    errLogo: 'Sorry, an error occurred while uploading logo, please try again later',
    successProposal: 'Team details updated successfully',
    errProposal: 'An error occurred during info updating. Please try again later',
    cancel: 'Cancel',
    submitBtn: 'Save changes'
  },
  quorumForm: {
    quorumBlock: {
      title: 'Quorum threshold:'
    },
    text: 'The proposal will be sent to group members and after it\'s approved the threshold will be changed',
    successProposal: 'Information has been updated successfully',
    errProposal: 'An error occurred during proposal sending',
    submitBtn: 'Update Quorum'
  }
};
