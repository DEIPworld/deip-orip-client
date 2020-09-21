<template />

<script>
  import { mapState } from 'vuex';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { commonSet } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCommonUsersSet',
    mixins: [componentStoreFactory(usersStore), commonSet],
    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      })
    },
    created() {
      if (!this.internalValue) {
        this.internalValue = [];
      }

      this.$store.dispatch(`${this.storeNS}/getActiveUsers`, this.users)
        .then(() => {
          this.$setReady();
        });
    },
    methods: {
      userFullName(e) {
        return e.profile ? this.$options.filters.fullname(e) : 'undefined'
      },
      userId(e) {
        return e.profile ? e.profile._id  : 'undefined';
      }
    }
  };
</script>
