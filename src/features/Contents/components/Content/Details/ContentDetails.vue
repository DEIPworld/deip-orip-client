<template>
  <d-layout>
    <d-layout-section class="spacer">
      <d-layout-section-main>
        sss
      </d-layout-section-main>

      <d-layout-section-sidebar>
        sss
      </d-layout-section-sidebar>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ContentDetails',
    components: {
      DLayoutSectionSidebar,
      DLayout,
      DLayoutSectionMain,
      DLayoutSection
    },
    props: {
      contentId: {
        type: String,
        default: null
      },
      researchId: {
        type: String,
        default: null
      }
    }
  };
</script>
