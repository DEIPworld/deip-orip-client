<template>
  <modal-route-view title="Edit personal info">

    <form-generator :model="formModel" :schema="schema">
      <template #actions>
        <v-btn
          class="my-0 ml-2"
          large
          :loading="isLoading"
          :disabled="isSavingDisabled || isLoading"
          color="primary"
          @click="save()"
        >
          Update Info
        </v-btn>
      </template>
    </form-generator>

  </modal-route-view>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  import { UserService } from '@deip/user-service';
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import FormGenerator from '@/components/ForrmGenerator/FormGenerator';

  const userService = UserService.getInstance();

  export default {
    name: 'AccountProfile',
    components: {
      FormGenerator,
      ModalRouteView
    },
    data() {
      const validation = {
        required: (value) => !!value || 'This field is required'
      };

      return {
        formModel: null,
        formModelCache: null,

        schema: [
          {
            title: 'Location:',
            fields: [
              {
                type: 'text',
                name: 'city',
                label: 'City',
                cols: { md: 6 },
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'text',
                name: 'country',
                label: 'Country',
                cols: { md: 6 },
                props: {
                  rules: [validation.required]
                }
              }
            ]
          },
          {
            title: 'Bio:',
            fields: [
              {
                type: 'textarea',
                name: 'bio',
                label: 'Tell about yourself',
                props: {
                  autoGrow: true,
                  rows: 1,
                  rules: [validation.required]
                }
              }
            ]
          },
          {
            title: 'Contacts:',
            fields: [
              {
                type: 'email',
                name: 'email',
                label: 'Email',
                props: {
                  rules: [validation.required]
                }
              }
            ]
          },
          {
            title: 'Personal information:',
            fields: [
              {
                type: 'text',
                name: 'firstName',
                label: 'First Name',
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'text',
                name: 'lastName',
                label: 'Last Name',
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'date',
                name: 'editedBirthdayDate',
                label: 'Birthday'
              }
            ]
          },
          {
            title: 'Additional information:',
            fields: [
              {
                type: 'select',
                name: 'category',
                label: 'Category',
                cols: { md: 6 },
                props: {
                  items: [
                    'Consultant',
                    'Contractor',
                    'Current WECO2 Partner',
                    'Investor',
                    'Project innovator',
                    'Team member'
                  ],
                  rules: [validation.required]
                }
              },
              {
                type: 'select',
                name: 'occupation',
                label: 'Occupation',
                cols: { md: 6 },
                props: {
                  items: [
                    'Company',
                    'Independent',
                    'Small team/group',
                    'Other'
                  ],
                  rules: [validation.required]
                }
              },
              {
                type: 'text',
                name: 'webPage',
                label: 'Web site'
              }
            ]
          }
        ],

        editedBirthdayMenu: false,
        editedBirthdayDate: null,
        city: '',
        country: '',
        bio: '',
        email: '',
        firstName: '',
        lastName: '',
        category: '',
        occupation: '',
        webPage: '',
        isLoading: false,
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'account/userInfo'
      }),

      isSavingDisabled() {
        return JSON.stringify(this.formModel) === this.formModelCache;
      }
    },

    created() {
      this.formModel = {
        city: this.userInfo.profile.location.city || ' ',
        country: this.userInfo.profile.location.country || ' ',
        bio: this.userInfo.profile.bio || ' ',
        email: this.userInfo.profile.email || ' ',
        firstName: this.userInfo.profile.firstName || ' ',
        lastName: this.userInfo.profile.lastName || ' ',
        editedBirthdayDate: this.userInfo.profile.birthdate
          ? moment(this.userInfo.profile.birthdate)
            .format('YYYY-MM-DD')
          : null,
        category: this.userInfo.profile.category,
        occupation: this.userInfo.profile.occupation,
        webPage: this.userInfo.profile.webPages.length ? this.userInfo.profile.webPages.length[0].link : ''
      };

      this.formModelCache = JSON.stringify(this.formModel);
    },

    methods: {
      cancel() {
        this.$router.push({
          name: 'UserDetails',
          params: { account_name: this.currentUser.username }
        });
      },
      save() {
        this.isLoading = true;

        const location = {
          city: this.formModel.city,
          country: this.formModel.country
        };
        const { bio } = this.formModel;
        const { email } = this.formModel;
        const { firstName } = this.formModel;
        const { lastName } = this.formModel;
        const { category } = this.formModel;
        const { occupation } = this.formModel;
        const { webPage } = this.formModel;
        const birthdate = this.formModel.editedBirthdayDate;

        const update = {
          ...this.userInfo.profile,
          ...{
            location,
            bio,
            email,
            firstName,
            lastName,
            birthdate,
            category,
            occupation,
            webPages: [{
              type: 'webpage',
              label: 'default',
              link: webPage
            }]
          }
        };

        userService
          .updateUserProfile(this.currentUser.username, update)
          .then(
            (res) => {
              this.$store.dispatch('account/loadUserProfile', {
                username: this.currentUser.username
              });
              this.$store.dispatch('auth/loadUser');
              this.$store.dispatch('layout/setSuccess', {
                message: '"Personal info has been saved successfully!"'
              });
            },
            (err) => {
              this.$store.dispatch('layout/setError', {
                message: 'An error occurred while saving, please try again later'
              });
              console.error(err);
            }
          )
          .finally(() => {
            this.isLoading = false;
            this.$router.push({
              name: 'UserDetails',
              params: { account_name: this.currentUser.username }
            });
          });
      }
    }
  };
</script>
