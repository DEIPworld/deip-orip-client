<template>
  <v-container fluid class="pa-0 ma-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col cols="6" class="hidden-sm-and-down pb-6">
        <div class="description fill-height">
          <div class="description__logo">
            <img src="/assets/img/landing-logo.png">
          </div>
          <div class="description__info-text">
            Open Research and Innovation Platform
          </div>
          <div class="description__signup-text">
            Don't have an account?
            <router-link
              :to="{ name: 'SignUp' }"
            >
              Sign Up
            </router-link>
          </div>
          <div class="description__info-list-item mt-12" align-center shrink>
            <v-icon small color="white">
              mdi-message-reply-text
            </v-icon>
            <span class="ml-2">Collaboration</span>
          </div>
          <div class="description__info-list-item mt-6" align-center shrink>
            <v-icon small color="white" class="icon-upended">
              mdi-lightbulb-on
            </v-icon>
            <span class="ml-2">Project tokenization</span>
          </div>
          <div class="description__info-list-item mt-6" align-center shrink>
            <v-icon small color="white">
              mdi-shield-check
            </v-icon>
            <span class="ml-2">Licensing of intellectual property</span>
          </div>
          <div class="description__info-list-item mt-6" align-center shrink>
            <v-icon small color="white">
              mdi-account-multiple-plus
            </v-icon>
            <span class="ml-2">Crowd investing</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">

        <v-card class="full-height elevation-0" color="secondary">
          <div class="login fill-height">
            <div class="login__title">
              Welcome back!
            </div>
            <v-form
              ref="form"
              v-model="isFormValid"
              class="login__form full-width"
              @submit.prevent
            >
              <v-text-field
                v-model="username"
                name="username"
                label="Username"
                :disabled="isChecking"
                :rules="[rules.required]"
              />
              <v-text-field
                v-model="password"
                name="password"
                label="Password / Private Key"
                :rules="[rules.required]"
                :append-icon="isHiddenPassword ? 'visibility_off' : 'visibility'"
                :type="isHiddenPassword ? 'password' : 'text'"
                :disabled="isChecking"
                @click:append="isHiddenPassword = !isHiddenPassword"
              />
              <v-btn
                type="submit"
                block
                color="primary"
                :loading="isChecking"
                :disabled="isChecking"
                @click="login()"
              >
                Log In
              </v-btn>
            </v-form>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import crypto from '@deip/lib-crypto';

  import { AccessService } from '@deip/access-service';
  import { AuthService } from '@deip/auth-service';

  const accessService = AccessService.getInstance();
  const authService = AuthService.getInstance();

  const encodeUint8Arr = (inputString) => new TextEncoder('utf-8').encode(inputString);

  const getPrivateKeyRole = (privateKey, account) => {
    const publicKey = deipRpc.auth.wifToPublic(privateKey);

    for (const role of ['owner', 'active']) {
      if (account[role].key_auths[0].includes(publicKey)) {
        return role;
      }
    }

    return null;
  };

  export default {
    name: 'SignIn',

    data() {
      return {
        isFormValid: false,
        username: '',
        password: '',
        isHiddenPassword: true,
        isChecking: false,
        rules: {
          required: (value) => !!value || 'This field is required'
        }
      };
    },

    created() {
      this.username = this.$route.query.username || '';
    },

    methods: {
      login() {
        if (!this.$refs.form.validate()) return;

        this.isChecking = true;

        let privateKey;
        return deipRpc.api.getAccountsAsync([this.username])
          .then(([account]) => {
            if (!account) {
              throw new Error('Invalid account name');
            }

            if (
              deipRpc.auth.isWif(this.password)
              && getPrivateKeyRole(this.password, account)
            ) {
              privateKey = this.password;
            } else {
              privateKey = deipRpc.auth.toWif(
                this.username,
                this.password,
                'owner'
              );
            }

            let secretKey;
            try {
              secretKey = crypto.PrivateKey.from(privateKey);
            } catch (err) {
              accessService.clearAccessToken();
              this.isChecking = false;
              this.$store.dispatch('layout/setError', { message: 'Invalid private key format' });
              return;
            }

            // sig-seed should be uint8 array with length = 32
            const secretSig = secretKey.sign(encodeUint8Arr(window.env.SIG_SEED).buffer);

            return authService.signIn({
              username: this.username,
              secretSigHex: crypto.hexify(secretSig)
            });
          }).then((response) => {
            if (!response.success) {
              accessService.clearAccessToken();
              this.isChecking = false;
              this.$store.dispatch('layout/setError', { message: response.error });
              return;
            }

            // The jwt is being used by Vue router and File uploader api
            // to verify that user has logged successfully and entered his private key.
            // TODO: We should make decision on how to store private keys at UI.
            // For now we can use local storage but it's not secure enough due to XSS attacks
            // and compromised thirdparty sources.
            accessService.setAccessToken(response.jwtToken, privateKey);
            this.isChecking = false;
            this.isServerValidated = true;
            this.$router.go('/');
          }).catch((err) => {
            accessService.clearAccessToken();
            this.isChecking = false;
            this.$store.dispatch('layout/setError', { message: err.message });
          });
      }
    }
  };
</script>

<style lang="less" scoped>
@import "./../../styles/colors.less";

.description {
  background-color: #ffffff;
  padding-top: 10%;
  padding-left: 20%;
  padding-right: 15%;

  &__logo {
    // margin-top: 5%;
    // margin-bottom: 10%;
    width: 80%;
    max-height: 200px;
    img {
      max-width: 100%;
    }
  }

  &__info-text {
    // padding-top: 5%;
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 48px;
    line-height: 61px;
    letter-spacing: 0.25px;
    color: var(--v-primary-base);
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


.signup-text {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  a {
    color: inherit;
  }
}
</style>
