<template>
  <div class="d-flex align-center">

    <d-simple-tooltip :tooltip="internalAttribute.title" tag="div">
      <div class="text-overline font-weight-medium mr-1">
        {{ internalAttribute.shortTitle }}
      </div>
    </d-simple-tooltip>

    <d-simple-tooltip :tooltip="valueOption.title">
      <v-avatar
        class="d-flex white--text font-weight-medium text-caption"
        color="grey"
        :size="18"
      >
        <span>
          {{ internalAttribute.valueOptions.indexOf(valueOption) + 1 }}
        </span>
      </v-avatar>
    </d-simple-tooltip>
  </div>
</template>

<script>
  import { commonRead, optionsRead } from '@/components/Attributes/mixins';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'AttributesStepperReadCard',
    components: { DSimpleTooltip },
    mixins: [commonRead, optionsRead]
  };
</script>
