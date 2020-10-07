<template>
<!--  <d-input-image-->
<!--    v-model="internalValue"-->
<!--    :aspect-ratio="aspectRatio"-->
<!--    :label="attribute.title"-->
<!--    :initial-image="initialImage"-->
<!--  />-->
  <div>
    <d-input-image
      v-model="internalValue"
      :aspect-ratio="aspectRatio"
      :label="attribute.title"
      :initial-image="initialImage"
    />
  </div>

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
        initialImage: null,

        defaultValue: {
          name: null,
          file: null
        }
      };
    },
    // computed: {
    //   initialImage() {
    //     return null;
    //   }
    // },
    watch: {
      internalValue: {
        deep: true,
        handler(val) {
          if (isString(val)) {
            this.initialImage = val
            this.checkDefaultValue(false);
          }
          this.$emit('change', val);
        }
      }
    },
    mounted() {
      console.log(111, this.internalValue)
    }
  };
</script>
