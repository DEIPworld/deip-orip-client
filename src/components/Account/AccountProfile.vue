<template>
  <full-screen-view :title="$t('account.profile.title')">
    <!-- <div class="dropzone-previews"></div> -->
    <v-avatar
      size="160px"
      class="user-avatar mb-6"
      @mouseover="onAvatarMouseOver"
      @mouseout="onAvatarMouseOut"
    >
      <v-img
        v-if="$currentUser.profile && !tempAva"
        :src="$currentUser.profile | avatarSrc(320, 320, false)"
      />

      <v-img
        v-if="tempAva"
        :src="tempAva"
      />

      <v-gravatar
        v-if="!$currentUser.profile && $currentUser.account &&  !tempAva"
        :email="$currentUser.username + '@deip.world'"
      />

      <vue-dropzone
        v-if="dropzoneOptions"
        v-show="avatarUploadIsShown"
        id="avatar-dropzone"
        ref="avatar-upload"
        :options="dropzoneOptions"
        @vdropzone-success="avatarUploadSuccess"
        @vdropzone-error="avatarUploadError"
        @vdropzone-file-added="fileAdded"
      />
    </v-avatar>
    <form-generator :model="formModel" :schema="schema">
      <template #actions>
        <v-btn
          class="my-0 ml-2"
          large
          :loading="isLoading"
          color="primary"
          :disabled="isSavingDisabled || isLoading"
          @click="save()"
        >
          {{ $t('account.profile.form.submitBtn') }}
        </v-btn>
      </template>
    </form-generator>
  </full-screen-view>
</template>

<script>
  import moment from 'moment';

  import { UserService } from '@deip/user-service';
  import FormGenerator from '@/components/ForrmGenerator/FormGenerator';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import { AccessService } from '@deip/access-service';
  import vueDropzone from 'vue2-dropzone';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'AccountProfile',
    components: {
      FullScreenView,
      FormGenerator,
      vueDropzone
    },
    data() {
      const validation = {
        required: (value) => !!value || this.$t('defaultNaming.fieldRules.required')
      };

      return {
        formModel: null,
        formModelCache: null,
        countFiles: 0,
        tempAva: null,

        schema: [
          {
            title: this.$t('account.profile.form.personalBlock.title'),
            fields: [
              {
                type: 'text',
                name: 'firstName',
                label: this.$t('account.profile.form.personalBlock.firstNameFiled'),
                cols: { md: 4 },
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'text',
                name: 'lastName',
                label: this.$t('account.profile.form.personalBlock.lastNameFiled'),
                cols: { md: 4 },
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'date',
                name: 'editedBirthdayDate',
                label: this.$t('account.profile.form.personalBlock.birthdayFiled'),
                cols: { md: 4 }
              }
            ]
          },
          {
            title: this.$t('account.profile.form.locationBlock.title'),
            fields: [
              {
                type: 'text',
                name: 'city',
                label: this.$t('account.profile.form.locationBlock.cityFiled'),
                cols: { md: 4 },
                props: {
                  rules: [validation.required]
                }
              },
              {
                type: 'text',
                name: 'country',
                label: this.$t('account.profile.form.locationBlock.countryFiled'),
                cols: { md: 4 },
                props: {
                  rules: [validation.required]
                }
              }
            ]
          },
          {
            title: this.$t('account.profile.form.contactBlock.title'),
            fields: [
              {
                type: 'email',
                name: 'email',
                label: this.$t('account.profile.form.contactBlock.emailFiled'),
                cols: { md: 4 },
                props: {
                  rules: [validation.required]
                }
              }
            ]
          },
          {
            title: this.$t('account.profile.form.bioBlock.title'),
            fields: [
              {
                type: 'textarea',
                name: 'bio',
                label: this.$t('account.profile.form.bioBlock.bioFiled'),
                props: {
                  autoGrow: true,
                  rows: 5,
                  rules: [validation.required]
                }
              }
            ]
          }
          // {
          //   title: this.$t('account.profile.form.addInfBlock.title'),
          //   fields: [
          //     {
          //       type: 'select',
          //       name: 'category',
          //       label: this.$t('account.profile.form.addInfBlock.categoryField'),
          //       cols: { md: 6 },
          //       props: {
          //         items: [
          //           'Consultant',
          //           'Contractor',
          //           'Current WECO2 Partner',
          //           'Investor',
          //           'Project innovator',
          //           'Team member'
          //         ],
          //         rules: [validation.required]
          //       }
          //     },
          //     {
          //       type: 'select',
          //       name: 'occupation',
          //       label: 'this.$t('account.profile.form.addInfBlock.occupationField'),
          //       cols: { md: 6 },
          //       props: {
          //         items: [
          //           'Company',
          //           'Independent',
          //           'Small team/group',
          //           'Other'
          //         ],
          //         rules: [validation.required]
          //       }
          //     },
          //     {
          //       type: 'text',
          //       name: 'webPage',
          //       label: this.$t('account.profile.form.addInfBlock.webSiteField'),
          //       props: {
          //         rules: [validation.required]
          //       }
          //     }
          //   ]
          // }
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
        avatarUploadIsShown: false
      };
    },
    computed: {
      dropzoneOptions() {
        return this.$currentUser != null ? {
          url: `${window.env.DEIP_SERVER_URL}/api/user/upload-avatar`,
          paramName: 'user-avatar',
          headers: {
            username: this.$currentUser.username.toString(),
            Authorization: `Bearer ${accessService.getAccessToken()}`
          },
          timeout: 0,
          maxFiles: 1,
          uploadMultiple: false,
          previewsContainer: false,
          // previewsContainer: '.dropzone-previews',
          autoProcessQueue: false,
          addRemoveLinks: false,
          dictDefaultMessage:
            '<i class=\'v-icon material-icons theme--dark mb-n10\' style=\'font-size:40px\'>camera_alt</i>',
          acceptedFiles: ['image/png', 'image/jpeg'].join(',')
        } : null;
      },

      isSavingDisabled() {
        return !this.countFiles && JSON.stringify(this.formModel) === this.formModelCache;
      }
    },

    created() {
      this.formModel = {
        city: this.$currentUser.profile.location ? this.$currentUser.profile.location.city : '',
        country: this.$currentUser.profile.location? this.$currentUser.profile.location.country : '',
        bio: this.$currentUser.profile.bio || ' ',
        email: this.$currentUser.profile.email || ' ',
        firstName: this.$currentUser.profile.firstName || ' ',
        lastName: this.$currentUser.profile.lastName || ' ',
        editedBirthdayDate: this.$currentUser.profile.birthdate
          ? moment(this.$currentUser.profile.birthdate)
            .format('YYYY-MM-DD')
          : '',
        category: this.$currentUser.profile.category,
        occupation: this.$currentUser.profile.occupation,
        webPage: this.$currentUser.profile.webPages.length ? this.$currentUser.profile.webPages[0].link : ''
      };

      this.formModelCache = JSON.stringify(this.formModel);
    },

    methods: {
      fileAdded(file) {
        this.$nextTick(() => {
          const reader = new FileReader();

          reader.onload = (event) => {
            this.tempAva = event.target.result;
          };
          reader.readAsDataURL(file);

          this.countFiles = this.$refs['avatar-upload'].getQueuedFiles().length;
        });
      },
      onAvatarMouseOver() {
        if (this.$currentUser.username === this.$currentUser.account.name) {
          this.avatarUploadIsShown = true;
        }
      },
      onAvatarMouseOut() {
        this.avatarUploadIsShown = false;
      },

      avatarUploadSuccess(file, response) {
        if (JSON.stringify(this.formModel) !== this.formModelCache) {
          this.updateAccountData();
        } else {
          this.isLoading = true;
          this.$store.dispatch('auth/loadUser')
            .then(() => {
              this.$notifier.showSuccess('Avatar has been changed successfully !');
            })
            .then(() => {
              this.$router.push('/account');
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      },

      avatarUploadError(file, message, xhr) {
        console.error(message);
        return this.$notifier.showError('Sorry, an error occurred while uploading avatar, please try again later');
      },
      cancel() {
        this.$router.push({
          name: 'UserDetails',
          params: { account_name: this.$currentUser.username }
        });
      },
      save() {
        this.$nextTick(() => {
          if (this.$refs['avatar-upload'].getQueuedFiles().length) {
            this.$refs['avatar-upload'].processQueue();
          } else if (JSON.stringify(this.formModel) !== this.formModelCache) {
            this.updateAccountData();
          }
        });
      },
      updateAccountData() {
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
          ...this.$currentUser.profile,
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

        userService.updateUserProfile(this.$currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('account/loadUser', {
              username: this.$currentUser.username
            });

            this.$store.dispatch('auth/loadUser');

            this.$notifier.showSuccess('Personal info has been saved successfully!');
          })
          .then(() => this.$router.push('/account'))
          .catch((err) => {
            this.$notifier.showError('An error occurred while saving, please try again later');
            console.error(err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  };
</script>

<style scoped>
  .user-avatar {
    position: relative
  }

  #avatar-dropzone {
    background: #9e978e;
    background-color: rgba(29, 32, 34, .7);
    display: inline-block;
    position: absolute;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border: 0.5px solid rgba(29, 32, 34, 0.7);
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    min-height: 0 !important;
  }
</style>
