<template>
  <d-layout-full-screen>
    <d-form :disabled="processing" @submit="onSubmit">

      <d-input-image :value="formData.image" :aspect-ratio="4" />

      <d-stack :gap="32">
        <d-block title="Add title and description">
          <d-stack>
            <v-text-field
              v-model="formData.title"
              label="Title"
              outlined
              hide-details="auto"
              :rules="[rules.titleLength]"
              :error-messages="!isPermlinkVerifyed ? 'Research with the same name already exists' : ''"
            />

            <v-textarea
              v-model="formData.abstract"
              name="Description"
              label="Description"
              outlined
              :rules="[rules.descriptionLength]"
            />
          </d-stack>
        </d-block>

        <attributes-disciplines-set v-model="formData.disciplines" />

        <attributes-group-set v-model="formData.researchGroup" />

        <d-block title="Research attributes">
          <d-stack>
            <template
              v-for="(attr, index) of $where($tenantSettings.researchAttributes, {isVisible: true, isEditable: true})"
            >
              <attributes-set
                :key="`${index}-attr`"
                v-model="formData.researchRef.attributes[attr._id]"
                :attribute="attr._id"
              />
            </template>
          </d-stack>
        </d-block>

        <template
          v-for="(attr, index) of $where($tenantSettings.researchAttributes, {isVisible: true, isEditable: false})"
        >
          <attributes-set
            :key="`${index}-attr`"
            v-model="formData.researchRef.attributes[attr._id]"
            :attribute="attr._id"
          />
        </template>

        <d-stack>
          <v-divider />

          <div class="d-flex justify-space-between align-center">
            <v-switch
              v-model="formData.isPrivate"
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
      </d-stack>
    </d-form>
    <pre>
      {{ formData.research }}
    </pre>
  </d-layout-full-screen>
</template>

<script>
  import { ResearchService } from '@deip/research-service';
  import { HttpService } from '@deip/http-service'

  import DStack from '@/components/Deipify/DStack/DStack';
  import { maxDescriptionLength, maxTitleLength } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import AttributesDisciplinesSet from '@/components/Attributes/AttributesDisciplines/AttributesDisciplinesSet';
  import AttributesGroupSet from '@/components/Attributes/AttributesGroup/AttributesGroupSet';
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
  import { componentStoreFactory } from '@/mixins/registerStore';

  const researchService = ResearchService.getInstance();
  const httpService = HttpService.getInstance();

  export default {
    name: 'ResearchEdit',
    components: {
      DInputImage,
      DForm,
      DLayoutFullScreen,
      AttributesGroupSet,
      AttributesDisciplinesSet,
      AttributesSet,
      DBlock,
      DStack
    },
    mixins: [componentStoreFactory({}, '$route.props.researchExternalId')],
    props: {
      preset: {
        type: Object,
        default: () => ({})
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
          researchGroup: '',
          isPrivate: false,

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
        userGroups: 'auth/userGroups'
      }),

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      isProposal() {
        return this.formData.researchGroup !== this.userGroup.external_id;
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
          .dispatch('research/getResearch', this.$route.params.researchExternalId)
          .then(() => {
            const clone = camelizeObjectKeys(_.cloneDeep(this.$store.getters['research/data']));

            const transformed = {
              ...clone,
              ...{
                disciplines: clone.disciplines.map((d) => d.external_id),
                researchGroup: clone.researchGroup.external_id,
                researchRef: {
                  attributes: expandResearchAttributes(clone.researchRef.attributes)
                },

                image: this.$options.filters.researchBackgroundSrc(clone.externalId),

                isPrivate: !this.isPublic,
                reviewShare: undefined,
                compensationShare: undefined,
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
            this.formData.researchGroup,
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

        const researchRef = {
          ...this.formData.researchRef,
          ...{
            attributes: compactResearchAttributes(this.formData.researchRef.attributes)
          }
        };

        return researchService.createResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          this.formData,
          researchRef
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
        return researchService.updateResearchViaOffchain(
          this.$currentUser.privKey,
          this.isProposal,
          this.formData
        );
      },

      updateResearchRef() {
        return researchService.updateResearchOffchainMeta(
          this.formData.externalId,
          {
            ...this.formData.researchRef,
            ...{
              attributes: compactResearchAttributes(this.formData.researchRef.attributes)
            }
          }
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
          this.updateResearch(),
          this.updateResearchRef(),
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
