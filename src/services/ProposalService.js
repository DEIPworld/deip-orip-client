import _ from 'lodash';

const types = {
    startResearch: 1,
    inviteMember: 2,
    dropoutMember: 3,
    sendFunds: 4,
    startResearchTokenSale: 5,
    rebalanceResearchGroupTokens: 6,
    changeQuorum: 7,
    changeResearchReviewSharePercent: 8,
    offerResearchTokens: 9,
    acceptResearchTokensOffer: 10,
    createResearchMaterial: 11
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

// const proposalDataParser = {
//     5: dataStr =>
//         JSON.parse(dataStr, (key, value) => {
//             return key === "start_time" || key === "end_time"
//                 ? new Date(value)
//                 : value;
//         }),
//     11: dataStr => JSON.parse(dataStr)
// };

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

export {
    types,
    getStringifiedProposalData,
    getParsedProposal
};