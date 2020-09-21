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
        // return this.$options.filters.fullname(e.profile)
        return e.profile.firstName;
      },
      userId(e) {
        return e.profile._id;
      }
    }
  };
</script>
