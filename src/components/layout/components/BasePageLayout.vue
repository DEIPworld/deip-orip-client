<template>
  <div class="app-layout">
    <slot name="header" />

    <layout-toolbar v-if="$hasSlot('toolbar')">
      <slot name="toolbar" />
    </layout-toolbar>

    <slot name="addons" />

    <layout-section>
      <template #sidebar>
        <slot name="sidebar" />
      </template>

      <slot name="default" />
    </layout-section>

    <!-- TODO: REFACTORING   -->
    <v-sheet v-if="hasLeftSidebar">
      <slot name="left-sidebar" />
    </v-sheet>
    <v-sheet :class="adjustedContentClass">
      <slot name="content" />
    </v-sheet>
    <v-sheet v-if="hasRightSidebar">
      <slot name="right-sidebar" />
    </v-sheet>
  </div>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import LayoutToolbar from '@/components/layout/components/LayoutToolbar';

  export default {
    name: 'BasePageLayout',
    components: { LayoutToolbar, LayoutSection },
    computed: {
      adjustedContentClass() {
        if (this.contentClass) return this.contentClass;

        return this.hasLeftSidebar && this.hasRightSidebar
          ? 'xl6 lg6 md6 sm12 xs12'
          : !this.hasLeftSidebar && !this.hasRightSidebar
            ? 'xl12 lg12 md12 sm12 xs12'
            : 'xl9 lg9 md9 sm12 xs12';
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


<style lang="scss">
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: 100%;

    &__header {
      background-position: 100% 100%;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;

      &--muted {
        &::before {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          content: '';
          background: linear-gradient(to top, rgba(#000, .7), rgba(#000, .3));
        }
      }
    }

    &__header-inner {
      position: relative;
      z-index: 2;
    }

    &__section {
      flex: 1;
      min-height: 0px;
      display: flex;
      max-width: 100%;
    }

    &__content {
      flex: 1;
      max-width: 100%;
    }

    &__sidebar {
      width: 25%;

      &--left {
        border-right: 1px solid rgba(black, .12);
      }

      &--right {
        border-left: 1px solid rgba(black, .12);
        order: 999;
      }

      &--simple#{& + '--left'} {
          border-right: 0;
          padding-right: 0;
        }

      &--simple#{& + '--right'} {
          border-left: 0;
          padding-left: 0;
        }
    }

    &__footer {}
  }
</style>
