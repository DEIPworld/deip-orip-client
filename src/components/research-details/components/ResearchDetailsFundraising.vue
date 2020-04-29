<template>
  <v-layout row wrap v-if="isTokenSaleSectionAvailable" class="my-5">
    <v-flex xs12 lg7>
      <v-layout column>
        <v-layout row>
          <v-flex grow>
            <v-layout>
              <div class="pr-3">
                <v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon>
              </div>
              <div class="rd-block-header align-self-center">Fundraising</div>
            </v-layout>
          </v-flex>
          <v-flex shrink></v-flex>
        </v-layout>

        <div v-if="isActiveTokenSale || isInactiveTokenSale">
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">Start:</v-flex>
            <v-flex xs12 lg9 class="pl-2">
              <span>{{tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
              <v-chip
                v-if="hasInactiveTokenSale"
                class="my-0 mx-2 caption"
                style="height: 1.4em"
                color="primary lighten-3"
              >{{tokenSaleStartLeft}} left</v-chip>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">End:</v-flex>
            <v-flex xs12 lg9 class="pl-2">
              <span>{{tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
              <v-chip
                v-if="hasActiveTokenSale"
                class="my-0 mx-2 caption"
                style="height: 1.4em"
                color="amber lighten-1"
              >{{tokenSaleEndLeft}} left</v-chip>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">Tokens On sale:</v-flex>
            <v-flex
              xs12
              lg9
              class="pl-2"
            >{{tokenSale.balance_tokens}} ({{convertToPercent(tokenSale.balance_tokens)}}%)</v-flex>
          </v-layout>
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">Remaining Tokens:</v-flex>
            <v-flex
              xs12
              lg9
              class="pl-2"
            >{{research.owned_tokens}} ({{convertToPercent(research.owned_tokens)}}%)</v-flex>
          </v-layout>
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">Min:</v-flex>
            <v-flex xs12 lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.soft_cap)}}</v-flex>
          </v-layout>
          <v-layout row wrap class="pt-3">
            <v-flex xs12 lg3 class="bold">Max:</v-flex>
            <v-flex xs12 lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
          </v-layout>
        </div>

        <div v-if="isMissingTokenSale && isResearchGroupMember && research" class="pt-3">
          <v-btn
            round
            outline
            color="primary"
            class="ma-0"
            :to="{
                  name: 'CreateTokenSale',
                  params: { research_group_permlink: research.group_permlink, research_permlink: research.permlink }
                }"
          >Start fundraise</v-btn>
        </div>
      </v-layout>
    </v-flex>

    <v-flex xs12 lg5 v-if="isActiveTokenSale">
      <v-layout justify-end class="rd-cap-value">${{currentCap}}</v-layout>
      <v-layout justify-end align-center class="py-2">
        <div
          class="rd-cap-chip"
          v-if="currentCap >= fromAssetsToFloat(tokenSale.soft_cap)"
        >Min goal reached!</div>
        <div class="pl-4">Raised of ${{fromAssetsToFloat(tokenSale.hard_cap)}} Goal</div>
      </v-layout>
      <v-layout align-center justify-end class="py-2">
        <v-flex shrink class="rd-cap-progress-bound mr-2">0</v-flex>
        <v-flex grow class="rd-cap-progress-bar">
          <div class="progress-line" />
          <div class="progress-current" :style="{ width: `${currentCapPercent}%` }" />
        </v-flex>
        <v-flex shrink class="rd-cap-progress-bound ml-2">{{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
      </v-layout>

      <v-layout column v-if="isActiveTokenSale && !isResearchGroupMember">
        <!-- <v-layout justify-end class="pt-2">
          <v-text-field
            ref="amountToContribute"
            v-model="amountToContribute"
            placeholder="Amount"
            suffix="USD"
            :rules="[deipTokenValidator]"
            :disabled="investmentDialog.isInvesting"
          />
        </v-layout> -->
        <v-layout justify-end class="pt-2">
          <v-btn
            :loading="investmentDialog.isInvesting"
            :disabled="isContributionToTokenSaleDisabled"
            @click="onContributeToTokenSaleClick()"
            color="primary"
            block
          >Invest</v-btn>
        </v-layout>
        <v-dialog v-model="investmentConfirmDialog.isShown" persistent max-width="800px">
          <v-card class="pa-4">
            <v-card-title>
              <v-layout align-center>
                <v-flex grow headline font-weight-bold>SAFT (Simple Agreement for Future Tokens)</v-flex>
                <v-flex shrink right-top-angle>
                  <v-btn @click="disagreeSaft()" icon class="pa-0 ma-0">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text style="height: 50vh">
              <iframe
                height="100%"
                width="100%"
                src="/assets/img/form-of-SAFT-for-token-pre-sale.pdf"
              ></iframe>
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-layout row wrap>
                <v-flex xs12 py-2>
                  <v-btn block color="primary" @click="agreeSaft()">Agree</v-btn>
                </v-flex>
                <v-flex xs12 py-2>
                  <v-btn color="primary" block flat @click="disagreeSaft()">Disagree</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="investmentDialog.isOpened" persistent max-width="800px">
          <v-card class="pa-4">
            <v-card-title class="">
              <v-layout align-center>
                <v-flex subheading font-weight-bold grow>
                  Invest
                </v-flex>
                <v-flex shrink right-top-angle>
                  <v-btn @click="closeInvestmentDialog()" icon class="pa-0 ma-0">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-layout row wrap>
                <v-flex xs6 class="pr-5" style="border-right: 2px solid #E0E0E0">
                  <v-credit-card v-if="investmentDialog.isOpened" />
                </v-flex>
                <v-flex xs6>
                  <v-layout justify-end column fill-height class="pl-5 pr-3">
                    <div class="balance-form-input">
                      <label class="balance-form-input__label">Amount</label>
                      <input
                        class="balance-form-input__field"
                        type="text"
                        placehoder="Amount"
                        v-model="investmentDialog.amount"
                      />
                    </div>
                    <div class="my-3">
                      <v-checkbox
                        label="I confirm that I am qualified investor"
                        v-model="investmentDialog.termsConfirmed"
                        hide-details
                      ></v-checkbox>
                    </div>
                    <div class="my-3">
                      <v-btn @click="invest()" color="primary" block
                            :disabled="isInvestmentDisabled || investmentDialog.isInvesting"
                            :loading="investmentDialog.isInvesting">
                        Invest
                      </v-btn>
                    </div>
                    <div class="mb-4">
                      <v-btn
                        @click="closeInvestmentDialog()"
                        color="primary"
                        class="pa-0"
                        flat block
                        :disabled="investmentDialog.isInvesting"
                      >Cancel
                      </v-btn>
                    </div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-dialog>

      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import deipRpc from "@deip/rpc-client";

export default {
  name: "ResearchDetailsFundraising",

  data() {
    return {
      // amountToContribute: "",
      investmentConfirmDialog: {
        isShown: false,
        isConfirming: false
      },

      investmentDialog: {
        cardData: {
          name: '',
          cardNumber: '',
          expiration: '',
          security: ''
        },
        amount: 0,
        precision: 3,
        selectedCurrency: window.env.ASSET_UNIT,
        termsConfirmed: false,
        isOpened: false,
        isInvesting: false
      }

    };
  },
  computed: {
    ...mapGetters({
      tokenSale: "rd/tokenSale",
      research: "rd/research",
      userBalances: "auth/userBalances",
      user: "auth/user",
      contributionsList: "rd/contributionsList"
    }),
    isActiveTokenSale() {
      return this.tokenSale && this.tokenSale.status === 1;
    },
    hasInactiveTokenSale() {
      return this.tokenSale && this.tokenSale.status == 4;
    },
    tokenSaleStartLeft() {
      if (!this.tokenSale) return null;

      let now = moment.utc().local();
      let start = moment.utc(this.tokenSale.start_time).local();

      let months = Math.floor(moment.duration(start.diff(now)).asMonths());
      if (months > 1) return `${months} months`;

      let days = Math.floor(moment.duration(start.diff(now)).asDays());
      if (days > 1) return `${days} days`;

      let hours = Math.floor(moment.duration(start.diff(now)).asHours());
      if (hours > 1) return `${hours} hours`;

      let minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
      if (minutes > 1) return `${minutes} mins`;

      let seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
      return `${seconds} secs`;
    },
    tokenSaleEndLeft() {
      if (!this.tokenSale) return null;

      let now = moment.utc().local();
      let end = moment.utc(this.tokenSale.end_time).local();

      let months = Math.floor(moment.duration(end.diff(now)).asMonths());
      if (months > 1) return `${months} months`;

      let days = Math.floor(moment.duration(end.diff(now)).asDays());
      if (days > 1) return `${days} days`;

      let hours = Math.floor(moment.duration(end.diff(now)).asHours());
      if (hours > 1) return `${hours} hours`;

      let minutes = Math.floor(moment.duration(end.diff(now)).asMinutes());
      if (minutes > 1) return `${minutes} mins`;

      let seconds = Math.floor(moment.duration(end.diff(now)).asSeconds());
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
        ? this.$store.getters["auth/userIsResearchGroupMember"](
            this.research.research_group_id
          )
        : false;
    },
    currentCap() {
      return this.contributionsList
        .map(c => this.fromAssetsToFloat(c.amount))
        .reduce((acc, val) => acc + val, 0);
    },
    currentCapPercent() {
      return this.tokenSale
        ? (this.currentCap * 100) /
            this.fromAssetsToFloat(this.tokenSale.hard_cap)
        : 0;
    },
    isContributionToTokenSaleDisabled() {
      let balance = this.fromAssetsToFloat(this.userBalances[this.investmentDialog.selectedCurrency]);
      return !balance;
    },
    isFinishedResearch() {
      return this.research && this.research.is_finished;
    },
    isTokenSaleSectionAvailable() {
      return (
        (this.isMissingTokenSale &&
          this.isResearchGroupMember &&
          !this.isFinishedResearch) ||
        this.isActiveTokenSale ||
        this.isInactiveTokenSale
      );
    },

    isInvestmentDisabled() {
      // const isInvalidBankCard = !this.investmentDialog.cardData.name
      //   || !this.investmentDialog.cardData.cardNumber
      //   || this.investmentDialog.cardData.cardNumber.length < 19
      //   || !this.investmentDialog.cardData.expiration
      //   || !this.investmentDialog.cardData.security
      //   || this.investmentDialog.cardData.security < 3;

      // if (isInvalidBankCard) {
      //   return true;
      // }


      if (this.investmentDialog.amount && typeof this.investmentDialog.amount == "string" && this.investmentDialog.amount.indexOf("0") == 0) {
        return true;
      }

      if (isNaN(this.investmentDialog.amount)) {
        return true;
      }

      let balance = this.fromAssetsToFloat(this.userBalances[this.investmentDialog.selectedCurrency]);
      let notEnoughFunds = this.investmentDialog.amount > balance;
      if (notEnoughFunds) {
        return true;
      }
      
      if (!this.investmentDialog.termsConfirmed) {
        return true;
      }

      return !this.investmentDialog.amount;
    },

    // creditInfoChanged(values) {

    //   for (const key in values) {
    //     console.log(key, values[key])
    //     this.investmentDialog.cardData[key] = values[key];
    //   }
    // }

  },
  methods: {
    onContributeToTokenSaleClick() {
      this.investmentConfirmDialog.isShown = true;
    },
    contributeToTokenSale() {
      this.investmentDialog.isInvesting = true;
      let investment = this.toAssetUnits(
        parseInt(this.investmentDialog.amount), 
        this.investmentDialog.precision, 
        this.investmentDialog.selectedCurrency
      );
      return deipRpc.broadcast.contributeToTokenSaleAsync(
          this.user.privKey,
          this.tokenSale.id,
          this.user.username,
          investment
        )
        .then(data => {
          this.$store.dispatch("rd/loadResearchTokenSale", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadResearchTokenSales", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadResearchTokenHolders", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadUserContributions", {
            researchId: this.research.id
          });
          this.$store.dispatch("auth/loadAccount");
          this.$store.dispatch("auth/loadBalances");

          this.investmentDialog.isInvesting = false;
          // this.$refs.amountToContribute.reset();
          // this.amountToContribute = "";

          this.$store.dispatch("layout/setSuccess", {
            message: `You have contributed to "${this.research.title}" fundraise successfully !`
          });
        })
        .catch(err => {
          console.log(err);
          this.investmentDialog.isInvesting = false;
          this.$store.dispatch("layout/setError", {
            message:
              "An error occurred while contributing to fundraise, please try again later"
          });
        });
    },

    agreeSaft() {
      this.investmentConfirmDialog.isShown = false;
      this.investmentDialog.isOpened = true;
      // setTimeout(() => {
      //   this.investmentDialog.isOpened = true;
      // }, 100);
    },

    disagreeSaft() {
      this.investmentConfirmDialog.isShown = false;
    },

    closeInvestmentDialog() {
      this.investmentDialog.isOpened = false;
    },

    invest() {
      this.contributeToTokenSale();
      this.closeInvestmentDialog();
    },
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

.balance-form-input { // same as vue-credit card inputs
  color: #707070;

  &__label {
    padding-bottom: 5px;
    font-size: 13px;
  }

  &__field {
    box-sizing: border-box;
    margin-top: 3px;
    padding: 15px;
    font-size: 16px;
    width: 100%;
    border-radius: 3px;
    border: 1px solid #dcdcdc;
  }
}
</style>