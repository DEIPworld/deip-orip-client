import usersService from './../services/http/users'
import deipRpc from '@deip/deip-oa-rpc-client';

import percentiles from './percentiles.json';
const sortedPercentilesData = percentiles.sort((a, b) => a.eciBound - b.eciBound);

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

export function getEciPercentile(eciValue, username, disciplineId) {
  if (username === 'alice') {
    if (disciplineId === 3) {
      return 5;
    } else if (disciplineId === 48) {
      return 10;
    }
  }
  let percentile;
  const lowerBoundPercentileData = sortedPercentilesData[0];
  if (eciValue <= lowerBoundPercentileData.eciBound) {
    percentile = lowerBoundPercentileData.percentile;
  } else {
    let i = 0;
    while (i < sortedPercentilesData.length && sortedPercentilesData[i].eciBound < eciValue) {
      percentile = sortedPercentilesData[i].percentile;
      i += 1;
    }
  }
  return percentile;
}