<template>
  <v-row justify="start">
    <v-dialog v-model="meta.isShown" persistent :max-width="width">
      <v-card class="pa-6">
        <v-card-title v-if="title" class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="meta.isConfirming"
            :loading="meta.isConfirming"
            @click.native="confirm"
          >
            {{ confirmText }}
          </v-btn>
          <v-btn
            color="primary"
            outlined
            :disabled="meta.isConfirming"
            @click.native="cancel"
          >
            {{ cancelText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

  export default {
    name: 'ConfirmActionDialog',
    props: {
      title: { type: String, required: true },
      text: { type: String, required: true },
      meta: { type: Object, required: true },
      width: { type: Number, required: false, default: 400 },
      confirmText: { type: String, required: false, default: 'Confirm' },
      cancelText: { type: String, required: false, default: 'Cancel' }
    },
    data() {
      return {};
    },
    methods: {
      confirm() {
        this.$emit('confirmed', this.meta);
      },
      cancel() {
        this.$emit('canceled', this.meta);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
