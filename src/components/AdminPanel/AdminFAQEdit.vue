<template>
  <modal-route-view :title="title">
    <v-form ref="form" v-model="isFormValid">
      <v-textarea
        v-model="formData.question"
        outlined
        auto-grow
        rows="1"
        label="Question"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <v-textarea
        v-model="formData.answer"
        outlined
        auto-grow
        rows="8"
        label="Answer"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <v-checkbox v-model="formData.isVisible" label="Publish FAQ" />

      <div class="text-right mt-5">
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
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import { TenantService } from '@deip/tenant-service';

  import { mapGetters } from 'vuex';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminFAQEdit',
    components: { ModalRouteView },
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
        isFormValid: false,
        isSaving: false,
        formData: {
          question: '',
          answer: '',
          isVisible: true
        }
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        faqs: 'adminPanel/faqs'
      })
    },
    created() {
      if (this.$route.query.id) {
        const editFAQ = this.faqs.find(
          ({ _id }) => _id === this.$route.query.id
        );
        if (editFAQ) {
          this.formData = { ...editFAQ };
        }
      }
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const { _id } = this.formData;

        const updatedProfile = _.cloneDeep(this.tenant.profile);
        if (_id) {
          updatedProfile.settings.faq = updatedProfile.settings.faq.map((item) => (item._id === _id ? this.formData : item));
        } else {
          updatedProfile.settings.faq.push(this.formData);
        }
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Successfully' });
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          })
          .finally(() => {
            this.isSaving = true;
            setTimeout(() => this.$router.push({ name: 'admin.faq' }), 500);
          });
      }
    }
  };
</script>

<style scoped>
</style>
