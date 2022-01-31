<template>
  <d-layout-full-screen :title="title">
    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form v-if="$ready" :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
        <project-form-renderer
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
              {{ formModel._id ? 'Update' : 'Create' }}
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

  import ProjectFormRenderer from '@/features/Projects/components/Form/renderer';

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
    name: 'ProjectForm',

    components: {
      ValidationObserver,

      DStack,
      DLayoutFullScreen,

      ProjectFormRenderer
    },

    mixins: [changeable, attributesChore],

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
          attributes: {}
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

          if (this.enableDraft) {
            // store draft
          }
        }
      },

      layoutSchema() {
        return extendAttrModules(
          this.$portalSettings.layouts.projectEditForm.layout,
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
        return this.onchainData.team !== null
          && this.onchainData.team !== this.userGroup._id;
      },

      // FORMDATA

      filesAttrs() {
        return this.$where(
          this.$$projectAttributes,
          {
            type: [ATTR_TYPES.IMAGE || 'image']
          }
        )
          .map((attr) => attr._id);
      },

      attachedFiles() {
        return extractFilesFromAttributes(this.formModel.attributes);
      },

      onchainData() {
        const onchainFields = this.$$projectAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            const value = this.formModel.attributes[attr._id];

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
          attributes: compactAttributes(
            replaceFileWithName(this.formModel.attributes)
          )
        };
      },

      formData() {
        const formData = new FormData();

        const offchainMeta = _.cloneDeep(this.offchainMeta);
        const onchainData = _.cloneDeep(this.onchainData);

        if (!onchainData.team) {
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
        this.$ls.set('projectDraft', this.formModel, 1000 * 60 * 60);
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
