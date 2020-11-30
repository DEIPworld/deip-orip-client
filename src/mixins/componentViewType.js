import { pascalCase } from 'change-case';

export const componentViewType = {
  props: {
    viewType: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    $$componentViewType() {
      if (this.viewType === 'dataProvider') {
        return 'div';
      }

      const requestedView = `${this.$options.name}${pascalCase(this.viewType)}`;
      const requestedViewExist = Object.keys(this.$options.components)
        .includes(requestedView);

      if (requestedViewExist) {
        return requestedView;
      }

      throw new Error(`Can't find ${this.viewType} view component`);
    }
  }
};
