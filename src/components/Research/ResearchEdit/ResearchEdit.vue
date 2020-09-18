<template>
  <d-layout-full-screen :title="title">
    <d-form :disabled="processing" @submit="onSubmit">
      <d-stack>

        <attributes-set-iterator
          :attributes="$where($tenantSettings.researchAttributes, {isVisible: true})"
          area="researchForm"
        />

        <d-input-image
          :value="formData.image"
          :aspect-ratio="4"
          label="Header image"
        />

        <v-divider />

        <div class="d-flex justify-space-between align-center">
          <v-switch
            v-model="formData.is_private"
            label="Private project"
            hide-details="auto"
          />

          <d-stack horizontal :gap="8">
            <v-btn text color="primary">
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :disabled="processing || !isChanged"
            >
              Create project
            </v-btn>
          </d-stack>
        </div>
      </d-stack>
    </d-form>
    <pre>
      {{ formData.research }}
    </pre>
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
    compareModels
  } from '@/utils/helpers';

  import DInputImage from '@/components/Deipify/DInput/DInputImage';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { researchStore } from '@/components/Research/store';

  import AttributesSetIterator from '@/components/Attributes/AttributesSetIterator';
  import { researchAttributes } from '@/mixins/platformAttributes';

  const researchService = ResearchService.getInstance();
  const httpService = HttpService.getInstance();

  export default {
    name: 'ResearchEdit',
    components: {
      AttributesSetIterator,
      DInputImage,
      DForm,
      DLayoutFullScreen,
      DStack
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

          title: '',
          abstract: '',
          disciplines: [],
          research_group: '',
          is_private: false,

          researchRef: {
            attributes: {}
          },

          image: undefined
        },

        isPermlinkVerifyed: true,

        rules: {
          link: (value) => !value || this.isValidLink || 'Invalid http(s) link',
          titleLength: (value) => value.length <= maxTitleLength || `Title max length is ${maxTitleLength} symbols`,
          descriptionLength: (value) => value.length <= maxDescriptionLength || `Description max length is ${maxDescriptionLength} symbols`
        }
      };
    },
    computed: {
      ...mapGetters({
        userGroups: 'auth/userGroups',
        tenant: 'auth/tenant'
      }),

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      isProposal() {
        return this.formData.research_group !== this.userGroup.external_id;
      },

      isChanged() {
        return !compareModels(this.cachedFormData, this.formData);
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
                research_group: clone.research_group.external_id,
                researchRef: {
                  attributes: expandResearchAttributes(clone.researchRef.attributes)
                },
                // todo: check
                image: this.$options.filters.researchBackgroundSrc(clone.external_id),

                is_private: !this.isPublic,
                review_share: undefined,
                compensation_share: undefined,
                members: undefined
              }
            };

            this.formData = { ..._.cloneDeep(transformed) };
            this.cachedFormData = { ..._.cloneDeep(transformed) };
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
        return researchService
          .checkResearchExistenceByPermlink(
            this.formData.research_group,
            this.formData.title
          )
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            return exists;
          })
          .catch(() => {
            this.isPermlinkVerifyed = false;
          });
      },

      goToResearch(research) {
        if (research) { // if not proposal
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

      createResearch(exist) {
        if (exist) return false;

        const attributes = compactResearchAttributes(this.formData.researchRef.attributes);
        const chainFields = this.tenant.profile.settings.researchAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            let value = attributes[attr._id];
            acc[attr.blockchainFieldMeta.field] = value; 
            return acc;
          }, {});

        return researchService.createResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          { ...this.formData, ...chainFields },
          { attributes }
        )
          .then(({ rm }) => {
            this.$notifier.showSuccess(`Project "${this.formData.title}" has been created successfully`);
            return deipRpc.api.getResearchAsync(rm._id);
          })
          .then((research) => {
            this.goToResearch(research);
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while creating project, please try again later');
          });
      },

      updateResearchData() {

        const attributes = compactResearchAttributes(this.formData.researchRef.attributes);
        const chainFields = this.tenant.profile.settings.researchAttributes
          .filter((attr) => !!attr.blockchainFieldMeta)
          .reduce((acc, attr) => {
            let value = attributes[attr._id];
            acc[attr.blockchainFieldMeta.field] = value; 
            return acc;
          }, {});

        return researchService.updateResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          { ...this.formData, ...chainFields },
          { attributes }
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

      updateResearch(exist) {
        if (this.cachedFormData.title !== this.formData.title) {
          this.isPermlinkVerifyed = !exist;
        } else {
          this.isPermlinkVerifyed = true;
        }

        if (!exist) return false;

        return Promise.all([
          this.updateResearchData(),
          this.updateResearchImage()
        ])
          .then(() => {
            this.$notifier.showSuccess('Info has been change successfully!');
            this.goToResearch(true);
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
            .then((exist) => (this.$route.params.researchExternalId
              ? this.updateResearch(exist)
              : this.createResearch(exist)))
            .finally(() => {
              this.processing = false;
            });
        }
      }
    }
  };
</script>
