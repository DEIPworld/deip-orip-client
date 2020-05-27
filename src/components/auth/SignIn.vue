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
            :show-sign-up="!adminLogin"
            logo="AR3C"
            :title="adminLogin ? 'Sign in to your admin account' : 'Sign in to your account'"
          />
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet
          tile
          min-height="100%"
          color="primary"
          dark
          class="d-flex flex-column justify-center pa-12"
          style="background: linear-gradient(138.37deg, rgba(40, 56, 139, 0.5) 0%, rgba(10, 29, 43, 0.5) 100%), url(/assets/img/signin.png) center center / cover no-repeat;"
        >
          <div class="display-3 font-weight-bold">
            Open Research and Innovation Platform
          </div>
          <div class="subtitle-1 mt-12">
            <v-icon small>
              mdi-message-reply-text
            </v-icon>
            <span class="ml-4">Collaboration</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small>
              mdi-lightbulb-on
            </v-icon>
            <span class="ml-4">Project tokenization</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small>
              mdi-shield-check
            </v-icon>
            <span class="ml-4">Licensing of intellectual property</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small>
              mdi-account-multiple-plus
            </v-icon>
            <span class="ml-4">Crowd investing</span>
          </div>
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
