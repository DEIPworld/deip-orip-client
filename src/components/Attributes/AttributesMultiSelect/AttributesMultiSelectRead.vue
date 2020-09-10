<template>
  <div v-if="internalValue">
   {{ internalAttribute.title }}: {{ valueOptions.map(v => v.title).join(', ') }}
  </div>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesMultiSelectRead',
    mixins: [commonRead],
    computed: {
      valueOptions() {
        return this.internalAttribute.valueOptions.filter(({ value }) => this.internalValue && this.internalValue.some(v => v === value));
      },
    }
  };
</script>
