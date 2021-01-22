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

    <!-- ### START User Profile Project Section ### -->
    <div v-if="!$route.name.includes('account')" class="user-research-groups-container spinner-container mb-4">

      <!-- TODO: hotfix -->
      <div class="py-6">

        <projects-list
          :user-name="userInfo.account.name"
          type="public"
        />

      </div>

      <div v-if="commonGroups.length" class="py-6">
        <div class="d-flex mb-6">
          <div class="text-h5">
            {{ $t('userDetailRouting.teams') }}
            <v-badge offset-y="-8" offset-x="4" :content="commonGroups.length || '0'" />
          </div>
          <v-spacer v-if="isOwner" />
          <div v-if="isOwner">
            <v-btn
              class="ma-0"
              outlined
              color="primary"
              :to="{ name: 'CreateResearchGroup', params: {account_name: currentUser.username} }"
            >
              {{ $t('userDetailRouting.addGroup') }}
              <v-icon small>
                add
              </v-icon>
            </v-btn>

            <!-- <span class="pl-2">Add group</span> -->
          </div>
        </div>
        <v-row class="mt-2">
          <v-col v-for="(group, i) in commonGroups" :key="`${i}-group`" cols="4">
            <v-card
              outlined
              class="full-height d-flex"
              :to="{
                name: 'ResearchGroupDetails',
                params: {
                  research_group_permlink: encodeURIComponent(group.permlink) }
              }"
            >
              <d-box-item
                :avatar="group.external_id | researchGroupLogoSrc(64, 64)"
                :size="32"
                class="w-100 pa-4"
              >
                <v-clamp
                  autoresize
                  :max-lines="2"
                  class="text-h6"
                >
                  {{ group.name }}
                </v-clamp>
                <template #action>
                  <v-icon>
                    group
                  </v-icon>
                </template>
                <template #actionText>
                  <v-clamp
                    autoresize
                    :max-lines="2"
                    class="text-body-2"
                  >
                    {{ group.researchGroupRef.members.length }}
                  </v-clamp>
                </template>
              </d-box-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- ### END User Profile Project Section ### -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import UserDetailsEducation from '@/components/UserDetails/components/UserDetailsEducation';
  import UserDetailsEmployment from '@/components/UserDetails/components/UserDetailsEmployment';
  import UserDetailsProfileInfo from '@/components/UserDetails/components/UserDetailsProfileInfo';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';

  export default {
    name: 'UserDetailsBody',

    components: {
      ProjectsList,
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
      }),

      isOwner() {
        return this.currentUser && this.currentUser.account.name === this.userInfo.account.name;
      },
      commonGroups() {
        return this.groups.slice()
          .filter((g) => !g.is_personal);
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
