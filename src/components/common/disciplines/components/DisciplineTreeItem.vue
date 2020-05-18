<template>
  <div
    :class="[!discipline.isTop ? 'mb-1' : '', discipline.isTop ? 'ml-n6' : '']"
  >
    <v-list-item
      v-if="!discipline.isTop"
      :input-value="isSelected || isHighlighted"
      @click="select(discipline)"
    >
      {{ discipline.label }}
    </v-list-item>

    <div v-if="discipline.children" v-show="isExpanded" class="pl-6">
      <discipline-tree-item
        v-for="(val, key) in discipline.children"
        :key="key"
        :discipline="val"
        :selected="selected"
        :is-multiple-select="isMultipleSelect"
        :is-highlighted-parent="isHighlightedParent"
        @update="select"
      />
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  // todo: make single and multiselect handled by arrays bc it will be easier and more readable
  export default {
    name: 'DisciplineTreeItem',

    props: {
      discipline: {
        type: Object,
        required: true
      },
      isMultipleSelect: {
        type: Boolean,
        required: false,
        default: true
      },
      isHighlightedParent: {
        type: Boolean,
        required: false,
        default: false
      },

      selected: {
        validator(value) {
          return value === undefined || typeof value === 'array' || typeof value === 'object';
        },
        required: true
      }
    },

    computed: {
      isSelected() {
        return this.isMultipleSelect
          ? this.selected.some((d) => d.id == this.discipline.id)
          : this.selected && this.selected.id === this.discipline.id;
      },
      isExpanded() {
        return this.isSelected
          || this.discipline.isTop
          || !this.isMultipleSelect && this.selected && _.startsWith(this.selected.path, this.discipline.path);
      },
      isHighlighted() {
        return !this.isMultipleSelect
          && this.isHighlightedParent
          && this.selected
          && _.startsWith(this.selected.path, this.discipline.path);
      }
    },

    methods: {
      select(discipline) {
        this.$emit('update', discipline);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
