<template>
  <v-container fluid fill-height pa-0 ma-0>
    <v-layout row wrap v-if="!noSidebar">
      <v-flex lg9 md9 sm12 xs12>
        <slot name="content"></slot>
      </v-flex>
      <v-flex lg3 md3 sm12 xs12>
        <v-card height="100%" class="pa-4">
          <slot name="sidebar"></slot>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout v-else>
      <v-flex lg12 md12 sm12 xs12>
        <slot name="content"></slot>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "BasePageLayout",
  props: {
    noSidebar: { type: Boolean, required: false, default: false }
  },
  computed: {}
};
</script>


<style lang="less">
</style>
