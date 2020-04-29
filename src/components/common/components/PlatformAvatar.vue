<template>
  <div>
    <div v-if="!noFollow" class="d-inline-block">
      <router-link :to="{ name: 'UserDetails', params: { account_name: user.account.name } }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-avatar :size="size + 'px'" v-on="on">
              <img
                v-if="user.profile"
                :src="user.profile | avatarSrc(size * 2, size * 2, false)"
              >
              <v-gravatar v-else :email="user.account.name + '@deip.world'" />
            </v-avatar>
          </template>
          <span>{{ user | fullname }}</span>
        </v-tooltip>
      </router-link>
    </div>
    <div v-else class="d-inline-block">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-avatar :size="size + 'px'" v-on="on">
            <img
              v-if="user.profile"
              :class="{'cursor-pointer':!pickDisabled}"
              :src="user.profile | avatarSrc(size * 2, size * 2, false)"
              @click="selectUser(user)"
            >
            <v-gravatar v-else :email="user.account.name + '@deip.world'" />
          </v-avatar>
        </template>
        <span>{{ user | fullname }}</span>
      </v-tooltip>
    </div>
    <div v-if="linkToProfile" class="d-inline-block">
      <router-link
        :to="{ name: 'UserDetails', params: { account_name: user.account.name } }"
        class="a"
        :class="linkToProfileClass"
      >
        {{ user | fullname }}
      </router-link>
    </div>
    <div v-if="noFollowName" class="d-inline-block">
      <span :class="linkToProfileClass">{{ user | fullname }}</span>
    </div>
    <slot />
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'PlatformAvatar',
    props: {
      user: {
        type: Object,
        required: true,
        default: () => ({ account: { name: '' } })
      },
      size: { type: Number, required: false, default: 30 },
      linkToProfile: { type: Boolean, required: false, default: false },
      linkToProfileClass: { type: String, required: false, default: 'px-4' },
      noFollowName: { type: Boolean, required: false, default: false },
      noFollow: { type: Boolean, required: false, default: false },
      pickDisabled: { type: Boolean, required: false, default: false }
    },

    data() {
      return {};
    },

    watch: {},
    methods: {
      selectUser(user) {
        if (!this.pickDisabled) {
          this.$emit('onSelectedUser', { ...user });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
@import "./../../../styles/colors.less";
</style>
