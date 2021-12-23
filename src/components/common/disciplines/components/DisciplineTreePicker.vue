<template>
  <v-list dense nav class="pa-0">
    <domain-tree-item
      v-for="(d, i) in tree"
      :key="`domain-tree-item-${i}`"
      :domain="d"
      :selected="selected"
      :is-multiple-select="isMultipleSelect"
      :is-highlighted-parent="isHighlightedParent"
      @update="selectDomain"
    />
  </v-list>
</template>

<script>
  import _ from 'lodash';

  const mapDomains = (selected, isMultipleSelect) => {
    if (isMultipleSelect) {
      return selected.map((d) => d);
    }
    return selected;
  };

  // todo: make single and multiselect handled by arrays bc it will be easier and more readable
  export default {
    name: 'DomainTreePicker',

    props: {
      preselected: {
        validator(value) {
          return value === undefined || typeof value === 'array' || typeof value === 'object';
        },
        required: false
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
      }
    },

    data() {
      return {
        selected: undefined
      };
    },

    computed: {
      tree() { return this.$store.getters['Domains/tree'](); }
    },

    watch: {
      preselected(preselected) {
        this.selected = mapDomains(preselected, this.isMultipleSelect);
      }
    },

    created() {
      if (this.isMultipleSelect) {
        this.selected = !_.isEmpty(this.preselected)
          ? mapDomains(this.preselected, this.isMultipleSelect)
          : [];
      } else {
        this.selected = this.preselected
          ? mapDomains(this.preselected, this.isMultipleSelect)
          : undefined;
      }
    },

    methods: {
      selectDomain(picked) {
        if (this.isMultipleSelect) {
          if (this.selected.some((d) => d._id == picked._id)) {
            // parent can't be unselected if any of his child is selected
            const filterOut = picked.children ? this.selected.find((d) => {
              const parts = d.parentId;
              return d._id != picked._id && parts == picked._id;
            }) === undefined : true;

            if (filterOut) {
              this.selected = this.selected.filter((d) => d._id != picked._id);
            }
          } else {
            this.selected.push(picked);
          }
        } else {
          this.selected = picked;
        }

        this.$emit('select', mapDomains(this.selected, this.isMultipleSelect));
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
