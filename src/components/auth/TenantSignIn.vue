<template>
  <v-container fluid class="pa-0 c-mt-10">
    <v-layout row wrap fill-height align-space-around justify-space-around text-xs-center>
      <v-flex xs3></v-flex>
      <v-flex xs5>
        <div>
          <div class="text-align-center">
            <div v-if="tenant">
              <img width="200px" height="200px" :src="tenant | tenantSymbolSrc(160, 160, false)"/>
            </div>
            <!-- <div class="title c-pb-4 bold">Welcome to</div>
            <div class="deip-emblem">
              <div class="emblem-logo">Deip.world</div>
                <div class="emblem-caption">Decentralized research platform</div>
                <div v-if="tenant" class="c-pt-5 subheading" style="text-decoration: underline">Use credentials from Grants Community Blockchain</div>
            </div> -->
            <div>
              <v-form v-model="isFormValid" ref="form" class="mt-4" @submit.prevent>
                <v-text-field
                  name="username"
                  label="Username"
                  v-model="username"
                  :disabled="isChecking"
                  :rules="[rules.required]"
                ></v-text-field>

                <v-text-field
                  name="password"
                  label="Password / Private Key"
                  v-model="password"
                  :rules="[rules.required]"
                  :append-icon="isHiddenPassword ? 'visibility_off' : 'visibility'"
                  :type="isHiddenPassword ? 'password' : 'text'"
                  :disabled="isChecking"
                  @click:append="isHiddenPassword = !isHiddenPassword"
                ></v-text-field>

                <v-btn 
                  type="submit"
                  block
                  color="primary"
                  dark
                  :loading="isChecking"
                  :disabled="isChecking"
                  @click="login()"
                >Login</v-btn>
              </v-form>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs3>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import crypto from '@deip/lib-crypto';
  import deipRpc from '@deip/rpc-client';

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
    name: 'TenantSignIn',

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

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
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

<style>

</style>
