import { project } from './basicWords';

export default {
  join: 'Join team',
  invite: 'Invite member',
  start: `Start a ${project()}`,
  successDrop: 'Member is excluded from the team successfully!',
  errDrop: 'An error occurred while creating proposal, please try again later',
  quorumThreshold: 'Quorum threshold',
  transferDialog: {
    transfer: 'Transfer from Group balance',
    toLabel: 'To',
    amountLabel: 'Amount',
    create: 'Create proposal',
    existRule: 'No user with such name',
    amountRule: 'Amount is greater than group balance',
    success: 'Proposal was successfully created',
    err: 'Proposal was failed',
    send: 'Send',
    cancel: 'Cancel'
  },
  groupReqs: {
    joinReqs: 'Join requests',
    invites: 'Pending invites',
    wantJoin: 'Wants to join your group',
    view: 'View'
  },
  sidebar: {
    joinReq: 'Join requests:',
    wantToJoin: 'wants to join your group',
    view: 'View',
    wallet: 'Group Wallet',
    transfer: 'Transfer'
  },
  proposalsTable: {
    title: 'Multisignature transactions',
    failure: 'Failure',
    next: 'Next attempt:',
    reason: 'Reason:',
    pending: 'Pending',
    approved: 'Approved by:',
    noApproval: 'No approvals yet',
    success: 'You have confirmed transaction successfully',
    header: {
      status: 'Status',
      proposal: 'Proposal',
      created: 'Created by',
      signatures: 'Signatures',
      data: 'Data',
      expData: 'Exp. data'
    }
  },
  proposalExpand: {
    reviewers: 'Reviewers\' reward:',
    invToGroup: 'is being invited to the group',
    leftGroup: 'to left the group',
    user: 'User:',
    amount: 'Amount:',
    project: `${project(true)}:`,
    min: 'Min:',
    max: 'Max:',
    start: 'Start Date:',
    end: 'End Date:',
    type: 'Type:',
    updateGrMeta: 'Update group meta',
    updatePrMeta: `Update ${project()} meta`,
    authors: 'Authors:'
  },
  proposal: {
    transfer: 'Transfer tokens',
    fundraise: 'fundraise',
    updateGrMeta: 'Update group meta',
    updatePrMeta: `Update ${project()} meta`
  },
  addMemberDialog: {
    title: 'Invite member to team',
    findPlaceholder: 'Find teammate',
    letterLabel: 'Add invitation letter',
    create: 'Send proposal',
    success: 'Invitation has been sent successfully',
    err: 'An error occurred while creating proposal, please try again later'
  },
  joinRequestDialog: {
    join: 'Join Request',
    tokensLabel: 'Team Tokens',
    submitBtn: 'Approve and create proposal',
    reject: 'Reject',
    successSend: 'Invite proposal for "{username}" has been created successfully',
    successDeny: 'You have denied join request from  "{username}" successfully',
    errSend: 'An error occurred while approving join request, please try again later'
  },
  assetsBlock: {
    title: 'Assets',
    table: {
      assets: 'Assets',
      tokensPrice: 'Tokens price',
      totalRevenue: 'Total Revenue'
    }
  }
};
