<template>
  <validation-provider
    ref="inputValidator"
    v-slot="{ errors }"
    name="Input"
    :rules="rules"
  >
    <v-text-field
      v-model="internalValue"
      class="rounded-br-0 rounded-tr-0"
      :label="label"
      outlined
      :type="type"
      hide-details="auto"
      :append-icon="appendIcon"
      :error-messages="[...errors]"
      name="Input"
      autocomplete="off"
      @click:append="clickAppend"
    />
  </validation-provider>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { deepEqual } from 'vuetify/lib/util/helpers';

  import { assetsChore } from '@/mixins/chores';
  import { objectedModel } from '@/mixins/extendModel';

  import { extend, ValidationProvider } from 'vee-validate';
  import { required, integer, double } from 'vee-validate/dist/rules';

  extend('required', {
    ...required,
    // message: '{_field_} can not be empty'
    message: 'This field is required'
  });

  extend('email', {
    validate(value) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value);
    },
    message: 'Invalid {_field_}'
  });

  export default {
    name: 'DInput',
    components: {
      ValidationProvider
    },
    mixins: [Proxyable, objectedModel, assetsChore],
    props: {
      label: {
        type: String,
        default: null
      },
      rules: {
        type: [Object, Array, String],
        default: ''
      },
      inputType: {
        type: String,
        default: 'text'
      }
    },
    data() {
      return {
        isHidden: true
      };
    },

    computed: {
      appendIcon() {
        if (this.inputType === 'password') {
          return this.isHidden ? 'visibility' : 'visibility_off';
        }
        return '';
      },
      type() {
        if (this.inputType === 'password') {
          return this.isHidden ? 'password' : 'text';
        }
        return this.inputType;
      }
    },

    methods: {
      clickAppend() {
        if (this.inputType === 'password') {
          this.isHidden = !this.isHidden;
        }
      }
    }
  };
</script>
