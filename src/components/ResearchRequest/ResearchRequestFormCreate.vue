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
  import { ResearchService } from '@deip/research-service';
  import deipRpc from '@deip/rpc-client';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  const researchService = ResearchService.getInstance();

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
        const researcherPubKey = this.user.account.memo_key;
        const tenantAccount = this.tenant.account.external_id;

        formData.append('researcher', researcher); // the current user
        formData.append('researcherPubKey', researcherPubKey); // the current user's pubKey
        formData.append('tenant', tenantAccount); // tenant account
        const applicationLifetime = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days
        formData.append('proposalExpirationTime', applicationLifetime);

        formData.append('researchAbstract', '');
        formData.append('researchIsPrivate', false);

        formData.append('researchGroupFee', this.toAssetUnits(0));
        formData.append('researchGroupName', `${this.formData.researchTitle} team`);
        formData.append('researchGroupDescription', '');

        researchService.createResearchApplicationViaOffchain(researcherPrivKey, formData)
          .then(({ rm }) => {
            this.$notifier.showSuccess(this.$t('defaultNaming.forms.researchRequest.successReq'));
            return deipRpc.api.getResearchAsync(rm._id);
          })
          .then((research) => {
            if (research) { // if proposal
              this.$router.push({
                name: 'research.details',
                params: {
                  research_permlink: research.external_id
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
