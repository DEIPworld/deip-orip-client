<template>
  <div>
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
          :label="attribute.title"
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
    <div
      v-if="internalValue && internalValue.length"
      class="pt-2 ma-n1"
    >
      <v-chip
        v-for="id in sortedLabels"
        :key="id"
        outlined
        class="ma-1"
      >
        <div class="text-truncate">
          {{ getItemObject(id).label }}
        </div>
        <v-btn
          icon
          x-small
          class="mr-n2 ml-2"
          @click="removeItem(id)"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-chip>
    </div>
  </div>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import { find as deepFind } from 'find-keypath';
  import { arrayDiff, getNestedValue } from 'vuetify/lib/util/helpers';

  import * as disciplineTreeService from '@/components/common/disciplines/DisciplineTreeService';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DBlock from '@/components/Deipify/DBlock/DBlock';


  export default {
    name: 'AttributesDisciplinesListSet',
    components: { DBlock },
    mixins: [attributeSet],
    data() {
      return {
        search: '',
        open: false,
        oldValue: [],
        menuTop: false,

        defaultValue: []
      };
    },
    computed: {

      disciplinesTree() {
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

      disciplinesListIds() {
        const disciplines = [];

        function transform(tree) {
          for (const item of tree) {
            const { children } = item;
            disciplines.push(item.id);
            if (children) {
              transform(children);
            }
          }
        }

        transform(this.disciplinesTree);

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
      internalValue(val) {
        this.checkDefaultValue(val);
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
