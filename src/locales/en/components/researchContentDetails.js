import { project } from './basicWords';

export default {
  project: `${project()}`,
  subject: 'Subject',
  sidebar: {
    references: 'References',
    bchMetadata: 'Blockchain Metadata',
    expiredProposal: 'The proposal is expired. Unlock the material for a new proposal or removal',
    unlockDraftBtn: 'Unlock Draft',
    eci: 'Expertise Contribution Index',
    authors: 'Authors',
    contentTable: `${project(true)} table of content`,
    draft: 'Draft is',
    proposed: 'proposed',
    locked: 'as project content and locked for editing'
  },
  metadata: {
    blockNum: 'Block #{blockNum}',
    genesis: 'GENESIS',
    blockID: 'Block ID',
    ripemd: 'RIPEMD-160',
    content: 'content',
    SHA256: 'SHA256',
    timestamp: 'Timestamp (ISO 8601)',
    signee: 'Signee',
    ecc: 'ECC',
    signature: 'Signature',
    approvedBy: 'Approved by',
    transactionID: 'Transaction ID',
    transactionHEX: 'Transaction HEX',
    hex: 'HEX',
    chainID: 'Chain ID'
  },
  references: {
    dataOver: 'Data usage overview',
    refNumber: 'Number of reference nodes: {referencesCount}',
    fileInfo: 'File Info',
    dataUsers: 'Data users',
    title: 'Title',
    dataType: 'Data Type',
    authors: 'Authors',
    organization: 'Organization',
    releaseDate: 'Release date',
    verifiedBy: 'Verified by',
    sharedMat: 'Material has not yet exploit by anyone',
    usageOrg: 'Usage by organization',
    usageType: 'Usage by data type',
    usageDomain: 'Usage by domain'
  },
  addRev: {
    pubSucc: 'Your review has been published successfully !',
    pubFail: 'An error occurred while adding review, please try again later'
  }
};
