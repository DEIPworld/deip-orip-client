<template>
  <d-layout-section>
    <d-layout-section-main>

      <d-autocomplete
        label="label"
        class="mb-12"
        outlined
        :items="[
          'anim ad',
          'ex incididunt',
          'anim quis',
          'aliqua eiusmod',
          'magna enim',
          'magna qui',
          'ea aliqua',
          'reprehenderit laborum',
          'nulla ea',
          'magna exercitation',
          'aute et',
          'magna tempor',
          'do sunt',
          'laborum consectetur',
          'officia ex'
        ]"
      />

      <d-autocomplete
        label="label"
        outlined
        multiple
        chips
        deletable-chips
        :items="[
          'anim ad',
          'ex incididunt',
          'anim quis',
          'aliqua eiusmod',
          'magna enim',
          'magna qui',
          'ea aliqua',
          'reprehenderit laborum',
          'nulla ea',
          'magna exercitation',
          'aute et',
          'magna tempor',
          'do sunt',
          'laborum consectetur',
          'officia ex'
        ]"
      />

    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'Sandbox',
    components: { DAutocomplete, DLayoutSectionMain, DLayoutSection },
    data() {
      return {
        tab: undefined
      };
    }
  };
</script>
