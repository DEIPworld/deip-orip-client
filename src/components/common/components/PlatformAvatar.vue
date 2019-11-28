<template>
  <span>
    <router-link v-if="!noFollow" :to="{ name: 'UserDetails', params: { account_name: user.account.name } }">
      <v-tooltip bottom>
        <v-avatar :size="size + 'px'" slot="activator">
          <img v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(size * 2, size * 2, false)"/>
          <v-gravatar v-else :email="user.account.name + '@deip.world'" />
        </v-avatar>
        <span>{{ user | fullname }}</span>
      </v-tooltip>
    </router-link>
    <span v-else>
      <v-tooltip bottom>
        <v-avatar :size="size + 'px'" slot="activator">
          <img @click="selectUser(user)" :class="{'cursor-pointer':!pickDisabled}" v-if="user.profile" v-bind:src="user.profile.avatar | avatarSrc(size * 2, size * 2, false)"/>
          <v-gravatar v-else :email="user.account.name + '@deip.world'" />
        </v-avatar>
        <span>{{ user | fullname }}</span>
      </v-tooltip>
    </span>
    <router-link
      v-if="linkToProfile"
      :to="{ name: 'UserDetails', params: { account_name: user.account.name } }"
      class="a"
      :class="linkToProfileClass"
    >{{ user | fullname }}
    </router-link>
    <slot></slot>
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
    textHtml: { type: String, required: false, default: null },
    noFollow: { type: Boolean, required: false, default: false },
    pickDisabled: { type: Boolean, required: false, default: false }
  },

  data() {
    return {};
  },
  methods: {
    selectUser(user){
      if (!this.pickDisabled){
        this.$emit('onSelectedUser', {...user});
      }
    }
  },

  watch: {}
};
</script>

<style lang="less" scoped>
@import "./../../../styles/colors.less";
</style>
