<template>
  <div class="d-flex align-center">
    <slot name="prepend" />

    <v-avatar v-if="avatar" :size="size" class="mr-3">
      <img :src="avatar">
    </v-avatar>

    <div class="spacer">
      <h6 v-if="title" class="text-h6" v-text="title" />
      <div v-if="subTitle" class="text-body-2" v-text="subTitle" />
      <div v-if="caption" class="text-caption" v-text="caption" />
      <slot name="default" />
    </div>

    <div v-if="$hasSlot('action')" class="text-caption text--secondary ml-3">
      <slot name="action" />
    </div>

    <div v-if="$hasSlot('actionText')" class="text-caption text--secondary ml-2">
      <slot name="actionText" />
    </div>

    <slot name="append" />
  </div>
</template>

<script>
  // TODO: refactoring
  // import Routable from 'vuetify/lib/mixins/routable';

  export default {
    name: 'DBoxItem',

    props: {
      avatar: {
        type: String,
        default: ''
      },
      size: {
        type: [String, Number],
        default: 40
      },

      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      },
      caption: {
        type: String,
        default: ''
      }
    }
  };
</script>
