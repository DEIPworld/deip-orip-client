<template>
  <v-container fluid fill-height class="pa-0 ma-0">
    <v-layout row wrap>
      <v-flex md6 lg6 xl6 hidden-sm-and-down>
        <v-layout column wrap fill-height class="description">
          <div class="description__logo">
            <img src="/static/logo-iconed.svg" />
          </div>
          <div class="description__info-text">
            Open Research and Innovation Platform
          </div>
          <!-- <div class="description__signup-text">
            Don't have an account?
            <router-link
              :to="{ name: 'SignUp' }"
            >Sign Up</router-link>
          </div> -->
          <v-layout class="description__info-list-item mt-5" align-center shrink>
            <v-icon small color="white">mdi-message-reply-text</v-icon>
            <span class="ml-2">Collaboration</span>
          </v-layout>
          <v-layout class="description__info-list-item mt-4" align-center shrink>
            <v-icon small color="white" class="icon-upended">mdi-lightbulb-on</v-icon>
            <span class="ml-2">Project tokenization</span>
          </v-layout>
          <v-layout class="description__info-list-item mt-4" align-center shrink>
            <v-icon small color="white">mdi-shield-check</v-icon>
            <span class="ml-2">Licensing of intellectual property</span>
          </v-layout>
          <v-layout class="description__info-list-item mt-4" align-center shrink>
            <v-icon small color="white">mdi-account-multiple-plus</v-icon>
            <span class="ml-2">Crowd investing</span>
          </v-layout>
          <v-divider class="description__divider white my-5"/>
          <v-layout column class="description__disclaimer">
            <p>This is a demonstration version.</p>
            <p class="mt-2">You’re welcome to order a <b>white-label solution of DEIP Open Research&Innovation Platform</b></p>
          </v-layout>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md6 lg6 xl6>
        <v-layout column wrap fill-height class="login">
          <div class="login__title">Welcome back!</div>
          <v-form
            v-model="isFormValid"
            ref="form"
            @submit.prevent
            class="login__form full-width"
          >
            <v-text-field
              name="username"
              label="Username"
              v-model="username"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              name="privateKey"
              label="Private key"
              v-model="privKey"
              :rules="[rules.required]"
              :append-icon="isHiddenPassword ? 'visibility_off' : 'visibility'"
              :type="isHiddenPassword ? 'password' : 'text'"
              @click:append="isHiddenPassword = !isHiddenPassword"
            ></v-text-field>
            <v-btn
              type="submit"
              block
              color="#485fda"
              dark
              :loading="isChecking"
              :disabled="isChecking"
              @click="login()"
            >Log In</v-btn>
          </v-form>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client'
    import crypto from '@deip/lib-crypto'
    import authService from './../../services/http/auth'
    import {decodedToken, clearAccessToken, setAccessToken} from './../../utils/auth'

    export default {
        name: 'SignIn',

        data() {
          return {
            isFormValid: false,
            username: '',
            privKey: '',
            isHiddenPassword: true,
            isChecking: false,
            rules: {
              required: (value) => !!value || 'This field is required'
            }
          }
        },

        methods: {
            login() {
                const self = this;

                if (this.$refs.form.validate()) {
                    this.isChecking = true;
                    const privKey = this.privKey;
                    var secretKey;
                    try {
                        secretKey = crypto.PrivateKey.from(privKey);
                    } catch(err) {
                        clearAccessToken();
                        this.isChecking = false;
                        self.$store.dispatch('layout/setError', { message: "Invalid private key format"});
                        return;
                    }

                    // sig-seed should be uint8 array with length = 32
                    const secretSig = secretKey.sign(encodeUint8Arr(window.env.SIG_SEED).buffer);
                    const secretSigHex = crypto.hexify(secretSig);
                    authService.signIn({
                      username: this.username,
                      secretSigHex: secretSigHex
                    })
                        .then((response) => {

                            if (response.success) {
                                const decoded = decodedToken(response.jwtToken);
                                const pubKey = decoded.pubKey;
                                
                                // this validation is not necessary as we validate private key at the server using signature
                                var isValid;
                                try {
                                    isValid = deipRpc.auth.wifIsValid(this.privKey, pubKey);
                                } catch (err) {
                                    isValid = false;
                                }
                                
                                if (isValid) {
                                    // The jwt is being used by Vue router and File uploader api
                                    // to verify that user has logged successfully and entered his private key.
                                    // TODO: We should make decision on how to store private keys at UI. 
                                    // For now we can use local storage but it's not secure enough due to XSS attacks
                                    // and compromised thirdparty sources.
                                    setAccessToken(response.jwtToken, this.privKey)
                                    this.isChecking = false;
                                    this.isServerValidated = true;
                                    this.$router.go('/');
                                } else {
                                    clearAccessToken();
                                    this.isChecking = false;
                                    self.$store.dispatch('layout/setError', { message: `Invalid private key for "${self.username}"`});
                                }

                            } else {
                                clearAccessToken();
                                this.isChecking = false;
                                self.$store.dispatch('layout/setError', { message: response.error});
                            }

                        }, (err) => {
                            clearAccessToken();
                            this.isChecking = false;
                            self.$store.dispatch('layout/setError', { message: err.message});
                        });
                }

                function encodeUint8Arr(myString) {
                    return new TextEncoder("utf-8").encode(myString);
                }
            }
        },
        
        created() {
             this.username = this.$route.query.username || '';
        }
    }
</script>

<style lang="less" scoped>
@import "./../../styles/colors.less";

.description {
  background-color: #485fda;
  padding-top: 10%;
  padding-left: 20%;
  padding-right: 15%;

  &__logo {
    margin-top: 5%;
    margin-bottom: 10%;
    img {
      max-width: 100%;
    }
  }

  &__info-text {
    padding-top: 5%;
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 48px;
    line-height: 61px;
    letter-spacing: 0.25px;
    color: @white;
  }

  &__signup-text {
    margin-top: 5%;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    color: @white;
    a {
      color: inherit;
    }
  }

  &__info-list-item {
    font-family: Muli;
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;

    color: #FFFFFF;

    .icon-upended {
      transform: rotate(180deg);
    }
  }

  &__divider {
    opacity: 0.2;
  }

  &__disclaimer {
    font-family: Muli;
    font-size: 16px;
    line-height: 20px;
    color: white;
    opacity: 0.6;
  }
}

.login {
  padding: 10% 15%;

  &__title {
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 30px;
    letter-spacing: 0.25px;
  }

  &__form {
    padding-top: 10%;
  }
}
</style>
