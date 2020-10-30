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
        <div>
          <v-text-field
            v-model="search"
            :label="attribute.title"
            :error-messages="$refs.validator ? $refs.validator.errors : []"
            outlined
            hide-details="auto"
            v-bind="attrs"
            v-on="on"
          />
        </div>
      </template>

      <v-sheet>
        <validation-provider
          ref="validator"
          v-slot="{ errors, validate }"
          :detect-input="false"
          :name="attribute.title"
          rules="required"
        >
          <v-treeview
            :value="internalValue"
            :active="internalValue"

            hoverable

            activatable
            multiple-active

            selectable
            selection-type="independent"

            :items="disciplinesTree"
            item-key="id"
            item-text="label"

            :search="search"

            class="py-2"
            :class="{'v-treeview--without-children': withoutAnyChildren}"

            @input="onInput($event); validate($event);"
            @update:active="onInput"
          />

        </validation-provider>
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
  import { attributeSet } from '@/components/Attributes/_mixins';
  import { find as deepFind } from 'find-keypath';
  import { arrayDiff, getNestedValue } from 'vuetify/lib/util/helpers';

  import * as disciplineTreeService from '@/components/common/disciplines/DisciplineTreeService';
  import { arrayedModel } from '@/mixins/extendModel';

  import { extend } from 'vee-validate';

  extend('required', {
    validate(value) {
      console.log(value, !!value.length)
      return !!value.length;
    },
    message: '{_field_} is required'
  });

  export default {
    name: 'AttributesDisciplinesListSet',
    mixins: [attributeSet, arrayedModel],
    data() {
      return {
        search: '',
        open: false,
        oldValue: [],
        menuTop: false,

        validationErrors: []
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
            }
          }
          return Object.values(obj);
        }
        return transform(disciplineTreeService.disciplineTree.children);
      },

      withoutAnyChildren() {
        return !this.disciplinesTree
          .filter((node) => (node.children && node.children.length))
          .length;
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

    methods: {
      onInput(value, validate) {
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

        // this.$refs.validator.validate(this.internalValue).then((ctx) => {
        //   this.validationErrors = ctx.errors;
        // });
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
        if (this.internalValue) {
          const idx = this.internalValue.indexOf(item);
          if (idx !== -1) {
            this.internalValue.splice(idx, 1);
            this.internalValue = [...new Set(this.internalValue)];
          }
        }
      },
      addItem(id) {
        this.internalValue.push(id);
        this.internalValue = [...new Set(this.internalValue)];
      }
    }
  };
</script>
