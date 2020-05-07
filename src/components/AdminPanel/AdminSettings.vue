<template>
  <admin-view title="Settings">
    <div>
      <vue-dropzone
        id="tenant-banner-dropzone"
        ref="tenantBanner"
        :options="bannerDropzoneOptions"
        @vdropzone-success="bannerUploadSuccess"
        @vdropzone-error="bannerUploadError"
        @vdropzone-sending="bannerUploadSending"
      />
      <div class="py-4 text-right">
        <v-btn
          large
          :disabled="isUploadingTenantBanner"
          :loading="isUploadingTenantBanner"
          class="ma-0"
          color="primary"
          @click="updateBanner()">
          Update banner
        </v-btn>
      </div>
    </div>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import VueDropzone from 'vue2-dropzone';
  import { AccessService } from '@deip/access-service';
  import { AppConfigService } from '@deip/app-config-service';

  const accessService = AccessService.getInstance();
  const appConfigService = AppConfigService.getInstance();


  export default {
    name: 'AdminSettings',
    components: { AdminView, VueDropzone },

    data() {
      return {
        isUploadingTenantBanner: false,
        bannerDropzoneOptions: {
          url: `${env.DEIP_SERVER_URL}/tenant/banner`,
          paramName: 'tenant-banner',
          timeout: 0,
          maxFiles: 1,
          uploadMultiple: false,
          createImageThumbnails: true,
          autoProcessQueue: false,
          dictDefaultMessage:
            '<i class=\'v-icon material-icons\' style=\'font-size:40px\'>backup</i><p>Banner image should be at least 1440 x 430 px in dimension</p>',
          addRemoveLinks: true,
          acceptedFiles: ['image/png', 'image/jpeg', 'image/jpg'].join(',')
        }
      }
    },

    methods: {

      bannerUploadSuccess(file, response) {
        this.$refs.tenantBanner.removeAllFiles();
        this.isUploadingTenantBanner = false;
        this.$store.dispatch('layout/setSuccess', {
          message: 'Banner image has been updated successfully ! Refresh the page to see thr changes'
        });
      },

      bannerUploadSending(file, xhr, formData) {
        const accessToken = accessService.getAccessToken();
        const env = appConfigService.get('env');
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Tenant-Id', env.TENANT);
      },

      bannerUploadError(file, message, xhr) {
        console.log(message);
        this.$refs.tenantBanner.removeAllFiles();
        this.isUploadingTenantBanner = false;
        this.$store.dispatch('layout/setError', { message: 'Sorry, an error occurred while uploading banner image, please try again later' });
      },

      updateBanner() {
        if (this.$refs.tenantBanner.getQueuedFiles().length) {
          this.isUploadingTenantBanner = true;
          this.$refs.tenantBanner.processQueue();
        }
      },

      cancel() {
        this.$refs.tenantBanner.removeAllFiles();
      },
    }

  };
</script>

<style scoped>

</style>
