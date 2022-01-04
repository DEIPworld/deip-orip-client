<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>

        <projects-list
          v-if="$currentUser.bookmarks.filter((b) => b.type === bookmarkTypes.PROJECT).length"
          :user-name="$currentUser.username"
          type="following"
        />

        <v-row v-else justify="center">
          <v-col cols="auto" class="text-center">
            <img width="64px" class="mb-3" src="/assets/img/follow-project.png">
            <div class="text-h5 mb-3">
              <!-- {{ $t('account.projects.notFollPr') }} -->
            </div>
            <div class="text-body-1 mb-12">
              <!-- {{ $t('account.projects.aLotOfPr') }} -->
            </div>
            <div>
              <v-btn
                :to="{ name: 'explore' }"
                color="primary"
              >
                <!-- {{ $t('account.projects.browseBtn') }} -->
              </v-btn>
            </div>
          </v-col>
        </v-row>

      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import { USER_BOOKMARK_TYPE } from '@/variables';

  export default {
    name: 'AccountFollowingProjects',

    components: { DLayoutSectionMain, DLayoutSection, DLayout, ProjectsList, LayoutSection },

    data() {
      return {
        bookmarkTypes: USER_BOOKMARK_TYPE
      };
    },
    computed: {
      ...mapGetters({
        projects: 'account/followingProjects'
      })
    },
  };
</script>
