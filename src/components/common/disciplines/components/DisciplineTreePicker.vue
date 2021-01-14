<template>
  <v-list dense nav class="pa-0">
    <discipline-tree-item
      v-for="(d, i) in tree"
      :key="`discipline-tree-item-${i}`"
      :discipline="d"
      :selected="selected"
      :is-multiple-select="isMultipleSelect"
      :is-highlighted-parent="isHighlightedParent"
      @update="selectDiscipline"
    />
  </v-list>
</template>

<script>
  import _ from 'lodash';

  const mapExternalDisciplines = (selected, isMultipleSelect) => {
    if (isMultipleSelect) {
      return selected.map((d) => d);
    }
    return selected;
  };

  // todo: make single and multiselect handled by arrays bc it will be easier and more readable
  export default {
    name: 'DisciplineTreePicker',

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
      tree() { return this.$store.getters['Disciplines/tree'](); }
    },

    watch: {
      preselected(preselected) {
        this.selected = mapExternalDisciplines(preselected, this.isMultipleSelect);
      }
    },

    created() {
      if (this.isMultipleSelect) {
        this.selected = !_.isEmpty(this.preselected)
          ? mapExternalDisciplines(this.preselected, this.isMultipleSelect)
          : [];
      } else {
        this.selected = this.preselected
          ? mapExternalDisciplines(this.preselected, this.isMultipleSelect)
          : undefined;
      }
    },

    methods: {
      selectDiscipline(picked) {
        if (this.isMultipleSelect) {
          if (this.selected.some((d) => d.externalId == picked.externalId)) {
            // parent can't be unselected if any of his child is selected
            const filterOut = picked.children ? this.selected.find((d) => {
              const parts = d.parentExternalId;
              return d.externalId != picked.externalId && parts == picked.externalId;
            }) === undefined : true;

            if (filterOut) {
              this.selected = this.selected.filter((d) => d.externalId != picked.externalId);
            }
          } else {
            this.selected.push(picked);
          }
        } else {
          this.selected = picked;
        }

        this.$emit('select', mapExternalDisciplines(this.selected, this.isMultipleSelect));
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
