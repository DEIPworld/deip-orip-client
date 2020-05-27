<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block title="Basics">
      <v-col cols="12">
        <v-text-field
          v-model="formData.researchTitle"
          label="Project name"
          v-bind="fieldState"
          :disabled="partialDisabled.researchTitle"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.description"
          label="What is your idea?"
          auto-grow
          rows="3"
          v-bind="fieldState"
          :disabled="partialDisabled.description"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="formData.researchDisciplines[0]"
          label="Domain"
          v-bind="fieldState"
          :rules="[rules.required]"
          :items="[
            {text: 'Bio Products', value: 1},
            {text: 'Bio Energy', value: 2},
            {text: 'Bio Food', value: 3},
            {text: 'Bio Chemical', value: 4},
            {text: 'Bio Fiber', value: 5},
            {text: 'Bio Mechanical', value: 6}
          ]"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.location.country"
          label="Project location"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.problem"
          label="What area are you trying to impact?"
          auto-grow
          rows="3"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.solution"
          label="How will this solve a current problem?"
          auto-grow
          rows="3"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Project readines level">
      <template v-for="(item, i) in tenant.profile.settings.researchComponents">
        <v-col
          v-if="item.isVisible"
          :key="`${i}-stepper`"
          cols="12"
        >
          <leveller-selector
            v-model="formData.tenantCriterias[i].value.index"
            :x-props="fieldState"
            :items="stepperSelector(item.component.readinessLevels)"
            :label="item.component.readinessLevelTitle"
          />
        </v-col>
      </template>
    </d-form-block>

    <d-form-block title="Funfing">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.funding"
          label="How much funding are you expecting?"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.eta"
          label="What is your project estimate?"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Additional information">
      <v-col cols="12" md="6">
        <d-input-file
          v-model="formData.budgetAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          label="Budget information"
          :exist="getAttachmentUrl(formData.budgetAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-input-file
          v-model="formData.businessPlanAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          label="Business plan"
          :exist="getAttachmentUrl(formData.businessPlanAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-input-file
          v-model="formData.cvAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          label="Resume/CV"
          :exist="getAttachmentUrl(formData.cvAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-input-file
          v-model="formData.marketResearchAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          label="Market research document"
          :exist="getAttachmentUrl(formData.marketResearchAttachment, false)"
        />
      </v-col>
    </d-form-block>


    <div v-if="!hideButtons" class="text-right">
      <slot name="buttons">
        <v-btn
          type="button"
          text
          color="primary"
          :disabled="disabled"
          @click="$router.back()"
        >
          Cancel
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          class="ml-2"
          :loading="loading"
        >
          Apply request
        </v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import LevellerSelector from '@/components/Leveller/LevellerSelector';
  import DInputFile from '@/components/Deipify/DInputFile/DInputFile';
  import { mapGetters } from 'vuex';
  import { FormMixin } from '@/utils/FomMixin';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchRequestFormView',
    components: {
      DInputFile,
      LevellerSelector,
      DFormBlock
    },
    mixins: [FormMixin],
    model: {
      prop: 'formData'
    },
    props: {
      formData: {
        type: Object,
        default: () => ({})
      },

      hideButtons: {
        type: Boolean,
        default: false
      },

      partialDisabled: {
        type: Object,
        default: () => ({})
      },

      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || 'This field is required' },
      }
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      }),

      fieldState(e) {
        return {
          disabled: this.disabled,
          readonly: this.readonly,
          filled: true
        };
      }
    },
    methods: {
      stepperSelector(readinessLevels) {
        return readinessLevels.map((item, index) => ({
          text: item.title,
          value: index,
          num: index + 1
        }));
      },
      getAttachmentUrl(filename, download = false) {
        if (this.formData._id && filename) {
          return `${window.env.DEIP_SERVER_URL}/api/research/application/${this.formData._id}/attachment?filename=${filename}&download=${download}&authorization=${accessService.getAccessToken()}`;
        }

        return false;
      }
    }
  };
</script>

<style scoped>

</style>
