<template>
  <div class="d-inline-flex ml-2">

    <v-menu v-if="internalValue.availableProps" :close-on-content-click="false">
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
        <v-subheader class="px-4">{{ internalValue.name }} settings</v-subheader>
        <v-list-item v-for="(prop, index) of Object.keys(internalValue.availableProps)" :key="index">
          <v-list-item-content style="overflow: initial">
            <v-text-field
              v-if="internalValue.availableProps[prop] === 'string' || internalValue.availableProps[prop] === 'number'"
              v-model="internalValue.props[prop]"
              outlined
              :label="prop"
              hide-details="auto"
              class="ma-0"
              dense
            />

            <v-checkbox
              v-if="internalValue.availableProps[prop] === 'boolean'"
              v-model="internalValue.props[prop]"
              :label="prop"
              hide-details="auto"
              class="ma-0"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-if="!internalValue.required"
      icon
      x-small
      class="mr-n1"
      @click="$emit('click:remove')"
    >
      <v-icon class="ma-0">clear</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AdminLayoutsNodeSettings',
    mixins: [Proxyable]
  };
</script>
