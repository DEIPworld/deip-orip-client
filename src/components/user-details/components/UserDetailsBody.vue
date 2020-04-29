<template>
  <div>
    <!-- ### START User Profile Details Section ### -->
    <div class="user-profile-info-container spinner-container">
      <v-progress-circular
        v-if="isLoadingUserAccount || isLoadingUserProfile"
        class="section-spinner"
        indeterminate
        color="primary"
      />

      <div v-if="isLoadingUserAccount === false && isLoadingUserProfile === false" class="display-flex">
        <v-avatar
          size="160px"
          class="user-avatar mr-12"
          @mouseover="onAvatarMouseOver"
          @mouseout="onAvatarMouseOut"
        >
          <img v-if="userInfo.profile" :src="userInfo.profile | avatarSrc(320, 320, false)">

          <v-gravatar v-if="!userInfo.profile && userInfo.account" :email="userInfo.account.name + '@deip.world'" />

          <vue-dropzone
            v-if="dropzoneOptions"
            v-show="avatarUploadIsShown"
            id="avatar-dropzone"
            ref="avatar-upload"
            :options="dropzoneOptions"
            @vdropzone-success="avatarUploadSuccess"
            @vdropzone-error="avatarUploadError"
          />
        </v-avatar>

        <div>
          <div class="display-1 font-weight-medium pt-4">
            {{ userInfo | fullname }} <span
              v-if="(userInfo.profile && userInfo.profile.firstName)"
              class="caption username-caption grey--text"
            >({{ userInfo.account.name }})</span>
            <v-btn
              v-if="isOwner"
              class="my-0 mr-0 ml-2"
              small
              outlined
              color="grey"
              :to="{
                name: 'UserSettings',
                params: {
                  account_name: currentUser.username
                }
              }"
            >
              Edit profile
            </v-btn>
          </div>

          <div class="pt-4">
            <div v-if="userInfo.profile">
              <div class="font-weight-medium">
                <span v-if="isOwner && !isLocationSpecified" class="owner-hint mt-1">
                  <v-icon small>location_on</v-icon>
                  Add location info
                </span>
                <span v-else class="mt-1">
                  <v-icon v-if="isLocationSpecified" small>location_on</v-icon>
                  {{ locationString }}
                </span>
              </div>
            </div>
          </div>

          <!-- display either the current employment or education, todo: add isActive flag to employment/education -->
          <div v-if="isProfileAvailable" class="pt-2">
            <v-icon v-if="getEmploymentOrEducation(userInfo)" small class="pr-1">
              school
            </v-icon>
            {{ userInfo | employmentOrEducation }}
          </div>
        </div>
      </div>

      <div class="pt-6">
        <div v-if="userInfo.profile">
          <div v-if="isOwner && !userInfo.profile.bio" class="font-weight-medium owner-hint">
            <v-icon small>
              subject
            </v-icon>
            Add short bio
          </div>
          <div v-else>
            {{ userInfo.profile.bio }}
          </div>
        </div>
      </div>
    </div>
    <!-- ### END User Profile Details Section ### -->

    <!-- ### START User Profile Research Section ### -->
    <div class="user-research-groups-container spinner-container">
      <v-progress-circular
        v-if="isLoadingUserGroups || isLoadingUserResearch"
        class="section-spinner"
        indeterminate
        color="primary"
      />

      <div v-if="isLoadingUserGroups === false && isLoadingUserResearch === false">
        <div class="pt-6">
          <state-research-list
            :research-list="researchList"
            :header-text="'Research projects'"
          />
        </div>

        <div v-if="commonGroups.length" class="pt-6">
          <div class="title">
            Research groups: {{ commonGroups.length }}
          </div>
        </div>

        <v-card class="mt-6">
          <template v-for="(group, i) in commonGroups" :class="[{'personal-group': group.is_personal}]">
            <div :key="'group-' + i" class="pa-6">
              <div v-if="group.is_personal">
                <router-link
                  class="research-group-title"
                  :to="{
                    name: 'ResearchGroupDetails',
                    params: {
                      research_group_permlink: encodeURIComponent(group.permlink) }
                  }"
                >
                  {{ userInfo | fullname }}
                </router-link>
                <span class="grey--text caption">(personal group)</span>
              </div>
              <div v-else>
                <router-link
                  class="research-group-title"
                  :to="{
                    name: 'ResearchGroupDetails',
                    params: {
                      research_group_permlink: encodeURIComponent(group.permlink) }
                  }"
                >
                  {{ group.name }}
                </router-link>
                <div class="caption grey--text pt-2">
                  <template v-for="share in group.shares">
                    <span :key="'share-' + share.id">
                      <span>{{ share.owner }}</span>
                      <span> · </span>
                    </span>
                  </template>
                </div>
              </div>
            </div>
            <v-divider :key="'divider-' + i" />
          </template>

          <div v-if="isOwner" class="py-4 px-6">
            <v-btn
              class="ma-0"
              outlined
              icon
              color="primary"
              :to="{ name: 'CreateResearchGroup' }"
            >
              <v-icon small>
                add
              </v-icon>
            </v-btn>

            <span class="pl-2">Add group</span>
          </div>
        </v-card>
      </div>
    </div>
    <!-- ### END User Profile Research Section ### -->

    <!-- ### START User Profile Education\Employment Section ### -->
    <div class="user-education-employment-container spinner-container">
      <v-progress-circular
        v-if="isLoadingUserAccount || isLoadingUserProfile"
        class="section-spinner"
        indeterminate
        color="primary"
      />

      <div v-if="isLoadingUserAccount === false && isLoadingUserProfile === false">
        <div v-if="isProfileAvailable && (isEducationSpecified || isOwner)" class="pt-6">
          <div class="title">
            Education
          </div>
          <v-card v-if="userInfo && userInfo.profile" class="mt-6">
            <div v-for="(item, index) in userInfo.profile.education" :key="`${index}-education`">
              <div v-if="isOwner" class="float-right mt-6 mr-4">
                <v-btn
                  class="mr-2 ml-2"
                  outlined
                  small
                  depressed
                  color="primary lighten-1"
                  @click="showSaveEducationDialog(item, index)"
                >
                  Edit
                </v-btn>
                <v-btn
                  class="mr-2 ml-2"
                  outlined
                  small
                  depressed
                  color="red lighten-1"
                  @click="showDeleteEducationDialog(item, index)"
                >
                  Delete
                </v-btn>
              </div>
              <div class="pa-6">
                <div class="subtitle-1 font-weight-medium">
                  {{ item.educationalInstitution }}
                </div>
                <div class="">
                  {{ item.degree }}
                </div>
              </div>
              <v-divider />
            </div>
            <div v-if="isOwner" class="py-4 px-6">
              <v-btn
                class="ma-0"
                outlined
                icon
                color="primary"
                @click="showSaveEducationDialog(null, -1)"
              >
                <v-icon small>
                  add
                </v-icon>
              </v-btn>
              <span class="pl-2">Add education institutions</span>
            </div>
            <div v-if="isOwner">
              <user-edit-education-dialog
                :meta="saveEducationMeta"
                @saveEducation="saveEducation($event); saveEducationMeta.isShown = false"
              />
              <confirm-action-dialog
                :meta="deleteEducationMeta"
                :title="``"
                :text="`Are you sure you want to delete this entry ?`"
                @confirmed="deleteEducation($event); deleteEducationMeta.isShown = false"
                @canceled="deleteEducationMeta.isShown = false"
              />
            </div>
          </v-card>
        </div>

        <div v-if="isProfileAvailable && (isEmploymentSpecified || isOwner)">
          <div class="pt-6">
            <div class="title">
              Employment
            </div>
          </div>
          <v-card v-if="userInfo && userInfo.profile" class="mt-6">
            <div v-for="(item, index) in userInfo.profile.employment" :key="`${index}-employment`">
              <div v-if="isOwner" class="float-right mt-6 mr-4">
                <v-btn
                  class="mr-2 ml-2"
                  outlined
                  small
                  depressed
                  color="primary lighten-1"
                  @click="showSaveEmploymentDialog(item, index)"
                >
                  Edit
                </v-btn>
                <v-btn
                  class="mr-2 ml-2"
                  outlined
                  small
                  depressed
                  color="red lighten-1"
                  @click="showDeleteEmploymentDialog(item, index)"
                >
                  Delete
                </v-btn>
              </div>
              <div class="pa-6">
                <div class="subtitle-1 font-weight-medium">
                  {{ item.company }}
                </div>
                <div class="">
                  {{ item.position }}
                </div>
              </div>
              <v-divider />
            </div>
            <div v-if="isOwner" class="py-4 px-6">
              <v-btn
                class="ma-0"
                outlined
                icon
                color="primary"
                @click="showSaveEmploymentDialog(null, -1)"
              >
                <v-icon small>
                  add
                </v-icon>
              </v-btn>
              <span class="pl-2">Add employment</span>
            </div>
            <div v-if="isOwner">
              <user-edit-employment-dialog
                :meta="saveEmploymentMeta"
                @saveEmployment="saveEmployment($event); saveEmploymentMeta.isShown = false"
              />
              <confirm-action-dialog
                :meta="deleteEmploymentMeta"
                :title="``"
                :text="`Are you sure you want to delete this entry ?`"
                @confirmed="deleteEmployment($event); deleteEmploymentMeta.isShown = false"
                @canceled="deleteEmploymentMeta.isShown = false"
              />
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
  <!-- ### END User Profile Education\Employment Section ### -->
</template>

<script>
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';

  import { AccessService } from '@deip/access-service';
  import { UsersService } from '@deip/users-service';

  const accessService = AccessService.getInstance();
  const usersService = UsersService.getInstance();

  export default {
    name: 'UserDetailsBody',

    components: {
      vueDropzone
    },
    data() {
      return {
        saveEducationMeta: {
          isShown: false,
          item: null,
          index: null
        },
        deleteEducationMeta: {
          isShown: false,
          item: null,
          index: null
        },

        saveEmploymentMeta: {
          isShown: false,
          item: null,
          index: null
        },
        deleteEmploymentMeta: {
          isShown: false,
          item: null,
          index: null
        },

        avatarUploadIsShown: false,

        accountName: this.$route.params.account_name,
        fileStorageBaseUrl: window.env.DEIP_SERVER_URL,

        tmpClaimObjects: []
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userDetails/userInfo',
        groups: 'userDetails/groups',
        researchList: 'userDetails/researchList',

        isLoadingUserAccount: 'userDetails/isLoadingUserAccount',
        isLoadingUserProfile: 'userDetails/isLoadingUserProfile',
        isLoadingUserGroups: 'userDetails/isLoadingUserGroups',
        isLoadingUserResearch: 'userDetails/isLoadingUserResearch'
      }),

      isOwner() {
        return this.currentUser && this.currentUser.username === this.$route.params.account_name;
      },
      isLocationSpecified() {
        return this.userInfo && this.userInfo.profile
          && this.userInfo.profile.location && (this.userInfo.profile.location.city || this.userInfo.profile.location.country);
      },
      locationString() {
        const profile = this.userInfo ? this.userInfo.profile : null;
        let location = '';
        if (profile) {
          location += profile.location.city ? profile.location.city : '';
          location += profile.location.city && profile.location.country ? ', ' : '';
          location += profile.location.country ? profile.location.country : '';
        }
        return location;
      },
      isEducationSpecified() {
        return this.userInfo && this.userInfo.profile && this.userInfo.profile.education.length;
      },
      isEmploymentSpecified() {
        return this.userInfo && this.userInfo.profile && this.userInfo.profile.employment.length;
      },
      commonGroups() {
        return this.groups.slice()
          .sort((g) => (g.is_personal ? -1 : 1));
      },
      dropzoneOptions() {
        return this.currentUser != null ? {
          url: `${window.env.DEIP_SERVER_URL}/api/user/upload-avatar`,
          paramName: 'user-avatar',
          headers: {
            username: this.currentUser.username.toString(),
            Authorization: `Bearer ${accessService.getAccessToken()}`
          },
          timeout: 0,
          uploadMultiple: false,
          createImageThumbnails: false,
          previewsContainer: false,
          dictDefaultMessage: '',
          acceptedFiles: ['image/png', 'image/jpeg'].join(',')
        } : null;
      },

      isProfileAvailable() {
        return this.userInfo.profile != null;
      }

    },
    methods: {
      showSaveEducationDialog(item, index) {
        this.saveEducationMeta.item = item;
        this.saveEducationMeta.index = index;
        this.saveEducationMeta.isShown = true;
      },
      showDeleteEducationDialog(item, index) {
        this.deleteEducationMeta.item = item;
        this.deleteEducationMeta.index = index;
        this.deleteEducationMeta.isShown = true;
      },
      saveEducation({ item, index }) {
        const update = {};
        if (index === -1) { // new education
          const educationList = this.userInfo.profile.education.map((e) => e)
            .concat([item]);
          Object.assign(update, this.userInfo.profile, { education: educationList });
        } else { // edited education
          const educationList = this.userInfo.profile.education.reduce(
            (accum, current, i) => {
              if (i == index) {
                return accum.concat(item);
              }
              return accum.concat(current);
            }, []
          );
          Object.assign(update, this.userInfo.profile, { education: educationList });
        }
        usersService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$store.dispatch('layout/setSuccess', {
              message: `"${item.educationalInstitution}" Institute has been saved successfully!"`
            });
          }, (err) => {
            this.$store.dispatch('layout/setError', {
              message: `An error occurred while saving "${item.educationalInstitution}" details, please try again later`
            });
            console.log(err);
          });
      },
      deleteEducation({ item, index }) {
        const educationList = this.userInfo.profile.education.reduce(
          (accum, current, i) => {
            if (i == index) {
              return accum;
            }
            return accum.concat(current);
          }, []
        );

        const update = { ...this.userInfo.profile, education: educationList };

        usersService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$store.dispatch('layout/setSuccess', {
              message: `"${item.educationalInstitution}" Institute has been deleted successfully!"`
            });
          }, (err) => {
            this.$store.dispatch('layout/setError', {
              message: `An error occurred while deleting "${item.educationalInstitution}" details, please try again later`
            });
            console.log(err);
          });
      },

      showSaveEmploymentDialog(item, index) {
        this.saveEmploymentMeta.item = item;
        this.saveEmploymentMeta.index = index;
        this.saveEmploymentMeta.isShown = true;
      },
      showDeleteEmploymentDialog(item, index) {
        this.deleteEmploymentMeta.item = item;
        this.deleteEmploymentMeta.index = index;
        this.deleteEmploymentMeta.isShown = true;
      },

      saveEmployment({ item, index }) {
        const update = {};
        if (index === -1) { // new education
          const employmentList = this.userInfo.profile.employment.map((e) => e)
            .concat([item]);
          Object.assign(update, this.userInfo.profile, { employment: employmentList });
        } else { // edited education
          const employmentList = this.userInfo.profile.employment.reduce(
            (accum, current, i) => {
              if (i == index) {
                return accum.concat(item);
              }
              return accum.concat(current);
            }, []
          );
          Object.assign(update, this.userInfo.profile, { employment: employmentList });
        }
        usersService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$store.dispatch('layout/setSuccess', {
              message: `"${item.company}" employment has been saved successfully!"`
            });
          }, (err) => {
            this.$store.dispatch('layout/setError', {
              message: `An error occurred while saving "${item.company}" details, please try again later`
            });
            console.log(err);
          });
      },

      deleteEmployment({ item, index }) {
        const employmentList = this.userInfo.profile.employment.reduce(
          (accum, current, i) => {
            if (i == index) {
              return accum;
            }
            return accum.concat(current);
          }, []
        );

        const update = { ...this.userInfo.profile, employment: employmentList };

        usersService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$store.dispatch('layout/setSuccess', {
              message: `"${item.company}" employment has been deleted successfully!"`
            });
          }, (err) => {
            this.$store.dispatch('layout/setError', {
              message: `An error occurred while deleting "${item.company}" employment details, please try again later`
            });
            console.log(err);
          });
      },

      onAvatarMouseOver() {
        if (this.currentUser.username == this.userInfo.account.name) {
          this.avatarUploadIsShown = true;
        }
      },
      onAvatarMouseOut() {
        this.avatarUploadIsShown = false;
      },

      avatarUploadSuccess(file, response) {
        this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
        this.$store.dispatch('layout/setSuccess', {
          message: 'Avatar has been changed successfully !'
        });
      },

      avatarUploadError(file, message, xhr) {
        this.$store.dispatch('layout/setError', {
          message: 'Sorry, an error occurred while uploading avatar, please try again later'
        });
        console.log(message);
      },

      getEmploymentOrEducation(user) {
        return this.$options.filters.employmentOrEducation(user);
      },

      openClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/openExpertiseTokensClaimDialog');
      },
      closeClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/closeExpertiseTokensClaimDialog');
      }
    }
  };
</script>

<style lang="less" scoped>

  .user-avatar {
    position: relative
  }

  #avatar-dropzone {
    background: #9e978e;
    background-color: rgba(29, 32, 34, .7);
    display: inline-block;
    margin: 0 1em 1em 0;
    position: absolute;
    height: 80px;
    width: 160px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border: 0.5px solid rgba(29, 32, 34, 0.7);
    bottom: -15px;
    min-height: 0 !important;
  }

  #avatar-dropzone:before {
    content: "⇪";
    font-size: 30px;
    position: absolute;
    top: 15px;
    right: 62px;
  }


  .research-group-title {
    font-size: 16px;
    color: var(--v-primary-base);
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

  }

  .owner-hint {
    font-style: italic;
  }

  .username-caption {
    font-size: 14px !important;
  }

  .user-profile-info-container {
    min-height: 200px
  }

  .user-education-employment-container {
    min-height: 100px
  }

  .personal-group {
    margin-bottom: 20px;
  }

</style>
