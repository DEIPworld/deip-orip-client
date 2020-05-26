<template>
  <v-file-input
    :id="field.name"
    :label="field.label"
    :name="field.name"
    v-bind="field.props"

    prepend-inner-icon="attach_file"
    prepend-icon=""

    @blur="onBlur"
    @change="onChange"
    @focus="onFocus"
    @input="onInput"
  />
</template>

<script>
  import abstractField from '@/components/ForrmGenerator/fields/abstractField';

  export default {
    name: 'FieldFile',
    mixins: [abstractField],
    methods: {
      onChange(e) {
        // this.localValue = e;
        this.$emit('upd', e, this.field.name);
      }
    }
  };
</script>

<style scoped>

</style>
