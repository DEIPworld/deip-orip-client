<template>
  <span>
    {{ education }}
  </span>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesDateRead',
    mixins: [attributeRead],
    computed: {
      education() {
        if (this.attribute.value.length) {
          return this.attribute.value[
            this.attribute.value.length - 1
          ].educationalInstitution;
        }
        return '';
      }
    }
  };
</script>
