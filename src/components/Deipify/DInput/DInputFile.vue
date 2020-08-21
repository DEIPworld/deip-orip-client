<template>
  <div>
    <v-file-input
      :label="label"

      prepend-inner-icon="attach_file"
      prepend-icon=""

      v-bind="_xProps"
    />
    <div v-if="!!exist" class="pl-4 pt-2">
      <a class="link" :href="exist" target="_blank">View file</a>
    </div>
  </div>
</template>

<script>
  import { AbstractField } from '@/components/Deipify/DInput/AbstractField';

  export default {
    name: 'DInputFile',
    mixins: [AbstractField],
    props: {
      // value: {
      //   type: [File, String, Object],
      //   default: null
      // },
      exist: {
        type: [String, Boolean],
        default: false
      }
    },
    methods: {
      // onChange(e) {
      //   this.$emit('input', e);
      // },
    }
  };
</script>
