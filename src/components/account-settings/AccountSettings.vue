<template>
  <v-container fluid fill-height pa-0 ma-0>
    <v-card tile flat class="full-height full-width">
      <v-layout row wrap class="account-settings py-4">
        <v-flex xs12 sm12 md12 lg12 xl12>
          <div class="glass-container py-4">
            <p class="account-settings__header py-2">Account Settings</p>
            <p class="account-settings__subheader py-2">
              {{ `${currentUser.profile.firstName} ${currentUser.profile.lastName}` }}
              <span class="indigo--text ml-4">{{ currentUser.profile.email }}</span>
            </p>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <div class="glass-container">
            <v-container grid-list-lg pa-0 ma-0>
              <v-layout row wrap>
                <v-flex xs12 md6 lg4
                  v-for="section of sections"
                  :key="section.routeName"
                >
                  <v-card
                    class="account-settings__section py-3"
                    flat
                    @click="onSectionClick(section.routeName)"
                  >
                    <v-card-text>{{ section.label }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AccountSettings",

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),

    sections() {
      return [{
        label: 'Personal Information',
        routeName: 'ProfileSettings',
        isShown: true,
      }, {
        label: 'Change Password',
        routeName: 'ChangePassword',
        isShown: true,
      }, {
        label: 'Private Key',
        routeName: 'PrivateKeyDownload',
        isShown: true,
      }].filter(s => s.isShown);
    }
  },

  methods: {
    onSectionClick(routeName) {
      this.$router.push({ name: routeName })
    }
  },
};
</script>

<style lang="less">
  @import "./../../styles/colors.less";

  .account-settings {
    font-family: Muli;
    font-style: normal;
    color: @black;
    
    p { margin-bottom: 0 }

    &__header {
      font-weight: 900;
      font-size: 36px;
      line-height: 45px;
      letter-spacing: 0.25px;
    }

    &__subheader {
      font-weight: 500;
      font-size: 16px;
      line-height: 40px;
    }

    &__section {
      height: 115px;
      box-sizing: border-box;
      border: 1px solid @grey-lighten-1 !important;
      color: @grey !important;
      font-weight: 900;
      font-size: 24px;
      line-height: 30px;
      letter-spacing: 0.25px;

      &:hover {
        border: 1px solid var(--v-primary-base) !important;
        color: @black !important;
        cursor: pointer;
      }
    }
  }
</style>
