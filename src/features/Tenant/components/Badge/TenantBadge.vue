<template>
  <component :is="tag" v-if="tenant && $ready">
    <template v-if="asText">
      {{ tenant.profile.shortName }}
    </template>

    <template v-else>
      <v-chip
        small
        :to="{
        name: 'explore',
        query: {
          rFilter: JSON.stringify({tenantIds: [tenant.id]})
        }
      }"
      >
        <div class="text-truncate spacer">
          {{ tenant.profile.shortName }}
        </div>
      </v-chip>
    </template>
  </component>

</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { tenantsListStore } from '@/features/Tenant/store/tenantsListStore';
  import { mapState } from 'vuex';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'TenantBadge',
    components: { DMetaItem },
    mixins: [
      componentStoreFactoryOnce(tenantsListStore, 'Tenants')
    ],
    props: {
      tenantId: {
        type: String,
        default: ''
      },

      asText: {
        type: Boolean,
        default: false
      },

      tag: {
        type: String,
        default: 'div'
      }
    },
    computed: {
      ...mapState({
        tenant(state, getters) { return getters['Tenants/one'](this.tenantId); }
      })
    },
    created() {
      this.loadTenant();
    },

    methods: {
      loadTenant() {
        this.$setReady(false);

        this.$store.dispatch('Tenants/get', this.tenantId)
          .then(() => {
            this.$setReady();
            this.$emit('ready', this.tenant);
          });
      }
    }
  };
</script>
