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
  import { PortalService } from '@deip/portal-service';
  import { mapGetters } from 'vuex';

  const portalService = PortalService.getInstance();

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

    methods: {
      onSubmit() {
        this.isSubmitting = true;
        this.updateNetworkSettings(this.formData)
          .finally(() => {
            this.isSubmitting = false;
          })
      },

      updateNetworkSettings(form) {
        return portalService.updateNetworkSettings(form)
          .then(() => {
            this.$notifier.showSuccess(this.$t('adminRouting.network.success'));
            const portal = window.env.TENANT;
            this.$store.dispatch('auth/loadPortal', { portal });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('adminRouting.network.err'));
          })
      },
    },

    created() {
      this.formData.globalNetworkIsVisible = this.$portal.profile.network.isGlobalScopeVisible;
    },
  };
</script>

<style scoped>
</style>
