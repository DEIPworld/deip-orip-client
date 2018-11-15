import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import groupsHttp from './http/groups';


const createResearchGroup = function(name, permlink, description, quorumPercent, proposalQuorums, invitees) {
    const group = {
        creator: getDecodedToken().username,
        name: name,
        permlink: permlink,
        description: description,
        quorum_percent: quorumPercent,
        proposal_quorums: proposalQuorums,
        is_personal: false,
        invitees: invitees
    };

    const operation = ["create_research_group", group];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return groupsHttp.sendCreateGroup(signedTx)
        })
}

export {
    createResearchGroup
};
