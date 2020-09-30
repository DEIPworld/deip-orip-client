<template>
  <app-layout>
    <layout-header :background="$options.filters.tenantBackgroundSrc(tenant.account)">
      <div class="text-h3 uppercase">
        Projects
      </div>

      <div class="pt-6">
        <v-btn
          v-if="$isLoggedIn"
          :to="tenant.profile.settings.newResearchPolicy === 'free' ? { name: 'research.create' } : { name: 'CreateResearchProposal' }"
          color="primary"
          class="ma-0"
        >
          Start a project
        </v-btn>

        <template v-else>
          <v-btn :to="{ name: 'SignIn' }" color="primary" class="ma-0 px-12">
            Sign in
          </v-btn>
          <div class="white--text text-body-1 mt-2">
            After creating an account/log in you can add
            new projects or enjoy shared materials
          </div>
        </template>
      </div>
    </layout-header>

    <d-layout-section>
      <d-layout-section-main>
        <research-list :data="researchFeed" namespace="feed" with-filter />
      </d-layout-section-main>
    </d-layout-section>
  </app-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  import LayoutHeader from '@/components/layout/components/LayoutHeader';
  import AppLayout from '@/components/layout/components/Layout';
  import ResearchList from '@/components/ResearchList/ResearchList';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'ResearchFeed',
    components: {
      DLayoutSectionMain,
      DLayoutSection,
      ResearchList,
      AppLayout,
      LayoutHeader
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchFeed: 'feed/researchFeed'
      })
    }
  };
</script>
