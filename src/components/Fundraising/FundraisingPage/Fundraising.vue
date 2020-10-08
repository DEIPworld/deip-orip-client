<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <div class="text-h4 mb-8">
        Fundraising
      </div>
      <v-row v-if="tokenSale">
        <v-col cols="12" md="7">
          <d-stack gap="32">
            <div class="text-h6">
              Assessing the Simulated Arctic Freshwater System
              in CMIP5 Models, the CESM Large Ensemble, and Forced Simulations
            </div>
            <div class="d-flex align-center">
              <d-stack gap="6" class="caption">
                <div>
                  <span class="font-weight-bold">
                    Start:
                  </span>
                  {{ tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true) }}
                </div>
                <div>
                  <span class="font-weight-bold">
                    End:
                  </span>
                  {{ tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true) }}
                </div>
              </d-stack>
              <div class="ml-4">
                <v-chip outlined class="caption">
                  {{ tokenSaleTimeLeft | timeLeft }} left
                </v-chip>
              </div>
            </div>
            <d-chart-pie
              donut
              :data="chartData"
              :options="{
                legend: {alignment: 'center'}
              }"
              style="width: 384px; height: 200px;"
            />
          </d-stack>
        </v-col>
        <v-col cols="12" md="5">
          <v-sheet class="mb-6 d-flex align-center py-4">
            <div class="flex-grow-1">
              <div class="d-flex">
                <fundraising-progress-needle
                  :tooltip="`${currentCap}`"
                  text="Already collected"
                  class="mr-6"
                  reverse
                  :style="marginCurrentCapPercent"
                />
              </div>
              <v-progress-linear
                color="primary"
                rounded
                background-color="secondary"
                :value="currentCapPercent"
              />
              <div class="d-flex">
                <fundraising-progress-needle
                  text="0"
                />
                <fundraising-progress-needle
                  :tooltip="`${fromAssetsToFloat(tokenSale.soft_cap)}`"
                  text="Min Goal"
                  class="mr-6"
                  :style="marginMinCapPercent"
                />
                <fundraising-progress-needle
                  :tooltip="`${fromAssetsToFloat(tokenSale.hard_cap)}`"
                  text="Max Goal"
                  class="ml-auto mr-6"
                />
              </div>
            </div>
          </v-sheet>
          <d-stack gap="12" class="caption text--secondary mb-6">
            <d-stack horizontal gap="6" class="text--secondary">
              <span class="font-weight-bold">Already collected investments:</span>
              <span>{{ currentCap }}</span>
            </d-stack>
            <div class="d-flex align-center">
              <d-stack horizontal gap="6" class="text--secondary mr-3">
                <span class="font-weight-bold">Min Goal:</span>
                <span>{{ fromAssetsToFloat(tokenSale.soft_cap) }}</span>
              </d-stack>
              <v-chip
                outlined
                :color="goalChipData.color"
                class="caption"
              >
                <v-icon left :class="goalChipData.iconClass">
                  {{ goalChipData.icon }}
                </v-icon>
                {{ goalChipData.text }}
              </v-chip>
            </div>
            <d-stack horizontal gap="6" class="text--secondary">
              <span class="font-weight-bold">Max Goal:</span>
              <span>{{ fromAssetsToFloat(tokenSale.hard_cap) }}</span>
            </d-stack>
          </d-stack>
          <d-form @submit="openFundraisingDialog">
            <v-text-field
              ref="amountToContribute"
              v-model="formData.amountToContribute"
              label="Amount of investment"
              outlined
              hide-details
              :suffix="tokenSale.soft_cap.split(' ')[1]"
              :rules="[rules.required, deipTokenValidator]"
              :disabled="isInvesting || !hasActiveTokenSale"
            />
            <v-checkbox
              v-model="formData.agreeFundraising"
              class="mt-3 mb-2"
              :rules="[rules.required]"
              hide-details
              :disabled="!hasActiveTokenSale"
              label="I agree to the Terms and Conditions listed below "
            />
            <a
              href="/assets/img/form-of-SAFT-for-token-pre-sale.pdf"
              target="_blank"
              class="text--secondary caption ml-8 mb-2 d-block"
            >
              Files
            </a>
            <v-btn
              color="primary"
              block
              small
              type="submit"
              :disabled="isContributionToTokenSaleDisabled || !hasActiveTokenSale"
            >
              Invest
            </v-btn>
          </d-form>
        </v-col>
      </v-row>

      <d-block title="Transactions" class="mt-8">
        <v-divider />
        <v-data-table
          :hide-default-footer="transactionsData.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"
          disable-sort

          :headers="transactionsTableHeader"
          :items="transactionsData"
        >
          <template #item.type="{item}">
            <v-chip
              :color="chipColors[transactionTypes['TRANS']].bg"
              :text-color="chipColors[transactionTypes['TRANS']].textColor"
            >
              Investment
            </v-chip>
          </template>
          <template #item.sender.profile.firstName="{item}">
            {{ item.sender | fullname }}
          </template>
          <template #item.date="{item}">
            {{ item.date | dateFormat('MMMM DD YYYY', true) }}
          </template>
        </v-data-table>
      </d-block>

      <d-dialog
        v-model="isOpenFundraisingDialog"
        title="Investment confirmation"
        :loading="isInvesting"
        @click:confirm="contributeToTokenSale()"
      >
        Do you confirm the investment of funds from your account?
      </d-dialog>
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import DForm from '@/components/Deipify/DForm/DForm';
  import FundraisingProgressNeedle from '@/components/Fundraising/FundraisingPage/components/FundraisingProgressNeedle';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { fundraisingStore } from '@/components/Fundraising/FundraisingPage/store';
  import { mapGetters } from 'vuex';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  const transactionTypes = {
    TRANS: 1
  };

  export default {
    name: 'Fundraising',
    components: {
      DLayoutSection,
      DLayoutSectionMain,
      DBlock,
      DStack,
      DChartPie,
      DForm,
      DDialog,
      FundraisingProgressNeedle
    },
    mixins: [componentStoreFactoryOnce(fundraisingStore)],
    props: {
      researchId: {
        type: [Number, String],
        default: 0
      },
      researchTitle: {
        type: String,
        default: ''
      },
      groupName: {
        type: String,
        default: ''
      },
      groupOwnedTokens: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        rules: {
          required: (value) => !!value || 'This field is required'
        },
        formData: {
          agreeFundraising: false,
          amountToContribute: ''
        },
        isInvesting: false,
        transactionTypes,
        isOpenFundraisingDialog: false,
        transactionsTableHeader: [
          {
            value: 'type'
          },
          {
            text: 'Sender',
            value: 'sender.profile.firstName',
            align: 'center'
          },
          {
            text: 'Date',
            value: 'date',
            align: 'center'
          },
          {
            text: 'Amount',
            value: 'amount',
            align: 'end'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        tokenSale: 'Fundraising/tokenSale',
        research: 'Fundraising/research',
        userBalances: 'auth/userBalances',
        userAssets: 'auth/userAssets',
        user: 'auth/user',
        assets: 'auth/assets',
        contributionsList: 'Fundraising/contributionsList',
        // currentContributionsList: 'Fundraising/currentContributionsList'
      }),
      transactionsData() {
        const data = this.contributionsList.map((item) => item.contributionsHistory.map((his) => ({
          amount: his.op[1].amount,
          date: his.timestamp,
          sender: item.user
        })));
        // data.push(...this.currentContributionsList.map((item) => ({
        //   amount: item.amount,
        //   date: item.contribution_time,
        //   sender: item.user
        // })));
        // console.log(this.contributionsList.map((item) => item.contributionsHistory.map((his) => ({
        //   amount: his.op[1].amount,
        //   date: his.timestamp,
        //   sender: item.user
        // }))))
        // console.log(...this.currentContributionsList.map((item) => ({
        //   amount: item.amount,
        //   date: item.contribution_time,
        //   sender: item.user
        // })))
        // console.log(this.currentContributionsList)
        // console.log(this.contributionsList)
        return data.flat().sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
      },
      chipColors() {
        return chartGradient(Object.keys(transactionTypes).length + 1).map((color) => ({
          bg: color,
          textColor: switchColor(color)
        }));
      },
      goalChipData() {
        let color = '';
        let iconClass = 'text--secondary';
        let icon = 'cancel';
        let text = 'Goal is not achieved';
        if (this.currentCap >= this.fromAssetsToFloat(this.tokenSale.soft_cap)) {
          color = 'success';
          iconClass = '';
          icon = 'check_circle';
          text = 'Min goal reached!';
        }
        return {
          color,
          iconClass,
          icon,
          text
        };
      },
      tokenSaleTimeLeft() {
        if (!this.tokenSale) return null;

        return this.hasInactiveTokenSale ? this.tokenSale.start_time : this.tokenSale.end_time;
      },
      // todo: transform to constant
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },
      // todo: transform to constant
      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 4;
      },
      chartData() {
        const investors = this.contributionsList.reduce((arr, item) => {
          arr.push(
            [this.$options.filters.fullname(item.user), this.convertToPercent(item.amount)]
          );
          return arr;
        }, []);
        const tokensOnSale = Math.round(100 - this.convertToPercent(this.groupOwnedTokens)
          - this.contributionsList.reduce(
            (sum, item) => sum + this.convertToPercent(item.amount), 0
          ));
        return [
          ['Researcher', 'AmountMoney'],
          ...investors,
          [this.groupName, this.convertToPercent(this.groupOwnedTokens)],
          ['On Sale', tokensOnSale]
        ];
      },
      currentCap() {
        if (!this.tokenSale) return 0;
        return this.fromAssetsToFloat(this.tokenSale.total_amount);
      },
      isContributionToTokenSaleDisabled() {
        if (!this.userBalances[this.tokenSale.soft_cap.split(' ')[1]]) return true;
        const balance = this.fromAssetsToFloat(this.userBalances[this.tokenSale.soft_cap.split(' ')[1]]);
        const isBalanceNotEnough = (this.formData.amountToContribute || 0) > balance;
        const isInvestmentNotSpecified = (this.formData.amountToContribute || 0) <= 0;
        return isBalanceNotEnough
          || isInvestmentNotSpecified
          || this.isInvesting
          || !this.formData.agreeFundraising;
      },
      currentCapPercent() {
        let percent = this.tokenSale
          ? (this.currentCap * 100)
            / this.fromAssetsToFloat(this.tokenSale.hard_cap)
          : 0;
        if (percent <= 0.7) {
          percent = 0.7;
        }
        return percent;
      },
      marginCurrentCapPercent() {
        let percent = this.currentCapPercent;
        let px = 3;
        if (percent <= 0) {
          percent = 0;
          px = 0;
        }
        if (percent >= 95) {
          return 'margin-left: auto;';
        }
        return `margin-left: calc(${percent}% - ${px}px)`;
      },
      marginMinCapPercent() {
        const percent = this.tokenSale
          ? (this.fromAssetsToFloat(this.tokenSale.soft_cap) * 100)
            / this.fromAssetsToFloat(this.tokenSale.hard_cap)
          : 0;
        return `margin-left: calc(${percent}% - 9px)`;
      }
    },
    created() {
      Promise.all([
        this.$store.dispatch('Fundraising/loadAllInvestors', this.researchId),
        this.$store.dispatch('Fundraising/loadResearchTokenSale', this.researchId)
      ])
        .then(() => {
          if (!this.tokenSale) {
            this.$router.back();
          } else {
            this.$setReady();
          }
        })
        .catch(() => this.$router.back());
    },
    methods: {
      openFundraisingDialog(value) {
        if (!value) return;

        this.isOpenFundraisingDialog = true;
      },
      contributeToTokenSale() {
        this.isInvesting = true;
        const symbol = this.tokenSale.soft_cap.split(' ')[1];
        const asset = this.userAssets.find((a) => a.string_symbol === symbol);

        researchService.contributeToResearchTokenSaleViaOffchain(this.$currentUser.privKey, {
          researchExternalId: this.$route.params.researchExternalId,
          contributor: this.$currentUserName,
          amount: this.toAssetUnits(
            this.formData.amountToContribute, asset.precision, asset.string_symbol
          ),
          extensions: []
        })
          .then(() => {
            Promise.all(
              [
                this.$store.dispatch('Fundraising/loadResearchTokenSale', this.researchId),
                this.$store.dispatch('Fundraising/loadAllInvestors', this.researchId),
                this.$store.dispatch('auth/loadAccount'),
                this.$store.dispatch('auth/loadBalances')
              ]
            );
            this.isInvesting = false;
            this.$refs.amountToContribute.reset();
            this.formData.amountToContribute = '';
            this.isOpenFundraisingDialog = false;

            this.$notifier.showSuccess(`You have contributed to "${this.researchTitle}" fundraise successfully !`);
          })
          .catch((err) => {
            console.error(err);
            this.isInvesting = false;
            this.$notifier.showError('An error occurred while contributing to fundraise, please try again later');
          });
      }
    }
  };
</script>
