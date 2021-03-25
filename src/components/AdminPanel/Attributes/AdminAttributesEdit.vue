<template>
  <d-layout-full-screen :title="title">
    <v-form ref="form">
<!--      <template>-->
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
  import { AttributesService } from '@deip/attributes-service';

  import { ATTR_TYPES, ATTR_LABELS, SYSTEM_ATTRS } from '@/variables';

  import { defaultAttributeModel } from '@/components/Attributes/_mixins/edit';
  import AttributesEdit from '@/components/Attributes/AttributesEdit';
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  const attributesService = AttributesService.getInstance();

  export default {
    name: 'AdminAttributesEdit',
    components: {
      DLayoutFullScreen,
      AttributesEdit,
    },
    mixins: [attributesChore],
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
        tenant: 'auth/tenant'
      }),

      attrsList() {
        return Object.keys(this.ATTR_LABELS)
          .reduce((arr, key) => {
            if (!SYSTEM_ATTRS[key]) {
              return [...arr, { value: key, text: this.ATTR_LABELS[key] }];
            }
            return arr;
          }, []);
      }
    },
    created() {
      if (this.$route.query.id) {
        const attribute = this.$$projectAttributes.find(({ _id }) => _id === this.$route.query.id);
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
          ? attributesService.createAttribute(this.formData)
          : attributesService.updateAttribute(this.formData);

        promise
          .then(() => {
            this.$notifier.showSuccess();

            this.$store.dispatch('Attributes/fetch');

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
