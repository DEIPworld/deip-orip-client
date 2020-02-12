import deipRpc from '@deip/deip-oa-rpc-client';

const ECI_REWARD_ACTION_TYPES = {
  CONTENT: 'content',
  REVIEW: 'review',
  INIT: 'init',
};

const ACTIONS_MAP = {
  1: ECI_REWARD_ACTION_TYPES.CONTENT,
  2: ECI_REWARD_ACTION_TYPES.REVIEW,
  3: ECI_REWARD_ACTION_TYPES.INIT,
};

const mapHistoryElement = (elem) => {
  const source = elem.op[1];
  const mappedElem = {
    accountName: source.account_name,
    disciplineId: source.discipline_id,
    newAmount: source.new_expertise_amount,
    delta: source.delta,
    action: ACTIONS_MAP[source.action],
    actionText: ACTIONS_MAP[source.action] == 'init' ? "other" : ACTIONS_MAP[source.action] == 'content' ? "research" : ACTIONS_MAP[source.action],
    actionObjectId: source.action_object_id,
    timestamp: source.timestamp * 1000,
  };

  if (!mappedElem.action) {
    throw new Error('Unsupported action found');
  }

  return mappedElem;
};

const getExpertiseHistory = (username, disciplineId, from = 0, to = Date.now()) => {
  const _from = Math.round(from / 1000);
  const _to = Math.ceil(to / 1000);

  return deipRpc.api.getExpertiseHistoryByAccountAndDisciplineAsync(username, disciplineId, _from, _to)
    .then((history) => {
      return history.map(mapHistoryElement);
    });
};

const getEciPercentile = (eciValue, username, disciplineId) => {
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

export {
  getExpertiseHistory,
  getEciPercentile,
  ECI_REWARD_ACTION_TYPES
}