<template>
  <d-block title="Select research domains">
    {{internalValue}}
    <v-radio-group v-model="isPersonal">
      <d-stack horizontal>
        <v-radio :value="true" label="Personal domains" class="ma-0" />
        <v-radio :value="false" label="All domains" class="ma-0" />
      </d-stack>
    </v-radio-group>

    <v-menu
      v-model="open"
      :close-on-content-click="false"
      offset-y
      offset-overflow
      max-height="560"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="search"
          label="Domain"
          outlined
          hide-details="auto"
          v-bind="attrs"
          v-on="on"
        />
      </template>

      <v-sheet>
        <v-treeview
          :value="internalValue"
          selectable
          selected-color="primary"
          :items="disciplinesTree"
          :search="search"
          item-key="id"
          item-text="label"
          selection-type="independent"
          @input="onInput"
        />
      </v-sheet>
    </v-menu>

    <v-chip-group
      v-model="internalValue"
      column
      class="mt-1"
    >
      <v-chip
        v-for="id in sortedLabels"
        :key="id"
        outlined
        close
        close-icon="close"
        @click:close="removeItem(id)"
      >
        {{ getItemObject(id).label }}
      </v-chip>
    </v-chip-group>
  </d-block>
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';
  import { find as deepFind } from 'find-keypath';
  import { arrayDiff, getNestedValue } from 'vuetify/lib/util/helpers';

  import * as disciplineTreeService from '@/components/common/disciplines/DisciplineTreeService';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DBlock from '@/components/Deipify/DBlock/DBlock';


  export default {
    name: 'AttributesDisciplinesListSet',
    components: { DBlock, DStack },
    mixins: [commonSet],
    data() {
      return {
        isPersonal: true,
        search: '',
        open: false,
        oldValue: [],
        menuTop: false
      };
    },
    computed: {
      userDisciplinesTree() {
        return disciplineTreeService.getNodesByIdList(
          this.$currentUser.expertTokens.map((token) => token.discipline_external_id)
        );
      },

      allDisciplinesTree() {
        function transform(obj) {
          for (const item of Object.keys(obj)) {
            const t = obj[item];
            if (t.children && Object.keys(t.children).length) {
              t.children = transform(t.children);
            } else {
              delete t.children;
            };
          }
          return Object.values(obj);
        }
        return transform(disciplineTreeService.disciplineTree.children);
      },

      disciplinesTree() {
        return this.isPersonal ? this.userDisciplinesTree : this.allDisciplinesTree;
      },

      disciplinesListIds() {
        const disciplines = [];

        function transfrom(tree) {
          for (const item of tree) {
            const { children } = item;
            disciplines.push(item.id);
            if (children) {
              transfrom(children);
            }
          }
        }

        transfrom(this.disciplinesTree);

        return disciplines;
      },

      sortedLabels() {
        const base = [...this.disciplinesListIds];
        const unsorted = [...this.internalValue];

        const sorted = unsorted.sort((lhs, rhs) => {
          const lhsi = base.indexOf(lhs);
          const rhsi = base.indexOf(rhs);

          return lhsi > rhsi ? 1 : lhsi < rhsi ? -1 : 0;
        });
        return sorted;
      },
    },

    watch: {
      isPersonal() {
        this.$nextTick(() => {
          this.internalValue = [];
        });
      }
    },

    created() {
      if (!this.internalValue) {
        this.internalValue = [];
      }
    },

    methods: {
      onInput(value) {
        const removed = this.oldValue.length > value.length;
        const changedId = (removed
          ? arrayDiff(value, this.oldValue)
          : arrayDiff(this.oldValue, value)
        )[0];

        if (removed) {
          this.removeChilds(changedId);
        } else {
          this.addParents(changedId);
        }

        this.oldValue = [...value];
      },

      getItemPath(id) {
        const path = deepFind(this.disciplinesTree, id);
        path.pop();
        return path;
      },
      getItemObject(id) {
        return getNestedValue(this.disciplinesTree, this.getItemPath(id));
      },

      removeChilds(id) {
        const target = this.getItemObject(id);
        this.removeItem(target.id);
        if (target.children && target.children.length) {
          for (const child of target.children) {
            this.removeChilds(child.id);
          }
        }
      },
      addParents(id) {
        const path = this.getItemPath(id);
        let target = this.disciplinesTree;

        for (const value of path) {
          target = target[value];
          if (target.id) {
            this.addItem(target.id);
          }
        }
      },

      removeItem(item) {
        const idx = this.internalValue.indexOf(item);
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      },
      addItem(id) {
        this.internalValue.push(id);
        this.internalValue = [...new Set(this.internalValue)];
      }
    }
  };
</script>
