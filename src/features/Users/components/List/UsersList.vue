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
  import { usersListStore } from '@/features/Users/store';
  import { mapState } from 'vuex';
  import { wrapInArray } from 'vuetify/lib/util/helpers';
  import { componentViewType } from '@/mixins/componentViewType';

  import UsersListDefault from '@/features/Users/components/List/views/UsersListDefault';
  import UsersListBrief from '@/features/Users/components/List/views/UsersListBrief';
  import UsersListStack from '@/features/Users/components/List/views/UsersListStack';

  export default {
    name: 'UsersList',

    components: {
      UsersListDefault,
      UsersListBrief,
      UsersListStack
    },

    mixins: [componentStoreFactory(usersListStore), componentViewType],

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
