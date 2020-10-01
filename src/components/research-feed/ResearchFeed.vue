<template>
  <d-layout>
    <d-layout-section
      :background="$options.filters.tenantBackgroundSrc(tenant.account)"
      background-overlay="to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)"
      dark
      :min-height="300"
      align-content="end"
    >
      <d-layout-section-main>
        <d-stack>
          <div class="text-h3 uppercase">
            {{ $t('researchFeed.title') }}
          </div>

          <!--          <v-btn-->
          <!--            v-if="$isLoggedIn"-->
          <!--            :to="tenant.profile.settings.newResearchPolicy === 'free' ? { name: 'research.create' } : { name: 'CreateResearchProposal' }"-->
          <!--            color="primary"-->
          <!--            class="ma-0"-->
          <!--          >-->
          <!--            {{ $t('researchFeed.startProjectBtn') }}-->
          <!--          </v-btn>-->

          <div v-if="!$isLoggedIn">
            <v-btn :to="{ name: 'SignIn' }" color="primary" class="ma-0 px-12">
              {{ $t('researchFeed.signInBtn') }}
            </v-btn>
            <div class="white--text text-body-1 mt-2">
              {{ $t('researchFeed.signInText') }}
            </div>
          </div>
        </d-stack>
      </d-layout-section-main>
    </d-layout-section>

    <d-layout-section>
      <d-layout-section-main>
        <research-list :data="researchFeed" namespace="feed" with-filter />
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  import ResearchList from '@/components/ResearchList/ResearchList';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DLayout from '@/components/Deipify/DLayout/DLayout';

  export default {
    name: 'ResearchFeed',
    components: {
      DLayout,
      DLayoutSection,
      DLayoutSectionMain,
      DStack,
      ResearchList
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchFeed: 'feed/researchFeed'
      })
    }
  };
</script>
