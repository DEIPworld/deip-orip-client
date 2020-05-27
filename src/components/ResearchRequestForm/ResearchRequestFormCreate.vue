<template>
  <full-screen-view title="Create research">
    <research-request-form-view
      v-model="formData"
      :disabled="formProcessing"
      :loading="formProcessing"
      :view-props="viewProps"
      @submit="createResearchApplication"
    />
  </full-screen-view>
</template>

<script>
  import ResearchRequestFormView from '@/components/ResearchRequestForm/ResearchRequestFormView';
  import { ResearchRequestModelMixin } from '@/components/ResearchRequestForm/ResearchRequestModelMixin';
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
      createResearchApplication() {
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
        formData.append('researchReviewShare', '0.00 %');
        formData.append('researchIsPrivate', false);
        //
        formData.append('researchGroupFee', `100.000 ${window.env.ASSET_UNIT}`);
        formData.append('researchGroupName', `${this.formData.researchTitle} team`);
        formData.append('researchGroupDescription', '');


        researchService.createResearchApplicationViaOffchain(researcherPrivKey, formData)
          .then(({ rm }) => {
            this.$store.dispatch('layout/setSuccess', {
              message: `Project "${this.formData.researchTitle}" has been created successfully`
            });
            return deipRpc.api.getResearchAsync(rm._id);
          })
          .then((research) => {
            if (research) { // if proposal
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(research.research_group.permlink),
                  research_permlink: encodeURIComponent(research.permlink)
                }
              });
            } else {
              this.$router.push({ name: 'ResearchFeed' });
            }
          })
          .catch((err) => {
            this.formProcessing = false;
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating project, please try again later'
            });
          });
      }
    }
  };
</script>
