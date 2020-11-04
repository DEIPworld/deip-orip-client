<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="eci-widget"
    :types="{
      'eci-widget': 'heading@3',
    }"
  >
    <d-block title="Fundraising" compact class="mt-n4">
      <template #title-append>
        <v-chip v-if="tokenSaleData" outlined :color="timeChipData.color" text-color="black">
          {{ timeChipData.date | timeLeft }}
        </v-chip>
      </template>
      <div>
        <template v-if="tokenSaleData">
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
          v-if="hasHistory || tokenSaleData"
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
        <div v-else class="caption">
          Project has never fundraised before.
        </div>
        <v-btn
          v-if="!tokenSaleData && isResearchGroupMember"
          block
          small
          outlined
          color="primary"
          class="mt-3"
          :to="{
            name: 'research.createTokenSale',
            params: {
              researchExternalId: $route.params.researchExternalId
            }
          }"
        >
          Start new fundraise
        </v-btn>
      </div>
    </d-block>
  </v-skeleton-loader>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { fundraisingWidgetStore } from '@/components/Fundraising/FundraisingWidget/store';
  import { mapGetters } from 'vuex';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'FundraisingStats',
    components: {
      DBlock
    },

    mixins: [componentStoreFactoryOnce(fundraisingWidgetStore)],

    props: {
      researchId: {
        type: [String, Number],
        default: ''
      }
    },


    computed: {
      ...mapGetters({
        tokenSaleData: 'FundraisingStats/tokenSale',
        research: 'FundraisingStats/research',
        hasHistory: 'FundraisingStats/hasHistory'
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
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      },
    },
    created() {
      this.$store.dispatch('FundraisingStats/loadResearchTokenSale', this.researchId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
