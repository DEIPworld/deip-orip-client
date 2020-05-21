<template>
  <modal-route-view :hide-toolbar="adminLogin ? true : false" max-width="100%" go-back-to="/research-feed" title="Explorer">
    <v-row no-gutters class="full-height">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-sheet class="align-self-center">
          <login-form logo="AR3C" title="Login to your account" />
          <div v-if="!adminLogin" class="mt-4 subtitle-2">
            New on DEIP? <router-link class="a" :to="{name: 'SignUp'}">Sign Up now</router-link>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="d-none d-md-flex mt-n12 mr-n12 ml-12 mb-n12" style="background: linear-gradient(138.37deg, rgba(40, 56, 139, 0.5) 0%, rgba(10, 29, 43, 0.5) 100%), url(/assets/img/signin.png) center center / cover no-repeat;">
        <div class="white--text d-flex flex-column justify-center pa-12">
          <!-- <div class="description__logo">
            <img src="/assets/img/landing-logo.svg">
          </div> -->
          <div class="display-3 font-weight-bold">
            Open Research and Innovation Platform
          </div>
          <div class="subtitle-1 mt-12">
            <v-icon small color="white">
              mdi-message-reply-text
            </v-icon>
            <span class="ml-2">Collaboration</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small color="white">
              mdi-lightbulb-on
            </v-icon>
            <span class="ml-2">Project tokenization</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small color="white">
              mdi-shield-check
            </v-icon>
            <span class="ml-2">Licensing of intellectual property</span>
          </div>
          <div class="subtitle-1 mt-2">
            <v-icon small color="white">
              mdi-account-multiple-plus
            </v-icon>
            <span class="ml-2">Crowd investing</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import LoginForm from '@/components/auth/components/LoginForm';

  export default {
    name: 'SignIn',
    components: { LoginForm, ModalRouteView },
    props: {
      adminLogin: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
