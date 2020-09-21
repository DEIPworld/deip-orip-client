<template>
  <div :class="$style.host">
    <div class="text-overline">{{ title }}</div>
    <v-card outlined>
      <draggable
        v-if="!disableNesting"
        :list="schema"
        :group="{ name: 'g1' }"
        class="pa-4"

      >
        <template v-for="(item, index) in schema">
          <admin-layouts-composer
            v-if="item.children"
            :key="item.id$"
            :title="item.name"
            :schema="item.children"
          />
          <div v-else :key="'ss' + item.id$">
            {{ item.name }}
          </div>
        </template>
      </draggable>
    </v-card>
  </div>
  <!--  :class="{ 'mb-4': index < schema.length + 1 }" -->
</template>

<script>
  import draggable from 'vuedraggable';

  export default {
    name: 'AdminLayoutsComposer',
    components: {
      draggable
    },
    props: {
      schema: {
        type: Array,
        default: () => ([])
      },
      title: {
        type: String,
        default: null
      },
      disableNesting: {
        type: Boolean,
        dafault: false
      }
    }
  };
</script>

<style lang="scss" module>
  .host {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
</style>
