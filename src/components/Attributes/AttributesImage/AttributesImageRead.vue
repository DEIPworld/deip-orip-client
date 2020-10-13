<template>
  <v-img
    :src="imageUrl"
  />
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import { researchAttributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesImageRead',
    mixins: [attributeRead],
    computed: {
      imageUrl() {
        return researchAttributeFileUrl(
          this.project.externalId,
          this.attribute.researchAttributeId,
          this.attribute.value,
          true
        );
      }
    }
  };
</script>
