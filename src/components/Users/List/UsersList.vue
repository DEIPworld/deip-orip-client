<template>
  <component
    :is="$$componentViewType"
    :users="usersList"
  >
    <template #item-info="{ user }" >
      <slot name="item-info" v-bind="{ user }" />
    </template>
    <template #item-avatar="{ user, avatar }" >
      <slot name="item-avatar" v-bind="{ user, avatar }" />
    </template>
  </component>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { mapState } from 'vuex';
  import { wrapInArray } from 'vuetify/lib/util/helpers';
  import { componentViewType } from '@/mixins/componentViewType';
  import UsersListDefault from '@/components/Users/List/_views/UsersListDefault';

  export default {
    name: 'UsersList',

    components: {
      UsersListDefault
    },

    mixins: [componentStoreFactory(usersStore), componentViewType],

    props: {
      users: {
        type: [Array, String],
        default: () => ([])
      }
    },

    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      })
    },

    created() {
      this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, wrapInArray(this.users))
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
