<template>
  <d-stack :gap="stackGap">
    <div v-if="hasHeader" :class="headerClassList">
      <slot name="title-prepend" />

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
      <div v-if="$hasSlot('title-append')" :class="$style.actions">
        <slot name="title-append" />
      </div>
    </div>

    <slot />
  </d-stack>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'DBlock',
    components: { DStack },
    props: {

      compact: {
        type: Boolean,
        default: false
      },

      title: {
        type: String,
        default: null
      },
      subtitle: {
        type: String,
        default: null
      }
    },
    computed: {
      hasTitle() { return !!this.title || this.$hasSlot('title'); },
      hasSubtitle() { return !!this.subtitle || this.$hasSlot('subtitle'); },
      hasHeader() { return this.hasTitle || this.hasSubtitle; },

      titleClassList() {
        return {
          'text-h6': this.compact,
          'text-h5': !this.compact
        };
      },
      headerClassList() {
        return {
          'd-flex': true,
          'align-center': true,
        };
      },

      stackGap() {
        return this.compact ? 16 : 24
      },

      subtitleClassList() {
        return {
          'text-body-2': true,
          'text--secondary': true
        };
      }
    }
  };
</script>

<style lang="scss" module>
  .actions {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
  }
</style>
