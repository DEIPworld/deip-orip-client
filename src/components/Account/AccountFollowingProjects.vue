<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>

        <projects-list
          v-if="$currentUser.researchBookmarks.length"
          :user-name="$currentUserName"
          type="following"
        />

        <v-row v-else justify="center">
          <v-col cols="auto" class="text-center">
            <img width="64px" class="mb-3" src="/assets/img/follow-project.png">
            <div class="text-h5 mb-3">
              {{ $t('account.followingProjects.notFollPr') }}
            </div>
            <div class="text-body-1 mb-12">
              {{ $t('account.followingProjects.aLotOfPr') }}
            </div>
            <div>
              <v-btn
                :to="{ name: 'explore' }"
                color="primary"
              >
                {{ $t('account.followingProjects.browseBtn') }}
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
  import ProjectsList from '@/components/Projects/List/ProjectsList';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'AccountFollowingProjects',

    components: { DLayoutSectionMain, DLayoutSection, DLayout, ProjectsList, LayoutSection },
    computed: {
      ...mapGetters({
        researches: 'account/followingProjects'
      })
    },
  };
</script>
