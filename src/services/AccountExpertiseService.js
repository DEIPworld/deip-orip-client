import deipRpc from '@deip/deip-oa-rpc-client';

const actionTypes = {
  CONTENT: 'content',
  REVIEW: 'review',
  INIT: 'init',
};

const ACTIONS_MAP = {
  1: actionTypes.CONTENT,
  2: actionTypes.REVIEW,
  3: actionTypes.INIT,
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

export {
  getExpertiseHistory,
  actionTypes
}