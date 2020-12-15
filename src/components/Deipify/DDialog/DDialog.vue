<template>
  <v-dialog
    ref="dialog"
    persistent
    :value="isActive"
    :max-width="maxWidth"
    scrollable
    @click:outside="closeDialog"
    @input="closeDialog"
  >
    <v-card>
      <v-card-title v-if="title" class="text-h5 pr-12">
        {{ title }}
      </v-card-title>
      <v-divider v-if="title" />

      <v-btn
        small
        icon
        absolute
        right
        top
        style="z-index: 10;"
        @click="closeDialog"
      >
        <v-icon>close</v-icon>
      </v-btn>

      <v-card-text class="text--primary pt-5 white-space-pre-line">
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions v-if="!hideButtons">
        <v-spacer />
        <slot name="actions">
          <slot name="buttonCancel">
            <v-btn
              text
              color="primary"
              :disabled="loading || disabled"
              @click="cancelButtonClick"
            >
              {{ cancelButtonTitle }}
            </v-btn>
          </slot>

          <slot name="buttonConfirm">
            <v-btn
              text
              color="primary"
              :disabled="disabled || confirmButtonDisabled"
              :loading="loading"
              @click="confirmButtonClick"
            >
              {{ confirmButtonTitle }}
            </v-btn>
          </slot>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Toggleable from 'vuetify/lib/mixins/toggleable';

  export default {
    name: 'DDialog',
    mixins: [Toggleable],
    props: {
      maxWidth: {
        type: [String, Number],
        default: 420
      },
      title: {
        type: String,
        default: null
      },
      hideButtons: {
        type: Boolean,
        default: false
      },

      cancelButtonTitle: {
        type: String,
        default() { return this.$t('defaultNaming.cancel'); }
      },
      cancelButtonHide: {
        type: Boolean,
        default: false
      },

      confirmButtonTitle: {
        type: String,
        default() { return this.$t('defaultNaming.confirm'); }
      },
      confirmButtonHide: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      },
      confirmButtonDisabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeDialog(e) {
        this.isActive = false;
        this.$emit('close', e);
      },

      cancelButtonClick(e) {
        this.call('click:cancel', e);
      },

      confirmButtonClick(e) {
        this.call('click:confirm', e);
      },

      call(eventName, e) {
        if (!this.$listeners[eventName]) {
          this.closeDialog(e);
        }
        this.$emit(eventName, e);
      }
    }
  };
</script>
