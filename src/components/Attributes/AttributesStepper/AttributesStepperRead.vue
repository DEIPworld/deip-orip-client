<template>
  <div class="d-flex align-center" v-if="internalValue">
    <d-simple-tooltip :tooltip="internalAttribute.title" tag="div">
      <div
        :class="textClassList"
      >
        {{ internalAttribute.shortTitle }}
      </div>
    </d-simple-tooltip>
    <d-simple-tooltip :tooltip="valueOption.title">
      <v-avatar
        class="d-flex white--text font-weight-medium justify-center align-center"
        :class="!small ? 'text-body-1' : 'text-caption'"
        :color="!small ? 'primary' : 'grey'"
        :size="!small ? 32 : 18"
      >
        <span>
          {{ internalAttribute.valueOptions.indexOf(valueOption) + 1 }}
        </span>
      </v-avatar>
    </d-simple-tooltip>
  </div>
</template>

<script>
  import { commonRead } from '@/components/Attributes/mixins';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'AttributesStepperRead',
    components: { DSimpleTooltip },
    mixins: [commonRead],
    computed: {
      valueOption() {
        return this.internalAttribute.valueOptions.find(({ value }) => value === this.internalValue);
      },

      textClassList() {
        return {
          'text-h6': !this.small,
          'text-overline': this.small,

          'mr-2': !this.small,
          'mr-1': this.small
        }
      }
    }
  };
</script>
