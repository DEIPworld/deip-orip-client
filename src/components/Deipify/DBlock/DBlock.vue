<template>
  <v-sheet>
    <div :class="contentClassList">
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

      <slot />
    </div>
  </v-sheet>
</template>

<script>
  export default {
    name: 'DBlock',
    props: {

      small: {
        type: Boolean,
        default: false
      },
      widget: {
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
          'text-h6': this.small || this.widget,
          'text-h5': !(this.small || this.widget)
        };
      },
      headerClassList() {
        return {
          'd-flex': true,
          'mb-4': this.small || this.widget,
          'mb-6': !(this.small || this.widget)
        };
      },
      subtitleClassList() {
        return {
          'text-body-2': true,
          'text--secondary': true
        };
      },
      contentClassList() {
        return {
          'px-6 py-4': this.widget
        };
      }
    }
  };
</script>
