<template>
  <full-screen-modal :title="title">
    <v-form ref="form" v-model="isFormValid">
      <v-text-field
        v-model="categoryTitle"
        outlined
        hide-details
        :label="$t('adminRouting.categories.categoryEdit.nameField')"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <div class="text-right mt-4">
        <v-btn
          color="primary"
          class="mr-4"
          text
          :loading="isSaving"
          :disabled="isSaving"
          @click="$router.back()"
        >
          {{ $t('adminRouting.categories.categoryEdit.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="save()"
        >
          {{ $t('adminRouting.categories.categoryEdit.submitBtn') }}
        </v-btn>
      </div>
    </v-form>
  </full-screen-modal>
</template>

<script>
  import { PortalService } from '@deip/portal-service';

  import { mapGetters } from 'vuex';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';

  const portalService = PortalService.getInstance();

  export default {
    name: 'AdminCategoryEdit',
    components: { FullScreenModal },
    props: {
      title: {
        type: String,
        default() { return this.$t('adminRouting.categories.categoryEdit.title'); }
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || this.$t('defaultNaming.fieldRules.required') },
        categoryTitle: '',
        isFormValid: false,
        isSaving: false
      };
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const updatedProfile = _.cloneDeep(this.$portal.profile);
        updatedProfile.settings.projectCategories = [{ text: this.categoryTitle }, ...this.$portal.profile.settings.projectCategories];
        portalService.updatePortalProfile(updatedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const portal = window.env.TENANT;
            this.$store.dispatch('auth/loadPortal', { portal });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => {
            this.isSaving = true;
            setTimeout(() => this.$router.push({ name: 'admin.categories' }), 500);
          });
      }
    }
  };
</script>
