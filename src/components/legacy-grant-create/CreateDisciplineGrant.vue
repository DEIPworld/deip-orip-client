<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row>
      <v-stepper v-model="currentStep" alt-labels class="legacy-column full-width full-height stepper-page">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="currentStep > 1">
            <div class="uppercase">
              Discipline
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
              <discipline-grant-pick-discipline
                :grant-info="grantInfo"
                @incStep="incStep"
              />
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="full-height">
              <discipline-grant-amount
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
              <discipline-grant-conditions
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
    name: 'CreateDisciplineGrant',

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
          discipline: undefined,
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
        const self = this;
        this.isLoading = true;

        deipRpc.api.getDynamicGlobalPropertiesAsync()
          .then((data) => {
            // counting approximate start block and end block for blockchain
            const BLOCK_CREATE_INTERVAL = 3; // 3 seconds

            const nowDateUnix = moment().unix();
            const startDateUnix = moment(this.grantInfo.startDate).unix();
            const endDateUnix = moment(this.grantInfo.endDate).unix();

            const startBlock = Math.floor((startDateUnix - nowDateUnix) / BLOCK_CREATE_INTERVAL) + data.last_irreversible_block_num;
            const endBlock = Math.floor((endDateUnix - nowDateUnix) / BLOCK_CREATE_INTERVAL) + data.last_irreversible_block_num;

            const isExtendable = true;
            const contentHash = this.grantInfo.description;

            deipRpc.broadcast.createGrantAsync(
              this.user.privKey,
              this.user.username,
              this.toAssetUnits(this.grantInfo.amount),
              this.grantInfo.discipline.label,
              startBlock,
              endBlock,
              isExtendable,
              contentHash
            ).then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: 'Grant has been created successfully!'
              });

              setTimeout(() => {
                self.$router.push({
                  name: 'ResearchFeed'
                });
              }, 1500);
            }).catch((err) => {
              this.$store.dispatch('layout/setError', {
                message: 'An error occurred while creating grant, please try again later'
              });
            }).finally(() => {
              this.isLoading = false;
            });
          });
      }
    }
  };
</script>

<style lang="less">
</style>
