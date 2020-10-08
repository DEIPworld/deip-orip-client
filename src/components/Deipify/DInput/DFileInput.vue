<!--<template>-->
<!--  <div>-->
<!--    <v-file-input-->
<!--      :label="label"-->

<!--      prepend-inner-icon="attach_file"-->
<!--      :prepend-icon="false"-->
<!--      outlined-->
<!--      -->
<!--    />-->
<!--    <div v-if="!!exist" class="pl-4 pt-2">-->
<!--      <a class="link" :href="exist" target="_blank">View file</a>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import Proxyable from 'vuetify/lib/mixins/proxyable';-->

<!--  export default {-->
<!--    name: 'DFileInput',-->
<!--    mixins: [Proxyable],-->
<!--    props: {-->
<!--      label: {-->
<!--        type: String,-->
<!--        default: null-->
<!--      }-->
<!--    }-->
<!--  };-->
<!--</script>-->

<script>
  import { VFileInput, VChip, VTextField } from 'vuetify/lib/components';

  export default {
    name: 'DFileInput',
    mixins: [VFileInput],
    props: {
      smallChips: {
        type: Boolean,
        default: true
      },
      chipAsLabel: {
        type: Boolean,
        default: true
      },
      chipColor: {
        type: String,
        default: 'primary'
      },
      outlined: {
        type: Boolean,
        default: true
      },
      prependIcon: {
        type: String,
        default: null
      },
      appendIcon: {
        type: String,
        default: '$file'
      },
      truncateLength: {
        type: [Number, String],
        default: 40
      },
    },
    computed: {
      classes() {
        return {
          ...VTextField.options.computed.classes.call(this),
          'v-file-input': true,
          'd-file-input': true
        };
      }
    },
    methods: {
      genChips() {
        if (!this.isDirty) return [];

        return this.text.map((text, index) => this.$createElement(VChip, {
          props: {
            small: this.smallChips,
            label: this.chipAsLabel,
            color: this.chipColor
          },
          on: {
            'click:close': () => {
              const { internalValue } = this;
              internalValue.splice(index, 1);
              this.internalValue = internalValue; // Trigger the watcher
            }
          }
        }, [text]));
      }
    }
  };
</script>

<style lang="scss">
  .d-file-input {
    .v-file-input__text--chips {
      margin-left: -4px;
    }
  }
</style>
