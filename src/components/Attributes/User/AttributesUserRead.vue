<template>
  <v-list
    v-if="usersList.length"
    class="mx-n3 py-0"
  >
    <v-list-item
      v-for="(user, index) in usersList" :key="`user-${index}`"
      class="px-3 py-2 rounded overflow-hidden reset-height"
      :to="userDetailsRoute(user.account.name)"
    >

      <v-list-item-avatar class="my-0 align-self-start">
        <img :src="user.profile | avatarSrc(2 * 40, 2 * 40, false)" />
      </v-list-item-avatar>

      <v-sheet :min-height="40" class="spacer align-self-start d-flex flex-column justify-center">
        <div class="text-h6">
          {{ user | fullname }}
        </div>

        <template v-if="!attributeInfo.isMultiple">
          <!-- TODO: switch to views -->
          <div class="text-caption font-weight-medium">
            {{ attributeInfo.title }}
          </div>

          <div class="text-caption">
            <a class="text--secondary link" :href="`mailto:${user.profile.email}`" @click.prevent>
              {{ user.profile.email }}
            </a>
          </div>
        </template>
      </v-sheet>
    </v-list-item>
  </v-list>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { mapState } from 'vuex';
  import kindOf from 'kind-of';

  export default {
    name: 'AttributesUserRead',
    mixins: [attributeRead, componentStoreFactory(usersStore, 'attribute.value')],
    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      })
    },
    created() {
      // TODO: check (must be array)
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
          : {
            name: 'UserDetails',
            params: { account_name: name }
          };
      }
    }
  };
</script>
