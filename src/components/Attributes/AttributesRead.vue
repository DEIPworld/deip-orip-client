<template>
  <component
    :is="attributeTypeComponent"
    v-if="Object.keys(attribute).length"
    :attribute="attribute"
    :view-type="viewType"
    :clamped="clamped"
  />
</template>

<script>
  import { attributeRead, attributeTypeComponent } from '@/components/Attributes/mixins';

  const componentsContext = require.context('./', true, /Attributes(.*)\/(.*)Read\.vue$/);
  const components = componentsContext.keys().reduce((obj, c) => ({
    ...obj,
    ...{
      [c.replace(/^.*[\\/]/, '').replace(/\.vue/, '').split('/').pop()]: componentsContext(c).default
    }
  }), {});

  export default {
    name: 'AttributesRead',
    components,
    mixins: [attributeRead, attributeTypeComponent]
  };
</script>

