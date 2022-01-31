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
          @close="clearDialogData()"
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
  import { ProjectNdaService } from '@deip/project-nda-service';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DDateTimeInput from '@/components/Deipify/DInput/DDateTimeInput';

  import { projectContext } from '@/features/Projects/mixins/projectDetails';
  import { attributeRead } from '@/components/Attributes/_mixins';
  import { ATTR_TYPES } from '@/variables';

  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';

  const projectNdaService = ProjectNdaService.getInstance();

  const dialogModel = () => ({
    endTime: '',
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
        return this.$$ifAttributesByType(ATTR_TYPES.EXPRESS_LICENSING || 'expressLicensing');
      },

      accessGranted() {
        return this.project.grantedAccess
          .some((entry) => [
            this.$currentUser.username,
            ...this.$currentUser.teams.map((g) => g._id)
          ].includes(entry));
      },

      hideForInternals() {
        return this.$$isProjectMember || (this.$$isPortalUser && !this.projectHasLicense);
      }
    },

    methods: {
      clearDialogData() {
        this.dialogModel = { ...dialogModel() };
        this.$refs.observer.reset();
      },
      closeDialog() {
        this.isOpen = false;
      },
      sendRequest() {
        this.processing = true;

        const parties = this.$portal.id === this.project.portalId
          ? [
            this.$currentUser.username,
            this.project.teamId
          ]
          : [
            this.$currentUser.username,
            this.project.teamId,
            this.$portal.id,
            this.project.portalId
          ];

        // TODO: Use ContractAgreement instead of NDA
        const creator = this.$currentUser.username;
        return projectNdaService.createProjectNda({
          initiator: {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          parties,
          description: '7559a289fa49afe62e4f37fe1c9097d3cb7834c98a2f42da5443242e8929a5d3',
          projectId: this.project._id,
          startTime: undefined,
          endTime: new Date(new Date().getTime() + 86400000 * 365 * 50).toISOString().split('.')[0], // 50 years
          requestEndTime: this.dialogModel.endTime,
          approvers: this.$portal.id === this.project.portalId
            ? [creator]
            : [creator, this.$portal.id]
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
