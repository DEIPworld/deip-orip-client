<template>
  <v-sheet
    ref="host"
    v-resize="recalc"
    class="d-flex"
  >
    <div ref="fieldsContainer" class="d-flex">
      <slot />
    </div>

    <div ref="actions" class="ml-6">
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
    </div>
  </v-sheet>
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
      },

      fieldContainerStyle() {
        return {};
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

      recalc() {
        const $host = this.$refs.host.$el;
        const $fields = $host.querySelectorAll('.v-input');
        const width = $host.clientWidth - this.$refs.actions.clientWidth;
        const delta = 3 * 24;
        const fieldWidth = ((width <= 1280 ? width : 1280) - delta) / 4;

        $fields.forEach((node, i) => {
          node.style.width = `${fieldWidth}px`;
          if (i + 1 < $fields.length) {
            node.style.marginRight = '24px';
          }
        });
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
