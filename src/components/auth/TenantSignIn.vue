<template>
  <v-container fluid class="pa-0 c-mt-10">
    <v-row class="fill-height align-space-around justify-center text-center">
      <v-col cols="5">
        <div class="text-center">
          <div v-if="tenant">
            <span class="text-h5">{{ tenant.profile.name }}</span>
            <!-- <img width="100px" height="100px" :src="tenant | tenantLogoSrc(160, 160, false)"> -->
          </div>
          <!-- <div class="text-h6 c-pb-4 bold">Welcome to</div>
          <div class="deip-emblem">
            <div class="emblem-logo">Deip.world</div>
              <div class="emblem-caption">Decentralized research platform</div>
              <div v-if="tenant" class="c-pt-5 text-subtitle-1" style="text-decoration: underline">Use credentials from Grants Community Blockchain</div>
          </div> -->
          <div>
            <v-form
              ref="form"
              v-model="isFormValid"
              class="mt-6"
              @submit.prevent
            >
              <v-text-field
                v-model="username"
                name="username"
                outlined
                :label="$t('tenantSignIn.form.usernameField')"
                :disabled="isChecking"
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="password"
                name="password"
                outlined
                :label="$t('tenantSignIn.form.passwordField')"
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
                dark
                :loading="isChecking"
                :disabled="isChecking"
                @click="login()"
              >
                {{ $t('tenantSignIn.form.submitBtn') }}
              </v-btn>
            </v-form>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import crypto from '@deip/lib-crypto';
  import deipRpc from '@deip/rpc-client';

  import { AccessService } from '@deip/access-service';
  import { AuthService } from '@deip/auth-service';
  import { UsersService } from '@deip/users-service';

  const accessService = AccessService.getInstance();
  const authService = AuthService.getInstance();
  const usersService = UsersService.getInstance();

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
    name: 'TenantSignIn',

    data() {
      return {
        isFormValid: false,
        username: '',
        password: '',
        isHiddenPassword: true,
        isChecking: false,
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required')
        }
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    created() {
      this.username = this.$route.query.username || '';
    },

    methods: {
      login() {
        if (!this.$refs.form.validate()) return;

        this.isChecking = true;

        let privateKey;
        return usersService.getUser(this.username)
          .then((res) => {
            const { account } = res;
            if (!account) {
              throw new Error(this.$t('tenantSignIn.form.rules.invalidOrg'));
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
              this.$notifier.showError(this.$t('tenantSignIn.form.rules.invalidKey'));
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
              this.$notifier.showError(response.error);
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
            this.$notifier.showError(err.message);
          });
      }
    }
  };
</script>

<style>

</style>
