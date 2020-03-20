<template>
  <div>
    <v-layout row justify-space-between align-center 
      v-for="(criteria, i) in criterias" 
      :key="`review-criteria-${i}`" 
      class="py-2 full-width">
      <div>{{criteria.title}}:</div>
      <review-assessment-squared-rating class="pl-4" 
        v-model="form[criteria.id]" 
        :readonly="readonly"
        :maxValue="criteria.max" />
    </v-layout>
  </div>
</template>

<script>
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ReviewAssessment',

    props: {
      value: { type: Object, required: true },
      researchContentType: { type: String, required: true },
      readonly: { type: Boolean, required: false, default: true }
    },

    data() {
      return {
        form: Object.keys(this.value).reduce((form, field) => {
          form[field] = this.value[field];
          return form;
        }, {}),
        criterias: researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.researchContentType)
      };
    },

    // computed: {
    //   criterias() {
    //     return researchContentReviewsService.getAssessmentCriteriasForResearchContent(this.researchContentType)
    //   }
    // },

    watch: {

      value: {
        handler(newVal, oldVal) {
          let keys = Object.keys(newVal);
          for (let i = 0; i < keys.length; i++) {
            let id = keys[i];
            if (this.criterias.some(criteria => criteria.id == id) && this.form[id] != newVal[id]) {
              this.form[id] = newVal[id];
            }
          }
        },
        deep: true
      },

      form: {
        handler(newVal, oldVal) {
          this.$emit('input', newVal);
        },
        deep: true
      }

    }
  };
</script>

<style lang="less" scoped>

</style>
