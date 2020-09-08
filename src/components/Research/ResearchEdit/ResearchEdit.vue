<template>
  <d-layout-full-screen>
    <d-form :disabled="isLoading" @submit="createResearch">
      <d-stack :gap="32">
        <d-block title="Add title and description">
          <d-stack>
            <v-text-field
              v-model="formData.research.title"
              label="Title"
              outlined
              hide-details="auto"
              :rules="[rules.titleLength]"
              :error-messages="!isPermlinkVerifyed ? 'Research with the same name already exists' : ''"
            />

            <v-textarea
              v-model="formData.research.abstract"
              name="Description"
              label="Description"
              outlined
              :rules="[rules.descriptionLength]"
            />
          </d-stack>
        </d-block>

        <attributes-disciplines-set v-model="formData.research.disciplines" />

        <attributes-group-set v-model="formData.research.researchGroup" />

        <d-block title="Research attributes">
          <d-stack>
            <template
              v-for="(attr, index) of $where($tenantSettings.researchAttributes, {isVisible: true, isEditable: true})"
            >
              <attributes-set
                :key="`${index}-attr`"
                v-model="formData.offchainMeta.attributes[attr._id]"
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
            v-model="formData.offchainMeta.attributes[attr._id]"
            :attribute="attr._id"
          />
        </template>

        <d-stack>
          <v-divider />

          <div class="d-flex justify-space-between align-center">
            <v-switch
              v-model="formData.research.isPrivate"
              label="Private project"
              hide-details="auto"
            />

            <d-stack horizontal :gap="8">
              <v-btn text color="primary">
                Cancel
              </v-btn>
              <v-btn type="submit" color="primary">
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
  import DStack from '@/components/Deipify/DStack/DStack';
  import { ResearchService } from '@deip/research-service';
  import { maxDescriptionLength, maxTitleLength } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import AttributesDisciplinesSet from '@/components/Attributes/AttributesDisciplines/AttributesDisciplinesSet';
  import AttributesGroupSet from '@/components/Attributes/AttributesGroup/AttributesGroupSet';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import DForm from '@/components/Deipify/DForm/DForm';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchEdit',
    components: {
      DForm,
      DLayoutFullScreen,
      AttributesGroupSet,
      AttributesDisciplinesSet,
      AttributesSet,
      DBlock,
      DStack
    },
    props: {
      preset: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        isLoading: false,
        formData: {
          research: {
            title: '',
            abstract: '',
            disciplines: [],
            researchGroup: '',
            isPrivate: false,

            // not used
            // members: undefined,
            // reviewShare: undefined,
            // compensationShare: undefined,
            // extensions: []
          },
          offchainMeta: {
            attributes: {},

            // not used
            // videoSrc: '',
            // milestones: [],
            // partners: [],
          }
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
      }),

      userGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0]
      },

      stringFormData() {
        return JSON.stringify(this.formData)
      }
    },
    watch: {
      stringFormData(val, oldVal) {
          console.log('новое значение: %s, старое значение: %s', val, oldVal)
      }
    },
    methods: {
      verifyPermlink() {
        researchService
          .checkResearchExistenceByPermlink(
            this.formData.research.researchGroup.external_id,
            this.research.title
          )
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            if (this.isPermlinkVerifyed) {
              this.$emit('incStep');
            }
          })
          .catch(() => {
            this.isPermlinkVerifyed = false;
          });
      },

      createResearch(valid) {
        if (!valid) return;

        const isProposal = this.formData.research.researchGroup !== this.userGroup.external_id;
        const researchData = this.formData.research;
        const offchainMeta = {
          ...this.formData.offchainMeta,
          ...{
            attributes: []
          }
        };

        researchService.createResearchViaOffchain(
          this.$currentUser.privKey,
          isProposal,
          researchData,
          offchainMeta
        )
          .then(({ rm }) => {
            this.isLoading = false;
            this.$notifier.showSuccess(`Project "${this.research.title}" has been created successfully`);
            return deipRpc.api.getResearchAsync(rm._id);
          })
          .then((research) => {
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
          })
          .catch((err) => {
            console.error(err);
            this.isLoading = false;
            this.$notifier.showError('An error occurred while creating project, please try again later');
          });
      }
    }
  };
</script>
