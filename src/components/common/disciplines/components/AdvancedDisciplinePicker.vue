<template>
  <v-row class="mx-0 fill-height discipline-picker overflow-y-auto">
    <v-col v-if="!withoutUserDisciplines" class="xs4 pa-4 overflow-y-auto">
      <div class="pb-4 bold uppercase">
        Your domain
      </div>

      <v-list
        v-if="userDisciplines.length"
        class="pa-0"
        dense
        nav
      >
        <v-list-item-group>
          <v-list-item
            v-for="(discipline, i) in userDisciplines"
            :key="i"
            :input-value="isUserLabelSelected(discipline)"
            @click="handleUserDiscipline(discipline)"
          >
            {{ discipline.label }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>

    <v-col class="pa-4 fill-height overflow-y-auto" :cols="!withoutUserDisciplines ? '8' : '12'">
      <div class="pb-4 bold uppercase">
        All domain
      </div>

      <discipline-tree-picker
        :is-multiple-select="isMultipleSelect"
        :is-highlighted-parent="isHighlightedParent"
        :preselected="preselected"
        @select="select"
      />
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';
  import * as disciplineTreeService from '../DisciplineTreeService';

  export default {
    name: 'AdvancedDisciplinePicker',

    props: {
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

      withoutUserDisciplines: {
        type: Boolean,
        required: false,
        default: false
      },

      preselected: {
        validator(value) {
          return value === undefined || typeof value === 'array' || typeof value === 'object';
        },
        required: true
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),

      userDisciplines() {
        return disciplineTreeService.getNodesByIdList(
          this.user.expertTokens.map((token) => token.discipline_external_id)
        );
      },

      disciplineTree() { return disciplineTreeService.disciplineTree; }
    },

    methods: {
      select(selected) {
        this.$emit('select', selected);
      },

      handleUserDiscipline(discipline) {
        if (!this.isMultipleSelect) {
          this.$emit('select', discipline);
        } else {
          const preselectedCopy = _.cloneDeep(this.preselected);

          if (!_.find(preselectedCopy, (item) => item.id === discipline.id)) {
            preselectedCopy.push(discipline);
          } else {
            _.remove(preselectedCopy, (item) => item.id === discipline.id);
          }

          this.$emit('select', preselectedCopy);
        }
      },

      isUserLabelSelected(discipline) {
        if (!this.isMultipleSelect) {
          return !!this.preselected && this.preselected.id === discipline.id;
        }
        return !!_.find(this.preselected, (item) => item.id === discipline.id);
      }
    }
  };
</script>

<style lang="less" scoped>
  .discipline-picker {
    border: 1px solid #E0E0E0;

    & > :not(:last-child) {
      border-right: 1px solid #E0E0E0;
    }
  }
</style>
