<template />

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { attributeSet } from '@/components/Attributes/mixins/set';
  import { mapState } from 'vuex';

  export default {
    name: 'AttributesCommonUsersSet',
    mixins: [componentStoreFactory(usersStore), attributeSet],
    props: {
      users: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      })
    },
    created() {
      if (this.users.length) {
        this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, this.users)
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$store.dispatch(`${this.storeNS}/getActiveUsers`, this.users)
          .then(() => {
            this.$setReady();
          });
      }
    },
    methods: {
      userFullName(e) {
        return e.profile ? this.$options.filters.fullname(e) : 'undefined'
      },
      userId(e) {
        return e.profile ? e.profile._id : 'undefined';
      }
    }
  };
</script>
