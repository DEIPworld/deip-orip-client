
import { getStringifiedProposalData, CREATE_RESEARCH_MATERIAL } from './ProposalService'
import { signOperation } from './../utils/blockchain'
import contentHttpService from './http/content'
import { getDecodedToken, getOwnerWif } from './../utils/auth'

const contentTypes = [
    { id: 1, text: 'Announcement' },
    { id: 3, text: 'Article' },
    { id: 4, text: 'Book' },
    { id: 5, text: 'Chapter' },
    { id: 6, text: 'Code' },
    { id: 7, text: 'Conference paper' },
    { id: 8, text: 'Cover page' },
    { id: 9, text: 'Data' },
    { id: 10, text: 'Experiment findings' },
    { id: 11, text: 'Method' },
    { id: 12, text: 'Negative results' },
    { id: 13, text: 'Patent' },
    { id: 14, text: 'Poster' },
    { id: 15, text: 'Preprint' },
    { id: 16, text: 'Presentation' },
    { id: 17, text: 'Raw data' },
    { id: 18, text: 'Research proposal' },
    { id: 19, text: 'Technical report' },
    { id: 20, text: 'Thesis' },

    { id: 2, text: 'Final Result' }
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
