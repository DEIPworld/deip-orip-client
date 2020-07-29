<template>
  <v-sheet :class="wrapperClassList">

    <div v-if="hasHeader" :class="headerClassList">

      <slot name="titleLeft" />

      <div class="spacer">
        <div
          v-if="hasTitle"
          :class="titleClassList"
        >
          {{ title }}
          <slot name="title" />
        </div>

        <div
          v-if="hasSubtitle"
          :class="subtitleClassList"
        >
          {{ subtitle }}
          <slot name="subtitle" />
        </div>
      </div>

      <slot name="titleAddon" />
    </div>

    <div :class="contentClassList">
      <slot />
    </div>

    <v-divider v-if="divided" />

  </v-sheet>
</template>

<script>
  export default {
    name: 'DBlock',
    props: {
      last: {
        type: Boolean,
        default: false
      },
      sm: {
        type: Boolean,
        default: false
      },

      icon: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      subtitle: {
        type: String,
        default: null
      },
      divided: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      hasTitle() { return !!this.title || this.$hasSlot('title'); },
      hasSubtitle() { return !!this.subtitle || this.$hasSlot('subtitle'); },
      hasHeader() { return this.hasTitle || this.hasSubtitle; },

      wrapperClassList() {
        return {
          [this.$style.host]: true,
          [this.$style['host-sm']]: !!this.sm
        };
      },
      titleClassList() {
        return {
          'text-h6': this.sm,
          'text-h5': !this.sm
        };
      },
      headerClassList() {
        return {
          'd-flex': true,
          'mb-6': true,
          // 'mb-4': this.sm,
          // 'mb-6': !this.sm
        };
      },
      subtitleClassList() {
        return {
          'text-body-2': true,
          'text--secondary': true
        };
      },
      contentClassList() {
        return {};
      }
    }
  };
</script>

<style module lang="scss">
  .host {
    --vb-gap: 48px;

    & + & {
      margin-top: var(--vb-gap);
    }

    &-sm {
      --vb-gap: 24px;
    }

    & > [role="separator"] {
      margin-top: var(--vb-gap);
    }
  }

</style>
