<template>
  <div class="d-flex align-center">
    <d-simple-tooltip :tooltip="attributeInfo.title" tag="div">
      <div class="text-overline font-weight-medium mr-1">
        {{ attributeInfo.shortTitle }}
      </div>
    </d-simple-tooltip>

    <d-simple-tooltip :tooltip="valueOption.title">
      <v-avatar
        class="d-flex white--text font-weight-medium text-caption"
        color="grey"
        :size="18"
      >
        <span>
          {{ attributeInfo.valueOptions.indexOf(valueOption) + 1 }}
        </span>
      </v-avatar>
    </d-simple-tooltip>
  </div>
</template>

<script>
  import { attributeReadOption } from '@/components/Attributes/_mixins';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'AttributesStepperReadSmall',
    components: { DSimpleTooltip },
    mixins: [attributeReadOption]
  };
</script>
