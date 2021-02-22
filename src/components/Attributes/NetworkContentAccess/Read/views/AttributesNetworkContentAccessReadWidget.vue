<template>
  <d-block-widget
    v-if="!hideForInternals"
    :title="title"
  >

    <template v-if="accessGranted">
      <div class="d-flex text-body-2 align-center">
        <v-icon class="mr-2">
          mdi-lock-open-outline
        </v-icon>
        Access granted
      </div>
    </template>

    <template v-else>
      <v-btn
        outlined
        block
        color="primary"
        small
        @click="isOpen = !isOpen"
      >
        Get access
      </v-btn>

      <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
        <vex-dialog
          v-model="isOpen"
          title="Send request"

          :true-disabled="!dialogModel.agree || invalid"
          :disabled="processing"
          :loading="processing"

          @click:confirm="handleSubmit(sendRequest)"
        >
          <d-stack>
            <div class="text-body-2">
              <span class="font-weight-medium">Access to technology:</span>
              {{ project.title }}
            </div>
            <validation-provider
              v-slot="{ errors }"
              name="Request expiration"
              vid="RequestExpiration"
              rules="required"
            >
              <d-date-time-input
                v-model="dialogModel.endTime"
                :error-messages="errors"
                label="Request expiration date"
                only-future
              />
            </validation-provider>

            <div>
              <v-checkbox
                v-model="dialogModel.agree"
                class="ma-0"
                hide-details="true"
                label="I agree to the Terms and Conditions listed below"
              />
              <a
                href="/assets/NDA.pdf"
                target="_blank"
                class="ml-8 text-caption text--secondary"
              >
                NDA.pdf</a>
            </div>

          </d-stack>
        </vex-dialog>
      </validation-observer>
    </template>
  </d-block-widget>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';

  import { projectContext } from '@/features/Projects/mixins/projectDetails';
  import { attributeRead } from '@/components/Attributes/_mixins';
  import { ATTR_TYPES } from '@/variables';

  import { ResearchNdaService } from '@deip/research-nda-service';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';

  const researchNdaService = ResearchNdaService.getInstance();

  const dialogModel = () => ({
    endTime: null,
    agree: false
  });

  export default {
    name: 'AttributesNetworkContentAccessReadWidget',

    components: {
      DBlockWidget,
      DDateTimeInput,
      DStack
    },

    mixins: [projectContext, attributeRead],

    props: {
      title: {
        type: String,
        default: 'Content access'
      }
    },

    data() {
      return {
        ATTR_TYPES,
        isOpen: false,
        processing: false,
        dialogModel: dialogModel()
      };
    },

    computed: {
      projectHasLicense() {
        return this.$$ifAttributesByType(ATTR_TYPES.EXPRESS_LICENSING);
      },

      accessGranted() {
        return this.project.researchRef.grantedAccess
          .some((entry) => [
            this.$currentUser.username,
            ...this.$currentUser.teams.map((g) => g.external_id)
          ].includes(entry));
      },

      hideForInternals() {
        return this.$$isProjectMember || (this.$$isTenantUser && !this.projectHasLicense);
      }
    },

    methods: {
      closeDialog() {
        this.isOpen = false;
        this.dialogModel = dialogModel();
      },
      sendRequest() {
        this.processing = true;

        const parties = this.$tenant.id === this.project.tenantId
          ? [
            this.$currentUser.username,
            this.project.researchGroup.external_id
          ]
          : [
            this.$currentUser.username,
            this.project.researchGroup.external_id,
            this.$tenant.id,
            this.project.tenantId
          ];

        const creator = this.$currentUser.username;
        return researchNdaService.createResearchNda({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          creator,
          parties,
          description: '7ec7e331d6a8c9ac68516b4c70bd0ae77e78cc2de3d6472387369478a79c8dac',
          researchExternalId: this.project.externalId,
          startTime: undefined,
          endTime: this.dialogModel.endTime,
          extensions: [],
          approvers: this.$tenant.id === this.project.tenantId ? [creator] : [creator, this.$tenant.id]
        })
          .then(() => {
            this.closeDialog();
            this.$notifier.showSuccess('Request has been sent successfully!');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => {
            this.processing = false;
          });
      }
    }
  };
</script>
