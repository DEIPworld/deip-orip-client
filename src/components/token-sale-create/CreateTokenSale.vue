<template>
  <full-screen-view title="Create fundraising">
    <create-token-sale-form
      v-model="formData"
      :owned-amount="research.owned_tokens"
      :disabled="formProcessing"
      :loading="formProcessing"
      @submit="finish"
    />
  </full-screen-view>
</template>


<script>
  import { CreateTokenSaleMixin } from '@/components/token-sale-create/CreateTokenSaleMixin';
  import { ResearchService } from '@deip/research-service';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import CreateTokenSaleForm from './components/CreateTokenSaleForm';


  const researchService = ResearchService.getInstance();

  export default {
    name: 'CreateTokenSale',
    components: { FullScreenView, CreateTokenSaleForm },
    mixins: [CreateTokenSaleMixin],

    methods: {
      finish(success) {
        if (!success) return;
        this.formProcessing = true;

        const isProposal = !this.research.research_group.is_personal;
        researchService.createResearchTokenSaleViaOffchain(this.user.privKey, isProposal, {
          researchGroup: this.research.research_group.external_id,
          researchExternalId: this.research.external_id,
          startTime: this.formData.startDate.toISOString().split('.')[0],
          endTime: this.formData.endDate.toISOString().split('.')[0],
          share: `${(this.formData.amountToSell / this.DEIP_100_PERCENT) * 100}.00 %`,
          softCap: this.toAssetUnits(this.formData.softCap),
          hardCap: this.toAssetUnits(this.formData.hardCap),
          extensions: []
        })
          .then(() => {
            this.formProcessing = false;
            this.$store.dispatch('layout/setSuccess', {
              message: 'Fundraise Proposal has been created successfully! Approve it to start the fundraise!'
            });
          })
          .catch((err) => {
            this.formProcessing = false;
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating proposal, please try again later'
            });
            console.error(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  group_permlink: this.research.research_group.permlink,
                  research_permlink: this.research.permlink
                }
              });
            }, 1500);
          });
      }
    }
  };
</script>

<style lang="less">
</style>
