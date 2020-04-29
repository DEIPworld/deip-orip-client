const USERNAME_SORT_BY = 'username';
const DISCIPLINE_SORT_BY = 'discipline';
const CREATED_AT_SORT_BY = 'created_at';
const PUBLICATIONS_SORT_BY = 'publications';

const sortingMap = {};

sortingMap[USERNAME_SORT_BY] = [(claim) => claim.username];
sortingMap[DISCIPLINE_SORT_BY] = [(claim) => claim.disciplineId];
sortingMap[CREATED_AT_SORT_BY] = [(claim) => Date.parse(claim.created_at)];
sortingMap[PUBLICATIONS_SORT_BY] = [(claim) => claim.publications.length];

export default {
  types: {
    USERNAME_SORT_BY,
    DISCIPLINE_SORT_BY,
    CREATED_AT_SORT_BY,
    PUBLICATIONS_SORT_BY
  },

  sortingMap
};
