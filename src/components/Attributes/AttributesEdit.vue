<template>
  <component
    :is="attributeTypeComponent"
    v-model="internalValue"
  />
</template>


<script>
  import { commonAttribute, attributeTypeComponent } from '@/components/Attributes/mixins';

  const componentsContext = require.context('./', true, /Attributes(.*)\/(.*)Edit\.vue$/);
  const components = componentsContext.keys().reduce((obj, c) => ({
    ...obj,
    ...{
      [c.replace(/^.*[\\/]/, '').replace(/\.vue/, '').split('/').pop()]: componentsContext(c).default
    }
  }), {});

  export default {
    name: 'AttributesEdit',
    components,
    mixins: [commonAttribute, attributeTypeComponent]
  };
</script>
