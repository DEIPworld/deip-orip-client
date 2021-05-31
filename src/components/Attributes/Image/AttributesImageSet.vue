<template>
  <d-input-image
    v-model="image"

    :label="$$label"

    :aspect-ratio="aspectRatio"
    :initial-image="initialImage"

    :disabled="!$$isEditable"
    :rules="$$isRequired ? $$rules : null"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { isString, researchAttributeFileUrl, userAttributeFileUrl, teamAttributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesImageSet',
    components: { DInputImage },
    mixins: [attributeSet],
    props: {
      aspectRatio: {
        type: [Number, String],
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
        if (this.$route.params.projectId) {
          return researchAttributeFileUrl(
            this.$route.params.projectId,
            this.attribute._id,
            this.internalValue
          );
        }
        if (this.$route.name.includes('account')) {
          return userAttributeFileUrl(
            this.$currentUser.username,
            this.attribute._id,
            this.internalValue,
            true,
            false,
            182
          );
        }
        if (this.$route.params.teamId) {
          return teamAttributeFileUrl(this.$route.params.teamId, this.attribute._id, this.internalValue, true, false, 182);
        }
        return null;
      }
    }
  };
</script>
