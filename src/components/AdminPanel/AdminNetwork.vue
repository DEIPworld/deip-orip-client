<template>
  <admin-view :title="$t('adminRouting.network.title')">
    <div class="display-flex flex-wrap">
      <div class="flex-grow-1">
        <v-form :disabled="isSubmitting" @submit.prevent="onSubmit">
          <d-form-block :title="$t('adminRouting.network.visibilitySectionTitle')">
            <v-col cols="12">
              <v-switch
                v-model="formData.globalNetworkIsVisible"
                :disabled="isSubmitting"
                :label="$t('adminRouting.network.visibility')"
                class="ma-0 pa-0"
                hide-details="auto"
              />
            </v-col>
          </d-form-block>

          <div class="text-right">
            <slot name="buttons">
              <v-btn
                type="submit"
                color="primary"
                large
                :disabled="isSubmitting"
                :loading="isSubmitting"
              >
                {{ $t('adminRouting.network.update') }}
              </v-btn>
            </slot>
          </div>
        </v-form>
      </div>
    </div>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { TenantService } from '@deip/tenant-service';
  import { mapGetters } from 'vuex';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminNetwork',
    components: { AdminView, DFormBlock },

    data() {
      return {
        isSubmitting: false,
        formData: {
          globalNetworkIsVisible: false,
        }
      }
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    methods: {
      onSubmit() {
        this.isSubmitting = true;
        this.updateNetworkSettings(this.formData)
          .finally(() => {
            this.isSubmitting = false;
          })
      },

      updateNetworkSettings(form) {
        return tenantService.updateNetworkSettings(form)
          .then(() => {
            this.$notifier.showSuccess(this.$t('adminRouting.network.success'));
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('adminRouting.network.err'));
          })
      },
    },

    created() {
      // temp
      this.formData.globalNetworkIsVisible = this.tenant.profile.network.scope.some(id => id === 'all');
    },
  };
</script>

<style scoped>
</style>
