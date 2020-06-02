<template>
  <admin-view title="Settings">
    <div class="title mb-6">
      Change banner on Explore page
    </div>
    <div class="display-flex flex-wrap">
      <div class="mr-6 mb-2">
        <v-img
          class="grey lighten-4"
          contain
          height="252"
          max-width="252"
          :src="$options.filters.tenantBackgroundSrc(tenant.account)"
        />
      </div>
      <div class="flex-grow-1">
        <vue-dropzone
          id="tenant-banner-dropzone"
          ref="tenantBanner"
          class="py-1"
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
            @click="updateBanner()"
          >
            Update banner
          </v-btn>
        </div>
      </div>
    </div>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import VueDropzone from 'vue2-dropzone';
  import { AccessService } from '@deip/access-service';
  import { mapGetters } from 'vuex';

  const accessService = AccessService.getInstance();


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
            '<i class=\'v-icon material-icons mb-2\' style=\'font-size:40px\'>backup</i><div class=\'mb-2\'>Drop files here to upload</div><div class=\'mb-2\'>or</div><button class=\'primary v-btn v-size--small mb-2\'>BROWSE</button><div>Background image should be at least 1440 x 430 px in dimension (.png)</div>',
          addRemoveLinks: true,
          acceptedFiles: ['image/png', 'image/jpeg', 'image/jpg'].join(',')
        }
      }
    },


    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    methods: {
      bannerUploadSuccess(file, response) {
        this.$refs.tenantBanner.removeAllFiles();
        this.isUploadingTenantBanner = false;
        this.$notifier.showSuccess('Banner image has been updated successfully ! Refresh the page to see thr changes');
      },

      bannerUploadSending(file, xhr, formData) {
        const accessToken = accessService.getAccessToken();
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Tenant-Id', this.$env.TENANT);
      },

      bannerUploadError(file, message, xhr) {
        console.log(message);
        this.$refs.tenantBanner.removeAllFiles();
        this.isUploadingTenantBanner = false;
        this.$notifier.showError('Sorry, an error occurred while uploading banner image, please try again later');
      },

      updateBanner() {
        if (this.$refs.tenantBanner.getQueuedFiles().length) {
          this.isUploadingTenantBanner = true;
          this.$refs.tenantBanner.processQueue();
        }
      },

      cancel() {
        this.$refs.tenantBanner.removeAllFiles();
      }
    }
  };
</script>

<style scoped>
</style>
