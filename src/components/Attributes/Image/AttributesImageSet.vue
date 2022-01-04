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
  import { attributesChore } from '@/mixins/chores/attributesChore';
  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { isString, attributeFileUrl } from '@/utils/helpers';

  export default {
    name: 'AttributesImageSet',
    components: { DInputImage },
    mixins: [attributeSet, attributesChore],
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
        const attrInfo = this.$$getAttributeInfo(this.attribute._id);
        let entityId = this.$currentUser.username;
        if (this.$route.params.teamId) {
          entityId = this.$route.params.teamId;
        }
        if (this.$route.params.projectId) {
          entityId = this.$route.params.projectId;
          return attributeFileUrl(
            attrInfo.scope,
            entityId,
            this.attribute._id,
            this.internalValue
          );
        }

        return attributeFileUrl(
          attrInfo.scope,
          entityId,
          this.attribute._id,
          this.internalValue,
          true,
          false,
          182
        );
      }
    }
  };
</script>
