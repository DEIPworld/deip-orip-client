<template>
  <d-simple-tooltip
    :tooltip="text"
  >
    <v-clamp autoresize :max-lines="4" class="text-body-2">
      {{ text }}
    </v-clamp>
  </d-simple-tooltip>
</template>

<script>

  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'ResearchListItemAbstract',
    components: { DSimpleTooltip },
    props: {
      text: {
        type: String,
        default: null
      }
    }
  };
</script>
