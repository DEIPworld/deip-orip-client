<template>
  <div>
    <component
      :is="attributeTypeComponent"
      v-model="internalValue"
      :attribute-id="attributeId"
      :multiple="multiple"
    />
  </div>

</template>

<script>
  import { commonAttribute, attributeTypeComponent } from '@/components/Attributes/mixins';

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
    mixins: [commonAttribute, attributeTypeComponent]
  };
</script>
