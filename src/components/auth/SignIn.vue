<template>
  <v-container fluid fill-height class="pa-0 ma-0">
    <v-layout row wrap>
      <v-flex md6 lg6 xl6 hidden-sm-and-down>
        <v-layout column wrap fill-height class="description">
          <div class="description__logo">
            <img style="width: 100%; height: 100%" src="/assets/img/landing-logo.png" />
          </div>
          <div class="description__info-text">
            Open Research and Innovation Platform
          </div>
        </v-layout>
      </v-flex>
      <v-flex md6 lg6 xl6 xs12 sm12>
        <v-card class="full-height elevation-0" color="secondary">
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
                :disabled="isChecking"
                :rules="[rules.required]"
              />
              <v-text-field
                name="password"
                label="Password / Private Key"
                v-model="password"
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
              >Log In</v-btn>
            </v-form>
            <div class="signup-text text-xs-center mt-2">
              New on AR3C?
              <router-link
                :to="{ name: 'SignUp' }"
                class="primary--text"
              >Sign Up</router-link> now
            </div>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import crypto from '@deip/lib-crypto'

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
      }
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
            } catch(err) {
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
            })
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
            accessService.setAccessToken(response.jwtToken, privateKey)
            this.isChecking = false;
            this.isServerValidated = true;
            this.$router.go('/');
          }).catch((err) => {
            accessService.clearAccessToken();
            this.isChecking = false;
            this.$store.dispatch('layout/setError', { message: err.message });
          });
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
