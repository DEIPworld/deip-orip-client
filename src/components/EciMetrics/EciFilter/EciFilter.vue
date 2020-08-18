<template>
  <d-filter-block
    v-model="filterModel"
    :reset-model="resetModel"
    :loading="loading"
    @apply="apply()"
    @reset="reset()"
  >
    <v-select
      v-model="filterModel.discipline"
      label="Domain"
      outlined
      :items="[{label: 'All', external_id: ''}, ...disciplines]"
      item-text="label"
      item-value="external_id"
      hide-details="auto"
    />
    <v-select
      v-model="filterModel.contribution"
      class="my-0 py-0"
      :items="contributions"
      label="Contribution Type"
      hide-details="auto"
      outlined
    />
    <v-select
      v-model="filterModel.criteria"
      class="my-0 py-0"
      :items="criterias"
      label="Assessment criteria"
      hide-details="auto"
      outlined
    />
    <d-input-date
      v-model="filterModel.date"
      label="Period"
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
    discipline: '',
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

      disciplines: {
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
