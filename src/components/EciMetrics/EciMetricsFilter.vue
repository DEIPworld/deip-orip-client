<template>
  <d-filter-block
    v-model="internalValue"
    :loading="loading"
    @apply="$emit('apply', internalValue)"
  >
    <v-col v-if="disciplines && disciplines.length" cols="2">
      <v-select
        v-model="internalValue.discipline"
        label="Domain"
        outlined
        :items="[{label: 'All', external_id: ''}, ...disciplines]"
        item-text="label"
        item-value="external_id"
      />
    </v-col>
    <v-col v-if="contributions && contributions.length" cols="2">
      <v-select
        v-model="internalValue.contribution"
        class="my-0 py-0"
        :items="contributions"
        label="Contribution Type"
        outlined
      />
    </v-col>
    <v-col v-if="criterias && criterias.length" cols="2">
      <v-select
        v-model="internalValue.criteria"
        class="my-0 py-0"
        :items="criterias"
        label="Assessment criteria"
        outlined
      />
    </v-col>

    <v-col cols="2">
      <d-input-date
        v-model="internalValue.date"
        label="Period"
        :picker-props="{
          min: moment('2020-01-01').format('YYYY-MM-DD'),
          range: true
        }"
        :field-props="{
          clearable: true,
        }"
      />
    </v-col>
  </d-filter-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';

  export default {
    name: 'EciMetricsFilter',
    components: { DFilterBlock, DInputDate },
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
    }
  };
</script>
