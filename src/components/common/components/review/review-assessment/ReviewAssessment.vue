<template>
  <div>
    <v-row
      v-for="(criteria, i) in criterias"
      :key="`review-criteria-${i}`"
      no-gutters
      align="center"
      class="full-width py-2"
    >
      <v-col>
        {{ criteria.title }}:
      </v-col>
      <v-col>
        <review-assessment-squared-rating
          v-model="form[criteria.id]"
          class="pl-6"
          :readonly="readonly"
          :max-value="criteria.max"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ReviewAssessment',

    props: {
      value: {
        type: Object,
        required: true
      },
      researchContentType: {
        type: String,
        required: true
      },
      readonly: {
        type: Boolean,
        required: false,
        default: true
      }
    },

    data() {
      return {
        form: Object.keys(this.value)
          .reduce((form, field) => {
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
          const keys = Object.keys(newVal);
          for (let i = 0; i < keys.length; i++) {
            const id = keys[i];
            if (this.criterias.some((criteria) => criteria.id == id) && this.form[id] != newVal[id]) {
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
