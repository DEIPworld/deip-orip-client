<template>
  <d-layout-full-screen :title="title">
<!--    <pre>{{ JSON.stringify(offchainMeta, null, 2) }}</pre>-->
    <validation-observer v-slot="{ valid, handleSubmit }">
      <v-form v-if="$ready" :disabled="processing" @submit.prevent="handleSubmit(onSubmit)">
        <research-edit-renderer
          v-model="formModel"
          :schema="layoutSchema"
        />

        <v-divider class="mt-8 mb-6" />
        <div class="d-flex justify-end align-center">
          <d-stack horizontal :gap="8">
            <v-btn
              text
              color="primary"
              :disabled="processing"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :disabled="processing || !isChanged || !valid"
              :loading="processing"
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
  import { ResearchService } from '@deip/research-service';

  import DStack from '@/components/Deipify/DStack/DStack';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import { mapGetters } from 'vuex';
  import {
    compactResearchAttributes,
    camelizeObjectKeys,
    expandResearchAttributes,
    isArray,
    extendAttrModules,
    extractFilesFromAttributes,
    replaceFileWithName
  } from '@/utils/helpers';
  import { debounce } from 'vuetify/lib/util/helpers';

  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  import { researchAttributes } from '@/mixins/platformAttributes';
  import ResearchEditRenderer from '@/components/Research/ResearchEdit/ResearchEditRenderer';
  import { ATTR_TYPES } from '@/variables';

  import { ValidationObserver } from 'vee-validate';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchEdit',
    components: {
      DStack,
      ResearchEditRenderer,
      DLayoutFullScreen,

      ValidationObserver
    },
    mixins: [
      componentStoreFactoryOnce(researchStore, '$route.props.researchExternalId'),
      researchAttributes
    ],
    props: {
      preset: {
        type: Object,
        default: () => ({})
      },
      title: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        processing: false,

        cachedFormModel: {},

        formModel: {
          researchRef: {
            attributes: {}
          }
        },

        isPermlinkVerifyed: true,

        storeDraftDebounce: null
      };
    },
    computed: {
      ...mapGetters({
        userGroups: 'auth/userGroups'
      }),

      layoutSchema() {
        const schema = this.$tenantSettings.researchLayouts.projectEditForm.layout;

        if (this.$route.params.researchExternalId) {
          return extendAttrModules(
            schema,
            { attrs: { project: this.formModel } }
          );
        }

        return schema;
      },

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      isProposal() {
        return this.onchainData.researchGroup !== null
          && this.onchainData.researchGroup !== this.userGroup.external_id;
      },

      isChanged() {
        return this.cachedFormModel !== JSON.stringify(this.formModel);
      },

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

            // console.log(attr.title, attr._id, this.formModel.researchRef.attributes[attr._id])
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
          onchainData.creator = this.$currentUser.account.name;
          onchainData.memo = this.$currentUser.account.memo_key;
          onchainData.fee = this.toAssetUnits(0);
        }

        formData.append('onchainData', JSON.stringify(onchainData));
        formData.append('offchainMeta', JSON.stringify(offchainMeta));

        for (const file of this.attachedFiles) {
          formData.append(...file);
        }

        return formData;
      }
    },
    watch: {
      formModel: {
        deep: true,
        handler() {
          if (!this.$route.params.researchExternalId) {
            this.storeDraftDebounce();
          }
        }
      }
    },
    created() {
      if (!this.$route.params.researchExternalId) {
        this.storeDraftDebounce = debounce(this.storeDraft, 1000);
      }

      if (this.$route.params.researchExternalId) {
        this.$store
          .dispatch('Research/getResearchDetails', this.$route.params.researchExternalId)
          .then(() => {
            const clone = _.cloneDeep(this.$store.getters['Research/data']);
            const transformed = {
              ...clone,
              ...{
                // disciplines: clone.disciplines.map((d) => d.external_id),
                // researchGroup: clone.researchGroup.external_id,
                researchRef: {
                  attributes: expandResearchAttributes(clone.researchRef.attributes)
                }
              }
            };

            this.formModel = { ..._.cloneDeep(transformed) };
            this.$setReady();

            this.$nextTick(() => {
              this.cachedFormModel = JSON.stringify(this.formModel);
            });
          });
      } else {
        this.$setReady();
      }
    },
    methods: {
      storeDraft() {
        this.$ls.set('researchDraft', this.formModel, 1000 * 60 * 60);
      },
      readDraft() {},
      clearDraft() {},

      verifyPermlink() {
        if (this.onchainData.researchGroup) {
          return researchService
            .checkResearchExistenceByPermlink(
              this.onchainData.researchGroup,
              this.onchainData.title
            )
            .then((exists) => {
              this.isPermlinkVerifyed = !exists;
              return exists;
            })
            .catch(() => {
              this.isPermlinkVerifyed = false;
            });
        }

        return Promise.resolve(false)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            return exists;
          });
      },

      goToResearch(research) {
        if (research && research.external_id) { // if not proposal
          this.$router.push({
            name: 'research.details',
            params: {
              researchExternalId: research.external_id
            }
          });
        } else {
          this.$router.push({ name: 'explore' });
        }
      },

      createResearch(exists) {
        if (exists) return false;

        // return false;

        return researchService.createResearchViaOffchain(
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          false,
          this.formData
        )
          .then((research) => {
            this.$notifier.showSuccess(`Project "${this.onchainData.title}" has been created successfully`);
            this.goToResearch(research);
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating project, please try again later');
          });
      },

      updateResearch(exists) {
        // if (JSON.parse(this.cachedFormModel).title !== this.transformedFormData.onchainData.title) {
        //   this.isPermlinkVerifyed = !exists;
        // } else {
        //   this.isPermlinkVerifyed = true;
        // }

        // if (exists) return false;

        // console.log(this.formFiles)
        // console.log(offchainMeta)
        // return false;

        return researchService.updateResearchViaOffchain(
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          false,
          this.formData
        )
          .then((research) => {
            this.$notifier.showSuccess('Info has been change successfully!');
            this.goToResearch(research);
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred during change info');
            console.error(err);
          });
      },

      onSubmit(valid) {
        // if (valid) {
        this.processing = true;

        this.verifyPermlink()
          .then((exists) => (this.$route.params.researchExternalId
            ? this.updateResearch(exists)
            : this.createResearch(exists)))
          .finally(() => {
            this.processing = false;
          });
        // }
      }
    }
  };
</script>
