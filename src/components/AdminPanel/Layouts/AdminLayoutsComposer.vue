<template>
  <div>
    <draggable
      tag="ul"
      :list="schema"
      :group="{ name: 'g1' }"
    >
      <li v-for="item in schema" :key="item.component">
        <p>{{ item.component }}</p>
        <admin-layouts-composer :schema="item.children" />
      </li>
    </draggable>
  </div>
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
      }
    }
  };
</script>
