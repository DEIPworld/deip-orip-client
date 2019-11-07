<template>
  <span class="platform-avatar">
    <v-layout row wrap align-center align-baseline>
      <div>
        <router-link :to="{ name: 'UserDetails', params: { account_name: user.account.name } }">
          <v-tooltip bottom>
            <v-avatar :size="size + 'px'" slot="activator">
              <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(size * 2, size * 2, false)"/>
              <v-gravatar v-else :email="user.account.name + '@deip.world'" />
            </v-avatar>
            <span>{{ user | fullname }}</span>
          </v-tooltip>
        </router-link>
      </div>
      <div>
        <router-link
          v-if="linkToProfile"
          :to="{ name: 'UserDetails', params: { account_name: user.account.name } }"
          class="a"
          :class="linkToProfileClass"
        >{{ user | fullname }}</router-link>
      </div>
      <slot></slot>
    </v-layout>
  </span>
</template>

<script>
import moment from "moment";

export default {
  name: "PlatformAvatar",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {
        return {
          account: {
            name: ""
          }
        };
      }
    },
    size: { type: Number, required: false, default: 30 },
    linkToProfile: { type: Boolean, required: false, default: false },
    linkToProfileClass: { type: String, required: false, default: "px-3" },
    textHtml: { type: String, required: false, default: null }
  },

  data() {
    return {};
  },

  watch: {}
};
</script>

<style lang="less" scoped>
@import "./../../../styles/colors.less";
</style>
