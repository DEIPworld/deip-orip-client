<template>
  <div v-if="attribute && attribute.value" class="d-flex flex-wrap align-center text-caption text--secondary">
    <template v-for="(item, index) of disciplines">
      <router-link
        :key="`link-${index}`"
        class="link text--secondary"
        :to="goToDiscipline(item.id)"
      >
        {{ item.label }}
      </router-link>
      <div
        v-if="index + 1 < disciplines.length"
        :key="`dot-${index}`"
        class="mx-2"
      >
        •
      </div>
    </template>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import * as disciplineTreeService from '@/components/common/disciplines/DisciplineTreeService';
  import { getNestedValue } from 'vuetify/lib/util/helpers';
  import { find as deepFind } from 'find-keypath';

  export default {
    name: 'AttributesDisciplineRead',
    mixins: [attributeRead],
    computed: {
      disciplines() {
        return this.attribute.value.map((d) => this.getItemObject(d));
      }
    },
    methods: {
      getItemPath(id) {
        const path = deepFind(disciplineTreeService.disciplineTree.children, id);
        path.pop();
        return path;
      },
      getItemObject(id) {
        return getNestedValue(
          disciplineTreeService.disciplineTree.children,
          this.getItemPath(id)
        );
      },
      goToDiscipline(id) {
        const q = {
          researchAttributes: {
            [this.attribute.researchAttributeId]: [id]
          }
        };

        return {
          name: 'explore',
          query: {
            rFilter: JSON.stringify(q)
          }
        };
      }
    }
  };
</script>
