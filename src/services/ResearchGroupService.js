import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import groupsHttp from './http/groups';
import deipRpc from '@deip/deip-oa-rpc-client';


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

const mapResearchGroup = (rg) => ({
  ...rg,
  logo_src: rg.is_personal ? null : `/static/research_groups/${rg.permlink}.png`,
});

const getAllResearchGroups = (withPersonal = false) => deipRpc.api.getAllResearchGroupsAsync(withPersonal)
  .then((groupsList) => groupsList.map(mapResearchGroup));

const getResearchGroupById = (groupId) => deipRpc.api.getResearchGroupByIdAsync(groupId)
  .then(mapResearchGroup);

export {
  createResearchGroup,
  getAllResearchGroups,
  getResearchGroupById,
};
