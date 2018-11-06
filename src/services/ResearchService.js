
import { getStringifiedProposalData, CREATE_RESEARCH_MATERIAL } from './ProposalService'
import { signOperation } from './../utils/blockchain'
import contentHttpService from './http/content'
import { getDecodedToken, getOwnerWif } from './../utils/auth'

export const ANNOUNCEMENT = 1;
export const FINAL_RESULT = 2;
export const ARTICLE = 3;
export const BOOK = 4;
export const CHAPTER = 5;
export const CODE = 6;
export const CONFERENCE_PAPER = 7;
export const COVER_PAGE = 8;
export const DATA = 9;
export const EXPERIMENT_FINDINGS = 10;
export const METHOD = 11;
export const NEGATIVE_RESULTS = 12;
export const PATENT = 13;
export const POSTER = 14;
export const PREPRINT = 15;
export const PRESENTATION = 16;
export const RAW_DATA = 17;
export const RESEARCH_PROPOSAL = 18;
export const TECHNICAL_REPORT = 19;
export const THESIS = 20;

const contentTypes = [
    { id: ANNOUNCEMENT, text: 'Announcement', type: 'announcement' },
    { id: ARTICLE, text: 'Article', type: 'milestone_article' },
    { id: BOOK, text: 'Book', type: 'milestone_book' },
    { id: CHAPTER, text: 'Chapter', type: 'milestone_chapter' },
    { id: CODE, text: 'Code', type: 'milestone_code' },
    { id: CONFERENCE_PAPER, text: 'Conference paper', type: 'milestone_conference_paper' },
    { id: COVER_PAGE, text: 'Cover page', type: 'milestone_cover_page' },
    { id: DATA, text: 'Data', type: 'milestone_data' },
    { id: EXPERIMENT_FINDINGS, text: 'Experiment findings', type: 'milestone_experiment_findings' },
    { id: METHOD, text: 'Method', type: 'milestone_method' },
    { id: NEGATIVE_RESULTS, text: 'Negative results', type: 'milestone_negative_results' },
    { id: PATENT, text: 'Patent', type: 'milestone_patent' },
    { id: POSTER, text: 'Poster', type: 'milestone_poster' },
    { id: PREPRINT, text: 'Preprint', type: 'milestone_preprint' },
    { id: PRESENTATION, text: 'Presentation', type: 'milestone_presentation' },
    { id: RAW_DATA, text: 'Raw data', type: 'milestone_raw_data' },
    { id: RESEARCH_PROPOSAL, text: 'Research proposal', type: 'milestone_research_proposal' },
    { id: TECHNICAL_REPORT, text: 'Technical report', type: 'milestone_technical_report' },
    { id: THESIS, text: 'Thesis', type: 'milestone_thesis' },

    { id: FINAL_RESULT, text: 'Final Result', type: 'final_result' }
];

const createContentProposal = function(contentRef, contentType) {
    const proposal = getStringifiedProposalData(CREATE_RESEARCH_MATERIAL, [
            contentRef.researchId, contentType, contentRef.title, 
            contentRef.title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase(),
            `${contentRef.type}:${contentRef.hash}`, contentRef.authors, contentRef.references, []
        ]);

    const operation = ["create_proposal", {
        creator: getDecodedToken().username,
        research_group_id: contentRef.researchGroupId,
        data: proposal,
        action: CREATE_RESEARCH_MATERIAL,
        expiration_time: new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
    }];

    return signOperation(operation, getOwnerWif())
        .then((signedTX) => {
            return contentHttpService.createContentProposal(signedTX, contentRef.type);
        });
}

export {
    contentTypes,
    contentTypesDictionary,
    createContentProposal
}
