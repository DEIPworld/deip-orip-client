<template>
  <v-container fluid fill-height class="pa-0 ma-0">
    <v-layout row>
      <v-flex md6 lg6 xl6 hidden-sm-and-down>
        <v-layout column wrap fill-height class="description">
          <div class="description__logo">
            <img src="/assets/img/landing-logo.svg" />
          </div>
          <div class="description__info-text">
            Open Research and Innovation Platform
          </div>
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
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md6 lg6 xl6>
        <v-card class="full-height elevation-0" color="secondary">
          <v-layout column wrap fill-height class="signup">
            <div class="signup__title">Registration</div>
            <v-form v-model="isFormValid" ref="form" class="c-mt-10" v-show="!isServerValidated">

              <v-text-field 
                label="Email"
                v-model="formData.email" 
                :rules="[rules.required, rules.email]"
                :disabled="isSaving"
              />

              <v-text-field 
                label="First name"
                v-model="formData.firstName" 
                :rules="[rules.required, rules.nameChars]"
                :disabled="isSaving"
              />

              <v-text-field 
                label="Last name"
                v-model="formData.lastName" 
                :rules="[rules.required, rules.nameChars]"
                :disabled="isSaving"
              />
                
              <v-text-field 
                name="username"
                label="Username"
                v-model="formData.username" 
                :rules="[
                  rules.required, 
                  rules.unique, 
                  rules.usernameFormat
                ]"
                @input="usernameChanged"
                :loading="isUsernameChecking"
                :disabled="isSaving"
              />

              <v-text-field
                v-model="formData.masterPassword"
                class="c-mt-4"
                label="Master Password"
                :disabled="isSaving"
                :rules="[rules.required, rules.masterPassword]"
                :append-icon="formData.isHiddenMasterPassword ? 'visibility_off' : 'visibility'"
                :type="formData.isHiddenMasterPassword ? 'password' : 'text'"
                @click:append="formData.isHiddenMasterPassword = !formData.isHiddenMasterPassword"
                @input="$refs.reEnterMasterPassword.validate()"
              />

              <v-text-field
                v-model="formData.reEnterMasterPassword"
                ref="reEnterMasterPassword"
                class="c-mt-4"
                label="Re-Enter Master Password"
                :disabled="isSaving"
                :rules="[rules.required, rules.reEnterMasterPassword]"
                :append-icon="formData.isHiddenReEnterMasterPassword ? 'visibility_off' : 'visibility'"
                :type="formData.isHiddenReEnterMasterPassword ? 'password' : 'text'"
                @click:append="formData.isHiddenReEnterMasterPassword = !formData.isHiddenReEnterMasterPassword"
              />

              <div class="text-align-justify caption grey--text">
                Please confirm you have saved the generated key and want to be added to the list of private beta
                participants with the information specified above:
              </div>

              <v-checkbox
                class="c-mv-4 pa-0"
                label="I have saved the password and want to be added to the list"
                v-model="formData.isMasterPasswordSaved"
                :disabled="isSaving"
                hide-details
              />

              <div class="c-pb-4 text-align-justify caption grey--text">
                No data is stored until you press “Finish Registration” button.
                For more information about our privacy terms please read <a class="a" target="_blank" href="https://deip.world/DEIP%20PRIVACY%20POLICY.pdf">Privacy Policy</a>.
                By clicking below, you agree that we may process ypur information in accordance with these terms.
              </div>

              <v-btn block color="primary" 
                :loading="isSaving"
                @click="finishRegistration()"
                :disabled="!formData.isMasterPasswordSaved || isSaving"
              >Finish registration</v-btn>
              <div class="primary--text text-xs-center mt-2">
                Already have an account?
                <router-link
                  :to="{ name: 'SignIn' }"
                >Sign In</router-link>
              </div>
            </v-form>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import deipRpc from '@deip/deip-oa-rpc-client';
  import _ from 'lodash';
  import authService from '@/services/http/auth'

  export default {
    name: 'SignUp',

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
          isMasterPasswordSaved: false,
        },

        rules: {
          required: value => !!value || 'This field is required',
          unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
          nameChars: value => (
            value.match(/^[a-z][a-z ,.'-]*$/i) !== null 
            || "Incorrect value"
          ),
          usernameFormat: value => {
            var result = deipRpc.utils.validateAccountName(value);
            return result === null || result;
          },
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid E-mail'
          },
          masterPassword: (value) => {
            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password should be at least 10 symbols';
            } else if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          },
          reEnterMasterPassword: (value) => value === this.formData.masterPassword || `Password doesn't match`,
        },
      }
    },
    
    methods: {
      finishRegistration() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const {
          email, firstName, lastName, username,
          masterPassword,
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
          pubKey,
        }).then(() => {
          this.isSaving = false;
          this.isServerValidated = true;
          this.$store.dispatch('layout/setSuccess', {
            message: `Account '${this.formData.username}' has been created successfully! Use the private key to sign in to the DEIP platform!`
          });
          this.$router.push({ name: 'SignIn', query: { username: this.formData.username }});
        }).catch((err) => {
          this.isSaving = false;
          const message = err.response && err.response.data
            || "Sorry, the service is temporarily unavailable, please try again later";

          this.$store.dispatch('layout/setError', { message: message });
          console.log(err);
        });
      },
      usernameChanged: _.debounce(
        function() {
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
                let usernameInput = _.find(this.$refs.form.inputs, input => input.$attrs.name === 'username');
                usernameInput.validate();
              });
          }
        }, 
        600
      )
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
