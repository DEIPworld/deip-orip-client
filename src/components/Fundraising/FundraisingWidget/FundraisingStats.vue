<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="eci-widget"
    :types="{
      'eci-widget': 'heading@3',
    }"
  >
    <d-block-widget :title="$t('fundraising.title')" class="ma-n4">
      <template #title-append>
        <v-chip
          v-if="tokenSaleData"
          outlined
          :color="timeChipData.color"
          text-color="black"
        >
          {{ timeChipData.date | timeLeft }}
        </v-chip>
      </template>

      <div v-if="disabled" class="text-body-2">
        {{ $t('fundraising.neverFund') }}
        {{ $t('fundraising.please') }}
        <router-link
          :to="{
            name: 'project.asset.create',
            params: $route.params
          }"
        >
          {{ $t('fundraising.issueTokens') }}
        </router-link>
        {{ $t('fundraising.toStart') }}
      </div>

      <template v-else>
        <div v-if="tokenSaleData">
          <template
            v-for="(item, index) of saleInfo"
          >
            <v-row
              v-if="!item.hide"
              :key="`ls-${index}`"
              :class="{'mb-2': index + 1 < saleInfo.length}"
              no-gutters
            >
              <v-col class="text-caption" cols="auto">
                {{ item.label }}
              </v-col>
              <v-divider class="dotted align-self-end mx-1" style="margin-bottom: 2px;" />
              <v-col
                class="text-caption font-weight-medium"
                :class="item.classList"
                cols="auto"
              >
                {{ item.value }}
              </v-col>
            </v-row>
          </template>
        </div>

        <div v-if="!(hasHistory || tokenSaleData)" class="caption">
          {{ $t('fundraising.neverFund') }}
        </div>
        <v-btn
          v-if="!tokenSaleData && isResearchMember && $isUser"
          block
          small
          outlined
          color="primary"
          :to="{
            name: 'project.fundraising.create',
            params: $route.params
          }"
        >
          {{ $t('fundraising.startNew') }}
        </v-btn>
        <div v-else-if="!tokenSaleData && !isResearchMember && hasHistory" class="text-caption">
          {{ $t('fundraising.finished') }}
        </div>
        <v-btn
          v-if="(hasHistory || tokenSaleData) && $isUser"
          block
          small
          text
          color="primary"
          :to="{
            name: 'project.fundraising',
            params: {
              researchExternalId: $route.params.researchExternalId
            }
          }"
        >
          {{ $t('defaultNaming.moreDetails') }}
        </v-btn>
      </template>
    </d-block-widget>
  </v-skeleton-loader>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { fundraisingWidgetStore } from '@/components/Fundraising/FundraisingWidget/store';
  import { mapGetters } from 'vuex';
  import { hasValue } from '@/utils/helpers';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';

  export default {
    name: 'FundraisingStats',
    components: {
      DBlockWidget
    },

    mixins: [componentStoreFactoryOnce(fundraisingWidgetStore)],

    props: {
      researchId: {
        type: [String, Number],
        default: ''
      },

      project: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      ...mapGetters({
        tokenSaleData: 'FundraisingStats/tokenSale',
        hasHistory: 'FundraisingStats/hasHistory'
      }),
      timeChipData() {
        if (this.tokenSaleData && this.tokenSaleData.status === 4) {
          return {
            color: 'info',
            date: this.tokenSaleData.start_time
          };
        }
        return {
          color: 'warning',
          date: this.tokenSaleData.end_time
        };
      },
      token() {
        return this.tokenSaleData.soft_cap ? this.tokenSaleData.soft_cap.split(' ')[1] : '';
      },
      saleInfo() {
        if (!this.tokenSaleData) return [];
        return [
          {
            label: this.$t('fundraising.start'),
            value: this.$options.filters.dateFormat(this.tokenSaleData.start_time, 'D MMM YYYY, HH:mm', true)
          },
          {
            label: this.$t('fundraising.end'),
            value: this.$options.filters.dateFormat(this.tokenSaleData.end_time, 'D MMM YYYY, HH:mm', true)
          },
          {
            label: this.$t('fundraising.totalInvestment'),
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.total_amount))} ${this.token}`,
            hide: !this.fromAssetsToFloat(this.tokenSaleData.total_amount)
          },
          {
            label: this.$t('fundraising.minGoal'),
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.soft_cap))} ${this.token}`
          },
          {
            label: this.$t('fundraising.maxGoal'),
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.hard_cap))} ${this.token}`
          }
        ];
      },
      isResearchMember() {
        return this.project ? this.project.members.includes(this.$currentUser.username) : false;
      },

      disabled() {
        if (hasValue(this.project)) {
          return !(this.project.securityTokens && this.project.securityTokens.length);
        }
        return false;
      }
    },
    created() {
      this.$store.dispatch('FundraisingStats/loadResearchTokenSale', this.researchId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
