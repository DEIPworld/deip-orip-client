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
              v-model="files[index]"
              label="Upload an agreement"
              :exists-files="getFileUrl(fileNames[index])"
            />
            <a :href="getFileUrl(fileNames[index])">
              {{ fileNames[index] }}
            </a>
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
  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import { arrayModelAddFactory } from '@/mixins/extendModel';
  import { researchAttributeFileUrl } from '@/utils/helpers';

  const licenseModel = () => ({
    name: '',
    fee: {},
    file: null
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
    mixins: [attributeSet, arrayModelAddFactory(licenseModel())],
    data() {
      return {
        active: false,

        files: {},
        fileNames: {}
      };
    },
    watch: {
      active(val) {
        if (!val) {
          this.internalValue = [];
          this.normalizeModel();
        }
      },
      files: {
        deep: true,
        handler(files) {
          for (const [index, item] of this.internalValue.entries()) {
            this.internalValue[index].file = files[index] || this.fileNames[index] || null;
          }
          this.$emit('change', this.internalValue);
        }
      }
    },
    created() {
      if (this.internalValue) {
        for (const [index, item] of this.internalValue.entries()) {
          this.fileNames[index] = item.file;
        }

        this.active = true;
      }
    },
    methods: {
      getFileUrl(file) {
        if (!file) return false;

        return researchAttributeFileUrl(
          this.projectId,
          this.attribute._id,
          file,
          false,
          true
        );
      }
    }
  };
</script>
