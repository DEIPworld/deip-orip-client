<template>
  <div>
    <v-row
      v-for="(item, index) of licensesList"
      :key="`ls-${index}`"
      no-gutters
    >
      <v-col class="text-caption" cols="auto">
        {{ item.licencePlan.name }}
      </v-col>
      <v-divider class="dotted align-self-end mx-1" style="margin-bottom: 2px;" />
      <v-col
        class="text-caption font-weight-medium"
        cols="auto"
      >
        {{ $$toAssetUnits(item.licencePlan.fee) }}
      </v-col>
      <v-col cols="12" class="text-caption">
        {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { expressLicensingStore } from '@/components/Licensing/Express/_temp/store';
  import { mapState } from 'vuex';
  import { assetsChore } from '@/mixins/chores';

  export default {
    name: 'ExpressLicensingPurchased',
    mixins: [
      componentStoreFactory(expressLicensingStore),
      assetsChore
    ],
    props: {
      projectId: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapState({
        licensesList(state, getters) { return getters[`${this.storeNS}/licensesListByUser`](this.projectId); }
      })
    },
    created() {
      this.$store.dispatch(`${this.storeNS}/getLicensesByUser`, this.$currentUserName);
    }
  };
</script>
