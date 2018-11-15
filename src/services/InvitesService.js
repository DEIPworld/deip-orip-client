import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import invitesHttp from './http/invites';

const approveInvite = function(groupId, owner) {
    const invite = {
        research_group_invite_id: groupId,
        owner: owner
    };
    
    const operation = ["approve_research_group_invite", invite];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return invitesHttp.sendApproveInvite(signedTx)
        })
}

const rejectInvite = function(groupId, owner) {
    const invite = {
        research_group_invite_id: groupId,
        owner: owner
    };
    
    const operation = ["reject_research_group_invite", invite];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return invitesHttp.sendRejectInvite(signedTx)
        })
}

export {
    approveInvite,
    rejectInvite
};
