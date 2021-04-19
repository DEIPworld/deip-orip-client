import { PROPOSAL_TYPES, PROPOSAL_STATUS } from '@deip/proposals-service';
import { EXPERTISE_CONTRIBUTION_TYPE, ECI_STAT_PERIOD_STEP_TYPE } from '@deip/expertise-contributions-service';
import { RESEARCH_CONTENT_TYPES } from '@deip/research-content-service';
import { AWARD_STATUS, AWARD_RECIPIENT_STATUS, AWARD_WITHDRAWAL_REQUEST_STATUS } from '@deip/grants-service';
import { ASSESSMENT_CRITERIA_TYPE } from '@deip/research-content-reviews-service';
import { createEnum } from '@deip/toolbox';

const proposalTypesLabels = {
  [PROPOSAL_TYPES.CREATE_RESEARCH]: 'Start new research project',
  [PROPOSAL_TYPES.INVITE_MEMBER]: 'Invite new member to research group',
  [PROPOSAL_TYPES.EXCLUDE_MEMBER]: 'Exclude member from research group',
  [PROPOSAL_TYPES.TRANSFER]: 'Transfer research group funds',
  [PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: 'Schedule research fundraising campaign',
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: 'Publish research project results',
  [PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP]: 'Update group meta',
  [PROPOSAL_TYPES.UPDATE_RESEARCH]: 'Update research meta'
};

const LOC_PROPOSAL_TYPES = createEnum({
  CREATE_RESEARCH: 1,
  UPDATE_RESEARCH: 2,
  CREATE_RESEARCH_MATERIAL: 3,
  CREATE_RESEARCH_TOKEN_SALE: 4,
  UPDATE_RESEARCH_GROUP: 5,
  INVITE_MEMBER: 6,
  EXCLUDE_MEMBER: 7,
  TRANSFER_ASSET: 8,
  EXPRESS_LICENSE_REQUEST: 9,
  ASSET_EXCHANGE_REQUEST: 10,
  RESEARCH_NDA: 11
});

let contentTypesMap = {
  // [RESEARCH_CONTENT_TYPES.ANNOUNCEMENT]: { text: 'Announcement', order: 1 },
  // [RESEARCH_CONTENT_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_ARTICLE]: { text: 'Deliverable', order: 2 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_BOOK]: { text: 'Book', order: 3 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_CHAPTER]: { text: 'Chapter', order: 4 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_CODE]: { text: 'Code', order: 5 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_CONFERENCE_PAPER]: { text: 'Conference paper', order: 6 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_COVER_PAGE]: { text: 'Cover page', order: 7 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_DATA]: { text: 'Cost statement', order: 8 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { text: 'Experiment findings', order: 9 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_METHOD]: { text: 'Method', order: 10 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_NEGATIVE_RESULTS]: { text: 'Negative results', order: 11 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_PATENT]: { text: 'Patent', order: 12 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_POSTER]: { text: 'Poster', order: 13 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_PREPRINT]: { text: 'Preprint', order: 14 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_PRESENTATION]: { text: 'Presentation', order: 15 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_RAW_DATA]: { text: 'Raw data', order: 16 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_RESEARCH_PROPOSAL]: { text: 'Research proposal', order: 17 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_TECHNICAL_REPORT]: { text: 'Final report', order: 18 },
  // [RESEARCH_CONTENT_TYPES.MILESTONE_THESIS]: { text: 'Thesis', order: 19 }
};

contentTypesMap = Object.keys(contentTypesMap).reduce((obj, key) => {
  obj[key] = {
    id: key,
    type: RESEARCH_CONTENT_TYPES[key].toLowerCase(),
    ...contentTypesMap[key]
  };
  return obj;
}, {});


const researchContentTypes = [...Object.values(contentTypesMap)].sort((a, b) => a.order - b.order);

const getResearchContentType = (type) => {
  return researchContentTypes.some((t) => t.type === type) 
    ? researchContentTypes.find((t) => t.type === type)
    : researchContentTypes[0];
}

export {
  PROPOSAL_TYPES,
  proposalTypesLabels,
  researchContentTypes,
  getResearchContentType,
  EXPERTISE_CONTRIBUTION_TYPE,
  AWARD_STATUS,
  AWARD_RECIPIENT_STATUS,
  AWARD_WITHDRAWAL_REQUEST_STATUS,
  ASSESSMENT_CRITERIA_TYPE,
  ECI_STAT_PERIOD_STEP_TYPE,
  PROPOSAL_STATUS,
  LOC_PROPOSAL_TYPES,
  RESEARCH_CONTENT_TYPES
};
