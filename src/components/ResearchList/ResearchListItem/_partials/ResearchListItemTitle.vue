<template>
  <d-simple-tooltip
    :tooltip="text"
  >
    <v-clamp autoresize :max-lines="2" class="text-h6">
      {{ text }}
    </v-clamp>
  </d-simple-tooltip>
</template>

<script>

  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'ResearchListItemTitle',
    components: { DSimpleTooltip },
    props: {
      text: {
        type: String,
        default: null
      },
      compact: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      titleClass() {
        return {
          'text-h6': !this.compact,
          'text-body-2 font-weight-medium': this.compact
        };
      }
    }
  };
</script>
