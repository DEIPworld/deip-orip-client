<template>
  <div>
    <v-switch
      v-model="internalValue.isFilterable"
      label="Use in filter"
    ></v-switch>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AttributesCommonEditProps',
    mixins: [Proxyable]
  };
</script>
