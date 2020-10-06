<template>
  <d-layout-section>
    <d-layout-section-main>
      <projects-list with-filter>

<!--        <template #itemRowActions="{ project }">-->
<!--          <v-btn small icon><v-icon>clear</v-icon></v-btn>-->
<!--        </template>-->

<!--        <template #itemCardActions="{ project }">-->
<!--          <v-btn small>clear</v-btn>-->
<!--        </template>-->

      </projects-list>

    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import ProjectsList from '@/components/Projects/List/ProjectsList';
  import { VIEW_TYPES } from '@/variables';

  export default {
    name: 'Sandbox',
    components: { ProjectsList, DLayoutSectionMain, DLayoutSection },
    data() {
      return {
        VIEW_TYPES
      };
    }
  };
</script>
