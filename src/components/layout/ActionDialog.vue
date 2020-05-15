<template>
  <v-dialog
    :value="isOpen"
    max-width="420px"
    scrollable
    @click:outside="close"
  >
    <v-card>
      <v-card-title>
        <span v-if="title" class="headline">{{ title }}</span>
        <v-spacer />
        <v-btn
          small
          icon
          class="mr-n2"
          @click="close"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="text--primary pt-5 white-space-pre-line">
        <slot />
      </v-card-text>

      <div v-if="$hasSlot('actions')">
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <slot name="actions" />
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ActionDialog',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: null
      }
    },
    computed: {
      isOpen: {
        get() {
          return !!this.open;
        },
        set(v) {
          this.open = v;
        }
      }
    },
    methods: {
      close() {
        this.$emit('close', true);
      }
    }
  };
</script>

<style scoped>

</style>
