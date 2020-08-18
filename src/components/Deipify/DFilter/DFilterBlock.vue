<template>
  <v-sheet
    ref="host"
    v-resize="recalc"
    class="d-flex"
  >
    <div ref="fieldsContainer" class="d-flex">
      <slot />
    </div>

    <div ref="actions" class="ml-6 text-no-wrap">
      <slot name="actions">
        <v-btn
          color="primary"
          :disabled="loading || !filterChanged"
          :loading="loading"
          @click="onApply()"
        >
          Apply
        </v-btn>
        <v-btn
          v-if="resetVisible"
          text
          color="primary"
          :disabled="loading"
          @click="onReset()"
        >
          Clear
        </v-btn>
      </slot>
    </div>
  </v-sheet>
</template>

<script>
  import { Filterable } from '@/components/Deipify/DFilter/filterable';

  export default {
    name: 'DFilterBlock',

    mixins: [Filterable],

    created() {
      this.equaliseModels();
    },

    methods: {
      recalc() {
        const $host = this.$refs.host.$el;
        const $fields = $host.querySelectorAll('.v-input');
        const width = $host.clientWidth - this.$refs.actions.clientWidth;
        const delta = 4 * 24;
        const fieldWidth = ((width <= 1280 ? width : 1280) - delta) / 4;

        $fields.forEach((node, i) => {
          node.style.width = `${fieldWidth}px`;
          if (i + 1 < $fields.length) {
            node.style.marginRight = '24px';
          }
        });
      }
    },

    updated() {
      this.recalc();
    }
  };
</script>
