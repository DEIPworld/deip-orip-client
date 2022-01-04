<template>
  <d-filter-block
    v-model="filterModel"
    :reset-model="resetModel"
    :loading="loading"
    @apply="apply()"
    @reset="reset()"
  >
    <v-select
      v-model="filterModel.domain"
      :label="$t('defaultNaming.filters.domainField')"
      outlined
      :items="[{label: $t('defaultNaming.all'), _id: ''}, ...domains]"
      item-text="label"
      item-value="_id"
      hide-details="auto"
    />
    <v-select
      v-model="filterModel.contribution"
      class="my-0 py-0"
      :items="contributions"
      :label="$t('defaultNaming.filters.contributionType')"
      hide-details="auto"
      outlined
    />
    <v-select
      v-model="filterModel.criteria"
      class="my-0 py-0"
      :items="criterias"
      :label="$t('defaultNaming.filters.assessmentCriteria')"
      hide-details="auto"
      outlined
    />
    <d-input-date
      v-model="filterModel.date"
      :label="$t('defaultNaming.filters.periodField')"
      :picker-props="{
        min: moment('2020-01-01').format('YYYY-MM-DD'),
        range: true
      }"
      :field-props="{
        clearable: true,
      }"
    />
  </d-filter-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';

  export const defaultFilterModel = () => ({
    domain: '',
    date: [],
    contribution: '',
    criteria: ''
  });

  export default {
    name: 'EciFilter',
    components: {
      DFilterBlock,
      DInputDate
    },
    mixins: [Proxyable],
    props: {
      loading: {
        type: Boolean,
        default: false
      },

      domains: {
        type: [Array, Boolean],
        default: () => ([])
      },
      contributions: {
        type: [Array, Boolean],
        default: () => ([])
      },
      criterias: {
        type: [Array, Boolean],
        default: () => ([])
      }
    },
    data() {
      return {
        filterModel: defaultFilterModel(),
        resetModel: defaultFilterModel()
      };
    },
    methods: {
      apply() {
        this.internalValue = { ...this.filterModel };
      },
      reset() {
        this.internalValue = { ...this.resetModel };
      }
    }
  };
</script>
