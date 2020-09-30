<template>
  <d-block widget separated>
    <div class="d-flex align-center">

      <d-simple-tooltip :tooltip="attributeInfo.title" tag="div">
        <div class="text-h6 font-weight-medium mr-2">
          {{ attributeInfo.shortTitle }}
        </div>
      </d-simple-tooltip>

      <d-simple-tooltip :tooltip="valueOption.title">
        <v-avatar
          class="d-flex white--text font-weight-medium text-body-1"
          color="primary"
          :size="32"
        >
          <div>
            {{ attributeInfo.valueOptions.indexOf(valueOption) + 1 }}
          </div>
        </v-avatar>
      </d-simple-tooltip>
    </div>
  </d-block>
</template>

<script>
  import { attributeReadOption } from '@/components/Attributes/mixins';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesStepperReadSidebar',
    components: { DBlock, DSimpleTooltip },
    mixins: [attributeReadOption]
  };
</script>
