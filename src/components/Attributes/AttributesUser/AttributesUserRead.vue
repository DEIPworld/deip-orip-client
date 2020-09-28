<template>
  <v-list
    v-if="usersList.length"
    class="mx-n3 py-0"
  >
    <v-list-item
      v-for="(user, index) in usersList" :key="`user-${index}`"
      class="px-3 rounded overflow-hidden"
      :to="userDetailsRoute(user.account.name)"
    >
      <v-list-item-avatar>
        <img :src="user.profile | avatarSrc(2 * 32, 2 * 32, false)" />
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
  import { attributeRead } from '@/components/Attributes/mixins';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { mapState } from 'vuex';
  import kindOf from 'kind-of';

  export default {
    name: 'AttributesUserRead',
    mixins: [componentStoreFactory(usersStore, 'attribute.value'), attributeRead],
    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      })
    },
    created() {
      console.log(333, this.storeNS)
      const users = kindOf(this.attribute.value) === 'string'
        ? [this.attribute.value]
        : this.attribute.value;
      this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, users)
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
