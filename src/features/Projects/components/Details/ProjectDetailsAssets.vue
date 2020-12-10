<template>
  <assets-widget :asset="project.securityTokens[0]" />
</template>

<script>
  import { projectDetails } from '@/features/Projects/mixins/projectDetails';
  import AssetsWidget from '@/features/Assets/components/Widget/AssetsWidget';

  export default {
    name: 'ProjectDetailsAssets',
    components: { AssetsWidget },
    mixins: [projectDetails]
  };
</script>
