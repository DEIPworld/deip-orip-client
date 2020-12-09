<template>
  <full-screen-view v-if="$ready" title="Create fundraising">
    <create-token-sale-form
      v-model="formData"
      :security-token-on-sale="securityTokenOnSale ? securityTokenOnSale.external_id : ''"
      :security-token-on-sale-balance="securityTokenOnSaleBalance ? securityTokenOnSaleBalance : {}"
      :disabled="formProcessing"
      :loading="formProcessing"
      @submit="finish"
    />
  </full-screen-view>
</template>

<script>
  import { CreateTokenSaleMixin } from '@/components/token-sale-create/CreateTokenSaleMixin';
  import { ResearchService } from '@deip/research-service';
  import { InvestmentsService } from '@deip/investments-service';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';
  import { mapGetters } from 'vuex';
  import CreateTokenSaleForm from './components/CreateTokenSaleForm';

  const researchService = ResearchService.getInstance();
  const investmentsService = InvestmentsService.getInstance();

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

        investmentsService.createResearchTokenSale(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.account.name },
          isProposal,
          {
            researchGroup: this.research.research_group.external_id,
            researchExternalId: this.research.external_id,
            startTime: new Date(this.formData.startDate).toISOString().split('.')[0],
            endTime: new Date(this.formData.endDate).toISOString().split('.')[0],
            securityTokensOnSale: [this.formData.amountToSell],
            softCap: this.$$toAssetUnits(this.formData.softCap, false),
            hardCap: this.$$toAssetUnits(this.formData.hardCap, false),
            extensions: []
          }
        )
          .then(() => {
            this.isLoading = false;
            this.$notifier.showSuccess('Fundraise has been created successfully!');
          })
          .catch((err) => {
            this.isLoading = false;
            this.$notifier.showError('An error occurred while creating proposal, please try again later');
            console.error(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.$router.push({
                name: 'project.details',
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
