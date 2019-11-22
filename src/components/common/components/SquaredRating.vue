<template>
  <div class="squared-rating">
    <div
      v-for="i in MAX_VALUE" :key="i"
      :class="{
        'point': true,
        'point--readonly': readonly
      }"
      :style="{
        backgroundColor: getColor(i)
      }"
      @click="!readonly && onPointClick(i)"
    />
  </div>
</template>

<script>
const MAX_VALUE = 5;

export default {
  name: "SquaredRating",
  props: {
    readonly: { type: Boolean, required: false, default: false },
    value: {
      type: Number,
      required: false,
      default: 0,
      validator(value) {
        return value >=0 && value <= MAX_VALUE;
      },
    }
  },
  data() {
    return {
      defaultColor: '#E0E0E0',

      rating: this.value,
      MAX_VALUE,
    };
  },
  methods: {
    getColor(pointIndex) {
      if (pointIndex > this.rating) {
        return this.defaultColor;
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
          return this.defaultColor;
      }
    },
    onPointClick(ratingValue) {
      this.rating = ratingValue;
      this.$emit('input', ratingValue);
    }
  },
};
</script>

<style lang="less" scoped>
  .squared-rating {
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
