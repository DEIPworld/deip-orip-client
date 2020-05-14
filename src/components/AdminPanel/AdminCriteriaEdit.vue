<template>
  <modal-route-view :title="title">
    <v-form ref="form">
      <v-text-field
        v-model="formData.component.readinessLevelTitle"
        label="Criterion name"
        outlined
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="formData.component.readinessLevelShortTitle"
        label="Criterion short name"
        outlined
        :rules="[rules.required]"
      />

      <div class="subtitle-1 font-weight-medium mb-2">
        Steps
      </div>

      <leveller-list class="py-0">
        <leveller-item
          v-for="(field,index) of formData.component.readinessLevels"
          :key="'level-' + index"
          :dot-num="index + 1"
          class="px-0"
          double-field
        >
          <v-text-field
            v-model="formData.component.readinessLevels[index].title"
            label="Step name"
            outlined
            hide-details
            solo
            flat
            class="py-2"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="formData.component.readinessLevels[index].description"
            label="Step description"
            outlined
            hide-details
            solo
            flat
            class="py-2"
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
      
      <v-row no-gutters>
        <v-spacer />
        <v-col cols="auto">
          <v-checkbox class="mt-6" v-model="formData.isVisible" label="Publish Stepper" />
        </v-col>
      </v-row>

      <div class="mt-6 text-right">
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
  import LevellerItem from '@/components/Leveller/LevellerItem';
  import LevellerList from '@/components/Leveller/LevellerList';
  import LevellerListButton from '@/components/Leveller/LevellerListButton';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCriteriaEdit',
    components: {
      LevellerListButton,
      LevellerList,
      LevellerItem,
      ModalRouteView
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
          component: {
            readinessLevelTitle: '',
            readinessLevelShortTitle: '',
            readinessLevels: []
          }
        }
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchComponents: 'adminPanel/researchComponents'
      })
    },
    created() {
      if (this.$route.query.id) {
        const editStepper = this.researchComponents.find(
          ({ _id }) => _id === this.$route.query.id
        );
        if (editStepper) {
          this.formData = _.cloneDeep(editStepper);
        }
      } else {
        this.addField();
      }
    },
    methods: {
      addField() {
        this.formData.component.readinessLevels.push({ title: '', description: '' });
      },
      removeField(index) {
        this.$delete(this.formData.component.readinessLevels, index);
      },
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const { _id } = this.formData;

        const updatedProfile = _.cloneDeep(this.tenant.profile);
        if (_id) {
          updatedProfile.settings.researchComponents = updatedProfile.settings.researchComponents.map((item) => (item._id === _id ? this.formData : item));
        } else {
          updatedProfile.settings.researchComponents.push(this.formData);
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
            setTimeout(() => this.$router.push({ name: 'admin.criteria' }), 500);
          });
      }
    }
  };
</script>

<style scoped>

</style>
