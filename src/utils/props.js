export const breakpoints = ['sm', 'md', 'lg', 'xl'];

export const breakpointProps = breakpoints.reduce((props, val) => {
  // eslint-disable-next-line no-param-reassign
  props[val] = {
    type: [Boolean, String, Number],
    default: false
  };
  return props;
}, {});
