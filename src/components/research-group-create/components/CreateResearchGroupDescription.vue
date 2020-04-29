<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Group description
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto group-description-max-width">
          <v-textarea
            v-model="description"
            name="Description"
            label="Description"
            solo
            auto-grow
            :rules="descriptionRules"
          />
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon> Back
        </v-btn>
        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateResearchGroupDescription',
    props: {
      group: { type: Object, required: true }
    },
    data() {
      return {
        description: '',
        descriptionRules: [(v) => !!v || 'Group description is required']
      };
    },
    computed: {
      nextDisabled() {
        return !this.group.description;
      }
    },
    watch: {
      description() {
        this.$emit('setDescription', this.description);
      }
    },
    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      }
    }
  };
</script>

<style lang="less" scoped>
    .group-description-max-width {
        max-width: 700px ;
    }
</style>
