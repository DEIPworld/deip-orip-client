import { componentStoreFactory } from '@/mixins/registerStore';
import { usersStore } from '@/components/Users/store';
import { mapState } from 'vuex';

export const userListCommon = {
  mixins: [componentStoreFactory(usersStore)],
  props: {
    users: {
      type: Array,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
    })
  },
  created() {
    this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, this.users)
      .then(() => {
        this.$setReady();
      });
  },
  methods: {
    userDetailsRoute(name) {
      return this.$currentUserName === name
        ? { name: 'account.summary' }
        : {
          name: 'UserDetails',
          params: { account_name: name }
        };
    }
  }
};
