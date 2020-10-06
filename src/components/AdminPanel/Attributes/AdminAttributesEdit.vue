<template>
  <d-layout-full-screen :title="title">
    <v-form ref="form">
      <template v-if="!formData._id">
        <v-select
          v-model="formData.type"
          outlined
          hide-details="auto"
          :label="$t('adminRouting.attributes.attributesEdit.typeField')"
          :items="attrsList"
        />
        <v-divider class="my-6" />
      </template>

      <attributes-edit v-model="formData" :type="formData.type" />

      <v-divider class="my-6" />

      <v-row no-gutters class="align-center">
        <v-col cols="auto">
          <v-checkbox
            v-model="formData.isPublished"
            class="ma-0 pa-0"
            hide-details
            :label="$t('adminRouting.attributes.attributesEdit.publishField')"
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            color="primary"
            class="mr-4"
            text
            :disabled="isSaving"
            @click="$router.back()"
          >
            {{ $t('adminRouting.attributes.attributesEdit.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
            @click="save()"
          >
            {{ $t('adminRouting.attributes.attributesEdit.submitBtn') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </d-layout-full-screen>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import { ATTR_TYPES, ATTR_LABELS } from '@/variables';

  import { defaultAttributeModel } from '@/components/Attributes/mixins';
  import AttributesEdit from '@/components/Attributes/AttributesEdit';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminAttributesEdit',
    components: {
      DLayoutFullScreen,
      AttributesEdit,
    },
    props: {
      title: {
        type: String,
        default() { return this.t('adminRouting.attributes.attributesEdit.title'); }
      }
    },
    data() {
      return {
        ATTR_TYPES,
        ATTR_LABELS,

        rules: { required: (value) => !!value || this.$t('defaultNaming.fieldRules.required') },

        formData: {
          type: ATTR_TYPES.TEXT,
          ...defaultAttributeModel()
        },

        isFormValid: false,
        isSaving: false
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchAttributes: 'adminPanel/researchAttributes'
      }),

      attrsList() {
        return Object.keys(this.ATTR_LABELS)
          .map((key) => ({ value: key, text: this.ATTR_LABELS[key] }));
      }
    },
    created() {
      if (this.$route.query.id) {
        const attribute = this.researchAttributes.find(({ _id }) => _id === this.$route.query.id);
        if (attribute) {
          this.formData = _.cloneDeep(attribute);
        }
      }
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const isNewAttribute = !this.formData._id;

        const promise = isNewAttribute
          ? tenantService.createTenantResearchAttribute(this.formData)
          : tenantService.updateTenantResearchAttribute(this.formData);

        promise
          .then(() => {
            this.$notifier.showSuccess();

            const tenant = window.env.TENANT;

            this.$store.dispatch('auth/loadTenant', { tenant });

            this.isSaving = false;
            setTimeout(() => this.$router.push({ name: 'admin.attributes' }), 500);
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
            this.isSaving = false;
          })
      }
    }
  };
</script>
