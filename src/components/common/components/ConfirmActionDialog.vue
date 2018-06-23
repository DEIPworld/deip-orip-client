<template>
  <v-layout row justify-center>
    <v-dialog v-model="meta.isShown" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text class="text-align-center">{{text}}</v-card-text>
        <v-card-actions class="text-align-center mt-2">
          <v-spacer></v-spacer>
          <v-btn color="green lighten-1" flat @click.native="confirm">Confirm</v-btn>
          <v-btn color="primary lighten-1" flat @click.native="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

    export default {
        name: 'ConfirmActionDialog',
        props: {
            title: { type: String, required: true },
            text: { type: String, required: true },
            meta: { type: Object, required: true }
        },
        data() {
            return {}
        },
        methods: {
            confirm() {
                this.$emit('confirmed', this.meta);
            },
            cancel() {
                this.$emit('canceled', this.meta);
            }
        }
  }
</script>

<style lang="less" scoped>
</style>
