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
                legend: {alignment: 'center'},
              }"
              style="height: 200px; max-width: 600px;"
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
                  class="mr-1"
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
              <span>{{ toAsset(tokenSale.total_amount) }}</span>
            </d-stack>
            <div class="d-flex align-center">
              <d-stack horizontal gap="6" class="text--secondary mr-3">
                <span class="font-weight-bold">Min Goal:</span>
                <span>{{ toAsset(tokenSale.soft_cap) }}</span>
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
              <span>{{ toAsset(tokenSale.hard_cap) }}</span>
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
              Terms and Conditions
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
          :hide-default-footer="transactionsHistory.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"
          sort-by="timestamp"
          sort-desc

          :headers="transactionsTableHeader"
          :items="transactionsHistory"
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
            <d-box-item
              :avatar="item.sender.profile | avatarSrc(64, 64, false)"
              :size="32"
            >
              <v-clamp
                autoresize
                :max-lines="1"
              >
                {{ item.sender | fullname }}
              </v-clamp>
            </d-box-item>
          </template>
          <template #item.timestamp="{item}">
            {{ item.timestamp | dateFormat('MMMM DD YYYY', true) }}
          </template>
          <template #item.op[1].research_token_sale_id="{item}">
            {{ mockSignature(item.op[1].research_token_sale_id) }}
          </template>
          <template #item.op[1].amount="{ item }">
            {{ toAsset(item.op[1].amount) }}
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
  import { InvestmentsService } from '@deip/investments-service';
  import crypto from '@deip/lib-crypto';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { assetsChore } from '@/mixins/chores';

  const researchService = ResearchService.getInstance();
  const investmentsService = InvestmentsService.getInstance();

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
      FundraisingProgressNeedle,
      DBoxItem
    },
    mixins: [componentStoreFactoryOnce(fundraisingStore, 'FundraisingDetails'), assetsChore],
    props: {
      research: {
        type: Object,
        default: () => ({})
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
            value: 'type',
            sortable: false
          },
          {
            text: 'Sender',
            value: 'sender.profile.firstName',
            sortable: false
          },
          {
            text: 'Date',
            value: 'timestamp',
            sortable: false
          },
          {
            text: 'Fundraising Phase',
            value: 'op[1].research_token_sale_id',
            align: 'center',
            sortable: false
          },
          {
            text: 'Amount',
            value: 'op[1].amount',
            align: 'end',
            sortable: false
          },
        ]
      };
    },
    computed: {
      ...mapGetters({
        userBalances: 'auth/userBalances',
        userAssets: 'auth/userAssets',
        tokenSale: 'FundraisingDetails/tokenSale',
        securityTokenBalances: 'FundraisingDetails/securityTokenBalances',
        transactionsHistory: 'FundraisingDetails/transactionsHistory',
        researchGroup: 'FundraisingDetails/researchGroup'
      }),
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
        const securityTokenHolders = this.securityTokenBalances.reduce((arr, item) => {
          const { amount } = this.$$fromAssetUnits(item.amount);
          if (item.owner === this.research.researchGroup.external_id) { // TODO: resolve this for all group accounts in store
            arr.push([this.researchGroup.name, amount]);
          } else {
            arr.push([this.$options.filters.accountFullname(item.user), amount]);
          }
          return arr;
        }, []);

        const data = [
          ['Researcher', 'AmountMoney'],
          ...securityTokenHolders,
        ];

        if (this.hasActiveTokenSale || this.hasInactiveTokenSale) {
          const { amount } = this.$$fromAssetUnits(this.tokenSale.security_tokens_on_sale[0]);
          data.push(['On Sale', amount]);
        }

        return data;
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
        let percent = this.tokenSale
          ? (this.fromAssetsToFloat(this.tokenSale.soft_cap) * 100)
            / this.fromAssetsToFloat(this.tokenSale.hard_cap)
          : 0;
        let mr6 = '0px';
        if (percent >= 88) {
          percent = 88;
          mr6 = '24px';
        }
        return `margin-left: calc(${percent}% - 9px - ${mr6})`;
      }
    },
    created() {
      const { assetId } = this.$$fromAssetUnits(this.research.securityTokens[0]);
      Promise.all([
        this.$store.dispatch('FundraisingDetails/loadSecurityTokenHolders', assetId),
        this.$store.dispatch('FundraisingDetails/loadResearchTokenSale', this.research.externalId),
        this.$store.dispatch('FundraisingDetails/loadTransactionsHistory', this.research.externalId),
        this.$store.dispatch('FundraisingDetails/loadResearchGroup', this.research.researchGroup.external_id)
      ])
        .then(() => {
          if (!this.tokenSale) {
            this.$router.back();
          } else {
            this.$setReady();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$router.back();
        });
    },
    methods: {
      mockSignature(id) {
        return crypto.hexify(crypto.ripemd160(new TextEncoder('utf-8').encode(`${id}`).buffer)).slice(0, 8);
      },
      openFundraisingDialog(value) {
        if (!value) return;

        this.isOpenFundraisingDialog = true;
      },
      contributeToTokenSale() {
        this.isInvesting = true;
        const symbol = this.tokenSale.soft_cap.split(' ')[1];
        const asset = this.userAssets.find((a) => a.string_symbol === symbol);

        investmentsService.contributeResearchTokenSale({ privKey: this.$currentUser.privKey, username: this.$currentUser.account.name }, {
          tokenSaleExternalId: this.tokenSale.external_id,
          contributor: this.$currentUser.account.name,
          amount: this.toAssetUnits(this.formData.amountToContribute, asset.precision, asset.string_symbol),
          extensions: []
        })
          .then(() => {
            const { assetId } = this.$$fromAssetUnits(this.research.securityTokens[0]);
            Promise.all(
              [
                this.$store.dispatch('FundraisingDetails/loadResearchTokenSale', this.research.externalId),
                this.$store.dispatch('FundraisingDetails/loadSecurityTokenHolders', assetId),
                this.$store.dispatch('FundraisingDetails/loadTransactionsHistory', this.research.externalId),
                this.$store.dispatch('auth/loadAccount'),
                this.$store.dispatch('auth/loadBalances')
              ]
            );
            this.isInvesting = false;
            this.$refs.amountToContribute.reset();
            this.formData.amountToContribute = '';
            this.isOpenFundraisingDialog = false;

            this.$notifier.showSuccess(`You have contributed to "${this.research.title}" fundraise successfully !`);
          })
          .catch((err) => {
            console.error(err);
            this.isInvesting = false;
            this.$notifier.showError('An error occurred while contributing to fundraise, please try again later');
          });
      },
      toAsset(val) {
        return this.$$toAssetUnits({
          amount: this.fromAssetsToFloat(val),
          assetId: val.split(' ')[1]
        });
      }
    }
  };
</script>
