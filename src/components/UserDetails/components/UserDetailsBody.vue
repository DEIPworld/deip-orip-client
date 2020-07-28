<template>
  <div>
    <!-- ### START User Profile Details Section ### -->
    <user-details-profile-info />
    <!-- ### END User Profile Details Section ### -->

    <v-divider class="my-4" />

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
        <v-card outlined class="mt-2">
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
            <v-divider v-if="i !== commonGroups.length - 1" :key="'divider-' + i" />
          </template>
        </v-card>
      </div>
    </div>
    <!-- ### END User Profile Research Section ### -->

    <!-- ### START User Profile Education\Employment Section ### -->
    <user-details-education />
    <user-details-employment />
  </div>
  <!-- ### END User Profile Education\Employment Section ### -->
</template>

<script>
  import { mapGetters } from 'vuex';

  import ResearchList from '@/components/ResearchList/ResearchList';
  import UserDetailsEducation from '@/components/UserDetails/components/UserDetailsEducation';
  import UserDetailsEmployment from '@/components/UserDetails/components/UserDetailsEmployment';
  import UserDetailsProfileInfo from '@/components/UserDetails/components/UserDetailsProfileInfo';

  export default {
    name: 'UserDetailsBody',

    components: {
      ResearchList,
      UserDetailsEducation,
      UserDetailsEmployment,
      UserDetailsProfileInfo
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
