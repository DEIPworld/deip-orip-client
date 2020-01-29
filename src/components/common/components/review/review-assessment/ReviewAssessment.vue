<template>
  <div>
    <v-layout v-for="(criteria, i) in criterias" :key="`review-criteria-${i}`" row justify-space-between align-center class="py-2 full-width" >
      <div>{{criteria.title}}:</div>
      <review-assessment-squared-rating class="pl-4" v-model="form[criteria.name]" :readonly="readonly" />
    </v-layout>
  </div>
</template>

<script>

import { getAssessmentCriteria } from "@/services/ReviewsService"

export default {
  name: "ReviewAssessment",
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
      }, {})
    };
  },

  computed: {
    criterias() {
      return getAssessmentCriteria(this.researchContentType)
    }
  },

  watch: {

    value: {
      handler(newVal, oldVal) {
        let keys = Object.keys(newVal);
        for (let i = 0; i < keys.length; i++) {
          let name = keys[i];
          if (this.criterias.some(criteria => criteria.name == name) && this.form[name] != newVal[name]) {
            this.form[name] = newVal[name];
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
