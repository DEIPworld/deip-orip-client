<template>
  <full-screen-view
    v-if="portal.profile.settings.signUpPolicy == signUpPolicy.FREE"
    max-width="100%"
    height="100%"
    toolbar-overlap
    no-gutters
    toolbar-color="transparent"
  >
    <template #toolbarButton>
      <v-btn :to="{ name: 'explore' }" color="primary" text>
        <v-icon left>
          arrow_back
        </v-icon>
        {{ $t('signUp.free.toolbarButton') }}
      </v-btn>
    </template>

    <v-row no-gutters class="full-height">
      <v-col class="d-flex align-center justify-center">
        <v-sheet max-width="800" width="100%" class="pa-12 mx-auto">
          <div class="text-h5 font-weight-bold mb-10">
            {{ $t('signUp.free.form.title') }}
          </div>
          <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
            <v-form :disabled="isLoading" @submit.prevent="handleSubmit(finishRegistration)">
              <registration-form-renderer
                v-model="formModel"
                :schema="layoutSchema"
              />
              <d-stack :gap="8" class="pt-4">
                <v-btn
                  block
                  type="submit"
                  color="primary"
                  :loading="isLoading"
                  :disabled="!formModel.isMasterPasswordSaved || isLoading || invalid"
                >
                  {{ $t('signUp.free.form.submitBtn') }}
                </v-btn>
                <div class="primary--text text-center mt-2">
                  {{ $t('signUp.free.form.bottomText') }}
                  <router-link
                    :to="{ name: 'SignIn' }"
                  >
                    {{ $t('signUp.free.form.bottomTextLink') }}
                  </router-link>
                </div>
              </d-stack>
            </v-form>
          </validation-observer>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet
          tile
          min-height="100%"
          color="primary"
          dark
          class="d-flex flex-column justify-center pa-12"
          style="background: linear-gradient(138.37deg, rgba(40, 56, 139, 0.5) 0%, rgba(10, 29, 43, 0.5) 100%), url(/assets/img/signin.png) center center / cover no-repeat;"
        >
          <div class="text-h2 font-weight-bold">
            {{ $t('signUp.free.title') }}
          </div>
          <div class="text-subtitle-1 mt-12">
            <v-icon small>
              mdi-message-reply-text
            </v-icon>
            <span class="ml-4">{{ $t('signUp.free.collaboration') }}</span>
          </div>
          <div class="text-subtitle-1 mt-2">
            <v-icon small>
              mdi-lightbulb-on
            </v-icon>
            <span class="ml-4">{{ $t('signUp.free.tokenization') }}</span>
          </div>
          <div class="text-subtitle-1 mt-2">
            <v-icon small>
              mdi-shield-check
            </v-icon>
            <span class="ml-4">{{ $t('signUp.free.licensing') }}</span>
          </div>
          <div class="text-subtitle-1 mt-2">
            <v-icon small>
              mdi-account-multiple-plus
            </v-icon>
            <span class="ml-4">{{ $t('signUp.free.investing') }}</span>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </full-screen-view>
  <userRegistration v-else-if="portal.profile.settings.signUpPolicy == signUpPolicy.ADMIN_APPROVAL" />
</template>

<script>
  import UserRegistration from '@/components/auth/UserRegistration';
  import RegistrationFormRenderer from '@/components/auth/renderer';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { SIGN_UP_POLICY } from '@/variables';
  import {
    compactAttributes,
    extendAttrModules,
  } from '@/utils/helpers';
  import _ from 'lodash';

  import { AuthService } from '@deip/auth-service';
  import { UserService } from '@deip/user-service';
  import { mapGetters } from 'vuex';

  const authService = AuthService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'SignUp',
    components: {
      UserRegistration,
      FullScreenView,
      RegistrationFormRenderer,
      DStack
    },

    data() {
      return {
        signUpPolicy: SIGN_UP_POLICY,
        formModel: {
          email: '',
          attributes: {},
          username: '',
          masterPassword: '',
          reEnterMasterPassword: '',
          isMasterPasswordSaved: false
        },

        isFormValid: false,
        isUsernameVerifyed: undefined,
        isUsernameChecking: false,
        isLoading: false,
        isServerValidated: false, // true only when server accepts all information
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          unique: (value) => !!value && this.isUsernameVerifyed !== false || this.$t('signUp.free.form.rules.unique'),
          nameChars: (value) => (
            value.match(/^[a-z][a-z ,.'-]*$/i) !== null
            || this.$t('signUp.free.form.rules.nameChars')
          ),
          usernameFormat: (value) => {
            const letterNumber = /^[0-9a-zA-Z]+$/;
            return letterNumber.test(value);
          },
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || this.$t('signUp.free.form.rules.email');
          },
          masterPassword: (value) => {
            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMinLength');
            } if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMaxLength');
            }

            return true;
          },
          reEnterMasterPassword: (value) => value === this.formData.masterPassword || this.$t('signUp.free.form.rules.rePasswordField')
        }
      };
    },

    computed: {
      ...mapGetters({
        portal: 'auth/portal'
      }),
      layoutSchema() {
        const schema = this.$portalSettings.layouts.signUp.layout;
        return extendAttrModules(
          schema
        );
      }
    },

    methods: {
      finishRegistration() {
        this.isLoading = true;

        const {
          email,
          attributes,
          username,
          masterPassword
        } = this.formModel;

        return authService.generateSeedAccount(username, masterPassword)
          .then((seedAccount) => {
            return authService.signUp({ 
              privKey: seedAccount.getPrivKey(), 
              isAuthorizedCreatorRequired: seedAccount.isAuthorizedCreatorRequired() 
            }, {
              email,
              attributes: compactAttributes(attributes),
              username,
              pubKey: seedAccount.getPubKey(),
              roles: []
            })
            .then(() => {
              this.isLoading = false;
              this.isServerValidated = true;
              this.$notifier.showSuccess(this.$t('signUp.free.form.success', { account: this.formModel.username }));
              this.$router.push({ name: 'SignIn', query: { username: this.formModel.username } });
            })
            .catch((err) => {
              this.isLoading = false;
              const message = err.response && err.response.data
                || this.$t('signUp.free.form.err');

              this.$notifier.showError(message);
              console.error(err);
            });
          });
      },
      usernameChanged: _.debounce(
        function () {
          this.isUsernameVerifyed = undefined;

          if (this.formData.username !== '') {
            this.isUsernameChecking = true;

            return userService.getUser(this.formData.username)
              .then(({ data: user }) => {
                this.isUsernameVerifyed = !user;
              }).catch((error) => {
                this.isUsernameVerifyed = false;
              }).finally(() => {
                this.isUsernameChecking = false;
                const usernameInput = this.$refs.form.inputs.find((input) => input.$attrs.name === 'username');
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
