<template>
  <component
    :is="$$componentViewType"
    :users="usersListComputed"
    v-bind="attrs$"
  >
    <slot v-bind="{ users: usersListComputed }" />

    <template #item-info="{ user }">
      <slot name="item-info" v-bind="{ user, hasLocation, hasEmplOrEduc }" />
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
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';

  export default {
    name: 'UsersList',

    components: {
      UsersListDefault,
      UsersListBrief,
      UsersListStack
    },

    mixins: [
      componentStoreFactory(usersListStore),
      componentViewType,
      BindsAttrs,
      dataContextSwitch
    ],

    props: {
      users: {
        type: [Array, String],
        default: () => ([])
      },

      usersData: {
        type: [Array, Object],
        default: () => ([])
      },

      portalId: {
        type: String,
        default: null
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

    watch: {
      users: {
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.getUsers();
          }
        }
      }
    },

    created() {
      this.getUsers();
    },

    methods: {
      hasLocation(userProfile) {
        return (
          userProfile.location
          && (userProfile.location.country || userProfile.location.city)
        );
      },

      hasEmplOrEduc(userProfile) {
        return (userProfile.education && userProfile.education.length)
          || (userProfile.employment && userProfile.employment.length);
      },

      getUsers() {
        if (!wrapInArray(this.usersData).length) {
          this.$setReady(false);

          this.$store.dispatch(`${this.storeNS}/getUsersList`, {
            users: wrapInArray(this.users),
            teamId: this.teamId,
            portalId: this.portalId
          })
            .then(() => {
              this.$setReady();
            });
        } else {
          this.$setReady();
        }
      }
    }
  };
</script>
