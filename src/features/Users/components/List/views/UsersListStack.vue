<template>
  <div
    v-if="users.length"
    class="d-flex"
  >
    <v-avatar
      v-for="user of users"
      :key="user.profile.name"
      color="white"
      size="52"
      style="border: 2px solid #fff"
      class="mr-n2"
    >
      <router-link
        :to="userDetailsRoute(user.account.name)"
        class="d-block"
      >
        <v-avatar>
          <v-img :src="user.profile | avatarSrc(64, 64, false)" />
        </v-avatar>
      </router-link>
    </v-avatar>
  </div>
</template>

<script>
  import { usersList } from '@/features/Users/mixins';

  export default {
    name: 'UsersListStack',
    mixins: [usersList]
  };
</script>
