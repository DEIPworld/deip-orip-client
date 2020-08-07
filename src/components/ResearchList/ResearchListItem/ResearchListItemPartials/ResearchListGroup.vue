<template>
  <d-simple-tooltip :tooltip="group.name">
    <d-box-item
      :avatar="group.external_id | researchGroupLogoSrc(32 * 2, 32 * 2)"
      :size="32"
    >
      <v-clamp
        autoresize
        :max-lines="2"
        class="text-caption"
      >
        {{ group.name }}
      </v-clamp>
    </d-box-item>
  </d-simple-tooltip>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'ResearchListGroup',
    components: { DSimpleTooltip, DBoxItem },
    props: {
      group: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
