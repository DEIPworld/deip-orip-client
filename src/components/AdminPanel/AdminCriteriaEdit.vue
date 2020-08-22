<template>
  <full-screen-modal :title="title">
    <v-form ref="form">
      <v-text-field
        v-model="formData.title"
        label="Criterion name"
        outlined
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="formData.shortTitle"
        label="Criterion short name"
        outlined
        :rules="[rules.required]"
      />

      <div class="text-subtitle-1 font-weight-medium mb-2">
        Steps
      </div>

      <leveller-list class="py-0">
        <leveller-item
          v-for="(field,index) of formData.valueOptions"
          :key="'level-' + index"
          :dot-num="index + 1"
          class="px-0"
          :ctrl-height="72"
        >
          <v-text-field
            v-model="formData.valueOptions[index].title"
            label="Step name"
            outlined
            hide-details
            class="mt-2"
            :rules="[rules.required]"
          />
          <v-textarea
            v-model="formData.valueOptions[index].description"
            label="Step description"
            outlined
            hide-details
            auto-grow
            rows="1"
            class="mt-2 mb-4"
          />

          <template #action>
            <v-btn icon @click="removeField(index)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </leveller-item>

        <leveller-list-button
          class="px-0"
          icon="add"
          @click="addField"
        />
      </leveller-list>
      <v-divider class="my-6" />
      <v-row no-gutters class="align-center">
        <v-col cols="auto">
          <v-checkbox
            v-model="formData.isVisible"
            class="ma-0 pa-0"
            hide-details
            label="Publish Criterion"
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
        </v-col>
      </v-row>
    </v-form>
  </full-screen-modal>
</template>

<script>
  import LevellerItem from '@/components/Leveller/LevellerItem';
  import LevellerList from '@/components/Leveller/LevellerList';
  import LevellerListButton from '@/components/Leveller/LevellerListButton';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCriteriaEdit',
    components: {
      FullScreenModal,
      LevellerListButton,
      LevellerList,
      LevellerItem
    },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || 'This field is required' },
        isFormValid: false,
        isSaving: false,
        formData: {
          isVisible: true,
          type: 'stepper',
          title: '',
          shortTitle: '',
          description: '',
          valueOptions: []
        }
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchAttributes: 'adminPanel/researchAttributes'
      })
    },
    created() {
      if (this.$route.query.id) {
        const editStepper = this.researchAttributes.find(({ _id }) => _id === this.$route.query.id);
        if (editStepper) {
          this.formData = _.cloneDeep(editStepper);
        }
      } else {
        this.addField();
      }
    },
    methods: {
      addField() {
        this.formData.valueOptions.push({ title: '', shortTitle: '', description: '' });
      },
      removeField(index) {
        this.$delete(this.formData.valueOptions, index);
      },
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const isNewAttribute = this.formData._id == null;

        let promise = isNewAttribute ? tenantService.createTenantResearchAttribute(this.formData) : tenantService.updateTenantResearchAttribute(this.formData)
        promise
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
            setTimeout(() => this.$router.push({ name: 'admin.criteria' }), 500);
          });
      }
    }
  };
</script>

<style scoped>

</style>
