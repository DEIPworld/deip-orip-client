<template>
  <div
    v-if="users.length"
    :class="$style.host"
  >

    <v-sheet
      v-for="(user, index) of users.slice(0, 5)"
      :key="index"
      :class="$style.item"
    >
      <router-link
        :to="userDetailsRoute(user)"
      >
        <v-avatar size="40">
          <v-img :src="user | accountAvatarSrc(40, 40, false)" />
        </v-avatar>
      </router-link>
    </v-sheet>

    <v-sheet
      v-if="users.length > 5"
      :class="$style.item"
    >
      <v-avatar size="40" color="grey lighten-3">
        <div class="text-h6 text--secondary">
          +{{ users.length - 5 }}
        </div>
      </v-avatar>
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
