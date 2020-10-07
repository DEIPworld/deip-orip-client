<template>
  <d-layout-full-screen :title="title">
    <d-form :disabled="processing" @submit="onSubmit" v-if="$ready">

      <research-edit-renderer
        v-model="formData"
        :schema="layoutSchema"
        :attributes="attributes$"
      />

      <v-divider class="mt-8 mb-6" />
      <div class="d-flex justify-end align-center">
        <d-stack horizontal :gap="8">
          <v-btn text color="primary">
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="processing || !isChanged"
          >
            {{ formData.externalId ? 'Update' : 'Create' }}
          </v-btn>
        </d-stack>
      </div>
    </d-form>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchService } from '@deip/research-service';

  import DStack from '@/components/Deipify/DStack/DStack';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DForm from '@/components/Deipify/DForm/DForm';
  import { mapGetters } from 'vuex';
  import {
    compactResearchAttributes,
    camelizeObjectKeys,
    expandResearchAttributes,
    tenantAttributesToObject,
    isArray, hasValue, isFile,
    researchAttributeFileUrl
  } from '@/utils/helpers';
  import { debounce } from 'vuetify/lib/util/helpers';

  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  import { researchAttributes } from '@/mixins/platformAttributes';
  import ResearchEditRenderer from '@/components/Research/ResearchEdit/ResearchEditRenderer';
  import { ATTR_TYPES } from '@/variables';
  import { camelCase } from 'change-case'

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchEdit',
    components: {
      DStack,
      ResearchEditRenderer,
      DForm,
      DLayoutFullScreen
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

        cachedFormData: {},

        formData: {

          researchRef: {
            attributes: {}
          },

          image: undefined
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
        return this.$tenantSettings.researchLayouts.projectEditForm.layout;
      },

      attributes$() {
        return tenantAttributesToObject(this.$tenantSettings.researchAttributes);
      },

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      isProposal() {
        return this.transformedFormData.onchainData.researchGroup !== null
          && this.transformedFormData.onchainData.researchGroup !== this.userGroup.external_id;
      },

      isChanged() {
        return this.cachedFormData !== JSON.stringify(this.formData);
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

      formFiles() {
        return this.filesAttrs.map((id) => {
          const file = this.formData.researchRef.attributes[id];
          return isFile(file) ? [id, file, `${id}-${file.name}`] : null;
        })
          .filter((file) => !!file);
      },

      onchainData() {
        const onchainFields = this.$tenantSettings.researchAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            const value = this.formData.researchRef.attributes[attr._id];
            if (attr.blockchainFieldMeta.isPartial) {
              if (!value) return acc;
              acc[attr.blockchainFieldMeta.field] = acc[attr.blockchainFieldMeta.field]
                ? [...acc[attr.blockchainFieldMeta.field], ...(Array.isArray(value) ? value : [value])]
                : [...(isArray(value) ? value : [value])];
            } else {
              acc[attr.blockchainFieldMeta.field] = value || null;
            }
            return acc;
          }, {});

        return {
          ...this.formData,
          ...camelizeObjectKeys(onchainFields)
        };
      },

      offchainMeta() {
        const filesAttrs = this.filesAttrs.reduce((obj, attr) => ({
          ...obj,
          ...(isFile(this.formData.researchRef.attributes[attr])
            ? {
              [attr]: this.formData.researchRef.attributes[attr].name
            }
            : {}
          )
        }), {});

        return {
          attributes: compactResearchAttributes({
            ...this.formData.researchRef.attributes,
            ...filesAttrs
          })
            // .filter((attr) => hasValue(attr.value))
        };
      },

      transformedFormData() {
        return {
          filesData: this.formFiles,
          onchainData: this.onchainData,
          offchainMeta: this.offchainMeta
        };
      }
    },
    watch: {
      formData: {
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
                disciplines: clone.disciplines.map((d) => d.external_id),
                researchGroup: clone.researchGroup.external_id,
                researchRef: {
                  attributes: expandResearchAttributes(
                    clone.researchRef.attributes.map((attr) => ({
                      ...attr,
                      ...{
                        value: this.filesAttrs.includes(attr.researchAttributeId)
                          ? researchAttributeFileUrl(
                            this.$route.params.researchExternalId,
                            attr.researchAttributeId,
                            attr.value
                          )
                          : attr.value
                      }
                    }))
                  )
                }
              }
            };

            this.formData = { ..._.cloneDeep(transformed) };
            this.$setReady();

            this.$nextTick(() => {
              this.cachedFormData = JSON.stringify(this.formData);
            });
          });
      } else {
        this.$setReady();
      }
    },
    methods: {
      storeDraft() {
        this.$ls.set('researchDraft', this.formData, 1000 * 60 * 60);
      },
      readDraft() {},
      clearDraft() {},

      verifyPermlink() {
        if (this.transformedFormData.onchainData.researchGroup) {
          return researchService
            .checkResearchExistenceByPermlink(
              this.transformedFormData.onchainData.researchGroup,
              this.transformedFormData.onchainData.title
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
          this.$router.push({ name: 'ResearchFeed' });
        }
      },

      createResearch(exists) {
        if (exists) return false;

        const formData = new FormData();

        const { offchainMeta } = this.transformedFormData;
        const { onchainData } = this.transformedFormData;

        if (!onchainData.researchGroup) {
          onchainData.creator = this.$currentUser.account.name;
          onchainData.memo = this.$currentUser.account.memo_key;
          onchainData.fee = this.toAssetUnits(0);
        }

        formData.append('onchainData', JSON.stringify(onchainData));
        formData.append('offchainMeta', JSON.stringify(offchainMeta));

        for (const file of this.formFiles) {
          formData.append(...file);
        }

        return researchService.createResearchViaOffchain(
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          false,
          formData
        )
          .then((research) => {
            this.$notifier.showSuccess(`Project "${this.transformedFormData.onchainData.title}" has been created successfully`);
            this.goToResearch(research);
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating project, please try again later');
          });
      },

      updateResearch(exists) {
        // if (JSON.parse(this.cachedFormData).title !== this.transformedFormData.onchainData.title) {
        //   this.isPermlinkVerifyed = !exists;
        // } else {
        //   this.isPermlinkVerifyed = true;
        // }

        // if (exists) return false;

        const formData = new FormData();

        const { offchainMeta } = this.transformedFormData;
        const { onchainData } = this.transformedFormData;

        // console.log(this.formFiles)
        // return false;

        formData.append('onchainData', JSON.stringify(onchainData));
        formData.append('offchainMeta', JSON.stringify(offchainMeta));

        for (const file of this.formFiles) {
          formData.append(...file);
        }

        return researchService.updateResearchViaOffchain(
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.account.name
          },
          false,
          formData
        )
          .then((research) => {
            console.log(1)
            this.$notifier.showSuccess('Info has been change successfully!');
            this.goToResearch(research);
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred during change info');
            console.error(err);
          });
      },

      onSubmit(valid) {
        if (valid) {
          this.processing = true;

          this.verifyPermlink()
            .then((exists) => (this.$route.params.researchExternalId
              ? this.updateResearch(exists)
              : this.createResearch(exists)))
            .finally(() => {
              this.processing = false;
            });
        }
      }
    }
  };
</script>
