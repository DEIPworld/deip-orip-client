<template>
  <div class="review-assessment-squared-rating">
    <div
      v-for="val in maxValue"
      :key="val"
      :class="{ 'point': true, 'point--readonly': readonly }"
      :style="{ backgroundColor: getColor(val) }"
      @click="!readonly && onPointClick(val)"
    />
  </div>
</template>

<script>

  export default {
    name: 'ReviewAssessmentSquaredRating',
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
        const max = this.maxValue;
        const avg = max / 2;

        const neutral = '#E0E0E0';

        const veryLow = '#F44336';
        const low = '#F49D36';
        const moderate = '#F2C94C';
        const high = '#A1CF55';
        const veryHight = '#43A047';

        if (val > this.rating) {
          return neutral;
        }

        if (this.rating == 1) {
          return veryLow;
        } if (this.rating > 1 && this.rating < Math.ceil(avg)) {
          return low;
        } if (this.rating == Math.ceil(avg)) {
          return moderate;
        } if (this.rating > Math.ceil(avg) && this.rating < max) {
          return high;
        } if (this.rating == max) {
          return veryHight;
        }
        return neutral;
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
