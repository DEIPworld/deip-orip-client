<template>
  <v-text-field
    :id="field.name"
    v-model.trim="localValue"
    :label="field.label"
    :name="field.name"
    v-bind="field.props"

    :append-icon="isHidden ? 'visibility_off' : 'visibility'"
    :type="isHidden ? 'password' : 'text'"
    @click:append="isHidden = !isHidden"

    @blur="onBlur"
    @change="onChange"
    @focus="onFocus"
    @input="onInput"
  />
</template>

<script>
  import abstractField from '@/components/ForrmGenerator/fields/abstractField';

  export default {
    name: 'FieldPassword',
    mixins: [abstractField],
    data() {
      return {
        isHidden: true,
      }
    }
  };
</script>

<style scoped>

</style>
