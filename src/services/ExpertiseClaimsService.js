import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import expertiseClaimsHttp from './http/expertiseClaims';

const createExpertiseClaim = function(claimer, disciplineId, description, publications) {
    const claim = {
        claimer: claimer,
        discipline_id: disciplineId,
        description: description
    };
    
    const operation = ["create_expertise_allocation_proposal", claim];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return expertiseClaimsHttp.createExpertiseClaim(signedTx, publications);
        })
}

const voteForExpertiseClaim = function(proposalId, voter, votingPower) {
    const vote = {
        proposal_id: proposalId,
        voter: voter,
        voting_power: votingPower
    };
    
    const operation = ["vote_for_expertise_allocation_proposal", vote];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return expertiseClaimsHttp.voteForExpertiseClaim(signedTx)
        })
}

export {
    createExpertiseClaim,
    voteForExpertiseClaim
};
