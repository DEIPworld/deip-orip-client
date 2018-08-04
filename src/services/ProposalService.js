import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';

const types = {
    START_RESEARCH: 1,
    INVITE_MEMBER: 2,
    DROPOUT_MEMBER: 3,
    SEND_FUNDS: 4,
    START_RESEARCH_TOKEN_SALE: 5,
    REBALANCE_RESEARCH_GROUP_TOKENS: 6,
    CHANGE_QUORUM: 7,
    CHANGE_RESEARCH_REVIEW_SHARE_PERCENT: 8,
    OFFER_RESEARCH_TOKENS: 9,
    ACCEPT_RESEARCH_TOKEN_OFFER: 10,
    CREATE_RESEARCH_MATERIAL: 11
};

// maybe will be OK to add param validations or type conversion
// in every function to be sure every time about right data
const proposalDataStringify = {
    1: (researchGroupId, title, abstract, permlink, reviewShareInPercent, dropoutCompensationInPercent, disciplines) => {
        // `{"research_group_id": 0, "title": "quantum break", "abstract":"research for quantum break", "permlink":"quantumbreak108", "review_share_in_percent": 10, "dropout_compensation_in_percent": 5, "disciplines": [2]}`
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
    2: (researchGroupId, name, researchGroupTokenAmount) => {
        // `{"research_group_id": 0, "name": "alice", "research_group_token_amount": 50}`
        return {
            "research_group_id": researchGroupId,
            "name": name,
            "research_group_token_amount_in_percent": researchGroupTokenAmount
        };
    },
    5: (researchId, startTime, endTime, amount, softCap, hardCap) => {
        // `{"research_id": 0, "start_time": "2018-04-03T15:15:04" , "end_time": "2018-04-03T16:22:43", "amount_for_sale": 5000, "soft_cap": 1000, "hard_cap": 1500}`
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
        // `{"research_id": 0, "type": 2, "title": "My milestone", "content": "My quantum break", "authors": ["initdelegate"], "references": [], "external_references": []}`
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

    const keys = _.keys(extensionFuncs);
    
    // todo: a lot of the same queries go to server, so it should be optimized
    // by grouping the same queries in one and then populating necessery items
    return Promise.all( _.map(extensionFuncs, func => func(proposal)) )
        .then(data => {
            keys.forEach((key, i) =>
                proposal.extension[key] = data[i]
            );

            return proposal;
        });
};

export {
    types,
    getStringifiedProposalData,
    getParsedProposal,
    extendProposalByRelatedInfo
};