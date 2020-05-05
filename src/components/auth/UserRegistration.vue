<template>
  <modal-route-view :title="title">
    <v-form v-show="!isServerValidated" ref="form" v-model="isFormValid">
      <div class="title mb-6">Personal information</div>

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
                v-model="formData.editedBirthdayDate"
                outlined
                label="Birthday"
                append-icon="event"
                readonly
                :disabled="isSaving"
                :rules="[rules.required]"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="formData.editedBirthdayDate" @input="editedBirthdayMenu = false" />
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

      <div class="title mb-6">Account information</div>

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

      <div class="title mb-6">Occupation information</div>

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
          <v-text-field v-model="formData.website" outlined label="Web site" :disabled="isSaving" />
        </v-col>
      </v-row>

      <div class="title mb-6">Contact information</div>

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
            :items="country"
            outlined
            :disabled="isSaving"
            label="Country"
            :rules="[rules.required]"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-text-field
            v-model="formData.phoneNumber"
            outlined
            label="Phone Number"
            :disabled="isSaving"
          />
        </v-col>
      </v-row>

      <div class="text-right mt-5">
        <v-btn
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="finishRegistration()"
        >Create account
        </v-btn>
      </div>
    </v-form>
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import { AuthService } from '@deip/auth-service';
  import _ from 'lodash';

  const authService = AuthService.getInstance();

  import { mapGetters } from 'vuex';

  export default {
    name: 'UserRegistration',
    components: { ModalRouteView },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: {
          required: value => !!value || 'This field is required',
          unique: value =>
            (!!value && this.isUsernameVerifyed !== false) ||
            'Username should be unique in system',
          nameChars: value =>
            value.match(/^[a-z][a-z ,.'-]*$/i) !== null || 'Incorrect value',
          usernameFormat: value => {
            const result = deipRpc.utils.validateAccountName(value);
            return result === null || result;
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid E-mail';
          },
          masterPassword: value => {
            if (value.length < this.MASTER_PASSWORD_MIN_LENGTH) {
              return 'Master password should be at least 10 symbols';
            }
            if (value.length > this.MASTER_PASSWORD_MAX_LENGTH) {
              return 'Master password max length is 100 symbols';
            }

            return true;
          }
        },
        isServerValidated: false,
        editedBirthdayMenu: false,
        isFormValid: false,
        isSaving: false,
        isUsernameChecking: false,
        category: [
          'Investor',
          'Project innovator',
          'Contractor',
          'Current WECO2 Partner',
          'Team member',
          'Consultant'
        ],
        occupation: ['Company', 'Independent', 'Small team/group', 'Other'],
        country: [
          'Afghanistan',
          'Åland Islands',
          'Albania',
          'Algeria',
          'American Samoa',
          'Andorra',
          'Angola',
          'Anguilla',
          'Antarctica',
          'Antigua and Barbuda',
          'Argentina',
          'Armenia',
          'Aruba',
          'Australia',
          'Austria',
          'Azerbaijan',
          'Bahamas',
          'Bahrain',
          'Bangladesh',
          'Barbados',
          'Belarus',
          'Belgium',
          'Belize',
          'Benin',
          'Bermuda',
          'Bhutan',
          'Bolivia (Plurinational State of)',
          'Bonaire, Sint Eustatius and Saba',
          'Bosnia and Herzegovina',
          'Botswana',
          'Bouvet Island',
          'Brazil',
          'British Indian Ocean Territory',
          'United States Minor Outlying Islands',
          'Virgin Islands (British)',
          'Virgin Islands (U.S.)',
          'Brunei Darussalam',
          'Bulgaria',
          'Burkina Faso',
          'Burundi',
          'Cambodia',
          'Cameroon',
          'Canada',
          'Cabo Verde',
          'Cayman Islands',
          'Central African Republic',
          'Chad',
          'Chile',
          'China',
          'Christmas Island',
          'Cocos (Keeling) Islands',
          'Colombia',
          'Comoros',
          'Congo',
          'Congo (Democratic Republic of the)',
          'Cook Islands',
          'Costa Rica',
          'Croatia',
          'Cuba',
          'Curaçao',
          'Cyprus',
          'Czech Republic',
          'Denmark',
          'Djibouti',
          'Dominica',
          'Dominican Republic',
          'Ecuador',
          'Egypt',
          'El Salvador',
          'Equatorial Guinea',
          'Eritrea',
          'Estonia',
          'Ethiopia',
          'Falkland Islands (Malvinas)',
          'Faroe Islands',
          'Fiji',
          'Finland',
          'France',
          'French Guiana',
          'French Polynesia',
          'French Southern Territories',
          'Gabon',
          'Gambia',
          'Georgia',
          'Germany',
          'Ghana',
          'Gibraltar',
          'Greece',
          'Greenland',
          'Grenada',
          'Guadeloupe',
          'Guam',
          'Guatemala',
          'Guernsey',
          'Guinea',
          'Guinea-Bissau',
          'Guyana',
          'Haiti',
          'Heard Island and McDonald Islands',
          'Holy See',
          'Honduras',
          'Hong Kong',
          'Hungary',
          'Iceland',
          'India',
          'Indonesia',
          'Côte d\'Ivoire',
          'Iran (Islamic Republic of)',
          'Iraq',
          'Ireland',
          'Isle of Man',
          'Israel',
          'Italy',
          'Jamaica',
          'Japan',
          'Jersey',
          'Jordan',
          'Kazakhstan',
          'Kenya',
          'Kiribati',
          'Kuwait',
          'Kyrgyzstan',
          'Lao People\'s Democratic Republic',
          'Latvia',
          'Lebanon',
          'Lesotho',
          'Liberia',
          'Libya',
          'Liechtenstein',
          'Lithuania',
          'Luxembourg',
          'Macao',
          'Macedonia (the former Yugoslav Republic of)',
          'Madagascar',
          'Malawi',
          'Malaysia',
          'Maldives',
          'Mali',
          'Malta',
          'Marshall Islands',
          'Martinique',
          'Mauritania',
          'Mauritius',
          'Mayotte',
          'Mexico',
          'Micronesia (Federated States of)',
          'Moldova (Republic of)',
          'Monaco',
          'Mongolia',
          'Montenegro',
          'Montserrat',
          'Morocco',
          'Mozambique',
          'Myanmar',
          'Namibia',
          'Nauru',
          'Nepal',
          'Netherlands',
          'New Caledonia',
          'New Zealand',
          'Nicaragua',
          'Niger',
          'Nigeria',
          'Niue',
          'Norfolk Island',
          'Korea (Democratic People\'s Republic of)',
          'Northern Mariana Islands',
          'Norway',
          'Oman',
          'Pakistan',
          'Palau',
          'Palestine, State of',
          'Panama',
          'Papua New Guinea',
          'Paraguay',
          'Peru',
          'Philippines',
          'Pitcairn',
          'Poland',
          'Portugal',
          'Puerto Rico',
          'Qatar',
          'Republic of Kosovo',
          'Réunion',
          'Romania',
          'Russian Federation',
          'Rwanda',
          'Saint Barthélemy',
          'Saint Helena, Ascension and Tristan da Cunha',
          'Saint Kitts and Nevis',
          'Saint Lucia',
          'Saint Martin (French part)',
          'Saint Pierre and Miquelon',
          'Saint Vincent and the Grenadines',
          'Samoa',
          'San Marino',
          'Sao Tome and Principe',
          'Saudi Arabia',
          'Senegal',
          'Serbia',
          'Seychelles',
          'Sierra Leone',
          'Singapore',
          'Sint Maarten (Dutch part)',
          'Slovakia',
          'Slovenia',
          'Solomon Islands',
          'Somalia',
          'South Africa',
          'South Georgia and the South Sandwich Islands',
          'Korea (Republic of)',
          'South Sudan',
          'Spain',
          'Sri Lanka',
          'Sudan',
          'Suriname',
          'Svalbard and Jan Mayen',
          'Swaziland',
          'Sweden',
          'Switzerland',
          'Syrian Arab Republic',
          'Taiwan',
          'Tajikistan',
          'Tanzania, United Republic of',
          'Thailand',
          'Timor-Leste',
          'Togo',
          'Tokelau',
          'Tonga',
          'Trinidad and Tobago',
          'Tunisia',
          'Turkey',
          'Turkmenistan',
          'Turks and Caicos Islands',
          'Tuvalu',
          'Uganda',
          'Ukraine',
          'United Arab Emirates',
          'United Kingdom of Great Britain and Northern Ireland',
          'United States of America',
          'Uruguay',
          'Uzbekistan',
          'Vanuatu',
          'Venezuela (Bolivarian Republic of)',
          'Viet Nam',
          'Wallis and Futuna Islands',
          'Western Sahara',
          'Yemen',
          'Zambia',
          'Zimbabwe'
        ],
        formData: {
          email: '',
          firstName: '',
          lastName: '',
          editedBirthdayDate: null,
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
          isHiddenMasterPassword: true
        }
      };
    },
    methods: {
      finishRegistration() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const {
          email,
          firstName,
          lastName,
          username,
          editedBirthdayDate,
          masterPassword,
          id,
          category,
          occupation,
          website,
          address,
          city,
          country,
          phoneNumber
        } = this.formData;

        const { ownerPubkey: pubKey } = deipRpc.auth.getPrivateKeys(
          username,
          masterPassword,
          ['owner']
        );

        console.log(email,
          firstName,
          lastName,
          editedBirthdayDate,
          username,
          masterPassword,
          id,
          category,
          occupation,
          website,
          address,
          city,
          country,
          phoneNumber);

        // return authService.signUp({
        //   email,
        //   firstName,
        //   lastName,
        //   username,
        //   pubKey
        // }).then(() => {
        //   this.isSaving = false;
        //   this.isServerValidated = true;
        //   this.$store.dispatch('layout/setSuccess', {
        //     message: `Account '${this.formData.username}' has been created successfully! Use the private key to sign in to the DEIP platform!`
        //   });
        //   this.$router.push({ name: 'SignIn', query: { username: this.formData.username } });
        // }).catch((err) => {
        //   this.isSaving = false;
        //   const message = err.response && err.response.data
        //     || 'Sorry, the service is temporarily unavailable, please try again later';

        //   this.$store.dispatch('layout/setError', { message });
        //   console.log(err);
        // });
      },
      usernameChanged: _.debounce(function () {
        this.isUsernameVerifyed = undefined;

        if (this.formData.username !== '') {
          this.isUsernameChecking = true;

          return deipRpc.api
            .getAccountsAsync([this.formData.username])
            .then(res => {
              this.isUsernameVerifyed = _.isEmpty(res);
            })
            .catch(error => {
              this.isUsernameVerifyed = false;
            })
            .finally(() => {
              this.isUsernameChecking = false;
              const usernameInput = _.find(
                this.$refs.form.inputs,
                input => input.$attrs.name === 'username'
              );
              usernameInput.validate();
            });
        }
      }, 600)
    }
  };
</script>

<style scoped>
</style>
