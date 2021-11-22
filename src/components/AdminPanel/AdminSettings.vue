<template>
  <admin-view :title="$t('adminRouting.settings.title')">
    <v-form ref="form" @submit.prevent="onSubmit"> 
      <v-row class="my-4">
        <d-form-block :title="$t('adminRouting.settings.changeLogo')" class="form-block">
          <v-col cols="12">
            <div class="logo-container">
              <v-img
                class="grey lighten-4"
                contain
                height="80%"
                width="100%"
                :src="$options.filters.tenantLogoSrc($tenant)"
              />
              <d-file-input
                id="title"
                class="mt-4"
                v-model="formData.logo"
                :label="$tenant.profile.logo"
                :disabled="isSubmitting"
                hint="Logo image should be at least 80 x 80 px in dimension"
                hide-details="auto"
              />
            </div>
          </v-col>
        </d-form-block>
      </v-row>
      <v-row class="my-8"> 
        <d-form-block :title="$t('adminRouting.settings.changeBanner')" class="form-block">
          <v-col cols="12">
            <div class="banner-container">
              <v-img
                class="grey lighten-4"
                contain
                height="80%"
                width="100%"
                :src="$options.filters.tenantBackgroundSrc($tenant)"
              />
              <d-file-input
                id="banner"
                class="mt-4"
                v-model="formData.banner"
                :label="$tenant.profile.banner"
                :disabled="isSubmitting"
                hint="Background image should be at least 1440 x 430 px in dimension"
                hide-details="auto"
              />
            </div>
          </v-col>
        </d-form-block>
      </v-row>
      <v-row> 
        <d-form-block :title="$t('adminRouting.settings.changeTabTitle')" class="form-block">
          <v-col cols="12">
            <div>
              <v-text-field
                v-model="formData.title"
                outlined
                :label="$tenant.profile.name"
                :disabled="isSubmitting"
                hide-details="auto"
              />
            </div>
          </v-col>
        </d-form-block>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="text-right">
            <v-btn
              large
              type="submit"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              class="ma-0"
              color="primary"
            >
              {{ $t('adminRouting.settings.update') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { TenantService } from '@deip/tenant-service';
  import { mapGetters } from 'vuex';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminSettings',
    components: { AdminView, DFileInput, DFormBlock },

    data() {
      return {
        formData: {
          title: '',
          banner: null,
          logo: null
        },
        isSubmitting: false,
      };
    },

    methods: {

      onSubmit() {
        const formData = {
          title: this.formData.title,
          banner: '',
          logo: ''
        };

        if (this.formData.banner) {
          formData.banner = this.formData.banner.name;
          formData.bannerFile = this.formData.banner;
        }
        if (this.formData.logo) {
          formData.logo = this.formData.logo.name;
          formData.logoFile = this.formData.logo;
        }

        this.isSubmitting = true;
        this.updateTenantSettings(formData)
          .finally(() => {
            this.isSubmitting = false;
          });
      },

      updateTenantSettings(form) {
        return tenantService.updateTenantSettings(form)
          .then(() => {
            this.$notifier.showSuccess(this.$t('adminRouting.settings.success'));
            const tenant = window.env.TENANT;
            return this.$store.dispatch('auth/loadTenant', { tenant })
          })
          .then(() => {
            document.title = this.$tenant.profile.name;
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(this.$t('adminRouting.settings.err'));
          });
      }
    }
  };
</script>

<style scoped>
  .form-block {
    width: 100%;
  }

  .banner-container {
    width: 100%;
    height: 260px;
  }
  .logo-container {
    width: 100%;
    height: 80px;
  }

</style>
