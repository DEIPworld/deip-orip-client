<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout>
      <v-stepper v-model="currentStep" alt-labels class="legacy-column full-width full-height stepper-page">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="currentStep > 1">
            <div class="uppercase">Amount</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="2" :complete="currentStep > 2">
            <div class="uppercase white-space-nowrap">Start/End Date</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :complete="currentStep > 3">
            <div class="uppercase">Min/Max Amount</div>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items class="legacy-col-grow">
          <v-stepper-content step="1">
            <div v-if="research" class="full-height">
              <token-sale-amount
                @incStep="incStep"
                :research="research"
                :token-sale-info="tokenSaleInfo"
                :owned-amount="research.owned_tokens"
              ></token-sale-amount>
            </div>
            <v-layout v-else justify-center>
              <v-progress-circular
                indeterminate
                color="primary"
              />
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="full-height">
              <token-sale-period
                @incStep="incStep" @decStep="decStep"
                :token-sale-info="tokenSaleInfo"
              ></token-sale-period>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div v-if="research" class="full-height">
              <token-sale-caps
                @finish="finish" @decStep="decStep"
                :token-sale-info="tokenSaleInfo"
                :research="research"
                :isLoading="isLoading"
              ></token-sale-caps>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-layout>
  </v-container>
</template>


<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'CreateTokenSale',
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
        research: null,
        currentStep: 0,
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
      }
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
        // there is no way to pick time in date picker currently,
        // but Token Sale status is set to inactive initially until its start_time
        // const nowPlus2Minutes = new Date(Date.now() + (2 * 60 * 1000));

        researchGroupService.createTokenSaleProposal({
          groupId: this.research.research_group_id,
          researchId: this.research.id,
          startDate: this.tokenSaleInfo.startDate.toISOString().split('.')[0],
          endDate: this.tokenSaleInfo.endDate.toISOString().split('.')[0],
          amount: parseInt(this.tokenSaleInfo.amountToSell),
          softCap: this.toAssetUnits(this.tokenSaleInfo.softCap),
          hardCap: this.toAssetUnits(this.tokenSaleInfo.hardCap),
        }).then(() => {
          this.isLoading = false;

          this.$store.dispatch('layout/setSuccess', {
            message: 'Fundraise Proposal has been created successfully! Approve it to start the fundraise!'
          });
        }).catch(err => {
          this.isLoading = false;
          this.$store.dispatch('layout/setError', {
            message: 'An error occurred while creating proposal, please try again later'
          });
          console.log(err)
        }).finally(() => {
          setTimeout(() => {
            this.$router.push({
              name: 'ResearchDetails', params: {
                group_permlink: this.research.group_permlink,
                research_permlink: this.research.permlink
              }
            });
          }, 1500);
        })
      }
    },

    created() {
      deipRpc.api.getResearchByAbsolutePermlinkAsync(
        decodeURIComponent(this.$route.params.research_group_permlink),
        decodeURIComponent(this.$route.params.research_permlink)
      )
        .then((research) => {
          this.group_permlink = this.$route.params.research_group_permlink;
          this.research = research;
        });
    }
  };
</script>

<style lang="less">
</style>
