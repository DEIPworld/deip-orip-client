<template>
  <v-select
    :id="field.name"
    v-model.trim="localValue"
    :label="field.label"
    :name="field.name"
    v-bind="field.props"

    @blur="onBlur"
    @change="onChange"
    @focus="onFocus"
    @input="onInput"
  />
</template>

<script>
  import abstractField from '@/components/ForrmGenerator/fields/abstractField';

  export default {
    name: 'FieldSelect',
    mixins: [abstractField]
  };
</script>

<style scoped>

</style>
