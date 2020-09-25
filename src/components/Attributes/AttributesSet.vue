<template>
  <component
    :is="attributeTypeComponent"
    v-model="internalValue"
    :attribute="attribute"
    :view-type="viewType"
  />
</template>

<script>
  import { attributeSet, attributeTypeComponent } from '@/components/Attributes/mixins';

  const componentsContext = require.context('./', true, /Attributes(.*)\/(.*)Set\.vue$/);
  const components = componentsContext.keys().reduce((obj, c) => ({
    ...obj,
    ...{
      [c.replace(/^.*[\\/]/, '').replace(/\.vue/, '').split('/').pop()]: componentsContext(c).default
    }
  }), {});

  export default {
    name: 'AttributesSet',
    components,
    mixins: [attributeSet, attributeTypeComponent]
  };
</script>
