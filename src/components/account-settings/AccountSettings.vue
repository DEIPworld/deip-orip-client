<template>
  <base-page-layout>
    <content-block title="Account Settings">
      <div class="body-1">
        {{ `${currentUser.profile.firstName} ${currentUser.profile.lastName}` }}
        <span class="indigo--text ml-6">{{ currentUser.profile.email }}</span>
      </div>

      <v-row>
        <v-col
          v-for="section of sections"
          :key="section.routeName"
          md="6"
          lg="4"
        >
          <v-card
            outlined
            @click="onSectionClick(section.routeName)"
          >
            <v-card-text>{{ section.label }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </content-block>
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ContentBlock from '@/components/layout/components/ContentBlock';

  export default {
    name: 'AccountSettings',
    components: { ContentBlock },
    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      }),

      sections() {
        return [{
          label: 'Personal Information',
          routeName: 'ProfileSettings',
          isShown: true
        }, {
          label: 'Change Password',
          routeName: 'ChangePassword',
          isShown: true
        }, {
          label: 'Private Key',
          routeName: 'PrivateKeyDownload',
          isShown: true
        }].filter((s) => s.isShown);
      }
    },

    methods: {
      onSectionClick(routeName) {
        this.$router.push({ name: routeName });
      }
    }
  };
</script>

<style lang="less">
  @import "./../../styles/colors.less";

  .account-settings {
    font-family: Muli;
    font-style: normal;
    color: @black;

    p {
      margin-bottom: 0
    }

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
