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
        :value="value"
        :label="label"
        v-bind="_xProps"
        append-icon="event"
        :readonly="!_xProps.disabled"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus"
        @input="onInput"
        v-on="on"
      />
    </template>
    <v-date-picker v-bind="_xProps" @change="onInput" @input="open = false" />
  </v-menu>
</template>

<script>
  import { AbstractField } from '@/components/Deipify/AbstractField';

  export default {
    name: 'DInputDate',
    mixins: [AbstractField],
    data() {
      return {
        open: false
      };
    },
  };
</script>
