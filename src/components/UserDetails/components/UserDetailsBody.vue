<template>
  <div>
    <!-- ### START User Profile Details Section ### -->
    <div class="display-flex">
      <v-avatar
        size="160px"
        class="user-avatar mr-12"
        @mouseover="onAvatarMouseOver"
        @mouseout="onAvatarMouseOut"
      >
        <img v-if="userInfo.profile" :src="userInfo.profile | avatarSrc(320, 320, false)">

        <v-gravatar
          v-if="!userInfo.profile && userInfo.account"
          :email="userInfo.account.name + '@deip.world'"
        />

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
        <div class="text-h4 font-weight-medium pt-4">
          {{ userInfo | fullname }} <span
            v-if="(userInfo.profile && userInfo.profile.firstName)"
            class="text-caption username-caption grey--text"
          >({{ userInfo.account.name }})</span>
          <v-btn
            v-if="isOwner"
            class="my-0 mr-0 ml-2"
            small
            outlined
            color="primary"
            :to="{
              name: 'account.profile',
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
    <!-- ### END User Profile Details Section ### -->

    <!-- ### START User Profile Research Section ### -->
    <div class="user-research-groups-container spinner-container">
      <div>
        <!-- TODO: hotfix -->
        <div class="pt-6" v-if="!$route.name.includes('account')">
          <state-research-list
            :research-list="researchList"
            :header-text="'Research projects'"
          />
        </div>

        <div v-if="commonGroups.length" class="pt-6">
          <div class="text-h6">
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
                <div class="text-caption grey--text pt-2">
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
              :to="{ name: 'CreateResearchGroup', params: {account_name: currentUser.username} }"
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
    <div>
      <div v-if="isProfileAvailable && (isEducationSpecified || isOwner)" class="pt-6">
        <div class="text-h6">
          Education
        </div>
        <v-card v-if="userInfo && userInfo.profile" class="mt-6">
          <div v-for="(item, index) in userInfo.profile.education" :key="`${index}-education`">
            <div v-if="isOwner" class="float-right mt-6 mr-4">
              <v-btn
                class="mr-2 ml-2"
                small
                depressed
                color="primary lighten-1"
                :to="{
                  name: 'account.education',
                  query: {
                    index: `${index}`
                  }
                }"
              >
                Edit
              </v-btn>
              <v-btn
                class="mr-2 ml-2"
                outlined
                small
                depressed
                color="primary lighten-1"
                @click="showDeleteEducationDialog(item, index)"
              >
                Delete
              </v-btn>
            </div>
            <div class="pa-6">
              <div class="text-subtitle-1 font-weight-medium">
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
              :to="{
                name: 'account.education'
              }"
            >
              <v-icon small>
                add
              </v-icon>
            </v-btn>
            <span class="pl-2">Add education institutions</span>
          </div>
          <div v-if="isOwner">
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
          <div class="text-h6">
            Employment
          </div>
        </div>
        <v-card v-if="userInfo && userInfo.profile" class="mt-6">
          <div v-for="(item, index) in userInfo.profile.employment" :key="`${index}-employment`">
            <div v-if="isOwner" class="float-right mt-6 mr-4">
              <v-btn
                class="mr-2 ml-2"
                small
                depressed
                color="primary lighten-1"
                :to="{
                  name: 'account.employment',
                  query: {
                    index: `${index}`
                  }
                }"
              >
                Edit
              </v-btn>
              <v-btn
                class="mr-2 ml-2"
                outlined
                small
                depressed
                color="primary lighten-1"
                @click="showDeleteEmploymentDialog(item, index)"
              >
                Delete
              </v-btn>
            </div>
            <div class="pa-6">
              <div class="text-subtitle-1 font-weight-medium">
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
              :to="{
                name: 'account.employment'
              }"
            >
              <v-icon small>
                add
              </v-icon>
            </v-btn>
            <span class="pl-2">Add employment</span>
          </div>
          <div v-if="isOwner">
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
  <!-- ### END User Profile Education\Employment Section ### -->
</template>

<script>
  import { mapGetters } from 'vuex';
  import vueDropzone from 'vue2-dropzone';

  import { AccessService } from '@deip/access-service';
  import { UserService } from '@deip/user-service';

  const accessService = AccessService.getInstance();
  const userService = UserService.getInstance();

  export default {
    name: 'UserDetailsBody',

    components: {
      vueDropzone
    },
    data() {
      return {
        deleteEducationMeta: {
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

        isLoadingUserGroups: 'userDetails/isLoadingUserGroups'
      }),

      isOwner() {
        return this.currentUser && this.currentUser.account.name === this.userInfo.account.name;
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
      showDeleteEducationDialog(item, index) {
        this.deleteEducationMeta.item = item;
        this.deleteEducationMeta.index = index;
        this.deleteEducationMeta.isShown = true;
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

        userService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"${item.educationalInstitution}" Institute has been deleted successfully!"`)
          }, (err) => {
            this.$notifier.showError(`An error occurred while deleting "${item.educationalInstitution}" details, please try again later`)
            console.error(err);
          });
      },

      showDeleteEmploymentDialog(item, index) {
        this.deleteEmploymentMeta.item = item;
        this.deleteEmploymentMeta.index = index;
        this.deleteEmploymentMeta.isShown = true;
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

        userService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"${item.company}" employment has been deleted successfully!"`)
          }, (err) => {
            this.$notifier.showError(`An error occurred while deleting "${item.company}" employment details, please try again later`)
            console.error(err);
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
        this.$notifier.showSuccess(`Avatar has been changed successfully !`)
      },

      avatarUploadError(file, message, xhr) {
        this.$notifier.showError(`Sorry, an error occurred while uploading avatar, please try again later`)
        console.error(message);
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
    // color: var(--v-primary-base);
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
