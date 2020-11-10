<template>
  <v-list
    v-if="users.length"
    class="mx-n3 py-0"
  >
    <v-list-item
      v-for="(user, index) in users"
      :key="`user-${index}`"
      class="px-3 py-2 rounded overflow-hidden reset-height"
      :to="userDetailsRoute(user.account.name)"
    >


      <v-list-item-action class="my-0 mr-4 align-self-start">
        <slot
          name="item-avatar"
          v-bind="{ user, avatar: $options.filters.avatarSrc(user.profile, 40) }"
        >
          <v-avatar :size="40">
            <v-img :src="user.profile | avatarSrc(40)" />
          </v-avatar>
        </slot>
      </v-list-item-action>


      <v-sheet :min-height="40" class="spacer align-self-start d-flex flex-column justify-center">
        <div class="text-h6">
          {{ user | fullname }}
        </div>

        <slot name="item-info" v-bind="{ user }" />

      </v-sheet>
    </v-list-item>
  </v-list>
</template>

<script>
  import { usersList } from '@/features/Users/mixins';

  export default {
    name: 'UsersListDefault',
    mixins: [usersList]
  };
</script>
