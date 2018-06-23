import usersService from './../services/users'
import deipRpc from '@deip/deip-rpc';

export function getEnrichedProfiles(usernames) {
    const profilesPromise = usersService.getUsersProfiles(usernames)
        .then((profiles) => {
            return profiles;
        }, (err) => {
            console.log(err)
            return [];
        })

    const accountsPromise = deipRpc.api.getAccountsAsync(usernames)
        .then((accounts) => {
            return accounts;
        }, (err) => {
            console.log(err)
            return [];
        })

    return Promise.all([profilesPromise, accountsPromise])
        .then((response) => {
            const profiles = response[0];
            const accounts = response[1];
            const results = [];
            for (let i = 0; i < accounts.length; i++) {
                const account = accounts[i];
                const profile = profiles.find(p => p._id == account.name);
                results.push({profile, account})
            }
            return results;
        })
}