<template>
  <d-stack>
    <div>
      {{internalValue}}
    </div>
    <v-checkbox
      v-model="active"
      :label="attribute.title"
    />

    <d-timeline>
      <d-timeline-item
        v-for="(license, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
      >
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="license.name"
              label="Set type"
              outlined
              hide-details="auto"
            />
          </v-col>

          <v-col cols="6">
            <d-asset-input
              v-model="license.fee"
              label="Set license issue fee"
            />
          </v-col>

          <v-col cols="12">
            <d-file-input
              v-model="license.file"
              label="Upload an agreement"
            />
          </v-col>
        </v-row>

        <template #action>
          <v-btn icon :disabled="!index" @click="removeFromModel(index)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </d-timeline-item>

      <d-timeline-add @click="appendModel()" />
    </d-timeline>
  </d-stack>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import { arrayModelAddFactory } from '@/mixins/extendModel';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';

  const licenseModel = () => ({
    name: undefined,
    fee: {},
    file: undefined
  });

  export default {
    name: 'AttributesExpressLicensingSet',
    components: {
      DAssetInput,
      DTimelineAdd,
      DFileInput,
      DTimelineItem,
      DTimeline,
      DStack
    },
    mixins: [arrayModelAddFactory(licenseModel()), attributeSet],
    data() {
      return {
        active: false,
        defaultValue: []
      };
    }
  };
</script>
