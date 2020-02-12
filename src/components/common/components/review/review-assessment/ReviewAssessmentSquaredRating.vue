<template>
  <div class="review-assessment-squared-rating">
    <div v-for="val in maxValue" :key="val" 
      :class="{ 'point': true, 'point--readonly': readonly }"
      :style="{ backgroundColor: getColor(val) }"
      @click="!readonly && onPointClick(val)"
    />
  </div>
</template>

<script>

export default {
  name: "ReviewAssessmentSquaredRating",
  props: {
    readonly: { type: Boolean, required: false, default: true },
    maxValue: { type: Number, required: false, default: 5 },
    value: { type: Number, required: false, default: 0 }
  },
  data() {
    return {
      rating: this.value
    };
  },
  methods: {
    
    getColor(val) {
      let max = this.maxValue;
      let avg = max / 2;

      let neutral = "#E0E0E0";

      let veryLow = "#F44336";
      let low = "#F49D36";
      let moderate = "#F2C94C";
      let high = "#A1CF55";
      let veryHight = "#43A047";

      if (val > this.rating) {
        return neutral;
      }

      if (this.rating == 1) {
        return veryLow;
      } else if (this.rating > 1 && this.rating < Math.ceil(avg)) {
        return low;
      } else if (this.rating == Math.ceil(avg)) {
        return moderate;
      } else if (this.rating > Math.ceil(avg) && this.rating < max) {
        return high;
      } else if (this.rating == max) {
        return veryHight;
      } else {
        return neutral;
      }
    },

    onPointClick(val) {
      this.rating = val;
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="less" scoped>
  .review-assessment-squared-rating {
    display: flex;
    .point {
      display: inline-flex;
      height: 14px;
      width: 14px;
      margin-right: 1px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &--readonly {
        cursor: default;
      }
    }
  }
</style>
