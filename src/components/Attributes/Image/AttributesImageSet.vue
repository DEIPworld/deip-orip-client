<template>
  <d-input-image
    v-model="image"
    :aspect-ratio="aspectRatio"
    :label="attribute.title"
    :initial-image="initialImage"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { isString, researchAttributeFileUrl } from '@/utils/helpers';

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
        initialImage: null,
        valuePrepared: true,

        image: null
      };
    },
    computed: {
      hasUploadedImage() {
        return this.internalValue && isString(this.internalValue);
      }
    },
    watch: {
      image(val) {
        if (this.valuePrepared) {
          this.internalValue = val;
        }

        if (!this.valuePrepared) {
          this.valuePrepared = true;
        }
      }
    },
    created() {
      if (this.hasUploadedImage) {
        this.initialImage = this.imageUrl();
        this.valuePrepared = false;
      }
    },
    methods: {
      imageUrl() {
        if (this.$route.params.researchExternalId) {
          return researchAttributeFileUrl(
            this.$route.params.researchExternalId,
            this.attribute._id,
            this.internalValue
          );
        }
        return null;
      }
    }
  };
</script>
