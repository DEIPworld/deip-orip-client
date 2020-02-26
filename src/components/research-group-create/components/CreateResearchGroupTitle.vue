<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Team name
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto group-title-max-width">
          <v-form ref="form">
            <div>
              <v-text-field
                v-model="name"
                name="title"
                label="Title"
                hint="Name of your group"
                :error-messages="isPermlinkVerifyed === false ? 'Group with the same name already exists' : ''"
                :rules="titleRules"
              />
            </div>
          </v-form>
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import _ from 'lodash';

  export default {
    name: 'CreateResearchGroupTitle',
    props: {
      group: { type: Object, required: true }
    },
    data() {
      return {
        name: '',
        isPermlinkChecking: false,
        isPermlinkVerifyed: undefined,
        titleRules: [(v) => !!v || 'Group name is required']
      };
    },
    computed: {
      nextDisabled() {
        return !this.group.name || this.isPermlinkVerifyed === false;
      }
    },
    watch: {
      name(newVal, oldVal) {
        this.isPermlinkVerifyed = undefined;
        this.$emit('setName', this.name);
      },
    },
    methods: {
      nextStep() {
        this.isPermlinkVerifyed = undefined;
        this.isPermlinkChecking = true;

        deipRpc.api.checkResearchGroupExistenceByPermlinkAsync(this.group.name)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          })
          .finally(() => {
            this.isPermlinkChecking = false;
            if (this.isPermlinkVerifyed) {
              this.$emit('incStep');
            }
          });
      }
    }
  };
</script>

<style lang="less">
@import "./../../../styles/colors.less";

.group-title-max-width {
  max-width: 700px;
}

.permlink-input {
  .v-text-field__prefix {
    background: @grey-lighten-2;
    border-radius: 2px 2px 0 0;
    padding: 3px 8px 3px;
    margin-top: 2px;
    margin-right: 3px;
  }
  // standart vuetify prefixes of big length are buged, so this is workaround
  // vuetify v1.0.16
  // &.v-input-group--prefix:not(.v-input-group--focused):not(.v-input-group--dirty) label {
  //     left: 105px;
  //     // width: 50%;
  // }
}
</style>
