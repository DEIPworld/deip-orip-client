<template>
  <d-layout-full-screen :title="title">
<!--        <pre>{{JSON.stringify(formData.researchRef.attributes[2], null, 2)}}</pre>-->
        <pre>{{JSON.stringify(transformedFormData.offchainMeta, null, 2)}}</pre>
<!--        <pre>{{JSON.stringify($tenantSettings.researchAttributes, null, 2)}}</pre>-->
    <d-form :disabled="processing" @submit="onSubmit">
      <research-edit-renderer
        v-model="formData"
        :schema="layoutSchema"
        :attributes="attributes$"
      />

      <!--      <d-input-image-->
      <!--        :value="formData.image"-->
      <!--        :aspect-ratio="4"-->
      <!--        label="Header image"-->
      <!--      />-->

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
            {{ formData.externalId ? 'Update research' : 'Create' }}
          </v-btn>
        </d-stack>
      </div>
    </d-form>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchService } from '@deip/research-service';
  import { HttpService } from '@deip/http-service';

  import DStack from '@/components/Deipify/DStack/DStack';
  import { maxDescriptionLength, maxTitleLength } from '@/variables';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DForm from '@/components/Deipify/DForm/DForm';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import {
    compactResearchAttributes,
    camelizeObjectKeys,
    expandResearchAttributes,
    compareModels, tenantAttributesToObject
  } from '@/utils/helpers';

  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  import { researchAttributes } from '@/mixins/platformAttributes';
  import ResearchEditRenderer from '@/components/Research/ResearchEdit/ResearchEditRenderer';

  const researchService = ResearchService.getInstance();
  const httpService = HttpService.getInstance();

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

        isPermlinkVerifyed: true
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
        return this.transformedFormData.data.researchGroup !== null
          && this.transformedFormData.data.researchGroup !== this.userGroup.external_id;
      },

      isChanged() {
        return this.cachedFormData !== JSON.stringify(this.formData);
      },

      transformedFormData() {
        const attributes = compactResearchAttributes(this.formData.researchRef.attributes);
        const chainFields = camelizeObjectKeys(this.  $tenantSettings.researchAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            const value = this.formData.researchRef.attributes[attr._id];
            if (attr.blockchainFieldMeta.isPartial) {
              if (!value) return acc;

              acc[attr.blockchainFieldMeta.field] = acc[attr.blockchainFieldMeta.field]
                ? [...acc[attr.blockchainFieldMeta.field], ...(Array.isArray(value) ? value : [value])]
                : [...(Array.isArray(value) ? value : [value])];

            } else {
              acc[attr.blockchainFieldMeta.field] = value || null;
            }
            return acc;
          }, {}));

        return {
          data: {
            ...this.formData,
            ...chainFields,
            // ...{
            //   researchGroup: this.formData.researchGroup // temp
            // }
          },
          offchainMeta: { attributes }
        };
      }
    },
    watch: {
      formData: {
        deep: true,
        handler() {
          this.storeDraft();
        }
      }
    },
    created() {
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
                  attributes: expandResearchAttributes(clone.researchRef.attributes)
                },
                // todo: check
                image: this.$options.filters.researchBackgroundSrc(clone.externalId)
              }
            };

            this.formData = { ..._.cloneDeep(transformed) };

            this.$nextTick(() => {
              this.cachedFormData = JSON.stringify(this.formData);
            })
          });
      }
    },
    methods: {
      storeDraft() {
        this.$ls.set('researchDraft', this.formData, 1000 * 60 * 60);
      },
      readDraft() {},
      clearDraft() {},

      verifyPermlink() {
        if (this.transformedFormData.data.researchGroup) {
          return researchService
            .checkResearchExistenceByPermlink(
              this.transformedFormData.data.researchGroup,
              this.transformedFormData.data.title
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

        const newResearchGroupMeta = this.transformedFormData.data.researchGroup === null ? {
          creator: this.$currentUser.account.name,
          memo: this.$currentUser.account.memo_key,
          fee: this.toAssetUnits(0)
        } : null;

        return researchService.createResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          { ...this.transformedFormData.data, newResearchGroupMeta },
          this.transformedFormData.offchainMeta
        )
          .then((research) => {
            this.$notifier.showSuccess(`Project "${this.transformedFormData.data.title}" has been created successfully`);
            this.goToResearch(research);
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating project, please try again later');
          });
      },

      updateResearchData() {
        return researchService.updateResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          this.transformedFormData.data,
          this.transformedFormData.offchainMeta
        );
      },

      updateResearchImage() {
        return httpService.post(
          `${this.$env.DEIP_SERVER_URL}/api/research/background`,
          {
            'research-background': ''
          }
        );
      },

      updateResearch(exists) {
        if (JSON.parse(this.cachedFormData).title !== this.transformedFormData.data.title) {
          this.isPermlinkVerifyed = !exists;
        } else {
          this.isPermlinkVerifyed = true;
        }

        if (exists) return false;

        return Promise.all([
          this.updateResearchData()
          // this.updateResearchImage()
        ])
          .then(([research]) => {
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
