<template>
  <v-list>
    <v-list-item v-for="(item, index) of attribute.value" :key="index">
      <v-list-item-content>
        <a :href="item.url">{{ item.label }}</a>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesUrlRead',
    mixins: [attributeRead]
  };
</script>
