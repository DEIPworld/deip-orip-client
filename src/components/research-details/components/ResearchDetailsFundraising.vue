<template>
  <v-row v-if="isTokenSaleSectionAvailable" no-gutters class="mb-12">
    <v-col cols="12" lg="7">
      <v-row no-gutters>
        <v-col cols="auto" class="pr-4">
          <v-icon large color="grey lighten-2">
            mdi-cash-usd-outline
          </v-icon>
        </v-col>
        <v-col class="rd-block-header align-self-center">
          Fundraising
        </v-col>
      </v-row>

      <div v-if="isMissingTokenSale && isResearchGroupMember && research" class="pt-4">
        <v-btn
          outlined
          color="primary"
          class="ma-0"
          :to="{
            name: 'CreateTokenSale',
            params: {
              research_group_permlink: research.research_group.permlink,
              research_permlink: research.permlink
            }
          }"
        >
          Start fundraise
        </v-btn>
      </div>

      <div v-if="isActiveTokenSale || isInactiveTokenSale">
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            Start:
          </v-col>
          <v-col cols="12" lg="9" class="pl-2">
            <span>{{ tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true) }}</span>
            <v-chip
              v-if="hasInactiveTokenSale"
              class="my-0 mx-2 caption"
              style="height: 1.4em"
              color="primary lighten-3"
            >
              {{ tokenSaleStartLeft }} left
            </v-chip>
          </v-col>
        </v-row>
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            End:
          </v-col>
          <v-col cols="12" lg="9" class="pl-2">
            <span>{{ tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true) }}</span>
            <v-chip
              v-if="hasActiveTokenSale"
              class="my-0 mx-2 caption"
              style="height: 1.4em"
              color="amber lighten-1"
            >
              {{ tokenSaleEndLeft }} left
            </v-chip>
          </v-col>
        </v-row>
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            Percentage On sale:
          </v-col>
          <v-col
            cols="12"
            lg="9"
            class="pl-2"
          >
            {{ convertToPercent(tokenSale.balance_tokens) }}%
          </v-col>
        </v-row>
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            Remaining Percentage:
          </v-col>
          <v-col
            cols="12"
            lg="9"
            class="pl-2"
          >
            {{ convertToPercent(research.owned_tokens) }}%
          </v-col>
        </v-row>
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            Min Goal:
          </v-col>
          <v-col cols="12" lg="9" class="pl-2">
<!--            ${{ fromAssetsToFloat(tokenSale.soft_cap) }}-->
            {{tokenSale.soft_cap}}
          </v-col>
        </v-row>
        <v-row no-gutters class="pt-4">
          <v-col cols="12" lg="3" class="bold">
            Max Goal:
          </v-col>
          <v-col cols="12" lg="9" class="pl-2">
<!--            ${{ fromAssetsToFloat(tokenSale.hard_cap) }}-->
            {{tokenSale.hard_cap}}
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col v-if="isActiveTokenSale" cols="12" lg="5">
      <v-row no-gutters justify="end" class="rd-cap-value">
        {{ currentCap }} {{ tokenSale.soft_cap.split(' ')[1] }}
      </v-row>
      <v-row
        no-gutters
        justify="end"
        align="center"
        class="py-2"
      >
        <div
          v-if="currentCap >= fromAssetsToFloat(tokenSale.soft_cap)"
          class="rd-cap-chip"
        >
          Min goal reached!
        </div>
        <div class="pl-6">
<!--          Raised of ${{ fromAssetsToFloat(tokenSale.hard_cap) }} Goal-->
          Raised of {{ tokenSale.hard_cap }} Goal
        </div>
      </v-row>
      <v-row no-gutters align="center" class="py-2">
        <v-col cols="auto" class="rd-cap-progress-bound mr-2">
          0
        </v-col>
        <v-col cols="auto" class="rd-cap-progress-bar grow">
          <div class="progress-line" />
          <div class="progress-current" :style="{ width: `${currentCapPercent}%` }" />
        </v-col>
        <v-col cols="auto" class="rd-cap-progress-bound ml-2">
          {{ fromAssetsToFloat(tokenSale.hard_cap) }}
        </v-col>
      </v-row>

      <div v-if="isActiveTokenSale && !isResearchGroupMember">
        <v-form ref="amountToContributeForm">
          <v-row no-gutters justify="end" class="pt-2">
            <v-text-field
              ref="amountToContribute"
              v-model="amountToContribute"
              placeholder="Amount"
              outlined
              :suffix="tokenSale.soft_cap.split(' ')[1]"
              :rules="[rules.required, deipTokenValidator]"
              :disabled="areTokensBuying"
            />
          </v-row>
          <v-row no-gutters justify="end" class="pt-2">
            <v-btn
              :loading="areTokensBuying"
              color="primary"
              block
              @click="onContributeToTokenSaleClick()"
            >
              Invest
            </v-btn>
          </v-row>
        </v-form>
        <v-dialog v-model="investmentConfirmDialog.isShown" persistent max-width="800px">
          <v-card class="pa-6">
            <v-card-title>
              <div class="text-h5 font-weight-bold">
                SAFT (Simple Agreement for Future Tokens)
              </div>
              <div class="right-top-angle">
                <v-btn icon class="pa-0 ma-0" @click="disagreeSaft()">
                  <v-icon color="black">
                    close
                  </v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text style="height: 50vh">
              <iframe
                height="100%"
                width="100%"
                src="/assets/img/form-of-SAFT-for-token-pre-sale.pdf"
              />
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-row no-gutters>
                <v-col class="py-2" cols="12">
                  <v-btn block color="primary" @click="agreeSaft()">
                    Agree
                  </v-btn>
                </v-col>
                <v-col class="py-2" cols="12">
                  <v-btn
                    color="primary"
                    block
                    text
                    @click="disagreeSaft()"
                  >
                    Disagree
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchDetailsFundraising',

    data() {
      return {
        rules: {
          required: (value) => !!value || 'This field is required'
        },
        amountToContribute: '',
        areTokensBuying: false,
        investmentConfirmDialog: {
          isShown: false,
          isConfirming: false
        }
      };
    },
    computed: {
      ...mapGetters({
        tokenSale: 'rd/tokenSale',
        research: 'rd/research',
        userBalances: 'auth/userBalances',
        user: 'auth/user',
        assets: 'auth/assets',
        contributionsList: 'rd/contributionsList'
      }),
      isActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },
      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 4;
      },
      tokenSaleStartLeft() {
        if (!this.tokenSale) return null;

        const now = moment.utc().local();
        const start = moment.utc(this.tokenSale.start_time).local();

        const months = Math.floor(moment.duration(start.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        const days = Math.floor(moment.duration(start.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        const hours = Math.floor(moment.duration(start.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        const minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        const seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
        return `${seconds} secs`;
      },
      tokenSaleEndLeft() {
        if (!this.tokenSale) return null;

        const now = moment.utc().local();
        const end = moment.utc(this.tokenSale.end_time).local();

        const months = Math.floor(moment.duration(end.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        const days = Math.floor(moment.duration(end.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        const hours = Math.floor(moment.duration(end.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        const minutes = Math.floor(moment.duration(end.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        const seconds = Math.floor(moment.duration(end.diff(now)).asSeconds());
        return `${seconds} secs`;
      },
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 1;
      },
      isInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 4;
      },
      isMissingTokenSale() {
        return this.tokenSale === undefined;
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      },
      currentCap() {
        return this.contributionsList
          .map((c) => this.fromAssetsToFloat(c.amount))
          .reduce((acc, val) => acc + val, 0);
      },
      currentCapPercent() {
        return this.tokenSale
          ? (this.currentCap * 100)
            / this.fromAssetsToFloat(this.tokenSale.hard_cap)
          : 0;
      },
      isContributionToTokenSaleDisabled() {
        const balance = this.fromAssetsToFloat(
          this.userBalances[window.env.ASSET_UNIT]
        );
        const notEnoughFunds = (this.amountToContribute || 0) > balance;
        return notEnoughFunds || !this.amountToContribute || this.areTokensBuying;
      },
      isFinishedResearch() {
        return this.research && this.research.is_finished;
      },
      isTokenSaleSectionAvailable() {
        return (
          (this.isMissingTokenSale
          && this.isResearchGroupMember
          && !this.isFinishedResearch)
          || this.isActiveTokenSale
          || this.isInactiveTokenSale
        );
      }
    },
    methods: {
      onContributeToTokenSaleClick() {
        if (!this.$refs.amountToContributeForm.validate()) return;
        this.investmentConfirmDialog.isShown = true;
      },
      contributeToTokenSale() {
        this.areTokensBuying = true;

        researchService.contributeToResearchTokenSaleViaOffchain(this.user.privKey, {
          researchExternalId: this.research.external_id,
          contributor: this.user.username,
          amount: this.toAssetUnits(this.amountToContribute),
          extensions: []
        })
          .then((data) => {
            this.$store.dispatch('rd/loadResearchTokenSale', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadResearchTokenSales', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadResearchTokenHolders', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadUserContributions', {
              researchId: this.research.id
            });
            this.$store.dispatch('auth/loadAccount');
            this.$store.dispatch('auth/loadBalances');

            this.areTokensBuying = false;
            this.$refs.amountToContribute.reset();
            this.amountToContribute = '';

            this.$notifier.showSuccess(`You have contributed to "${this.research.title}" fundraise successfully !`)
          })
          .catch((err) => {
            console.error(err);
            this.areTokensBuying = false;
            this.$notifier.showError(`An error occurred while contributing to fundraise, please try again later`)
          });
      },
      agreeSaft() {
        this.investmentConfirmDialog.isShown = false;
        setTimeout(() => {
          this.contributeToTokenSale();
        }, 100);
      },

      disagreeSaft() {
        this.investmentConfirmDialog.isShown = false;
      }
    }
  };
</script>

<style lang="less" scoped>
.rd-block-header {
  font-family: Muli;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.25px;
  color: black;
}

.rd-cap-chip {
  padding: 4px 16px;
  background-color: #00d57c;
  border-radius: 20px;
  color: white;
  font-family: Roboto;
  font-weight: 500;
  font-size: 14px;
}

.rd-cap-value {
  font-family: Muli;
  font-weight: 900;
  font-size: 36px;
  color: #000000;
}

.rd-cap-progress-bound {
  font-family: Roboto;
  font-size: 14px;
  color: #9e9e9e;
}

.rd-cap-progress-bar {
  height: 4px;
  min-width: 250px;
  position: relative;

  .progress-line {
    height: inherit;
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    position: absolute;
    z-index: 1;

    &:after {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
      content: "";
      background-color: inherit;
      position: absolute;
      top: calc(-50% - 1px);
      right: 0;
    }
  }

  .progress-current {
    height: inherit;
    min-width: 10px;
    position: absolute;
    background: linear-gradient(
      90deg,
      #ef01e5 0%,
      #8901ef 17.91%,
      #2962ff 43.25%,
      #57d8f5 74.02%,
      #60e5ad 98.85%
    );
    border-radius: 4px;
    z-index: 2;

    &:after {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
      content: "";
      background-color: #60e5ad;
      position: absolute;
      top: calc(-50% - 1px);
      right: 0;
    }
  }
}

.btn {
  &--gradient-pb {
    background: linear-gradient(165.53deg, #8900ef -32.44%, #4efef6 118.73%);
    box-shadow: 1px 2px 6px rgba(68, 85, 129, 0.15);
    border-radius: 2px;

    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
