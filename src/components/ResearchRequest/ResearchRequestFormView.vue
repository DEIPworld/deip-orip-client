<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block :title="$t('defaultNaming.forms.researchRequest.basicBlock.title')">
      <v-col cols="12">
        <v-text-field
          v-model="formData.researchTitle"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.nameField')"
          v-bind="fieldState"
          :disabled="partialDisabled.researchTitle"
          :rules="[rules.required, rules.titleLength]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.description"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.ideaField')"
          auto-grow
          outlined
          rows="3"
          v-bind="fieldState"
          :disabled="partialDisabled.description"
          :rules="[rules.required, rules.descriptionLength]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="formData.researchDisciplines[0]"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.domainField')"
          v-bind="fieldState"
          :rules="[rules.required]"
          :disabled="partialDisabled.researchDisciplines"
          :items="domains"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.location.country"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.locationField')"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.problem"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.areaField')"
          auto-grow
          outlined
          rows="3"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="formData.solution"
          :label="$t('defaultNaming.forms.researchRequest.basicBlock.solveField')"
          auto-grow
          outlined
          rows="3"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block :title="$t('defaultNaming.forms.researchRequest.readinesBlock.title')">
      <template v-for="(item, i) in tenant.profile.settings.researchAttributes">
        <v-col
          v-if="item.isPublished"
          :key="`${i}-stepper`"
          cols="12"
        >
          <leveller-selector
            v-model="formData.attributes[i].value"
            :x-props="fieldState"
            :items="stepperSelector(item.valueOptions)"
            :label="item.title"
          />
        </v-col>
      </template>
    </d-form-block>

    <d-form-block :title="$t('defaultNaming.forms.researchRequest.fundingBlock.title')">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.funding"
          :label="$t('defaultNaming.forms.researchRequest.fundingBlock.fundingField')"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.eta"
          :label="$t('defaultNaming.forms.researchRequest.fundingBlock.estimateField')"
          v-bind="fieldState"
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block :title="$t('defaultNaming.forms.researchRequest.addInfBlock.title')">
      <v-col cols="12" md="6">
        <d-file-input
          v-model="formData.budgetAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          :label="$t('defaultNaming.forms.researchRequest.addInfBlock.budgetInfField')"
          :exist="getAttachmentUrl(formData.budgetAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-file-input
          v-model="formData.businessPlanAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          :label="$t('defaultNaming.forms.researchRequest.addInfBlock.planField')"
          :exist="getAttachmentUrl(formData.businessPlanAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-file-input
          v-model="formData.cvAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          :label="$t('defaultNaming.forms.researchRequest.addInfBlock.cvField')"
          :exist="getAttachmentUrl(formData.cvAttachment, false)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <d-file-input
          v-model="formData.marketResearchAttachment"
          :x-props="{ disabled: fieldState.disabled || fieldState.readonly }"
          :label="$t('defaultNaming.forms.researchRequest.addInfBlock.documentField')"
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
          {{ $t('defaultNaming.forms.researchRequest.cancel') }}
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          class="ml-2"
          :loading="loading"
        >
          {{ $t('defaultNaming.forms.researchRequest.submitBtn') }}
        </v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import { mapGetters } from 'vuex';
  import { FormMixin } from '@/utils/FormMixin';
  import { AccessService } from '@deip/access-service';
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';
  import { maxTitleLength, maxDescriptionLength } from '@/variables';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchRequestFormView',
    components: {
      DFileInput,
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
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          titleLength: (value) => (!!value && value.length <= maxTitleLength) || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength }),
          descriptionLength: (value) => (!!value && value.length <= maxDescriptionLength) || this.$t('defaultNaming.fieldRules.descriptionMax', { maxDescriptionLength })
        },
        domains: [...disciplinesService.getTopLevelNodes().map(((d) => ({ text: d.label, value: d.id })))]
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      }),

      fieldState(e) {
        return {
          disabled: this.disabled,
          readonly: this.readonly,
          outlined: true,
          dense: true
        };
      }
    },
    methods: {
      stepperSelector(options) {
        return options.map((item, index) => ({
          text: item.title,
          value: item.value,
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
