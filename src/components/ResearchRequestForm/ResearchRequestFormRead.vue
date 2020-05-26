<template>
  <research-request-form-view
    v-model="formData"
    :readonly="true"
    :hide-buttons="!$hasSlot('buttons')"
  >
    <template #buttons>
      <slot name="buttons" />
    </template>

  </research-request-form-view>
</template>

<script>
  import ResearchRequestFormView from '@/components/ResearchRequestForm/ResearchRequestFormView';
  import objectRenameKeys from 'object-rename-keys';
  import { ResearchRequestModelMixin } from '@/components/ResearchRequestForm/ResearchRequestModelMixin';

  export default {
    name: 'ResearchRequestFormRead',
    components: {
      ResearchRequestFormView
    },
    mixins: [ResearchRequestModelMixin],

    data() {
      return {
        oldresearchId: null
      };
    },

    created() {
      this.getResearch();
    },

    methods: {
      getResearch() {
        if (this.researchId && this.researchId !== this.oldresearchId) {
          this.oldresearchId = this.researchId;

          const request = this.$store.getters[this.getFrom].filter((k) => k._id === this.researchId)[0];

          this.formData = objectRenameKeys(request, {
            title: 'researchTitle',
            disciplines: 'researchDisciplines'
          });
        }
      }
    }
  };
</script>
