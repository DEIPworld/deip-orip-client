<template>
  <div>
<!--    <d-meta-item-->
<!--      icon="mdi-account-network-outline"-->
<!--      :title="tenant.profile.name"-->
<!--    />-->
    <v-chip
      v-if="$ready"
      small
      :to="{
        name: 'explore',
        query: {
          rFilter: JSON.stringify({tenantIds: [tenant.id]})
        }
      }"
    >
<!--      <v-avatar left class="mr-2 ml-n2">-->
<!--        <v-img :src="tenant | tenantLogoSrc(24)" />-->
<!--      </v-avatar>-->

      <div class="text-truncate spacer">
        {{ tenant.profile.name }}
      </div>
    </v-chip>
  </div>

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
