<template>
  <v-sheet max-width="420" :class="{'text-center': centered}">
    <div v-if="logo" class="text-h3 mb-6">
      {{ logo }}
    </div>
    <div v-if="title" class="text-h6 mb-6">
      {{ title }}
    </div>

    <d-form @submit="login">
      <d-form-block>
        <v-col cols="12">
          <v-text-field
            v-model="formData.username"
            outlined
            :label="$t('signIn.form.usernameField')"
            :rules="[validation.required]"
            :disable="disable"
            prepend-inner-icon="person"
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <d-input-password
            v-model="formData.password"
            :label="$t('signIn.form.passwordField')"
            :disable="disable"
            :rules="[validation.required]"
            prepend-inner-icon="lock"
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            type="submit"
            block
            color="primary"
            :loading="disable"
            :disabled="disable"
          >
            {{ $t('signIn.form.submitBtn') }}
          </v-btn>
        </v-col>
      </d-form-block>
    </d-form>

    <div v-if="$hasModule(DEIP_MODULE.APP_PAGE_SIGN_UP) && showSignUp" class="mt-4 text-subtitle-2">
      {{ $t('signIn.form.bottomText') }}
      <router-link class="a" :to="{name: 'SignUp'}">
        {{ $t('signIn.form.bottomTextLink') }}
      </router-link>
    </div>
  </v-sheet>
</template>

<script>
  import { AccessService } from '@deip/access-service';
  import { AuthService } from '@deip/auth-service';
  import { UserService } from '@deip/user-service';
  import DForm from '@/components/Deipify/DForm/DForm';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import DInputPassword from '@/components/Deipify/DInput/DInputPassword';

  const accessService = AccessService.getInstance();
  const authService = AuthService.getInstance();
  const userService = UserService.getInstance();


  export default {
    name: 'LoginForm',
    components: {
      DInputPassword,
      DFormBlock,
      DForm
    },
    props: {
      logo: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default() { return this.$t('signIn.form.title'); }
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
      },
      isAdmin: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formData: {
          username: null,
          password: null
        },

        validation: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required')
        },

        disable: false
      };
    },

    created() {
      this.formData.username = this.$route.query.username || '';
    },

    methods: {
      login(formValid) {
        if (!formValid) return;

        let privateKey;
        let publicKey;
        this.disable = true;
        userService.getUser(this.formData.username)
          .then((res) => {
            if (!res) {
              throw new Error(this.$t('signIn.form.rules.invalidAccount'));
            }
            return authService.generateSeedAccount(this.formData.username, this.formData.password)
          })
          .then((seedAccount) => {
            privateKey = seedAccount.getPrivKey();
            publicKey = seedAccount.getPubKey();
            return authService[`${this.isAdmin ? 'adminSignIn' : 'signIn'}`]({
              username: this.formData.username,
              secretSigHex: seedAccount.signString(window.env.SIG_SEED)
            });
          })
          .then((response) => {
            if (!response.success) {
              accessService.clearAccessToken();
              this.disable = false;
              this.$notifier.showError(response.error);
            } else {
              accessService.setAccessToken(response.jwtToken, privateKey, publicKey);
              this.disable = false;
              this.$router.go(0);
            }
          })
          .catch((err) => {
            accessService.clearAccessToken();
            this.disable = false;
            this.$notifier.showError(err.message);
          });
      }
    }
  };
</script>
