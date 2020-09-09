<template>
  <router-view />
</template>

<script>
  import { componentStoreFactoryOne } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  export default {
    name: 'Research',
    mixins: [componentStoreFactoryOne(researchStore, 'group')]
  };
</script>
