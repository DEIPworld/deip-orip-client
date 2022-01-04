<template>
  <div>
    <v-list-item
      :input-value="isSelected || isHighlighted"
      @click="select(domain)"
    >
      {{ domain.name }}
    </v-list-item>

    <div v-if="domain.children" v-show="isExpanded" class="pl-6">
      <domain-tree-item
        v-for="(val, key) in domain.children"
        :key="key"
        :domain="val"
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
    name: 'DomainTreeItem',

    props: {
      domain: {
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
          ? this.selected.some((d) => d._id == this.domain._id)
          : this.selected && this.selected._id === this.domain._id;
      },
      isExpanded() {
        return this.isSelected
          || !this.isMultipleSelect && this.selected && this.domain.children;
      },
      isHighlighted() {
        return !this.isMultipleSelect
          && this.isHighlightedParent
          && this.selected
          && _.startsWith(this.selected.parentId, this.domain._id);
      }
    },

    methods: {
      select(domain) {
        this.$emit('update', domain);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
