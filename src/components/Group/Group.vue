<template>
  <router-view />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  // import { researchStore } from '@/components/Research/store';

  export default {
    name: 'Research',
    // mixins: [componentStoreFactoryOnce(researchStore, 'group')]
  };
</script>
