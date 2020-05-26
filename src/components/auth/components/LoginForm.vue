<template>
  <v-sheet :class="{'text-center': centered}">
    <div v-if="logo" class="display-2 mb-6">
      {{ logo }}
    </div>
    <div v-if="title" class="title mb-6">
      {{ title }}
    </div>

    <form-generator :model="formModel" :schema="schema" max-width="360" @submit="login">
      <template #actions>
        <v-btn
          type="submit"
          block
          large
          color="primary"
          :loading="disable"
          :disabled="disable"
        >
          Log In
        </v-btn>
      </template>
    </form-generator>
    <div v-if="showSignUp" class="mt-4 subtitle-2">
      New on DEIP?
      <router-link class="a" :to="{name: 'SignUp'}">Sign Up now</router-link>
    </div>

  </v-sheet>
</template>

<script>
  import FormGenerator from '@/components/ForrmGenerator/FormGenerator';
  import deipRpc from '@deip/rpc-client';
  import crypto from '@deip/lib-crypto';

  import { AccessService } from '@deip/access-service';
  import { AuthService } from '@deip/auth-service';
  import { setUser } from '@/bootstrap';

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
    name: 'LoginForm',
    components: {
      FormGenerator
    },
    props: {
      logo: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: 'Sign in to your account'
      },
      centered: {
        type: Boolean,
        default: false
      },
      redirect: {
        type: String,
        default: '/'
      },
      showSignUp: {
        type: Boolean,
        default: true
      }
    },
    data() {
      const validation = {
        required: (value) => !!value || 'This field is required'
      };

      return {
        formModel: {},

        schema: [{
          fields: [
            {
              type: 'text',
              label: 'Username',
              name: 'username',
              props: {
                rules: [validation.required],
                disable: this.disable,
                prependInnerIcon: 'person'
              }
            },
            {
              type: 'password',
              label: 'Password / Private Key',
              name: 'password',
              props: {
                rules: [validation.required],
                disable: this.disable,
                prependInnerIcon: 'lock'
              }
            }
          ]
        }],

        disable: false,
        isFormValid: false
      };
    },
    created() {
      this.formModel.username = this.$route.query.username || '';
    },
    methods: {
      login(formValid) {
        if (!formValid) return;

        this.disable = true;

        let privateKey;
        return deipRpc.api.getAccountsAsync([this.formModel.username])
          .then(([account]) => {
            if (!account) {
              throw new Error('Invalid account name');
            }

            if (
              deipRpc.auth.isWif(this.formModel.password)
              && getPrivateKeyRole(this.formModel.password, account)
            ) {
              privateKey = this.formModel.password;
            } else {
              privateKey = deipRpc.auth.toWif(
                this.formModel.username,
                this.formModel.password,
                'owner'
              );
            }

            let secretKey;
            try {
              secretKey = crypto.PrivateKey.from(privateKey);
            } catch (err) {
              accessService.clearAccessToken();
              this.disable = false;
              this.$store.dispatch('layout/setError', { message: 'Invalid private key format' });
              return;
            }

            // sig-seed should be uint8 array with length = 32
            const secretSig = secretKey.sign(encodeUint8Arr(window.env.SIG_SEED).buffer);
            return authService[`${this.isAdmin ? 'adminSignIn' : 'signIn'}`]({
              username: this.formModel.username,
              secretSigHex: crypto.hexify(secretSig)
            });
          }).then(async (response) => {
            if (!response.success) {
              accessService.clearAccessToken();
              this.disable = false;
              this.$store.dispatch('layout/setError', { message: response.error });
              return;
            }

            // The jwt is being used by Vue router and File uploader api
            // to verify that user has logged successfully and entered his private key.
            // TODO: We should make decision on how to store private keys at UI.
            // For now we can use local storage but it's not secure enough due to XSS attacks
            // and compromised thirdparty sources.
            accessService.setAccessToken(response.jwtToken, privateKey);

            this.disable = false;
            this.$router.go(0);
          }).catch((err) => {
            accessService.clearAccessToken();
            this.disable = false;
            this.$store.dispatch('layout/setError', { message: err.message });
          });
      }
    }
  };
</script>
