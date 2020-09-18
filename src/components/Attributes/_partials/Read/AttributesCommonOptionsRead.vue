<template>
  <div v-if="internalValue">
    {{ internalAttribute.title }}: {{ valueOption.title }}
  </div>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesCommonOptionsRead',
    mixins: [commonRead],
    computed: {
      valueOption() {
        return this.internalAttribute.valueOptions.find(({ value }) => value === this.internalValue);
      },
    }
  };
</script>
