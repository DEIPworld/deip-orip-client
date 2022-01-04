<template>
  <v-container fluid class="pa-0 c-mt-10">
    <v-row class="fill-height align-space-around justify-center text-center">
      <v-col cols="5">
        <div class="text-center">
          <div v-if="portal">
            <span class="text-h5">{{ portal.profile.shortName }}</span>
            <!-- <img width="100px" height="100px" :src="portal | portalLogoSrc(160, 160, false)"> -->
          </div>
          <!-- <div class="text-h6 c-pb-4 bold">Welcome to</div>
          <div class="deip-emblem">
            <div class="emblem-logo">Deip.world</div>
              <div class="emblem-caption">Decentralized project platform</div>
              <div v-if="portal" class="c-pt-5 text-subtitle-1" style="text-decoration: underline">Use credentials from Grants Community Blockchain</div>
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
                :label="$t('portalSignIn.form.usernameField')"
                :disabled="isChecking"
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="password"
                name="password"
                outlined
                :label="$t('portalSignIn.form.passwordField')"
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
                {{ $t('portalSignIn.form.submitBtn') }}
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
  import { AccessService } from '@deip/access-service';
  import { AuthService } from '@deip/auth-service';
  import { UserService } from '@deip/user-service';

  const accessService = AccessService.getInstance();
  const authService = AuthService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'PortalSignIn',

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
        portal: 'auth/portal'
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
        let publicKey;
        return userService.getUser(this.username)
          .then((res) => {
            if (!res) {
              throw new Error(this.$t('portalSignIn.form.rules.invalidOrg'));
            }
            return authService.generateSeedAccount(this.username, this.password);
          })
          .then((seedAccount) => {
            privateKey = seedAccount.getPrivKey();
            publicKey = seedAccount.getPubKey();
            return authService[`${this.isAdmin ? 'adminSignIn' : 'signIn'}`]({
              username: this.username,
              secretSigHex: seedAccount.signString(window.env.SIG_SEED)
            });
          })
          .then((response) => {
            if (!response.success) {
              accessService.clearAccessToken();
              this.isChecking = false;
              this.$notifier.showError(response.error);
            } else {
              accessService.setAccessToken(response.jwtToken, privateKey, publicKey);
              this.isChecking = false;
              this.isServerValidated = true;
              this.$router.go('/');
            }
          })
          .catch((err) => {
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
