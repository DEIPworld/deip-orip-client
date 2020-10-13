<template>
  <d-stack>
    <v-checkbox
      v-model="active"
      :label="attribute.title"
    />
    <d-timeline v-if="active">
      <d-timeline-item
        v-for="(license, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
      >
        <v-row class="pb-4">
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
            <d-file-input-extended
              v-model="license.file"
              label="Upload an agreemen"
              :url-builder="getFileUrl"
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
  import DStack from '@/components/Deipify/DStack/DStack';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import { arrayModelAddFactory } from '@/mixins/extendModel';
  import { hasValue, researchAttributeFileUrl } from '@/utils/helpers';
  import DFileInputExtended from '@/components/Deipify/DInput/DFileInputExtended';

  const licenseModel = () => ({
    name: '',
    fee: {},
    file: undefined
  });

  export default {
    name: 'AttributesExpressLicensingSet',
    components: {
      DFileInputExtended,
      DAssetInput,
      DTimelineAdd,
      DTimelineItem,
      DTimeline,
      DStack
    },
    mixins: [attributeSet, arrayModelAddFactory(licenseModel())],
    data() {
      return {
        active: false,

        files: {},
        fileNames: {},
      };
    },
    watch: {
      active(val) {
        if (!val) {
          this.internalValue = [];
          this.normalizeModel();
        }
      }
    },
    created() {
      if (hasValue(this.internalValue)) {
        this.active = true;
      }
    },
    methods: {
      getFileUrl(file) {
        if (!file) return false;

        return researchAttributeFileUrl(
          this.project.externalId,
          this.attribute._id,
          file,
          false,
          true
        );
      }
    }
  };
</script>
