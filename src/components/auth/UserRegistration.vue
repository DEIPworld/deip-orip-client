<template>
  <component :is="modal ? 'full-screen-modal' : 'full-screen-view'" :title="title">
    <v-form v-show="!isServerValidated" ref="form" v-model="isFormValid">
      <div class="text-h6 mb-6">
        Personal information
      </div>

      <v-row>
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.firstName"
            outlined
            label="First name"
            :rules="[rules.required, rules.nameChars]"
            :disabled="isSaving"
          />
        </v-col>

        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.lastName"
            outlined
            label="Last name"
            :rules="[rules.required, rules.nameChars]"
            :disabled="isSaving"
          />
        </v-col>

        <v-col cols="6" class="py-0">
          <v-menu
            v-model="editedBirthdayMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="formData.birthdate"
                outlined
                label="Birthday"
                append-icon="event"
                readonly
                :disabled="isSaving"
                :rules="[rules.required]"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="formData.birthdate"
              @input="editedBirthdayMenu = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.id"
            outlined
            label="ID"
            :rules="[rules.required]"
            :disabled="isSaving"
          />
        </v-col>
      </v-row>

      <div class="text-h6 mb-6">
        Account information
      </div>

      <v-row>
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.username"
            outlined
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
        </v-col>

        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.masterPassword"
            outlined
            class="c-mt-4"
            label="Master Password"
            :disabled="isSaving"
            :rules="[rules.required, rules.masterPassword]"
            :append-icon="formData.isHiddenMasterPassword ? 'visibility_off' : 'visibility'"
            :type="formData.isHiddenMasterPassword ? 'password' : 'text'"
            @click:append="formData.isHiddenMasterPassword = !formData.isHiddenMasterPassword"
          />
        </v-col>

        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.email"
            outlined
            label="Email"
            :rules="[rules.required, rules.email]"
            :disabled="isSaving"
          />
        </v-col>

        <!-- <v-col cols="6" class="py-0">
          <v-select
            v-model="formData.role"
            :items="roles"
            item-text="label"
            item-value="role"
            :disabled="isSaving"
            outlined
            label="Role"
            :rules="[rules.required]"
          />
        </v-col> -->
        
        <v-col cols="6" class="py-0">
          <v-select
            v-model="formData.category"
            :items="category"
            :disabled="isSaving"
            outlined
            label="Category"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>

      <div class="text-h6 mb-6">
        Occupation information
      </div>

      <v-row>
        <v-col cols="6" class="py-0">
          <v-select
            v-model="formData.occupation"
            :items="occupation"
            outlined
            :disabled="isSaving"
            label="Occupation"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.website"
            outlined
            label="Web site"
            :disabled="isSaving"
          />
        </v-col>
      </v-row>

      <div class="text-h6 mb-6">
        Contact information
      </div>

      <v-row>
        <v-col cols="12" class="py-0">
          <v-text-field
            v-model="formData.address"
            outlined
            label="Address"
            :rules="[rules.required]"
            :disabled="isSaving"
          />
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="formData.city"
            outlined
            label="City"
            :rules="[rules.required]"
            :disabled="isSaving"
          />
        </v-col>
        <v-col cols="6" class="py-0">
          <v-autocomplete
            v-model="formData.country"
            :items="countryList"
            outlined
            :menu-props="{
              maxHeight: 220
            }"
            :disabled="isSaving"
            label="Country"
            :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="12" class="py-0">
          <v-text-field
            v-model="formData.phoneNumber"
            outlined
            label="Phone Number"
            :disabled="isSaving"
          />
        </v-col>
        <v-col v-if="$route.name === 'SignUp'">
          <v-checkbox
            v-model="formData.agree"
            class="mt-0 pt-0"
            hide-details
            :rules="[rules.required]"
          >
            <template #label>
              Agree to Terms and Conditions
            </template>
          </v-checkbox>
          <div class="text-caption ml-8 mt-1">
            No data is stored until you press “Create account” button.
            By clicking below, you agree that we may process
            your information in accordance with these terms.
          </div>
        </v-col>
      </v-row>

      <div class="text-right mt-5">
        <v-btn
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="finishCreateAccount()"
        >
          Create account
        </v-btn>
      </div>
    </v-form>
  </component>
</template>

<script>
  import { PortalService } from '@deip/portal-service';
  import { UserService } from '@deip/user-service';
  import _ from 'lodash';
  import countryList from '@/components/common/country.json';
  import { AuthService } from '@deip/auth-service';

  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';

  const portalService = PortalService.getInstance();
  const authService = AuthService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'UserRegistration',
    components: { FullScreenView, FullScreenModal },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      },
      modal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          unique: (value) => (!!value && this.isUsernameVerifyed !== false)
            || 'Username should be unique in system',
          nameChars: (value) => value.match(/^[a-z][a-z ,.'-]*$/i) !== null || 'Incorrect value',
          usernameFormat: (value) => {
            const letterNumber = /^[0-9a-zA-Z]+$/;
            return letterNumber.test(value);
          },
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid E-mail';
          },
          masterPassword: (value) => {
            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMinLength');
            }
            if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return this.$t('defaultNaming.fieldRules.masterPasswordMaxLength');
            }

            return true;
          }
        },
        isServerValidated: false,
        isUsernameVerifyed: undefined,
        editedBirthdayMenu: false,
        isFormValid: false,
        isSaving: false,
        isUsernameChecking: false,
        category: [
          'Consultant',
          'Contractor',
          'Current WECO2 Partner',
          'Investor',
          'Project innovator',
          'Team member'
        ],
        occupation: ['Company', 'Independent', 'Small team/group', 'Other'],
        countryList,
        formData: {
          email: '',
          firstName: '',
          lastName: '',
          birthdate: null,
          username: '',
          masterPassword: '',
          id: '',
          category: '',
          occupation: '',
          website: '',
          address: '',
          city: '',
          country: '',
          phoneNumber: '',
          role: '',
          isHiddenMasterPassword: true
        }
      };
    },
    computed: {
      roles() {
        return this.$portalSettings.roles;
      }
    },
    methods: {
      create({ privKey, isAuthorizedCreatorRequired }, data) {

        return this.$route.name === 'admin.members.add'
          ? portalService.postSignUp({
          email: data.email,
          attributes: data.attributes || [],
          username: data.username,
          pubKey: data.pubKey,
          roles: data.role || []
        })
          : authService.signUp({ privKey, isAuthorizedCreatorRequired }, {
          email: data.email,
          attributes: data.attributes || [],
          username: data.username,
          pubKey: data.pubKey,
          roles: data.role || []
        });

      },
      finishCreateAccount() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;
        const {
          email,
          firstName,
          lastName,
          username,
          birthdate,
          masterPassword,
          id,
          category,
          occupation,
          website,
          address,
          city,
          country,
          phoneNumber,
          role
        } = this.formData;

        authService.generateSeedAccount(username, masterPassword)
          .then((seedAccount) => {
            this.create({ 
              privKey: seedAccount.getPrivKey(), 
              isAuthorizedCreatorRequired: seedAccount.isAuthorizedCreatorRequired() 
            }, {
              username,
              email,
              firstName,
              birthdate,
              lastName,
              pubKey,
              phoneNumbers: [
                ...(
                  phoneNumber
                    ? [{
                      label: 'default',
                      ext: '', // optional
                      number: phoneNumber
                    }]
                    : []
                )
              ],
              webPages: [
                ...(
                  website
                    ? [{
                      type: 'webpage',
                      label: 'default',
                      link: website
                    }]
                    : []
                )
              ],
              location: {
                city,
                country,
                address
              },
              category,
              occupation,
              foreignIds: [],
              role
            })
              .then(() => {
                this.isSaving = false;
                this.isServerValidated = true;
                this.$notifier.showSuccess(`Account '${this.formData.username}' successfully created`);
                this.$router.push({ name: this.$route.name === 'admin.members.add' ? 'admin.members' : 'UserApplicationAccepted' });
              })
              .catch((err) => {
                this.isSaving = false;
                const message = (err.response && err.response.data)
                  || 'Sorry, the service is temporarily unavailable, please try again later';

                this.$notifier.showError(message);
                console.error(err);
              });
          });
      },
      usernameChanged: _.debounce(function () {
        this.isUsernameVerifyed = undefined;

        if (this.formData.username !== '') {
          this.isUsernameChecking = true;

          return userService.getUser(this.formData.username)
            .then(({ data: user }) => {
              this.isUsernameVerifyed = !user;
            })
            .catch((error) => {
              this.isUsernameVerifyed = false;
            })
            .finally(() => {
              this.isUsernameChecking = false;
              const usernameInput = this.$refs.form.inputs.find((input) => input.$attrs.name === 'username');
              usernameInput.validate();
            });
        }
      }, 600)
    }
  };
</script>

<style scoped>
</style>
