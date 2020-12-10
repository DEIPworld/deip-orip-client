<template>
  <v-sheet
    width="6"
    class="d-flex align-center"
    :class="flexColumn"
  >
    <d-simple-tooltip v-if="tooltip" :tooltip="tooltip">
      <div class="caption white-space-nowrap">
        {{ text }}
      </div>
    </d-simple-tooltip>
    <div v-else class="caption white-space-nowrap">
      {{ text }}
    </div>
    <v-avatar
      size="6"
      color="primary"
      class="flex-grow-0 flex-shrink-0"
    />
    <div style="height: 22px">
      <v-divider vertical />
    </div>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'FundraisingProgressNeedle',

    components: {
      DSimpleTooltip
    },

    props: {
      tooltip: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      reverse: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters({
        tokenSale: 'FundraisingDetails/tokenSale'
      }),
      flexColumn() {
        return `flex-column${this.reverse ? '' : '-reverse'}`;
      }
    }
  };
</script>
