<template>
  <v-menu v-if="item.availableProps" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        x-small
        class="ml-1"
        v-on="on"
      >
        <v-icon size="14" class="ma-0">settings</v-icon>
      </v-btn>
    </template>



    <v-list dense>
      <v-subheader class="px-4">{{ item.name }} settings</v-subheader>
      <v-list-item v-for="(prop, index) of Object.keys(item.availableProps)" :key="index">
        <v-list-item-content style="overflow: initial">
          <v-text-field
            v-if="item.availableProps[prop] === 'string' || item.availableProps[prop] === 'number'"
            v-model="internalValue[prop]"
            outlined
            :label="prop"
            hide-details="auto"
            class="ma-0"
            dense
          />

          <v-checkbox
            v-if="item.availableProps[prop] === 'boolean'"
            v-model="internalValue[prop]"
            :label="prop"
            hide-details="auto"
            class="ma-0"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-menu>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AdminLayoutsNodeSettings',
    mixins: [Proxyable],
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>

</style>
