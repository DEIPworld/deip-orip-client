export function preliminaryDataLoader(component, { beforeEnter }) {
  return {
    name: 'PreliminaryDataLoaderComponent',

    data() {
      return {};
    },

    beforeRouteEnter(to, from, next) {
      beforeEnter(to, from, next);
    },

    // todo: think about how to change and optimize this method
    // bc the method will be called on every url change (even on change of a query param)
    // possible solution is to check and compare 'path'
    beforeRouteUpdate(to, from, next) {
      beforeEnter(to, from, next);
    },

    render(createElement) {
      return createElement(component);
    }
  };
}
