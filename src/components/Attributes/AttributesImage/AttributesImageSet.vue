<template>
  <d-input-image
    v-model="internalValue"
    :aspect-ratio="aspectRatio"
    :label="attribute.title"
    :initial-image="initialImage"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { isString } from '@/utils/helpers';

  export default {
    name: 'AttributesImageSet',
    components: { DInputImage },
    mixins: [attributeSet],
    props: {
      aspectRatio: {
        type: Number,
        default: 16 / 9
      }
    },
    data() {
      return {
        initialImage: null
      };
    },
    created() {
      if (this.internalValue && isString(this.internalValue)) {
        this.initialImage = this.internalValue;
        // this.checkDefaultValue(false);
      }
    }
  };
</script>
