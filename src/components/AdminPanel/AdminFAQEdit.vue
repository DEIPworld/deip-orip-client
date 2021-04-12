<template>
  <full-screen-modal :title="title">
    <v-form ref="form" v-model="isFormValid">
      <v-textarea
        v-model="formData.question"
        outlined
        auto-grow
        rows="1"
        :label="$t('adminRouting.faq.faqEdit.questionField')"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <v-textarea
        v-model="formData.answer"
        outlined
        auto-grow
        rows="8"
        :label="$t('adminRouting.faq.faqEdit.answerField')"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <v-row no-gutters class="align-center">
        <v-col cols="auto">
          <v-checkbox
            v-model="formData.isPublished"
            class="ma-0 pa-0"
            hide-details
            :label="$t('adminRouting.faq.faqEdit.publishField')"
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            color="primary"
            class="mr-4"
            text
            :loading="isSaving"
            :disabled="isSaving"
            @click="$router.back()"
          >
            {{ $t('adminRouting.faq.faqEdit.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
            @click="save()"
          >
            {{ $t('adminRouting.faq.faqEdit.submitBtn') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </full-screen-modal>
</template>

<script>
  import { TenantService } from '@deip/tenant-service';

  import { mapGetters } from 'vuex';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminFAQEdit',
    components: { FullScreenModal },
    props: {
      title: {
        type: String,
        default() { return this.$t('adminRouting.faq.faqEdit.title'); }
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || this.$t('defaultNaming.fieldRules.required') },
        isFormValid: false,
        isSaving: false,
        formData: {
          question: '',
          answer: '',
          isPublished: true
        }
      };
    },
    computed: {
      ...mapGetters({
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

        const updatedProfile = _.cloneDeep(this.$tenant.profile);
        if (_id) {
          updatedProfile.settings.faq = updatedProfile.settings.faq.map((item) => (item._id === _id ? this.formData : item));
        } else {
          updatedProfile.settings.faq.push(this.formData);
        }
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
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
