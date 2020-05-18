<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row>
      <v-stepper v-model="currentStep" alt-labels class="legacy-column full-width full-height stepper-page">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="currentStep > 1">
            <div class="uppercase">
              Research
            </div>
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="2" :complete="currentStep > 2">
            <div class="uppercase">
              Amount
            </div>
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="3" :complete="currentStep > 3">
            <div class="uppercase white-space-nowrap">
              Special conditions
            </div>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items class="legacy-col-grow">
          <v-stepper-content step="1">
            <div class="full-height">
              <direct-grant-pick-research
                :grant-info="grantInfo"
                @incStep="incStep"
              />
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="full-height">
              <direct-grant-amount
                :grant-info="grantInfo"
                :deip-token-balance="
                  user.account ? this.fromAssetsToFloat(user.account.balance) : 0
                "
                @incStep="incStep"
                @decStep="decStep"
              />
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div class="full-height">
              <direct-grant-conditions
                :grant-info="grantInfo"
                :is-loading="isLoading"
                @decStep="decStep"
                @finish="finish"
              />
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-row>
  </v-container>
</template>


<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'CreateDirectGrant',

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },

    data() {
      return {
        currentStep: 0,
        isLoading: false,

        grantInfo: {
          research: undefined,
          amount: '',
          startDate: undefined,
          endDate: undefined,
          description: ''
        }
      };
    },

    created() {
    },

    methods: {
      incStep() {
        this.currentStep++;
      },
      decStep() {
        this.currentStep--;
      },
      finish() {
        // this.isLoading = true;
      }
    }
  };
</script>

<style lang="less">
</style>
