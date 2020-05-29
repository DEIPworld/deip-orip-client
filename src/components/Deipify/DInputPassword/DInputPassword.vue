<template>
  <v-text-field
    :value="value"
    :label="label"
    v-bind="_xProps"

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
  import { AbstractField } from '@/components/Deipify/AbstractField';

  export default {
    name: 'DInputPassword',
    mixins: [AbstractField],
    data() {
      return {
        isHidden: true
      };
    }
  };
</script>
