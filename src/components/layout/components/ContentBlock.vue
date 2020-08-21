<template>
  <v-sheet tile :class="classList" :max-width="maxWidth">
    <div
      v-if="hasTitle"
      class="section__header mb-4"
    >
      <v-row no-gutters>
        <v-col
          v-if="hasTitleIcon"
          cols="auto"
        >
          <v-icon v-if="icon" large color="grey lighten-2">
            {{ icon }}
          </v-icon>
          <slot name="titleIcon" />
        </v-col>

        <v-col v-if="hasTitleText" :class="{'ml-4': hasTitleIcon}">
          <div v-if="title || $hasSlot('title')" class="text-h5">
            {{ title }}
            <slot name="title" />
          </div>

          <div v-if="description || $hasSlot('description')" class="text-body-2 text--secondary">
            {{ description }}
            <slot name="description" />
          </div>
        </v-col>

        <v-col v-if="$hasSlot('titleActions')" cols="auto">
          <slot name="titleActions" />
        </v-col>
      </v-row>
    </div>

    <slot name="default" />
  </v-sheet>
</template>

<script>
  export default {
    name: 'ContentBlock',
    props: {
      title: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
      icon: {
        type: String,
        default: null
      },
      maxWidth: {
        type: Number || String,
        default: null
      },
      centered: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      hasTitle() {
        return this.hasTitleIcon || this.hasTitleText || this.$hasSlot('titleActions');
      },
      hasTitleIcon() {
        return this.icon || this.$hasSlot('titleIcon');
      },
      hasTitleText() {
        return this.title || this.$hasSlot('title');
      },
      classList() {
        return {
          section: true,
          'mx-auto': this.centered
        };
      }
    }
  };
</script>

<style lang="scss">
  .section {
    & + & {
      margin-top: 3rem;
    }
  }

</style>
