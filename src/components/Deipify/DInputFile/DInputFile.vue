<template>
  <div>
    <v-file-input
      :label="label"

      prepend-inner-icon="attach_file"
      prepend-icon=""
      hide-details="auto"

      v-bind="_xProps"

      @blur="onBlur"
      @change="onChange"
      @focus="onFocus"
      @input="onInput"
    >
    </v-file-input>
    <div v-if="!!exist">
      <a class="a" :href="exist" target="_blank">View file</a>
    </div>
  </div>

</template>

<script>
  import { AbstractField } from '@/components/Deipify/AbstractField';

  export default {
    name: 'DInputFile',
    mixins: [AbstractField],
    props: {
      value: {
        type: [File, String, Object],
        default: null
      },
      exist: {
        type: [String, Boolean],
        default: false
      }
    },
    methods: {
      onChange(e) {
        this.$emit('input', e);
      },
    }
  };
</script>

<style scoped>

</style>
