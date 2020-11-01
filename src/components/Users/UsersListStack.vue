<template>
  <d-stack horizontal gap="0">

    <v-avatar
      v-for="user of usersList"
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
          <img :src="user.profile | avatarSrc(64, 64, false)" />
        </v-avatar>
      </router-link>
    </v-avatar>
  </d-stack>
</template>

<script>
  import { userListCommon } from '@/components/Users/mixins';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'UsersListStack',
    components: { DStack },
    mixins: [userListCommon]
  };
</script>
