<template>
  <div>
    <div class="display-flex pb-2">
      <v-avatar
        size="160px"
        class="user-avatar mr-4"
      >
        <img v-if="isProfileAvailable" :src="userInfo.profile | avatarSrc(320, 320, false)">

        <v-gravatar
          v-if="!isProfileAvailable && userInfo.account"
          :email="userInfo.account.name + '@deip.world'"
        />
      </v-avatar>

      <div class="flex-grow-1">
        <div class="text-h4 font-weight-medium pt-4">
          {{ userInfo | fullname }} <span
            v-if="(isProfileAvailable && userInfo.profile.firstName)"
            class="text-caption username-caption grey--text"
          >({{ userInfo.account.name }})</span>
          <v-btn
            v-if="isOwner"
            class="my-0 mr-0 ml-2"
            small
            icon
            :to="{
              name: 'account.profile',
              params: {
                account_name: currentUser.username
              }
            }"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </div>

        <div v-if="isProfileAvailable" class="d-flex pt-4 text-caption">
          <div class="mr-8">
            <div class="mb-2">
              <span v-if="isOwner && !isLocationSpecified" class="owner-hint mt-1">
                <v-icon size="18">location_on</v-icon>
                {{ $t('userDetailRouting.profileInfo.location') }}
              </span>
              <span v-else class="mt-1">
                <v-icon v-if="isLocationSpecified" size="18">location_on</v-icon>
                {{ locationString }}
              </span>
            </div>
            <div v-if="getEmploymentOrEducation(userInfo)">
              <v-icon size="18" class="pr-1">
                school
              </v-icon>
              <!-- {{ userInfo | employmentOrEducation }} -->
              {{ userInfo.profile.education[userInfo.profile.education.length - 1].educationalInstitution }}
            </div>
          </div>
          <div>
            <!-- display either the current employment or education, todo: add isActive flag to employment/education -->
            <div v-if="userInfo.profile.created_at" class="mb-2">
              <v-icon size="18">
                today
              </v-icon>
              <span class="font-weight-medium">
                {{ $t('userDetailRouting.profileInfo.regSince') }}
              </span>
              {{ moment(userInfo.profile.created_at).format('MMM DD, YYYY') }}
            </div>

            <div>
              <span v-if="isOwner && !userInfo.profile.email" class="owner-hint">
                <v-icon size="18">mail</v-icon>
                {{ $t('userDetailRouting.profileInfo.email') }}
              </span>
              <span v-else>
                <v-icon v-if="userInfo.profile.email" size="18">mail</v-icon>
                {{ userInfo.profile.email || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-divider class="my-2" />
    <div class="py-2">
      <div v-if="isProfileAvailable">
        <div v-if="isOwner && !userInfo.profile.bio" class="font-weight-medium owner-hint">
          <v-icon small>
            subject
          </v-icon>
          {{ $t('userDetailRouting.profileInfo.bio') }}
        </div>
        <div v-else>
          <div class="text-h6 mb-2">
            {{ $t('userDetailRouting.profileInfo.about') }}
          </div>
          <div class="text-body-2">
            {{ userInfo.profile.bio || $t('userDetailRouting.profileInfo.noDetails') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'UserDetailsBody',

    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userDetails/userInfo'
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
        if (profile && profile.location) {
          location += profile.location.city ? profile.location.city : '';
          location += profile.location.city && profile.location.country ? ', ' : '';
          location += profile.location.country ? profile.location.country : '';
        }
        return location;
      },

      isProfileAvailable() {
        return this.userInfo.profile != null;
      }

    },
    methods: {
      getEmploymentOrEducation(user) {
        return this.$options.filters.employmentOrEducation(user);
      }
    }
  };
</script>
