
import { getStringifiedProposalData, CREATE_RESEARCH_MATERIAL } from './ProposalService'
import { signOperation } from './../utils/blockchain'
import contentHttpService from './http/content'
import { getDecodedToken, getOwnerWif } from './../utils/auth'

const contentTypes = [
    { id: 1, text: 'Announcement', type: 'announcement' },
    { id: 3, text: 'Article', type: 'milestone_article' },
    { id: 4, text: 'Book', type: 'milestone_book' },
    { id: 5, text: 'Chapter', type: 'milestone_chapter' },
    { id: 6, text: 'Code', type: 'milestone_code' },
    { id: 7, text: 'Conference paper', type: 'milestone_conference_paper' },
    { id: 8, text: 'Cover page', type: 'milestone_cover_page' },
    { id: 9, text: 'Data', type: 'milestone_data' },
    { id: 10, text: 'Experiment findings', type: 'milestone_experiment_findings' },
    { id: 11, text: 'Method', type: 'milestone_method' },
    { id: 12, text: 'Negative results', type: 'milestone_negative_results' },
    { id: 13, text: 'Patent', type: 'milestone_patent' },
    { id: 14, text: 'Poster', type: 'milestone_poster' },
    { id: 15, text: 'Preprint', type: 'milestone_preprint' },
    { id: 16, text: 'Presentation', type: 'milestone_presentation' },
    { id: 17, text: 'Raw data', type: 'milestone_raw_data' },
    { id: 18, text: 'Research proposal', type: 'milestone_research_proposal' },
    { id: 19, text: 'Technical report', type: 'milestone_technical_report' },
    { id: 20, text: 'Thesis', type: 'milestone_thesis' },

    { id: 2, text: 'Final Result', type: 'final_result' }
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
    createContentProposal
}
