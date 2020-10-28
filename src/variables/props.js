const props = {
  project: {
    type: Object,
    default: () => ({})
  },

  attribute: {
    type: Object,
    default: () => ({})
  },
};

export const commonProps = (() => {
  return Object.keys(props)
    .reduce((res, prop) => ({ ...res, ...{ [prop]: { [prop]: props[prop] } } }), {});
})();
