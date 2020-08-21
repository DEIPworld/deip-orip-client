<template>
  <v-menu
    v-model.trim="open"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :id="field.name"
        v-model.trim="localValue"
        :label="field.label"
        :name="field.name"
        v-bind="field.props"
        append-icon="event"
        readonly
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus"
        @input="onInput"
        v-on="on"
      />
    </template>
    <v-date-picker v-model.trim="localValue" @input="open = false" />
  </v-menu>
</template>

<script>
  import abstractField from '@/components/ForrmGenerator/fields/abstractField';

  export default {
    name: 'FieldDate',
    mixins: [abstractField],
    data() {
      return {
        open: false
      };
    }
  };
</script>

<style scoped>

</style>
