<template>
  <v-checkbox
    v-model="internalValue"

    :label="attribute.title"

    class="ma-0"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesExpressLicensingSetFilter',
    mixins: [attributeSet]
  };
</script>
