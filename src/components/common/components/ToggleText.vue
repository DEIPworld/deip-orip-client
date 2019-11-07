<template>
  <v-layout row>
    <div>
      <span>{{hasMoreText ? `${text.slice(0, size)}${!isExpanded ? '...' : ''}` : text }}</span>
      <span v-if="hasMoreText">
        <span v-show="isExpanded">{{text.slice(size + 1, text.length)}}</span>
        <span class="a pl-1" @click="toggle()">{{isExpanded ? collapseText : expandText}}</span>
      </span>
    </div>
  </v-layout>
</template>

<script>

export default {
  name: "ToggleText",
  props: {
    text: { type: String, required: true, default: "" },
    size: { type: Number, required: false, default: 300 },
    expandText: { type: String, required: false, default: "Read more" },
    collapseText: { type: String, required: false, default: "Hide" },
  },
  computed: {
    hasMoreText() {
      return this.text.length > this.size;
    }
  },
  data() {
    return {
      isExpanded: false
    };
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    }
  },

  watch: {}
};
</script>

<style lang="less" scoped>
</style>
