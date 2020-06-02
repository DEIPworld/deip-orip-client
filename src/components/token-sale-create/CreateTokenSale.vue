<template>
  <!-- <layout-section> -->
  <v-container fluid class="pa-0 full-height">
    <v-stepper v-model="currentStep" alt-labels class="full-height">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="uppercase">
            Amount
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="uppercase white-space-nowrap">
            Start/End Date
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="uppercase">
            Min/Max Amount
          </div>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items class="mx-auto" style="max-width:500px">
        <v-stepper-content step="1">
          <div v-if="research">
            <token-sale-amount
              :research="research"
              :token-sale-info="tokenSaleInfo"
              :owned-amount="research.owned_tokens"
              @incStep="incStep"
            />
          </div>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          />
        </v-stepper-content>

        <v-stepper-content step="2">
          <token-sale-period
            :token-sale-info="tokenSaleInfo"
            @incStep="incStep"
            @decStep="decStep"
          />
        </v-stepper-content>

        <v-stepper-content step="3">
          <div v-if="research" class="full-height">
            <token-sale-caps
              :token-sale-info="tokenSaleInfo"
              :research="research"
              :is-loading="isLoading"
              @finish="finish"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
  <!-- </layout-section> -->
</template>


<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  // import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchService } from '@deip/research-service';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  // const researchGroupService = ResearchGroupService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'CreateTokenSale',
    components: { LayoutSection },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
        research: null,
        currentStep: 1,
        research_permlink: '',
        research_group_permlink: '',
        tokenSaleInfo: {
          amountToSell: 1000,
          startDate: undefined,
          endDate: undefined,
          softCap: '',
          hardCap: ''
        },

        isLoading: false
      };
    },

    created() {
      deipRpc.api.getResearchByAbsolutePermlinkAsync(
        decodeURIComponent(this.$route.params.research_group_permlink),
        decodeURIComponent(this.$route.params.research_permlink)
      )
        .then((research) => {
          this.group_permlink = research.research_group.permlink;
          this.research = research;
        });
    },
    methods: {
      incStep() {
        if (this.currentStep < 3) {
          this.currentStep++;
        } else {
          this.currentStep = 1;
        }
      },
      decStep() {
        this.currentStep--;
      },
      finish() {
        this.isLoading = true;

        const isProposal = !this.research.research_group.is_personal;
        researchService.createResearchTokenSaleViaOffchain(this.user.privKey, isProposal, {
          researchGroup: this.research.research_group.external_id,
          researchExternalId: this.research.external_id,
          startTime: this.tokenSaleInfo.startDate.toISOString().split('.')[0],
          endTime: this.tokenSaleInfo.endDate.toISOString().split('.')[0],
          share: `${(this.tokenSaleInfo.amountToSell / this.DEIP_100_PERCENT) * 100}.00 %`,
          softCap: this.toAssetUnits(this.tokenSaleInfo.softCap),
          hardCap: this.toAssetUnits(this.tokenSaleInfo.hardCap),
          extensions: []
        })
          .then(() => {
            this.isLoading = false;
            this.$notifier.show('Fundraise Proposal has been created successfully! Approve it to start the fundraise!', 'success')
          })
          .catch((err) => {
            this.isLoading = false;
            this.$notifier.show('An error occurred while creating proposal, please try again later', 'error')
            console.log(err);
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
