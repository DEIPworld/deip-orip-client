import _ from 'lodash';
import researchContentSvc from './http/content.js';
import notificationsHttpService from './http/notifications.js';
import deipRpc from '@deip/deip-rpc-client';

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
labels[START_RESEARCH_TOKEN_SALE] = 'Start Research Token sale';
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
}
schemasMap[INVITE_MEMBER] = (researchGroupId, name, researchGroupTokenAmount, coverLetter) => {
    return {
        "research_group_id": researchGroupId,
        "name": name,
        "research_group_token_amount_in_percent": researchGroupTokenAmount,
        "cover_letter": coverLetter
    };
}
schemasMap[START_RESEARCH_TOKEN_SALE] = (researchId, startTime, endTime, amount, softCap, hardCap) => {
    return {
        "research_id": researchId,
        "start_time": startTime,
        "end_time": endTime,
        "amount_for_sale": amount,
        "soft_cap": softCap,
        "hard_cap": hardCap
    };
}
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
}


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
extenderMap[START_RESEARCH_TOKEN_SALE] = undefined;
extenderMap[CREATE_RESEARCH_MATERIAL] = {
    research: proposal => deipRpc.api.getResearchByIdAsync(proposal.data.research_id),
    draftContent: proposal => researchContentSvc.getContentRef( proposal.data.content.split(':')[1] )
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

const createProposal = function(privKey, username, groupId, stringifiedPayload, proposalType) {
    return deipRpc.broadcast.createProposalAsync(privKey, username, groupId, stringifiedPayload, proposalType,
        new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000))
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
                return notificationsHttpService.createResearchGroupNotification(
                    groupId, { type: 'proposal', meta: proposal });
            });
    }

export {
    types,
    labels,
    createProposal,
    getStringifiedProposalData,
    getParsedProposal,
    extendProposalByRelatedInfo
};