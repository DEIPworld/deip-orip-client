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
  import { mapGetters } from 'vuex';
  import CreateTokenSaleForm from './components/CreateTokenSaleForm';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'CreateTokenSale',
    components: { FullScreenView, CreateTokenSaleForm },
    mixins: [CreateTokenSaleMixin],

    computed: {
      ...mapGetters({
        assets: 'auth/assets'
      })
    },

    methods: {
      finish(success) {
        if (!success) return;
        this.formProcessing = true;

        const isProposal = !this.research.research_group.is_personal;
        const asset = this.assets.find((a) => a.id === this.formData.asset);

        researchService.createResearchTokenSaleViaOffchain(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.account.name },
          isProposal, {
            researchGroup: this.research.research_group.external_id,
            researchExternalId: this.research.external_id,
            startTime: this.formData.startDate.toISOString().split('.')[0],
            endTime: this.formData.endDate.toISOString().split('.')[0],
            share: `${((this.formData.amountToSell / this.DEIP_100_PERCENT) * 100).toFixed(2)} %`,
            softCap: this.toAssetUnits(this.formData.softCap, asset.precision, asset.string_symbol),
            hardCap: this.toAssetUnits(this.formData.hardCap, asset.precision, asset.string_symbol),
            extensions: []
          })
          .then(() => {
            this.isLoading = false;
            this.$notifier.showSuccess('Fundraise Proposal has been created successfully! Approve it to start the fundraise!');
          })
          .catch((err) => {
            this.isLoading = false;
            this.$notifier.showError('An error occurred while creating proposal, please try again later');
            console.error(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.$router.push({
                name: 'research.details',
                params: {
                  researchExternalId: this.research.external_id
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
