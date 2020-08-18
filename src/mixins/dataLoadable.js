export const dataLoadableFactory = (defaultValue = []) => {
  return {
    props: {
      data: {
        type: [Array, Object],
        default: () => defaultValue
      },
      loading: {
        type: [Boolean, String],
        default: true
      }
    }
  };
};

export const DataLoadable = dataLoadableFactory();
