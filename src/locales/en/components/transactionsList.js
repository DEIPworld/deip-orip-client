import { project } from './basicWords';

export default {
  transaction: 'Transaction',
  parties: 'Parties',
  party: 'Party',
  signatures: 'Signatures',
  signature: 'Signature',
  transfer: '{asset} to {account}',
  licenseRequest: `{fee}, ${project()}: {project}`,
  exchangeRequest: '{asset1} to {asset2}',
  inviteMember: ' {invitee} invited to join {researchGroup}',
  excludeMember: 'Remove {member} from the {researchGroup}',
  createResearchMaterial: `{material}, ${project()}: {project}`,
  createTokenSale: `Min: {min}, max: {max}, ${project()}: {project}`,
  projectNda: `${project(true)}: {project}`,
  expiresIn: 'Expires in',
  confirm: 'Confirm',
  decline: 'Decline',
  licType: 'License type',
  requiredParties: 'Required parties',
  signedBy: 'Transaction signed by',
  transactionID: 'Transaction ID',
  block: 'Block',
  timestamp: 'Timestamp',
  showDetails: 'Show transactions details',
  hideDetails: 'Hide transactions details',
  transactionTypes: {
    createProject: `Create ${project(true)}`,
    projectUpdate: `${project(true)} Update`,
    contentUpload: 'Content Upload',
    fundraising: 'Fundraising',
    teamUpdate: 'Team update',
    inviteMember: 'Invite member',
    removeMember: 'Remove member',
    transfer: 'Transfer',
    licensing: 'Licensing',
    exchange: 'Exchange',
    projectNda: 'Grant access'
  },
  table: {
    type: 'Type',
    target: 'Target',
    status: 'Status',
    expirationDate: 'Expiration date',
    actions: 'Actions'
  },
  status: {
    signed: 'Signed',
    pending: 'Pending',
    declined: 'Declined',
    failed: 'Failed',
    expired: 'Expired'
  },
  voteSucc: 'You have confirmed transaction successfully',
  voteFail: 'Oops! Something went wrong. Please try again later'
}