<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors, validate }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <input v-model="internalValue" type="hidden">

    <v-menu
      v-model="open"
      :close-on-content-click="false"
      offset-y
      offset-overflow
      max-height="560"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="search"

          :label="$$label"

          hide-details="auto"
          :error-messages="errors"

          :disabled="!$$isEditable"

          outlined

          :append-icon="'mdi-menu-down'"
          :class="{'icon-upended': open}"

          v-bind="attrs"
          v-on="on"
        />
      </template>

      <v-sheet>
        <v-treeview
          :value="internalValue"
          :active="internalValue"

          hoverable

          selectable
          selection-type="independent"

          activatable
          multiple-active

          :items="disciplinesTree"
          item-key="externalId"
          item-text="name"

          :search="search"

          class="py-2"
          :class="{'v-treeview--without-children': withoutAnyChildren}"

          @input="onInput($event); validate($event);"
          @update:active="onInput"
        />
      </v-sheet>
    </v-menu>
    <div
      v-if="internalValue && internalValue.length"
      class="pt-2 ma-n1"
    >
      <v-chip
        v-for="externalId in sortedLabels"
        :key="externalId"
        outlined
        class="ma-1"
        :disabled="!$$isEditable"
      >
        <div class="text-truncate">
          {{ getItemObject(externalId).name }}
        </div>
        <v-btn
          icon
          x-small
          class="mr-n2 ml-2"
          @click="removeItem(externalId)"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-chip>
    </div>
  </validation-provider>
</template>

<script>
  import { attributeSet, attributeSetForceArray } from '@/components/Attributes/_mixins';
  import { find as deepFind } from 'find-keypath';
  import { arrayDiff, getNestedValue } from 'vuetify/lib/util/helpers';

  import { extend } from 'vee-validate';

  extend('required', {
    validate(value) {
      return value && !!value.length;
    },
    message: '{_field_} is required'
  });

  export default {
    name: 'AttributesDisciplineSetDefault',
    mixins: [attributeSet, attributeSetForceArray],
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
        return this.$store.getters['Disciplines/tree']();
      },

      disciplinesList() {
        return this.$store.getters['Disciplines/list']();
      },

      disciplinesListIds() {
        return this.disciplinesList.map((d) => d.externalId);
      },

      withoutAnyChildren() {
        return !this.disciplinesTree
          .filter((node) => (node.children && node.children.length))
          .length;
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
      }
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
        this.removeItem(target.externalId);
        if (target.children && target.children.length) {
          for (const child of target.children) {
            this.removeChilds(child.externalId);
          }
        }
      },
      addParents(id) {
        const path = this.getItemPath(id);
        let target = this.disciplinesTree;

        for (const value of path) {
          target = target[value];
          if (target.externalId) {
            this.addItem(target.externalId);
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

<style lang="scss" scoped>
  .icon-upended {
    ::v-deep .v-input__icon--append{
      .v-icon {
        transform: rotate(180deg);
      }
    }
  }
</style>
