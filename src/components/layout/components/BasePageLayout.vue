<template>
  <v-container fluid fill-height pa-0 ma-0>
    <v-layout row wrap>
      <v-flex v-if="hasLeftSidebar" :class="leftSidebarClass">
        <v-card height="100%" class="pa-4">
          <slot name="left-sidebar"></slot>
        </v-card>
      </v-flex>
      <v-flex :class="adjustedContentClass">
        <slot name="content"></slot>
      </v-flex>
      <v-flex v-if="hasRightSidebar" :class="rightSidebarClass">
        <v-card height="100%" class="pa-4">
          <slot name="right-sidebar"></slot>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "BasePageLayout",
  props: {
    leftSidebarClass: { type: String, required: false, default: "xl3 lg3 md3 sm12 xs12" },
    rightSidebarClass: { type: String, required: false, default: "xl3 lg3 md3 sm12 xs12" },
    contentClass: { type: String, required: false, default: undefined }
  },
  computed: {
    adjustedContentClass() {
      if (this.contentClass) return this.contentClass;

      return this.hasLeftSidebar && this.hasRightSidebar 
        ? "xl6 lg6 md6 sm12 xs12" 
        : !this.hasLeftSidebar && !this.hasRightSidebar 
          ? "xl12 lg12 md12 sm12 xs12"
          : "xl9 lg9 md9 sm12 xs12";
    },
    hasLeftSidebar() {
      return this.$slots['left-sidebar'] !== undefined;
    },
    hasRightSidebar() {
      return this.$slots['right-sidebar'] !== undefined;
    }
  }
};
</script>


<style lang="less">
</style>
