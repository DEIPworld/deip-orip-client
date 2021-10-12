<template>
  <d-stack>
    <v-checkbox
      v-model="modelActive"

      :label="attribute.title"

      hide-details="auto"

      class="mt-0 pt-0"

      :disabled="!$$isEditable"
    />
    <d-timeline v-if="modelActive">
      <d-timeline-item
        v-for="(license, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
      >
        <v-row class="pb-4">
          <v-col cols="6">
            <validation-provider
              v-slot="{ errors }"
              name="Type"
              rules="required"
            >
              <v-text-field
                v-model="license.name"
                label="Set type"
                outlined
                hide-details="auto"
                :error-messages="errors"
                name="License name"
                autocomplete="off"
              />
            </validation-provider>
          </v-col>

          <v-col cols="6">
            <d-asset-input
              v-model="license.fee"
              label="Set license issue fee"
              required
            />
          </v-col>

          <v-col cols="12">
            <d-file-input-extended
              v-model="license.file"
              label="Upload an agreement"
              :url-builder="getFileUrl"
              required
            />
          </v-col>
        </v-row>

        <template #action>
          <v-btn icon :disabled="!index" @click="removeItem(license)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </d-timeline-item>

      <d-timeline-add @click="addItem()" />
    </d-timeline>
  </d-stack>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import { activatableArrayModelFactory } from '@/mixins/extendModel';

  import { attributesChore } from '@/mixins/chores/attributesChore';
  import { attributeFileUrl } from '@/utils/helpers';

  import DStack from '@/components/Deipify/DStack/DStack';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DAssetInput from '@/components/Deipify/DInput/DAssetInput';
  import DFileInputExtended from '@/components/Deipify/DInput/DFileInputExtended';

  import { extend, ValidationProvider } from 'vee-validate';
  import { required } from 'vee-validate/dist/rules';

  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  });

  const licenseModelFactory = () => ({
    name: undefined,
    fee: undefined,
    file: undefined
  });

  export default {
    name: 'AttributesExpressLicensingSetDefault',
    components: {
      DFileInputExtended,
      DAssetInput,
      DTimelineAdd,
      DTimelineItem,
      DTimeline,
      DStack,

      ValidationProvider
    },
    mixins: [attributeSet, activatableArrayModelFactory(licenseModelFactory), attributesChore],
    props: {
      project: {
        type: Object,
        default: () => ({})
      }
    },

    methods: {
      getFileUrl(file) {
        if (!file) return false;
        const attrInfo = this.$$getAttributeInfo(this.attribute._id);
        return attributeFileUrl(
          attrInfo.scope,
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
