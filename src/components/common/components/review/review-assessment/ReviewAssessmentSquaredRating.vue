<template>
  <div class="review-assessment-squared-rating">
    <div v-for="i in maxValue" :key="i" 
      :class="{ 'point': true, 'point--readonly': readonly }"
      :style="{ backgroundColor: getColor(i) }"
      @click="!readonly && onPointClick(i)"
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
    
    getColor(pointIndex) {
      const defaultColor = '#E0E0E0';
      if (pointIndex > this.rating) {
        return defaultColor;
      }
      switch (this.rating) {
        case 1:
          return '#F44336';
        case 2:
          return '#F49D36';
        case 3:
          return '#F2C94C';
        case 4:
          return '#A1CF55';
        case 5:
          return '#43A047';
        default:
          return defaultColor;
      }
    },

    onPointClick(ratingValue) {
      this.rating = ratingValue;
      this.$emit('input', ratingValue);
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
