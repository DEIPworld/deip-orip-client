<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <div class="text-h4 mb-8">
        {{$t('fundraising.title')}}
      </div>
      <v-row v-if="tokenSale">
        <v-col cols="12" md="7">
          <d-stack gap="32">
            <div class="text-h6">
              {{research.title}}
            </div>
            <div class="d-flex align-center">
              <d-stack gap="6" class="caption">
                <div>
                  <span class="font-weight-bold">
                    {{$t('fundraising.fundraisingStatsSection.startTime')}}
                  </span>
                  {{ tokenSale.startTime | dateFormat('MMM D, YYYY HH:mm', true) }}
                </div>
                <div>
                  <span class="font-weight-bold">
                    {{$t('fundraising.fundraisingStatsSection.endTime')}}
                  </span>
                  {{ tokenSale.endTime | dateFormat('MMM D, YYYY HH:mm', true) }}
                </div>
              </d-stack>
              <div v-if="hasActiveTokenSale || hasInactiveTokenSale" class="ml-4">
                <v-chip outlined class="caption">
                  {{ tokenSaleTimeLeft | timeLeft }} left
                </v-chip>
              </div>
              <div v-else-if="hasFinishedTokenSale" class="ml-4">
                <v-chip outlined class="caption" color="success">
                  Finished
                </v-chip>
              </div>
              <div v-else-if="hasExpiredTokenSale" class="ml-4">
                <v-chip outlined class="caption" color="error">
                  Canceled
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
                  :text="$t('fundraising.alreadyCollected')"
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
                  :tooltip="tokenSale.softCap.amount"
                  :text="$t('fundraising.fundraisingControlSection.softCap')"
                  class="mr-6"
                  :style="marginMinCapPercent"
                />
                <fundraising-progress-needle
                  :tooltip="tokenSale.hardCap.amount"
                  :text="$t('fundraising.fundraisingControlSection.hardCap')"
                  class="ml-auto mr-6"
                />
              </div>
            </div>
          </v-sheet>
          <d-stack gap="12" class="caption text--secondary mb-6">
            <d-stack horizontal gap="6" class="text--secondary">
              <span class="font-weight-bold">
                {{$t('fundraising.fundraisingControlSection.collected')}}
              </span>
              <span>
                {{
                  $$toAssetUnits({
                    amount: tokenSale.totalInvested.amount,
                    assetId: tokenSale.totalInvested.symbol
                  })
                }}
              </span>
            </d-stack>
            <div class="d-flex align-center">
              <d-stack horizontal gap="6" class="text--secondary mr-3">
                <span class="font-weight-bold">{{$t('fundraising.fundraisingControlSection.softCap')}}</span>
                <span>
                  {{
                    $$toAssetUnits({
                      amount: tokenSale.softCap.amount,
                      assetId: tokenSale.softCap.symbol
                    })
                  }}
                </span>
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
              <span class="font-weight-bold">{{$t('fundraising.fundraisingControlSection.hardCap')}}</span>
              <span>
                {{
                  $$toAssetUnits({
                    amount: tokenSale.hardCap.amount,
                    assetId: tokenSale.hardCap.symbol
                  })
                }}
              </span>
            </d-stack>
          </d-stack>
          <d-form @submit="openFundraisingDialog">
            <v-text-field
              ref="amountToContribute"
              v-model="formData.amountToContribute"
              :label="$t('fundraising.amountOfInvest')"
              outlined
              hide-details
              :suffix="tokenSale.softCap.symbol"
              :rules="[rules.required, deipTokenValidator]"
              :disabled="isInvesting || !hasActiveTokenSale"
            />
            <v-checkbox
              v-model="formData.agreeFundraising"
              class="mt-3 mb-2"
              :rules="[rules.required]"
              hide-details
              :disabled="!hasActiveTokenSale"
              :label="$t('fundraising.agreeLabel')"
            />
            <a
              href="/assets/img/form-of-SAFT-for-token-pre-sale.pdf"
              target="_blank"
              class="text--secondary caption ml-8 mb-2 d-block"
            >
              {{ $t('fundraising.termsAndCond') }}
            </a>
            <v-btn
              color="primary"
              block
              small
              type="submit"
              :disabled="isContributionToTokenSaleDisabled || !hasActiveTokenSale"
            >
              {{ $t('fundraising.invest') }}
            </v-btn>
          </d-form>
        </v-col>
      </v-row>

      <d-block :title="$t('fundraising.contributionsHistorySection.title')" class="mt-8">
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
              {{ $t('fundraising.investment') }}
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
          <template #item.investmentOpportunityId="{item}">
            {{ mockSignature(item.investmentOpportunityId) }}
          </template>
          <template #item.token.amount="{ item }">
            {{
              $$toAssetUnits({
                amount: item.token.amount,
                assetId: item.token.symbol
              })
            }}
          </template>
        </v-data-table>
      </d-block>

      <vex-dialog
        v-model="isOpenFundraisingDialog"
        title="Investment confirmation"
        :loading="isInvesting"
        @click:confirm="contributeToTokenSale()"
      >
        {{ $t('fundraising.doYouConfirm') }}
      </vex-dialog>
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
  import { chartGradient, switchColor } from '@/plugins/charts';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { fundraisingStore } from '@/components/Fundraising/FundraisingPage/store';
  import { mapGetters } from 'vuex';
  import { InvestmentsService } from '@deip/investments-service';
  import crypto from '@deip/lib-crypto';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { assetsChore } from '@/mixins/chores';

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
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required')
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
            text: this.$t('fundraising.table.sender'),
            value: 'sender.profile.firstName',
            sortable: false
          },
          {
            text: this.$t('fundraising.table.date'),
            value: 'timestamp',
            sortable: false
          },
          {
            text: this.$t('fundraising.table.fundPhase'),
            value: 'investmentOpportunityId',
            align: 'center',
            sortable: false
          },
          {
            text: this.$t('fundraising.table.amount'),
            value: 'token.amount',
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
        let text = this.$t('fundraising.goalNotAchiev');
        if (this.currentCap >= Number(this.tokenSale.softCap.amount)) {
          color = 'success';
          iconClass = '';
          icon = 'check_circle';
          text = this.$t('fundraising.minGoalReached');
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

        return this.hasInactiveTokenSale ? this.tokenSale.startTime : this.tokenSale.endTime;
      },
      // todo: transform to constant
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },
      // todo: transform to constant
      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 4;
      },
      hasFinishedTokenSale() {
        return this.tokenSale && this.tokenSale.status === 2;
      },
      hasExpiredTokenSale() {
        return this.tokenSale && this.tokenSale.status === 3;
      },
      chartData() {
        const securityTokenHolders = this.securityTokenBalances.reduce((arr, item) => {
          arr.push([this.$options.filters.accountFullname(item.user), Number(item.amount)]);
          return arr;
        }, []);

        const data = [
          ['Researcher', 'AmountMoney'],
          ...securityTokenHolders,
        ];

        if (this.hasActiveTokenSale || this.hasInactiveTokenSale) {
          data.push(['On Sale', Number(this.tokenSale.shares[0].amount)]);
        }
        return data;
      },
      currentCap() {
        if (!this.tokenSale) return 0;
        return this.tokenSale.totalInvested.totalAmount;
      },
      isContributionToTokenSaleDisabled() {
        if (!this.userBalances[this.tokenSale.softCap.symbol]) return true;
        const balance = Number(this.userBalances[this.tokenSale.softCap.symbol]);
        const isBalanceNotEnough = (this.formData.amountToContribute || 0) > balance;
        const isInvestmentNotSpecified = (this.formData.amountToContribute || 0) <= 0;
        return isBalanceNotEnough
          || isInvestmentNotSpecified
          || this.isInvesting
          || !this.formData.agreeFundraising;
      },
      currentCapPercent() {
        let percent = this.tokenSale
          ? (this.currentCap * 100) / this.tokenSale.hardCap.amount : 0;
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
          ? (this.tokenSale.softCap.amount * 100) / this.tokenSale.hardCap.amount : 0;
        let mr6 = '0px';
        if (percent >= 88) {
          percent = 88;
          mr6 = '24px';
        }
        return `margin-left: calc(${percent}% - 9px - ${mr6})`;
      }
    },
    created() {
      Promise.all([
        this.$store.dispatch('FundraisingDetails/loadSecurityTokenHolders', this.research.securityTokens[0].symbol),
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
        const tokenSaleSymbol = this.tokenSale.softCap.symbol;
        const {
          id,
          symbol,
          precision
        } = this.$$assetInfo(tokenSaleSymbol);

        investmentsService.investProjectTokenSale(
          { privKey: this.$currentUser.privKey, username: this.$currentUser.username },
          {
            investmentOpportunityId: this.tokenSale._id,
            investor: this.$currentUser.username,
            asset: {
              id,
              symbol,
              precision,
              amount: this.formData.amountToContribute
            },
            extensions: []
          }
        )
          .then(() => {
            Promise.all(
              [
                this.$store.dispatch('FundraisingDetails/loadResearchTokenSale', this.research.externalId),
                this.$store.dispatch('FundraisingDetails/loadSecurityTokenHolders', this.research.securityTokens[0].symbol),
                this.$store.dispatch('FundraisingDetails/loadTransactionsHistory', this.research.externalId),
                this.$store.dispatch('auth/loadUserData'),
                this.$store.dispatch('auth/loadBalances')
              ]
            );
            this.isInvesting = false;
            this.$refs.amountToContribute.reset();
            this.formData.amountToContribute = '';
            this.isOpenFundraisingDialog = false;

            this.$notifier.showSuccess(this.$t('fundraising.contributedSucc', { project: this.research.title }));
          })
          .catch((err) => {
            console.error(err);
            this.isInvesting = false;
            this.$notifier.showError(this.$t('fundraising.contributedFail'));
          });
      }
    }
  };
</script>
