import _ from 'lodash';
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
export const ACCEPT_RESEARCH_TOKEN_OFFER = 10;
export const CREATE_RESEARCH_MATERIAL = 11;

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
    ACCEPT_RESEARCH_TOKEN_OFFER,
    CREATE_RESEARCH_MATERIAL
};

const labels = {
    1: 'Start research',
    2: 'Invite member',
    3: 'Dropout member',
    4: 'Send funds',
    5: 'Start research token sale',
    6: 'Rebalance research group tokens',
    7: 'Change quorum',
    8: 'Change research review share percent',
    9: 'Offer research tokens',
    10: 'Accept research token offer',
    11: 'Create  research material'
};

// maybe will be OK to add param validations or type conversion
// in every function to be sure every time about right data
const proposalDataStringify = {
    1: (researchGroupId, title, abstract, permlink, reviewShareInPercent, dropoutCompensationInPercent, disciplines) => {
        return {
            "research_group_id": researchGroupId, 
            "title": title, 
            "abstract": abstract, 
            "permlink": permlink, 
            "review_share_in_percent": reviewShareInPercent, 
            "dropout_compensation_in_percent": dropoutCompensationInPercent, 
            "disciplines": disciplines
        };
    },
    2: (researchGroupId, name, researchGroupTokenAmount, coverLetter) => {
        return {
            "research_group_id": researchGroupId,
            "name": name,
            "research_group_token_amount_in_percent": researchGroupTokenAmount,
            "cover_letter": coverLetter
        };
    },
    5: (researchId, startTime, endTime, amount, softCap, hardCap) => {
        return {
            "research_id": researchId,
            "start_time": startTime,
            "end_time": endTime,
            "amount_for_sale": amount,
            "soft_cap": softCap,
            "hard_cap": hardCap
        };
    },
    11: (researchId, type, title, permlink, content, authors, references, externalReferences) => {
        return {
            "research_id": researchId,
            "type": type,
            "title": title,
            "permlink": permlink,
            "content": content,
            "authors": authors,
            "references": references,
            "external_references": externalReferences
        }
    }
};

const getStringifiedProposalData = (type, params) => {
    if (proposalDataStringify[type] === undefined) {
        throw 'Wrong proposal type';
    }

    return JSON.stringify(
        proposalDataStringify[type](...params)
    );
};

const getParsedProposal = proposal => {
    proposal.data = JSON.parse(proposal.data);
    return proposal;
};

const proposalExtenderMap = {
    1: undefined,
    2: undefined,
    5: undefined,
    11: {
        research: proposal => deipRpc.api.getResearchByIdAsync(proposal.data.research_id)
    }
};

const extendProposalByRelatedInfo = proposal => {
    const extensionFuncs = proposalExtenderMap[proposal.action];
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

export {
    types,
    labels,
    getStringifiedProposalData,
    getParsedProposal,
    extendProposalByRelatedInfo
};