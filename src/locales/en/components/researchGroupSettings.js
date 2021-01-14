export default {
  title: 'Edit group info',
  dataForm: {
    logoBlock: {
      title: 'Update group logo:'
    },
    nameBlock: {
      title: 'Group name',
      nameField: {
        label: 'Name',
        err: 'Group with the same name already exists'
      },
      descField: 'Description'
    },
    descBlock: {
      title: 'Group description:'
    },
    successLogo: 'Logo has been updated successfully! Refresh the page please',
    errLogo: 'Sorry, an error occurred while uploading logo image, please try again later',
    successProposal: 'Proposal has been sent successfully!',
    errProposal: 'An error occurred during proposal sending',
    cancel: 'Cancel',
    submitBtn: 'Save changes'
  },
  quorumForm: {
    quorumBlock: {
      title: 'Quorum threshold:'
    },
    text: 'The proposal will be sent to group members and after it\'s approved the threshold will be changed',
    successProposal: 'Proposal has been sent successfully!',
    errProposal: 'An error occurred during proposal sending',
    submitBtn: 'Update Quorum'
  }
};
