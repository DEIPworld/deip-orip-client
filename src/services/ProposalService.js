import _ from 'lodash';
import deipRpc from '@deip/deip-oa-rpc-client';
import researchContentSvc from './http/content.js';
import proposalsHttp from './http/proposals';
import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import { getEnrichedProfiles } from './../utils/user'

export const START_RESEARCH = 1;
export const INVITE_MEMBER = 2;
export const DROPOUT_MEMBER = 3;
export const SEND_FUNDS = 4;
export const START_RESEARCH_TOKEN_SALE = 5;
export const REBALANCE_RESEARCH_GROUP_TOKENS = 6;
export const CHANGE_QUORUM = 7;
export const CHANGE_RESEARCH_REVIEW_SHARE_PERCENT = 8;
export const OFFER_RESEARCH_TOKENS = 9;
export const CREATE_RESEARCH_MATERIAL = 10;

const types = {
    START_RESEARCH,
    INVITE_MEMBER,
    DROPOUT_MEMBER,
    SEND_FUNDS,
    START_RESEARCH_TOKEN_SALE,
    REBALANCE_RESEARCH_GROUP_TOKENS,
    CHANGE_QUORUM,
    CHANGE_RESEARCH_REVIEW_SHARE_PERCENT,
    OFFER_RESEARCH_TOKENS,
    CREATE_RESEARCH_MATERIAL
};

const labels = {};
labels[START_RESEARCH] = 'Start research';
labels[INVITE_MEMBER] = 'Invite member';
labels[DROPOUT_MEMBER] = 'Dropout member';
labels[SEND_FUNDS] = 'Send funds';
labels[START_RESEARCH_TOKEN_SALE] = 'Start Research fundraise';
labels[REBALANCE_RESEARCH_GROUP_TOKENS] = 'Rebalance Research Group Tokens';
labels[CHANGE_QUORUM] = 'Change quorum';
labels[CHANGE_RESEARCH_REVIEW_SHARE_PERCENT] = 'Change research review share';
labels[OFFER_RESEARCH_TOKENS] = 'Offer Research Tokens';
labels[CREATE_RESEARCH_MATERIAL] = 'Publish research results';

// maybe will be OK to add param validations or type conversion
// in every function to be sure every time about right data
const schemasMap = {};
schemasMap[START_RESEARCH] = (researchGroupId, title, abstract, permlink, reviewShareInPercent, dropoutCompensationInPercent, disciplines) => {
    return {
        "research_group_id": researchGroupId, 
        "title": title, 
        "abstract": abstract, 
        "permlink": permlink, 
        "review_share_in_percent": reviewShareInPercent, 
        "dropout_compensation_in_percent": dropoutCompensationInPercent, 
        "disciplines": disciplines
    };
};
schemasMap[INVITE_MEMBER] = (researchGroupId, name, researchGroupTokenAmount, coverLetter) => {
    return {
        "research_group_id": researchGroupId,
        "name": name,
        "research_group_token_amount_in_percent": researchGroupTokenAmount,
        "cover_letter": coverLetter
    };
};
schemasMap[SEND_FUNDS] = (researchGroupId, recipient, funds) => {
    return {
        "research_group_id": researchGroupId,
        "recipient": recipient,
        "funds": funds
    };
};
schemasMap[START_RESEARCH_TOKEN_SALE] = (researchId, startTime, endTime, amount, softCap, hardCap) => {
    return {
        "research_id": researchId,
        "start_time": startTime,
        "end_time": endTime,
        "amount_for_sale": amount,
        "soft_cap": softCap,
        "hard_cap": hardCap
    };
};
schemasMap[CHANGE_QUORUM] = (researchGroupId, proposalType, quorumPercent) => {
    return {
        'research_group_id': researchGroupId,
        'proposal_type': proposalType,
        'quorum_percent': quorumPercent
    };
};
schemasMap[CREATE_RESEARCH_MATERIAL] = (researchId, type, title, permlink, content, authors, references, externalReferences) => {
    return {
        "research_id": researchId,
        "type": type,
        "title": title,
        "permlink": permlink,
        "content": content,
        "authors": authors,
        "references": references,
        "external_references": externalReferences
    };
};


const getStringifiedProposalData = (type, params) => {
    if (schemasMap[type] === undefined) {
        throw 'Unknown proposal type';
    }
    return JSON.stringify(schemasMap[type](...params));
};

const getParsedProposal = proposal => {
    proposal.data = JSON.parse(proposal.data);
    return proposal;
};

const extenderMap = {}
extenderMap[START_RESEARCH] = undefined;
extenderMap[INVITE_MEMBER] = undefined;
extenderMap[SEND_FUNDS] = {
    recipient: proposal => getEnrichedProfiles([proposal.data.recipient]).then(data => data[0])
};
extenderMap[START_RESEARCH_TOKEN_SALE] = undefined;
extenderMap[CREATE_RESEARCH_MATERIAL] = {
    research: proposal => deipRpc.api.getResearchByIdAsync(proposal.data.research_id),
    draftContent: proposal => researchContentSvc.getContentRefByHash(proposal.data.research_id, proposal.data.content.split(':')[1])
};

const extendProposalByRelatedInfo = proposal => {
    const extensionFuncs = extenderMap[proposal.action];
    proposal.extension = {};

    if (!extensionFuncs) {
        return Promise.resolve(proposal);
    }

    const fieldKeys = _.keys(extensionFuncs);
    
    // todo: a lot of the same queries go to server, so it should be optimized
    // by grouping the same queries in one and then populating necessery items
    // todo: use agregation services!!!
    return Promise.all( 
            _.map(extensionFuncs, func => func(proposal) )
        ).then(data => {
            fieldKeys.forEach((key, i) =>
                proposal.extension[key] = data[i]
            );

            return proposal;
        });
};

const getProposalExpirationTime = () => new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);

const createProposal = function(privKey, username, groupId, stringifiedPayload, proposalType) {
    return deipRpc.broadcast.createProposalAsync(privKey, username, groupId, stringifiedPayload, proposalType, getProposalExpirationTime())
            .then((block) => {
                var proposal = null;
                for (let i = 0; i < block.operations.length; i++) {
                    const op = block.operations[i];
                    const opName = op[0];
                    const opPayload = op[1];
                    if (opName === 'create_proposal') {
                        if (opPayload.data == stringifiedPayload) {
                            proposal = opPayload;
                            break;
                        }
                    }
                }
                if (proposal) {
                    proposal.data = JSON.parse(proposal.data)
                }
            });
}

const voteForProposal = function(groupId, proposalId) {
    const vote = {
        voter: getDecodedToken().username,
        research_group_id: groupId,
        proposal_id: proposalId
    };
    const operation = ["vote_proposal", vote];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return proposalsHttp.sendVoteForProposal(signedTx);
        })
}

const createInviteProposal = function(groupId, invitee, rgtAmount, coverLetter) {
    const data = getStringifiedProposalData(INVITE_MEMBER, [ 
        groupId, invitee, rgtAmount, coverLetter
    ]);

    const proposal = {
        creator: getDecodedToken().username,
        research_group_id: groupId,
        data: data,
        action: INVITE_MEMBER,
        expiration_time: getProposalExpirationTime()
    };

    const operation = ["create_proposal", proposal];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return proposalsHttp.sendInviteProposal(signedTx);
        })
}

const createSendFundsProposal = (groupId, recipient, funds) => {
    const data = getStringifiedProposalData(SEND_FUNDS, [
        groupId,
        recipient,
        funds
    ]);

    return deipRpc.broadcast.createProposalAsync(
        getOwnerWif(),
        getDecodedToken().username,
        groupId,
        data,
        SEND_FUNDS,
        getProposalExpirationTime()
    );
};

const createResearchProposal = function (groupId, title, description, permlink, reviewShare, disciplines, milestones, videoSrc) {
    const data = getStringifiedProposalData(START_RESEARCH, [
        groupId, title, JSON.stringify({ description, milestones, video_src: videoSrc }), permlink, reviewShare, 5, disciplines
    ]);

    const proposal = {
        creator: getDecodedToken().username,
        research_group_id: groupId,
        data: data,
        action: START_RESEARCH,
        expiration_time: getProposalExpirationTime()
    };

    const operation = ["create_proposal", proposal];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return proposalsHttp.sendResearchProposal(signedTx);
        })
}

const createChangeQuorumProposal = (groupId, proposalType, quorumPercent) => {
    const data = getStringifiedProposalData(CHANGE_QUORUM, [
        groupId,
        proposalType,
        quorumPercent
    ]);

    return deipRpc.broadcast.createProposalAsync(
        getOwnerWif(),
        getDecodedToken().username,
        groupId,
        data,
        CHANGE_QUORUM,
        getProposalExpirationTime()
    );
};

const createContentProposal = function(contentRef, contentType) {
    const data = getStringifiedProposalData(CREATE_RESEARCH_MATERIAL, [
        contentRef.researchId, contentType, contentRef.title, 
        contentRef.title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase(),
        `${contentRef.type}:${contentRef.hash}`, contentRef.authors, contentRef.references, contentRef.externalReferences
    ]);

    const proposal = {
        creator: getDecodedToken().username,
        research_group_id: contentRef.researchGroupId,
        data: data,
        action: CREATE_RESEARCH_MATERIAL,
        expiration_time: getProposalExpirationTime()
    };

    const operation = ["create_proposal", proposal];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return proposalsHttp.sendContentProposal(signedTx, contentRef.type);
        })
}

const createTokenSaleProposal = function(groupId, researchId, startDate, endDate, amount, softCap, hardCap) {
    const data = getStringifiedProposalData(START_RESEARCH_TOKEN_SALE, [
        researchId, startDate, endDate, amount, softCap, hardCap
    ]);

    const proposal = {
        creator: getDecodedToken().username,
        research_group_id: groupId,
        data: data,
        action: START_RESEARCH_TOKEN_SALE,
        expiration_time: getProposalExpirationTime()
    };

    const operation = ["create_proposal", proposal];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return proposalsHttp.sendTokenSaleProposal(signedTx);
        })
}

const validateQuorumValue = value => {
    let intValue = parseInt(value);
    let isNumber = _.isFinite(intValue);

    return !isNumber || isNumber && (intValue > 100 || intValue < 5);
}

export {
    types,
    labels,

    voteForProposal,

    createInviteProposal,
    createChangeQuorumProposal,
    createSendFundsProposal,
    createResearchProposal,
    createContentProposal,
    createTokenSaleProposal,

    getParsedProposal,
    extendProposalByRelatedInfo,

    validateQuorumValue
};