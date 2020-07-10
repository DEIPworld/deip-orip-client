<template>
  <v-sheet :class="wrapperClassList">

    <div v-if="hasHeader" class="mb-6">

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

<!--    <div-->
<!--      v-if="hasTitle"-->
<!--      :class="titleClassList"-->
<!--    >-->
<!--      <v-icon v-if="icon">-->
<!--        {{ icon }}-->
<!--      </v-icon>-->
<!--      {{ title }}-->
<!--      <slot name="title" />-->
<!--    </div>-->

    <div :class="contentClassList">
      <slot />
    </div>

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
  }

</style>
