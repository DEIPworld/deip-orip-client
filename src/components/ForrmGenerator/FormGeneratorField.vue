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

  import FieldDate from './fields/FieldDate';
  import FieldEmail from './fields/FieldEmail';
  import FieldFile from './fields/FieldFile';
  import FieldPassword from './fields/FieldPassword';
  import FieldSelect from './fields/FieldSelect';
  import FieldText from './fields/FieldText';
  import FieldTextarea from './fields/FieldTextarea';

  export default {
    name: 'FormGeneratorField',
    components: {
      FieldDate,
      FieldEmail,
      FieldFile,
      FieldPassword,
      FieldSelect,
      FieldText,
      FieldTextarea
    },
    props: {
      field: {
        type: Object,
        required: true
      },
      value: {
        type: [String, Number, File, Object],
        default: undefined
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
