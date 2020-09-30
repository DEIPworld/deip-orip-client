<template>
  <v-list
    v-if="usersList.length"
    class="mx-n3 py-0"
  >
    <v-list-item
      v-for="(user, index) in usersList"
      :key="`user-${index}`"
      class="px-3 py-2 rounded overflow-hidden reset-height"
      :to="userDetailsRoute(user.account.name)"
    >
      <v-list-item-avatar class="my-0 align-self-start">
        <img :src="user.profile | avatarSrc(2 * 40, 2 * 40, false)">
      </v-list-item-avatar>

      <v-sheet :min-height="40" class="spacer align-self-start d-flex flex-column justify-center">
        <div class="text-h6">
          {{ user | fullname }}
        </div>
      </v-sheet>
    </v-list-item>
  </v-list>
</template>

<script>
  import { attributeReadUsers } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesUsersListRead',
    mixins: [attributeReadUsers]
  };
</script>
