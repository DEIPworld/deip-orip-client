<template>
  <div class="text-caption text--secondary">{{disciplines}}</div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import * as disciplineTreeService from '@/components/common/disciplines/DisciplineTreeService';
  import { getNestedValue } from 'vuetify/lib/util/helpers';
  import { find as deepFind } from 'find-keypath';

  export default {
    name: 'AttributesDisciplinesListRead',
    mixins: [attributeRead],
    computed: {
      disciplines() {
        return this.attribute.value.map((d) => this.getItemObject(d).label).join(' • ');
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
    }
  };
</script>
