<template>
  <div>
    <!-- ### START User Profile Details Section ### -->
    <user-details-profile-info />
    <!-- ### END User Profile Details Section ### -->

    <v-divider class="my-2" />

    <!-- ### START User Profile Education\Employment Section ### -->
    <user-details-education />
    <user-details-employment />
    <!-- ### END User Profile Education\Employment Section ### -->

    <!-- ### START User Profile Research Section ### -->
    <div v-if="!$route.name.includes('account')" class="user-research-groups-container spinner-container mb-4">
      <!-- TODO: hotfix -->
      <div class="py-6">
        <research-list :items="researchList" namespace="userDetails" />
      </div>

      <div v-if="commonGroups.length" class="py-6">
        <div class="d-flex mb-6">
          <div class="text-h6">
            Research groups: {{ commonGroups.length }}
          </div>
          <v-spacer v-if="isOwner" />
          <div v-if="isOwner">
            <v-btn
              class="ma-0"
              outlined
              color="primary"
              :to="{ name: 'CreateResearchGroup', params: {account_name: currentUser.username} }"
            >
              Add group
              <v-icon small>
                add
              </v-icon>
            </v-btn>

            <!-- <span class="pl-2">Add group</span> -->
          </div>
        </div>
        <v-row class="mt-2">
          <v-col v-for="(group, i) in commonGroups.filter((g) => !g.is_personal)" :key="`${i}-group`" cols="4">
            <v-card
              outlined
              class="full-height d-flex"
              :to="{
                name: 'ResearchGroupDetails',
                params: {
                  research_group_permlink: encodeURIComponent(group.permlink) }
              }"
            >
              <div class="py-4 px-6 ma-auto text-body-2 flex-grow-1 d-flex justify-space-between">
                <d-box-item
                  :avatar="group.external_id | researchGroupLogoSrc(32, 32)"
                  :size="32"
                >
                  <div class="text-body-2">
                    {{ group.name }}
                  </div>
                </d-box-item>
                <div class="flex-shrink-0 align-self-center">
                  <v-icon>
                    group
                  </v-icon>
                  {{ group.shares.length }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- ### END User Profile Research Section ### -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import ResearchList from '@/components/ResearchList/ResearchList';
  import UserDetailsEducation from '@/components/UserDetails/components/UserDetailsEducation';
  import UserDetailsEmployment from '@/components/UserDetails/components/UserDetailsEmployment';
  import UserDetailsProfileInfo from '@/components/UserDetails/components/UserDetailsProfileInfo';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  export default {
    name: 'UserDetailsBody',

    components: {
      ResearchList,
      UserDetailsEducation,
      UserDetailsEmployment,
      UserDetailsProfileInfo,
      DBoxItem
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userDetails/userInfo',
        groups: 'userDetails/groups',
        researchList: 'userDetails/researchList'
      }),

      isOwner() {
        return this.currentUser && this.currentUser.account.name === this.userInfo.account.name;
      },
      commonGroups() {
        return this.groups.slice()
          .sort((g) => (g.is_personal ? -1 : 1));
      }
    }
  };
</script>

<style lang="less" scoped>

  .user-avatar {
    position: relative
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
