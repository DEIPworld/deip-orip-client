<template>
  <d-block
    v-if="internalValue"
    small
    widget
    separated
  >
    <div class="d-flex align-center">
      <d-simple-tooltip :tooltip="internalAttribute.title" tag="div">
        <div
          :class="textClassList"
        >
          {{ internalAttribute.shortTitle }}
        </div>
      </d-simple-tooltip>

      <d-simple-tooltip :tooltip="valueOption.title">
<!--        <v-avatar-->
<!--          class="d-flex white&#45;&#45;text font-weight-medium justify-center align-center"-->
<!--          :class="!small ? 'text-body-1' : 'text-caption'"-->
<!--          :color="!small ? 'primary' : 'grey'"-->
<!--          :size="!small ? 32 : 18"-->
<!--        >-->
        <v-avatar
        class="d-flex white--text font-weight-medium justify-center align-center"
        :class="'text-body-1'"
        :color="'primary'"
        :size="32"
        >
          <span>
            {{ internalAttribute.valueOptions.indexOf(valueOption) + 1 }}
          </span>
        </v-avatar>
      </d-simple-tooltip>
    </div>
  </d-block>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesStepperRead',
    components: { DBlock, DSimpleTooltip },
    mixins: [commonRead],
    computed: {
      valueOption() {
        return this.internalAttribute.valueOptions.find(({ value }) => value === this.internalValue);
      },

      textClassList() {
        return {
          'text-h6': true,
          // 'text-h6': !this.small,
          // 'text-overline': this.small,
          //
          // 'mr-2': !this.small,
          // 'mr-1': this.small
        };
      }
    }
  };
</script>
