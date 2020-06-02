<template>
  <full-screen-view
    v-if="tenant.profile.settings.signUpPolicy === 'free'"
    :hide-toolbar="false"
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
          <div class="headline font-weight-bold mb-10">
            Registration
          </div>
          <v-form
            v-show="!isServerValidated"
            ref="form"
            v-model="isFormValid"
          >
            <v-text-field
              v-model="formData.email"
              filled
              label="Email"
              :rules="[rules.required, rules.email]"
              :disabled="isSaving"
            />

            <v-text-field
              v-model="formData.firstName"
              filled
              label="First name"
              :rules="[rules.required, rules.nameChars]"
              :disabled="isSaving"
            />

            <v-text-field
              v-model="formData.lastName"
              filled
              label="Last name"
              :rules="[rules.required, rules.nameChars]"
              :disabled="isSaving"
            />

            <v-text-field
              v-model="formData.username"
              filled
              name="username"
              label="Username"
              :rules="[
                rules.required,
                rules.unique,
                rules.usernameFormat
              ]"
              :loading="isUsernameChecking"
              :disabled="isSaving"
              @input="usernameChanged"
            />

            <v-text-field
              v-model="formData.masterPassword"
              filled
              class="mt-4"
              label="Master Password"
              :disabled="isSaving"
              :rules="[rules.required, rules.masterPassword]"
              :append-icon="formData.isHiddenMasterPassword ? 'visibility_off' : 'visibility'"
              :type="formData.isHiddenMasterPassword ? 'password' : 'text'"
              @click:append="formData.isHiddenMasterPassword = !formData.isHiddenMasterPassword"
              @input="$refs.reEnterMasterPassword.validate()"
            />

            <v-text-field
              ref="reEnterMasterPassword"
              v-model="formData.reEnterMasterPassword"
              filled
              class="mt-2"
              label="Re-Enter Master Password"
              :disabled="isSaving"
              :rules="[rules.required, rules.reEnterMasterPassword]"
              :append-icon="formData.isHiddenReEnterMasterPassword ? 'visibility_off' : 'visibility'"
              :type="formData.isHiddenReEnterMasterPassword ? 'password' : 'text'"
              @click:append="formData.isHiddenReEnterMasterPassword = !formData.isHiddenReEnterMasterPassword"
            />

            <div class="text-justify caption grey--text">
              Please confirm you have saved the generated key and want to be added to the list of private beta
              participants with the information specified above:
            </div>

            <v-checkbox
              v-model="formData.isMasterPasswordSaved"
              class="my-2 pa-0"
              label="I have saved the password and want to be added to the list"
              :disabled="isSaving"
              hide-details
            />

            <div class="pb-4 text-justify caption grey--text">
              No data is stored until you press “Finish Registration” button.
              For more information about our privacy terms please read <a class="a" target="_blank" href="https://deip.world/DEIP%20PRIVACY%20POLICY.pdf">Privacy Policy</a>.
              By clicking below, you agree that we may process ypur information in accordance with these terms.
            </div>

            <v-btn
              block
              color="primary"
              :loading="isSaving"
              :disabled="!formData.isMasterPasswordSaved || isSaving"
              @click="finishRegistration()"
            >
              Finish registration
            </v-btn>
            <div class="primary--text text-center mt-2">
              Already have an account?
              <router-link
                :to="{ name: 'SignIn' }"
              >
                Sign In
              </router-link>
            </div>
          </v-form>
        </v-sheet>
      </v-col>

      <v-col class="d-none d-md-flex">
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
  <userRegistration v-else-if="tenant.profile.settings.signUpPolicy === 'admin-approval'" />
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import UserRegistration from '@/components/auth/UserRegistration';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  import _ from 'lodash';

  import { AuthService } from '@deip/auth-service';
  import { mapGetters } from 'vuex';

  const authService = AuthService.getInstance();

  export default {
    name: 'SignUp',
    components: {
      UserRegistration,
      FullScreenView
    },

    data() {
      return {
        isFormValid: false,
        isUsernameVerifyed: undefined,
        isUsernameChecking: false,
        isSaving: false,
        isServerValidated: false, // true only when server accepts all information

        formData: {
          email: '',
          firstName: '',
          lastName: '',
          username: '',
          masterPassword: '',
          isHiddenMasterPassword: true,
          reEnterMasterPassword: '',
          isHiddenReEnterMasterPassword: true,
          isMasterPasswordSaved: false
        },

        rules: {
          required: (value) => !!value || 'This field is required',
          unique: (value) => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
          nameChars: (value) => (
            value.match(/^[a-z][a-z ,.'-]*$/i) !== null
            || 'Incorrect value'
          ),
          usernameFormat: (value) => {
            const result = deipRpc.utils.validateAccountName(value);
            return result === null || result;
          },
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid E-mail';
          },
          masterPassword: (value) => {
            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password should be at least 10 symbols';
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          },
          reEnterMasterPassword: (value) => value === this.formData.masterPassword || 'Password doesn\'t match'
        }
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    methods: {
      finishRegistration() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const {
          email, firstName, lastName, username,
          masterPassword
        } = this.formData;

        const { ownerPubkey: pubKey } = deipRpc.auth.getPrivateKeys(
          username,
          masterPassword,
          ['owner']
        );

        return authService.signUp({
          email,
          firstName,
          lastName,
          username,
          pubKey
        }).then(() => {
          this.isSaving = false;
          this.isServerValidated = true;
          this.$store.dispatch('layout/setSuccess', {
            message: `Account '${this.formData.username}' has been created successfully! Use the private key to sign in to the DEIP platform!`
          });
          this.$router.push({ name: 'SignIn', query: { username: this.formData.username } });
        }).catch((err) => {
          this.isSaving = false;
          const message = err.response && err.response.data
            || 'Sorry, the service is temporarily unavailable, please try again later';

          this.$store.dispatch('layout/setError', { message });
          console.log(err);
        });
      },
      usernameChanged: _.debounce(
        function () {
          this.isUsernameVerifyed = undefined;

          if (this.formData.username !== '') {
            this.isUsernameChecking = true;

            return deipRpc.api.getAccountsAsync([this.formData.username])
              .then((res) => {
                this.isUsernameVerifyed = _.isEmpty(res);
              }).catch((error) => {
                this.isUsernameVerifyed = false;
              }).finally(() => {
                this.isUsernameChecking = false;
                const usernameInput = _.find(this.$refs.form.inputs, (input) => input.$attrs.name === 'username');
                usernameInput.validate();
              });
          }
        },
        600
      )
    }
  };
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
      // padding-top: 5%;
      font-family: Muli;
      font-style: normal;
      font-weight: 900;
      font-size: 48px;
      line-height: 61px;
      letter-spacing: 0.25px;
      color: @white;
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
  }

  .signup {
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
