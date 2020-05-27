<template>
  <full-screen-view
    :hide-toolbar="adminLogin"
    max-width="100%"
    height="100%"
    toolbar-overlap
    no-gutters
    toolbar-color="transparent"
  >

    <template #toolbarButton>
      <v-btn :to="{ name: 'ResearchFeed' }" color="primary" text>
        <v-icon left>arrow_back</v-icon>
        Explorer
      </v-btn>
    </template>

    <v-row no-gutters class="full-height">

      <v-col class="d-flex align-center justify-center">
        <v-sheet max-width="800" class="pa-12 mx-auto">
          <login-form
            centered
            :show-sign-up="!adminLogin"
            :logo="['/assets/img/ar3c-logo.png', '/assets/img/wechain-logo.png']"
            :title="adminLogin ? 'Sign in to your admin account' : 'Sign in to your account'"
          />
        </v-sheet>
      </v-col>

    </v-row>

  </full-screen-view>
</template>

<script>
  import LoginForm from '@/components/auth/components/LoginForm';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  export default {
    name: 'SignIn',
    components: {
      FullScreenView,
      LoginForm
    },
    props: {
      adminLogin: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        toolbarButton: {
          title: 'Explorer',
          onClick: () => { this.$router.push({ name: 'ResearchFeed' }); },
          props: {
            icon: false,
            text: true,
            color: 'primary',
            class: 'ml-n3'
          }
        }
      };
    }
  };
</script>
