import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import usersService from './../../../services/http/users';

const loadUserAccount = username => {
    return deipRpc.api.getAccountsAsync([username])
        .then(data => data[0]);
};

const loadGroups = username => {
    return deipRpc.api.getResearchGroupTokensByAccountAsync(username)
        .then(data => {
            let groupsInfo = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupByIdAsync(groupToken.research_group_id))
            );

            let groupsShares = Promise.all(
                data.map(groupToken => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(groupToken.research_group_id))
            );

            return Promise.all([groupsInfo, groupsShares]);
        })
        .then(([groupsInfo, groupsShares]) => {
            return _.each(groupsInfo, (item, i) => { item.shares = groupsShares[i] });
        });
};

const loadResearchList = (username, groupIds) => {
    // researhes where user took participation 
    let researchList = [];

    return Promise.all(
        groupIds.map(groupId => deipRpc.api.getAllResearchContentAsync(groupId))
    )
        .then(data => {
            let researchPromises = _(data)
                .flatten()
                .filter(item => _.includes(item.authors, username))
                .map('research_id')
                .uniq()
                .map(researchId => deipRpc.api.getResearchByIdAsync(researchId))
                .value();

            return Promise.all(researchPromises);
        })
        .then(researches => {
            researchList = researches;

            return Promise.all(
                researchList.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.research_id))
            );
        })
        .then(list => {
            let tvoMap = _.chain(list)
                .flatten()
                .groupBy('research_id')
                .value();

            researchList.forEach(research => {
                research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
            });

            return researchList;
        });
};

const loadExpertise = username => {
    return deipRpc.api.getExpertTokensByAccountNameAsync(username);
};

const loadUserProfile = username => {
    return usersService.getUserProfile(username)
        .then(profile => profile !== "" ? profile : null);
};

const loadUserInvites = username => {
    const invites = [];

    return deipRpc.api.getResearchGroupInvitesByAccountNameAsync(username)
        .then(list => {
            const promises = [];

            for (let i = 0; i < list.length; i++) {
                const invite = list[i];
                invites.push(invite);
                promises.push(deipRpc.api.getResearchGroupByIdAsync(invite.research_group_id))
            }

            return Promise.all(promises);
        })
        .then(groups => {
            for (let i = 0; i < invites.length; i++) {
                const invite = invites[i];
                invite.group = groups.find(g => g.id === invite.research_group_id)
            }

            return invites;
        });
};

export default {
    loadUserAccount,
    loadGroups,
    loadResearchList,
    loadExpertise,
    loadUserProfile,
    loadUserInvites
}