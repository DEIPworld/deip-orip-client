<template>
  <v-img
    v-if="attribute.value"
    :src="imageUrl"
    :aspect-ratio="aspectRatio"
    :width="width"
    class="flex-shrink-0 flex-grow-0"
  />
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import { researchAttributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesImageRead',
    mixins: [attributeRead],
    props: {
      project: {
        type: Object,
        default: () => ({})
      },
      aspectRatio: {
        type: [String, Number],
        default: 16 / 9
      },
      width: {
        type: [String, Number],
        default: undefined
      }
    },
    computed: {
      query() {
        let q = '';

        if (this.width) {
          const w = this.width * 2;
          q += `&width=${w}&height=${w / this.aspectRatio}`;
        }
        return q;
      },
      imageUrl() {
        return researchAttributeFileUrl(
          this.project.externalId,
          this.attribute.researchAttributeId,
          this.attribute.value,
          true
        ) + this.query;
      }
    }
  };
</script>
