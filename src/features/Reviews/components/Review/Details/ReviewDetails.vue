<template>
  <d-layout>
    <d-layout-section class="fill-height">
      <d-layout-section-main>
        {{ review }}
      </d-layout-section-main>
      <d-layout-section-sidebar>
        sidebar
      </d-layout-section-sidebar>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ReviewDetails',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection, DLayout },
    computed: {
      ...mapGetters({
        review: 'Review/reviewDetails'
      })
    }
  };
</script>
