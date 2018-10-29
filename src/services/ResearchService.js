
import { getStringifiedProposalData, CREATE_RESEARCH_MATERIAL } from './ProposalService'
import { signOperation } from './../utils/blockchain'
import contentHttpService from './http/content'
import { getDecodedToken, getOwnerWif } from './../utils/auth'

const contentTypes = [
    { id: 1, text: 'Announcement' },
    { id: 2, text: 'Milestone' },
    { id: 3, text: 'Final Result' }
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
