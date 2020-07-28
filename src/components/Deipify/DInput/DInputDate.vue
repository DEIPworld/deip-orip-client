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
        ref="field"
        v-model="dateText"
        :label="label"
        outlined
        hide-details="auto"
        append-icon="event"
        v-bind="fieldProps"
        :readonly="!fieldProps.disabled"
        @click:clear="$refs.field.blur()"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="internalValue" v-bind="pickerProps" @change="onChange" />
  </v-menu>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'DInputDate',
    mixins: [Proxyable],
    props: {
      label: {
        type: String,
        default: null
      },
      pickerProps: {
        type: Object,
        default: () => ({})
      },
      fieldProps: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        open: false
      };
    },
    computed: {
      dateText: {
        get() {
          if (this.pickerProps.range && Array.isArray(this.internalValue)) {
            return this.internalValue.join(' ~ ');
          }
          if (!this.pickerProps.range && Array.isArray(this.internalValue)) {
            return this.internalValue.join(', ');
          }
          return this.internalValue;
        },
        set(val) {
          if (Array.isArray(this.internalValue)) {
            if (val === null) {
              this.internalValue = [];
            } else {
              this.internalValue = val;
            }
          } else {
            this.internalValue = '';
          }
        }
      }
    },
    methods: {
      onChange(e) {
        this.$emit('change', e);
        this.open = false;
      }
    }
  };
</script>
