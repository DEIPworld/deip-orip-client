<template>
  <component
    :is="$$componentViewType"
    :users="usersListComputed"
    v-bind="attrs$"
  >
    <slot v-bind="{ users: usersListComputed }" />

    <template #item-info="{ user }">
      <slot name="item-info" v-bind="{ user, hasLocation }" />
    </template>
    <template #item-avatar="{ user, avatar }">
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
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  export default {
    name: 'UsersList',

    components: {
      UsersListDefault,
      UsersListBrief,
      UsersListStack
    },

    mixins: [componentStoreFactory(usersListStore), componentViewType, BindsAttrs],

    props: {
      users: {
        type: [Array, String],
        default: () => ([])
      },

      usersData: {
        type: [Array, Object],
        default: () => ([])
      }
    },

    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/usersList`]; }
      }),

      usersListComputed() {
        if (this.usersList.length) {
          return this.usersList;
        }

        return wrapInArray(this.usersData);
      }
    },

    created() {
      const users = wrapInArray(this.users);

      if (users.length) {
        this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, users)
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$store.dispatch(`${this.storeNS}/getActiveUsers`)
          .then(() => {
            this.$setReady();
          });
      }
    },

    methods: {
      hasLocation(userProfile) {
        return (
          userProfile.location
          && (userProfile.location.country || userProfile.location.city)
        );
      }
    }
  };
</script>
