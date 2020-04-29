<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Group name
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
                :rules="titleRules"
              />
            </div>

            <!-- example where label moves on focus -->
            <!-- <v-text-field
                            label="Amount"
                            value="10.00"
                            prefix="deip.world"
            ></v-text-field>-->

            <div>
              <v-text-field
                v-model="permlink"
                class="permlink-input"
                prefix="deip.world/"
                name="permlink"
                label="Permlink"
                hint="People can find your group by this url"
                :loading="isPermlinkChecking"
                :rules="permlinkRules"
                @keyup="setCustomPermlink"
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
        permlink: '',

        isPermlinkChecking: false,
        isPermlinkVerifyed: undefined,
        isDefaultPermlink: true,

        titleRules: [(v) => !!v || 'Group name is required'],
        permlinkRules: [
          (v) => !!v || 'Permanent link is required',
          (v) => (
            (!!v && this.isPermlinkVerifyed !== false)
            || 'This permanent link is already taken, please use another one'
          )
        ]
      };
    },
    computed: {
      nextDisabled() {
        return (
          !this.group.name
          || !this.group.permlink
          || this.isPermlinkVerifyed === false
        );
      }
    },
    watch: {
      name(newVal, oldVal) {
        if (this.isDefaultPermlink) {
          this.isPermlinkVerifyed = undefined;
          this.permlink = this.name
            .replace(/ /g, '-')
            .replace(/_/g, '-')
            .toLowerCase();
        }
        this.$emit('setName', this.name);
      },

      permlink(newVal, oldVal) {
        this.isPermlinkVerifyed = undefined;
        this.$emit(
          'setPermlink',
          this.permlink
            .replace(/ /g, '-')
            .replace(/_/g, '-')
            .toLowerCase()
        );
      }
    },
    methods: {
      setCustomPermlink() {
        this.isDefaultPermlink = false;
      },
      nextStep() {
        this.isPermlinkVerifyed = undefined;
        this.isPermlinkChecking = true;

        deipRpc.api
          .checkResearchGroupExistenceByPermlinkAsync(this.group.permlink)
          .then((res) => {
            this.isPermlinkVerifyed = !res;
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          })
          .finally(() => {
            this.isPermlinkChecking = false;
            const permlinkInput = _.find(
              this.$refs.form.inputs,
              (input) => input.$attrs.name === 'permlink'
            );
            permlinkInput.validate();

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
