<template>
  <v-list
    class="mx-n3 py-0" v-if="usersList.length"
  >
    <v-list-item
      v-for="(user, index) in usersList" :key="`user-${index}`"
      class="px-3 rounded overflow-hidden"
      :to="userDetailsRoute(user.account.name)"
    >
      <v-list-item-avatar>
        <img :src="user.profile | avatarSrc(64, 64, false)" />
      </v-list-item-avatar>
      <v-list-item-content>
        <div class="text-h6">
          {{ user | fullname }}
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { mapState } from 'vuex';

  export default {
    name: 'UsersListWidget',
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
          : { name: 'UserDetails', params: { account_name: name } };
      }
    }
  };
</script>
