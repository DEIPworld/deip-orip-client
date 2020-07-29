<template>
  <div class="text--secondary">
    <div class="d-flex justify-space-between">
      <div class="text-overline">
        ${{ fromAssetsToFloat(tokenSale.soft_cap) }}
      </div>
      <div class="text-overline">
        ${{ fromAssetsToFloat(tokenSale.hard_cap) }}
      </div>
    </div>
<!--    {{tokenSale}}-->
<!--    {{fromAssetsToFloat(tokenSale.total_amount) / fromAssetsToFloat(tokenSale.hard_cap) * 100}}-->
    <v-progress-linear
      class="rounded"
      :value="fromAssetsToFloat(tokenSale.total_amount) / fromAssetsToFloat(tokenSale.hard_cap)"
    />
    <div v-if="hasActiveTokenSale" class="text-caption mt-1">
      {{ tokenSaleLeft(tokenSale.end_time) }} left
    </div>
    <div v-if="hasInactiveTokenSale" class="text-caption mt-1">
      Fundraising starts in
      {{ tokenSaleLeft(tokenSale.start_time) }}
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'ResearchListTokenSale',
    props: {
      tokenSale: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },

      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 4;
      }
    },

    methods: {
      tokenSaleLeft(to) {
        const now = moment.utc().local();
        const point = moment.utc(to).local();

        const months = Math.floor(moment.duration(point.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        const days = Math.floor(moment.duration(point.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        const hours = Math.floor(moment.duration(point.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        const minutes = Math.floor(moment.duration(point.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        const seconds = Math.floor(moment.duration(point.diff(now)).asSeconds());
        return `${seconds} secs`;
      }
    }
  };
</script>
