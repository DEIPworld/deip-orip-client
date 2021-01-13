<template>
  <div>
    <v-list-item
      :input-value="isSelected || isHighlighted"
      @click="select(discipline)"
    >
      {{ discipline.name }}
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
        type: [Array, Object],
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
          ? this.selected.some((d) => d.externalId == this.discipline.externalId)
          : this.selected && this.selected.externalId === this.discipline.externalId;
      },
      isExpanded() {
        return this.isSelected
          || !this.isMultipleSelect && this.selected && this.discipline.children;
      },
      isHighlighted() {
        return !this.isMultipleSelect
          && this.isHighlightedParent
          && this.selected
          && _.startsWith(this.selected.parentExternalId, this.discipline.externalId);
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
