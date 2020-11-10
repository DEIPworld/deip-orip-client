<template>
  <div
    v-if="users.length"
    :class="$style.host"
  >
    <v-sheet
      v-for="(user, index) of users"
      :key="user.profile.name"
      :class="$style.item"
      :style="{zIndex: users.length - index}"
    >
      <router-link
        :to="userDetailsRoute(user.account.name)"
      >
        <v-avatar size="40">
          <v-img :src="user.profile | avatarSrc(64, 64, false)" />
        </v-avatar>
      </router-link>
    </v-sheet>
  </div>
</template>

<script>
  import { usersList } from '@/features/Users/mixins';

  export default {
    name: 'UsersListStack',
    mixins: [usersList]
  };
</script>

<style lang="scss" module>
  .host {
    display: flex;
  }

  .item {
    border-radius: 50%;
    padding: 2px;
    margin-right: -8px;
  }

</style>
