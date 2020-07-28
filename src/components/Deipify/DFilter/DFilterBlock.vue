<template>
  <v-row>
    <slot />
    <v-col cols="auto">
      <slot name="actions">
        <v-btn
          color="primary"
          :disabled="loading || !filterChanged"
          :loading="loading"
          @click="onApply()"
        >
          Apply
        </v-btn>
      </slot>
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import kindOf from 'kind-of';

  export default {
    name: 'DFilterBlock',

    mixins: [Proxyable],

    props: {
      loading: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        updatedValue: undefined
      };
    },

    computed: {
      filterChanged() {
        return JSON.stringify(this.updatedValue) !== JSON.stringify(this.internalValue);
      }
    },

    created() {
      this.equaliseModels();
    },

    methods: {
      onApply() {
        this.$emit('apply');

        this.equaliseModels();
      },

      equaliseModels() {
        if (kindOf(this.internalValue) === 'object') {
          this.updatedValue = { ...this.internalValue };
        } else if (kindOf(this.internalValue) === 'array') {
          this.updatedValue = [...this.internalValue];
        } else {
          this.updatedValue = this.internalValue;
        }
      }
    }
  };
</script>

<style scoped>

</style>
