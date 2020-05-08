<template>
  <modal-route-view :title="title">
    <v-form ref="form">
      <v-text-field
        v-model="formData.readinessLevelTitle"
        label="Criteria name"
        outlined
      />

      <div class="subtitle-1 font-weight-medium mb-2">
        Steps
      </div>

      <readiness-level-list class="py-0">
        <readiness-level-item
          v-for="(field,index) of formData.readinessLevels"
          :key="'level-' + index"
          :dot-num="index + 1"
          class="px-0"
        >

          <v-text-field
            v-model="formData.readinessLevels[index]"
            label="Criteria name"
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
        </readiness-level-item>

        <readiness-level-list-button
          class="px-0"
          icon="add"
          @click="addField"
        />
      </readiness-level-list>

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
  import ReadinessLevelItem from '@/components/ReadinessLevel/ReadinessLevelItem';
  import ReadinessLevelList from '@/components/ReadinessLevel/ReadinessLevelList';
  import ReadinessLevelListButton from '@/components/ReadinessLevel/ReadinessLevelListButton';

  export default {
    name: 'AdminCriteriaEdit',
    components: {
      ReadinessLevelListButton,
      ReadinessLevelList,
      ReadinessLevelItem,
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
          readinessLevelTitle: '',
          readinessLevels: []
        }
      };
    },
    mounted() {
      this.addField();
    },
    methods: {
      addField() {
        this.formData.readinessLevels.push(null);
      },
      removeField(index) {
        this.$delete(this.readinessLevels, index);
      },
      save() {}
    }
  };
</script>

<style scoped>

</style>
