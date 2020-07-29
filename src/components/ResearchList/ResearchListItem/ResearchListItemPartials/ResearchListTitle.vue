<template>
  <v-tooltip bottom :max-width="260" :open-delay="500">
    <template v-slot:activator="{ on }">
      <div :class="titleClass" v-on="on">
        <v-clamp autoresize :max-lines="2">
          {{ title }}
        </v-clamp>
      </div>
    </template>
    <span>{{ title }}</span>
  </v-tooltip>
</template>

<script>

  export default {
    name: 'ResearchListTitle',

    props: {
      title: {
        type: String,
        default: null
      },
      compact: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      titleClass() {
        return {
          'text-h6': !this.compact,
          'text-body-2 font-weight-medium': this.compact
        };
      }
    }
  };
</script>
