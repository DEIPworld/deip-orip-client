<template>
  <full-screen-modal :title="title">
    <v-form ref="form" v-model="isFormValid">
      <v-text-field
        v-model="categoryTitle"
        filled
        hide-details
        label="Category name"
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
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="save()"
        >
          Save
        </v-btn>
      </div>
    </v-form>
  </full-screen-modal>
</template>

<script>
  import { TenantService } from '@deip/tenant-service';

  import { mapGetters } from 'vuex';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCategoryEdit',
    components: { FullScreenModal },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || 'This field is required' },
        categoryTitle: '',
        isFormValid: false,
        isSaving: false
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.researchCategories = [{ text: this.categoryTitle }, ...this.tenant.profile.settings.researchCategories];
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$notifier.showSuccess()
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
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
