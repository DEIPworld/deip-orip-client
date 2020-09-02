import where from 'filter-where';

export const filterWhere = {
  install(_Vue) {
    const whereFn = (value, f = {}) => {
      if (!value) return '';
      return value.filter(where(f));
    };

    _Vue.prototype.$where = whereFn;
    _Vue.$where = whereFn;
    _Vue.filter('where', whereFn);
  }
};
