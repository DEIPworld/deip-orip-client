<template>
  <d-layout-full-screen :title="title">
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form v-if="$ready" :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
        <research-form-renderer
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

  import ResearchFormRenderer from '@/features/Projects/components/Form/renderer';

  import { changeable } from '@/mixins/changeable';

  import {
    camelizeObjectKeys,
    compactResearchAttributes,
    extendAttrModules,
    extractFilesFromAttributes,
    isArray, replaceFileWithName, hasValue, expandResearchAttributes
  } from '@/utils/helpers';

  import { debounce } from 'vuetify/lib/util/helpers';

  import { mapGetters } from 'vuex';
  import { ATTR_TYPES } from '@/variables';

  export default {
    name: 'ProjectForm',

    components: {
      ValidationObserver,

      DStack,
      DLayoutFullScreen,

      ResearchFormRenderer
    },

    mixins: [changeable],

    props: {
      project: {
        type: Object,
        default: () => ({})
      },

      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      enableDraft: {
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
          researchRef: { attributes: {} }
        },

        storeDraftDebounce: undefined,

        isPermlinkVerifyed: true
      };
    },

    computed: {
      formModel: {
        get() {
          return this.lazyFormModel;
        },

        set(val) {
          this.lazyFormModel = val;

          if (this.enableDraft) {
            // store draft
          }
        }
      },

      layoutSchema() {
        return extendAttrModules(
          this.$tenantSettings.researchLayouts.projectEditForm.layout,
          { attrs: { project: this.formModel } }
        );
      },

      // TODO: change groups fetch

      ...mapGetters({
        userGroups: 'auth/userGroups'
      }),

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      isProposal() {
        return this.onchainData.researchGroup !== null
          && this.onchainData.researchGroup !== this.userGroup.external_id;
      },

      // FORMDATA

      filesAttrs() {
        return this.$where(
          this.$tenantSettings.researchAttributes,
          {
            type: [ATTR_TYPES.IMAGE]
          }
        )
          .map((attr) => attr._id);
      },

      attachedFiles() {
        return extractFilesFromAttributes(this.formModel.researchRef.attributes);
      },

      onchainData() {
        const onchainFields = this.$tenantSettings.researchAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            const value = this.formModel.researchRef.attributes[attr._id];

            if (attr.blockchainFieldMeta.isPartial) {
              if (!value) return acc;
              acc[attr.blockchainFieldMeta.field] = acc[attr.blockchainFieldMeta.field]
                ? [...acc[attr.blockchainFieldMeta.field], ...(isArray(value) ? value : [value])]
                : [...(isArray(value) ? value : [value])];
            } else {
              acc[attr.blockchainFieldMeta.field] = attr.isMultiple
                ? isArray(value) ? value : [value]
                : isArray(value) ? (value[0] || null) : (value || null);
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
          attributes: compactResearchAttributes(
            replaceFileWithName(this.formModel.researchRef.attributes)
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
          formData.append(...file);
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
      if (this.enableDrafts) {
        this.storeDraftDebounce = debounce(this.storeDraft, 1000);
      }

      if (hasValue(this.project)) {
        this.formModel = {
          ...this.formModel,
          ..._.cloneDeep(this.project)
        };
      }

      this.$setReady();
      this.$$storeCache(this.formModel);
    },

    methods: {

      // DRAFTS

      storeDraft() {
        this.$ls.set('researchDraft', this.formModel, 1000 * 60 * 60);
      },
      readDraft() {},
      clearDraft() {},

      //

      onSubmit() {
        this.$emit('submit', this.formData);
      }
    }
  };
</script>
