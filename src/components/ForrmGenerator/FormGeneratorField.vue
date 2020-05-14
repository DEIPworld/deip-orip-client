<template>
  <v-col v-bind="cols">
    <component
      :is="'field-' + field.type"
      :field="field"
      :scope="scope"
      :value="value"
      @upd="onUpd"
    />
  </v-col>
</template>


<script>
  import merge from 'deepmerge';

  const componentsContext = require.context(
    './fields',
    false,
    /Field[\w-]+\.vue$/
  );

  const fieldComponents = componentsContext.keys().reduce((obj, component) => {
    const c = componentsContext(component).default;
    obj[c.name] = c;
    return obj;
  }, {});

  export default {
    name: 'FormGeneratorField',
    components: fieldComponents,
    props: {
      field: {
        type: Object,
        required: true
      },
      value: {
        type: [String, Number],
        required: false,
        default: ''
      },
      scope: {
        type: String,
        default: null,
        required: false
      }
    },
    computed: {
      cols() {
        const cols = { cols: 12 };
        return merge(cols, this.field.cols || {});
      }
    },
    methods: {
      onUpd(value, fieldName) {
        this.$emit('upd', value, fieldName);
      }
    }
  };
</script>

<style scoped>

</style>
