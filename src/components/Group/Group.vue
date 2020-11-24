<template>
  <router-view />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  // import { projectDetailsStore } from '@/components/Project/store';

  export default {
    name: 'Research',
    // mixins: [componentStoreFactoryOnce(projectDetailsStore, 'group')]
  };
</script>
