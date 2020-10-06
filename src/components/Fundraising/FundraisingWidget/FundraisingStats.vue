<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="eci-widget"
    :types="{
      'eci-widget': 'heading@3',
    }"
  >
    <template v-if="tokenSaleData">
      <d-block small title="Fundraising">
        <template #titleAddon>
          <v-chip outlined :color="timeChipData.color" text-color="black">
            {{ timeChipData.date | timeLeft }}
          </v-chip>
        </template>
      </d-block>
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
    </template>
    <v-btn
      block
      small
      outlined
      color="primary"
      class="mt-3"
      :to="{
        name: 'research.fundraising',
        params: {
          researchExternalId: $route.params.researchExternalId
        }
      }"
    >
      {{ tokenSaleData ? 'More details' : 'Info' }}
    </v-btn>
    <v-btn
      v-if="!tokenSaleData"
      block
      small
      outlined
      color="primary"
      class="mt-3"
      :to="{
        name: 'CreateTokenSale',
        params: {
          research_group_permlink: groupPemlink,
          research_permlink: researchPemlink
        }
      }"
    >
      Start new fundraise
    </v-btn>
  </v-skeleton-loader>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { fundraisingWidgetStore } from '@/components/Fundraising/FundraisingWidget/store';
  import { mapGetters } from 'vuex';

  export default {
    name: 'FundraisingStats',
    components: {
      DBlock
    },

    mixins: [componentStoreFactoryOnce(fundraisingWidgetStore)],

    props: {
      groupPemlink: {
        type: String,
        default: ''
      },
      researchPemlink: {
        type: String,
        default: ''
      },
      researchId: {
        type: [String, Number],
        default: ''
      }
    },


    computed: {
      ...mapGetters({
        tokenSaleData: 'FundraisingStats/tokenSale'
      }),
      timeChipData() {
        if (this.tokenSaleData && this.tokenSaleData.status === 4) {
          return {
            color: 'info',
            date: this.tokenSaleData.start_time
          };
        } else {
          return {
            color: 'warning',
            date: this.tokenSaleData.end_time
          }
        }
      },
      token() {
        return this.tokenSaleData.soft_cap ? this.tokenSaleData.soft_cap.split(' ')[1] : '';
      },
      saleInfo() {
        if (!this.tokenSaleData) return [];
        return [
          {
            label: 'Start',
            value: this.$options.filters.dateFormat(this.tokenSaleData.start_time, 'D MMM YYYY, hh:mm')
          },
          {
            label: 'End',
            value: this.$options.filters.dateFormat(this.tokenSaleData.end_time, 'D MMM YYYY, hh:mm')
          },
          {
            label: 'Total investment',
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.total_amount))} ${this.token}`,
            hide: !this.fromAssetsToFloat(this.tokenSaleData.total_amount)
          },
          {
            label: 'Min Goal',
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.soft_cap))} ${this.token}`
          },
          {
            label: 'Max Goal',
            value: `${this.$options.filters.commaNumber(this.fromAssetsToFloat(this.tokenSaleData.hard_cap))} ${this.token}`
          }
        ];
      }
    },
    created() {
      if (this.researchId) {
        this.$store.dispatch('FundraisingStats/loadResearchTokenSale', this.researchId)
          .then(() => {
            this.$setReady();
          });
      }
    }
  };
</script>
