<template>
  <d-layout>

    <d-layout-section
      :background="$options.filters.tenantBackgroundSrc($tenant.account)"
      :min-height="300"
      align-content="end"
    >
      <d-layout-section-main>
        <d-stack>
          <div class="text-h3 uppercase">
            {{ $t('researchFeed.title') }}
          </div>

          <div v-if="$isGuest">
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
        <projects-list with-filter />
      </d-layout-section-main>
    </d-layout-section>

  </d-layout>
</template>

<script>
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DStack from '@/components/Deipify/DStack/DStack';
  import ProjectsList from '@/components/Projects/List/ProjectsList';

  export default {
    name: 'Explore',
    components: {
      ProjectsList,
      DStack,
      DLayoutSectionMain,
      DLayoutSection,
      DLayout
    },
  };
</script>
