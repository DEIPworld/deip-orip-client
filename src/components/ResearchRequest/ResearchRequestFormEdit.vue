<template>
  <research-request-form-view
    v-model="formData"
    :disabled="formProcessing"
    :partial-disabled="{
      researchTitle: true,
      description: true
    }"
    :loading="formProcessing"
    @submit="editResearch"
  />
</template>

<script>
  import ResearchRequestFormView from '@/components/ResearchRequest/ResearchRequestFormView';
  import { ResearchRequestModelMixin } from '@/components/ResearchRequest/ResearchRequestModelMixin';
  import { ResearchService } from '@deip/research-service';
  import objectRenameKeys from 'object-rename-keys';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchRequestFormEdit',
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
      },

      editResearch(success) {
        if (!success) return;

        this.formProcessing = true;

        const formData = this.createFormData(this.formData);

        researchService.editResearchApplicationViaOffchain(this.formData._id, formData)
          .then((result) => {
            this.$notifier.show(`Project "${this.formData.researchTitle}" has been updated successfully`, 'success')
            this.$emit('done');
            this.formProcessing = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
</script>
