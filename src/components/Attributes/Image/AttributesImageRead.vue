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
  import { attributeRead } from '@/components/Attributes/_mixins';
  import { attributesChore } from '@/mixins/chores/attributesChore';
  import { attributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesImageRead',
    mixins: [attributeRead, attributesChore],
    props: {
      project: {
        type: Object,
        default: () => ({})
      },
      username: {
        type: String,
        default: () => ''
      },
      aspectRatio: {
        type: [String, Number],
        default: 16 / 9
      },
      width: {
        type: [String, Number],
        default: '100%'
      },
      srcWidth: {
        type: [String, Number],
        default: undefined
      }
    },
    computed: {
      query() {
        let q = '';

        if (this.srcWitdh) {
          const w = this.srcWitdh * 2;
          q += `&width=${w}&height=${w / this.aspectRatio}`;
        }
        return q;
      },
      imageUrl() {
        const attrInfo = this.$$getAttributeInfo(this.attribute.attributeId);
        if (this.project.externalId) {
          return attributeFileUrl(
            attrInfo.scope,
            this.project.externalId,
            this.attribute.attributeId,
            this.attribute.value,
            true
          ) + this.query;
        }
        if (this.username) {
          return attributeFileUrl(
            attrInfo.scope,
            this.username,
            this.attribute.attributeId,
            this.attribute.value,
            true,
            false,
            160
          ) + this.query;
        }

        return '';
      }
    }
  };
</script>
