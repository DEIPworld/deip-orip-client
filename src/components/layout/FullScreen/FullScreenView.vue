<template>
  <div class="full-height">
    <portal v-if="!hideToolbar" to="toolbar">
      <full-screen-bar
        :toolbar-overlap="toolbarOverlap"
        :toolbar-color="toolbarColor"
        :title="title"
      >
        <template #toolbarButton>
          <slot name="toolbarButton">
            <v-btn icon @click="$router.back()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </slot>
        </template>
      </full-screen-bar>
    </portal>

    <v-sheet
      :height="height"
      :max-width="maxWidth || 800"
      class="mx-auto"
      :class="{'pa-12': !noGutters}"
    >
      <slot />
    </v-sheet>
  </div>
</template>

<script>
  import { FullScreenMixin } from '@/components/layout/FullScreen/FullScreenMixin';
  import FullScreenBar from '@/components/layout/FullScreen/FullScreenBar';

  export default {
    name: 'FullScreenView',
    components: { FullScreenBar },
    mixins: [FullScreenMixin]
  };
</script>

<style scoped>

</style>
