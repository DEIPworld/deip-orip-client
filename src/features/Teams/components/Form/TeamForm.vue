<template>
  <d-layout-full-screen :title="title">
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form v-if="$ready" :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
        <team-form-renderer
          v-model="formModel"
          :schema="layoutSchema"
        />
        <v-divider class="mt-8 mb-6" />
        <div class="d-flex justify-end align-center">
          <d-stack horizontal :gap="8">
            <v-btn
              text
              color="primary"
              :disabled="isLoading"
              @click="$router.back()"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              :disabled="isDisabled || invalid"
              :loading="isLoading"
            >
              {{ formModel.externalId ? 'Update' : 'Create' }}
            </v-btn>
          </d-stack>
        </div>
      </v-form>
    </validation-observer>
  </d-layout-full-screen>
</template>

<script>
  import { ValidationObserver } from 'vee-validate';

  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DStack from '@/components/Deipify/DStack/DStack';

  import TeamFormRenderer from '@/features/Teams/components/Form/renderer';

  import { changeable } from '@/mixins/changeable';

  import {
    camelizeObjectKeys,
    compactAttributes,
    extendAttrModules,
    extractFilesFromAttributes,
    isArray, replaceFileWithName, hasValue, expandAttributes
  } from '@/utils/helpers';

  import { attributesChore } from '@/mixins/chores/attributesChore';

  import { debounce } from 'vuetify/lib/util/helpers';

  import { mapGetters } from 'vuex';
  import { ATTR_TYPES } from '@/variables';

  export default {
    name: 'TeamForm',

    components: {
      ValidationObserver,

      DStack,
      DLayoutFullScreen,

      TeamFormRenderer
    },

    mixins: [changeable, attributesChore],

    props: {
      team: {
        type: Object,
        default: () => ({})
      },

      layoutSchema: {
        type: Array,
        default: () => ([])
      },

      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },

      title: {
        type: String,
        default: null
      },
      submitLabel: {
        type: String,
        default: 'Create'
      }
    },

    data() {
      return {
        lazyFormModel: {
          researchGroupRef: { attributes: {} }
        },

        storeDraftDebounce: undefined
      };
    },

    computed: {
      formModel: {
        get() {
          return this.lazyFormModel;
        },

        set(val) {
          this.lazyFormModel = val;
        }
      },

      // FORMDATA

      filesAttrs() {
        return this.$where(
          this.$$teamAttributes,
          {
            type: [ATTR_TYPES.IMAGE]
          }
        )
          .map((attr) => attr._id);
      },

      attachedFiles() {
        return extractFilesFromAttributes(this.formModel.researchGroupRef.attributes);
      },

      onchainData() {
        const onchainFields = this.$$teamAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            const value = this.formModel.researchGroupRef.attributes[attr._id];

            if (attr.blockchainFieldMeta.isPartial) {
              if (!value) return acc;
              acc[attr.blockchainFieldMeta.field] = acc[attr.blockchainFieldMeta.field]
                ? [...acc[attr.blockchainFieldMeta.field], ...(isArray(value) ? value : [value])]
                : [...(isArray(value) ? value : [value])];
            } else {
              acc[attr.blockchainFieldMeta.field] = attr.isMultiple
                ? isArray(value) ? value : [value]
                : isArray(value) ? (value[0] || attr.defaultValue) : (value || attr.defaultValue);
            }
            return acc;
          }, {});

        return {
          ...this.formModel,
          ...camelizeObjectKeys(onchainFields)
        };
      },

      offchainMeta() {
        return {
          attributes: compactAttributes(
            replaceFileWithName(this.formModel.researchGroupRef.attributes)
          )
        };
      },

      formData() {
        const formData = new FormData();

        const offchainMeta = _.cloneDeep(this.offchainMeta);
        const onchainData = _.cloneDeep(this.onchainData);

        if (!onchainData.researchGroup) {
          onchainData.creator = this.$currentUser.username;
          onchainData.memo = this.$currentUser.pubKey;
          onchainData.fee = this.toAssetUnits(0);
        }

        formData.append('onchainData', JSON.stringify(onchainData));
        formData.append('offchainMeta', JSON.stringify(offchainMeta));

        for (const file of this.attachedFiles) {
          formData.append(file[0], file[1]);
        }

        return formData;
      },

      // ======================================

      isLoading() {
        return this.loading;
      },

      isDisabled() {
        return this.isLoading
          || this.disabled
          || !this.$$isChanged(this.formModel);
      }
    },

    created() {
      if (hasValue(this.team)) {
        this.formModel = {
          ...this.formModel,
          ..._.cloneDeep(this.team)
        };
      } else {
        this.formModel = {
          ...this.formModel,
          members: [this.$currentUser]
        };
      }

      this.$setReady();
      this.$$storeCache(this.formModel);
    },

    methods: {
      onSubmit() {
        this.$emit('submit', this.formData);
      }
    }
  };
</script>
