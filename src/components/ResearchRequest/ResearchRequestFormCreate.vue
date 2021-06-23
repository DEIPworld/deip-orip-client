<template>
  <full-screen-view :title="$t('defaultNaming.forms.researchRequest.start')">
    <research-request-form-view
      v-model="formData"
      :disabled="formProcessing"
      :loading="formProcessing"
      @submit="createResearchApplication"
    />
  </full-screen-view>
</template>

<script>
  import ResearchRequestFormView from '@/components/ResearchRequest/ResearchRequestFormView';
  import { ResearchRequestModelMixin } from '@/components/ResearchRequest/ResearchRequestModelMixin';
  import { ProjectService } from '@deip/project-service';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  const projectService = ProjectService.getInstance();

  export default {
    name: 'ResearchRequestFormCreate',
    components: {
      FullScreenView,
      ResearchRequestFormView
    },
    mixins: [ResearchRequestModelMixin],

    methods: {
      createResearchApplication(success) {
        if (!success) return;

        this.formProcessing = true;

        const formData = this.createFormData(this.formData);

        const researcher = this.user.username;
        const researcherPrivKey = this.user.privKey;
        const researcherPubKey = this.user.account.active.key_auths[0][0];
        const tenantAccount = this.$tenant.account.external_id;

        formData.append('researcher', researcher); // the current user
        formData.append('researcherPubKey', researcherPubKey); // the current user's pubKey
        formData.append('tenant', tenantAccount); // tenant account

        formData.append('researchAbstract', '');
        formData.append('researchIsPrivate', false);

        formData.append('researchGroupFee', this.toAssetUnits(0));
        formData.append('researchGroupName', `${this.formData.researchTitle} team`);
        formData.append('researchGroupDescription', '');

        projectService.createProjectApplication(researcherPrivKey, formData)
          .then(({ rm }) => {
            this.$notifier.showSuccess(this.$t('defaultNaming.forms.researchRequest.successReq'));
            return projectService.getProject(rm._id);
          })
          .then((research) => {
            if (research) { // if proposal
              this.$router.push({
                name: 'project.details',
                params: {
                  projectId: research.external_id
                }
              });
            } else {
              this.$router.push({ name: 'explore' });
            }
          })
          .catch((err) => {
            this.formProcessing = false;
            console.error(err);
            this.$notifier.showError(this.$t('defaultNaming.forms.researchRequest.errReq'));
          });
      }
    }
  };
</script>
