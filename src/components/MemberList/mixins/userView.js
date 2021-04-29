export const usersView = {
  props: {
    users: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iteratorProps() {
      return {
        itemsPerPage: 12,
        hideDefaultFooter: this.users.length < 12,
        footerProps: {
          'items-per-page-options': [12, 24, 48, -1]
        }
      };
    }
  },
  methods: {
    onUpdatePage() {
      this.$emit('update:page');
    }
  }
};
