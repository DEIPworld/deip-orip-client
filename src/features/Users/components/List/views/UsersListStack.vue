<template>
  <div
    v-if="users.length"
    :class="$style.host"
  >

    <v-sheet
      v-for="(user, index) of users"
      :key="index"
      :class="$style.item"
    >
      <router-link
        :to="userDetailsRoute(user)"
      >
        <v-avatar size="40">
          <v-img :src="user | accountAvatarSrc(64, 64, false)" />
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
    box-shadow: 0 0 0 2px #fff !important;
    border-radius: 50%;
    margin-right: -8px;
    z-index: 1;
  }

</style>
