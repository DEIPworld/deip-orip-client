<template>
  <v-sheet tile class="section mx-auto" :max-width="maxWidth">
    <div
      v-if="hasTitle"
      class="section__header mb-4"
    >
      <v-row>
        <v-col
          v-if="hasTitleIcon"
          cols="auto"
        >
          <v-icon v-if="icon" large color="grey lighten-2">
            {{ icon }}
          </v-icon>
          <slot name="titleIcon" />
        </v-col>

        <v-col v-if="hasTitleText">
          <div v-if="title" class="headline">
            {{ title }}
          </div>
          <div v-if="hasSlot('title')" class="headline">
            <slot name="title" />
          </div>
        </v-col>

        <v-col v-if="hasSlot('titleActions')" cols="auto">
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
        required: false,
        default: null
      },
      icon: {
        type: String,
        required: false,
        default: null
      },
      maxWidth: {
        type: Number || String,
        required: false,
        default: null
      }
    },
    computed: {
      hasTitle() {
        return this.hasTitleIcon || this.hasTitleText || this.hasSlot('titleActions');
      },
      hasTitleIcon() {
        return this.icon || this.hasSlot('titleIcon');
      },
      hasTitleText() {
        return this.title || this.hasSlot('title');
      }
    },
    methods: {
      hasSlot(name) {
        return this.$slots[name] !== undefined;
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
