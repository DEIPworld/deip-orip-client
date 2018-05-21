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
    11: (researchId, type, title, content, authors, references, externalReferences) => {
        // `{"research_id": 0, "type": 2, "title": "My milestone", "content": "My quantum break", "authors": ["initdelegate"], "references": [], "external_references": []}`
        return {
            "research_id": researchId,
            "type": type,
            "title": title,
            "content": content,
            "authors": authors,
            "references": references,
            "external_references": externalReferences
        }  
    }
};

const proposalDataParser = {
    5: dataStr =>
        JSON.parse(dataStr, (key, value) => {
            return key === "start_time" || key === "end_time"
                ? new Date(value)
                : value;
        }),
    11: dataStr => JSON.parse(dataStr)
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

export {
    types,
    getStringifiedProposalData,
    getParsedProposal
};