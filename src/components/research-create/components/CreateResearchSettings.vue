<template>
  <v-row class="full-width fill-height overflow-auto justify-center">
    <v-col cols="12" sm="8" class="flex-column mb-4 px-12">
      <div class="mb-6 step-title">
        Project settings
      </div>
      <div class="font-weight-bold title text-align-left mb-6">
        Visibility
      </div>
      <div>
        <div class="display-inline-block" :class="{'grey--text':isPublic}">
          Private project
        </div>
        <div class="display-inline-block">
          <v-switch
            v-model="isPublic"
            class="my-0 ml-2 py-0"
            color="primary"
            @change="setPrivateFlag"
          />
        </div>
        <div class="display-inline-block" :class="{'grey--text':!isPublic}">
          Public project
        </div>
      </div>
      <v-divider />
    </v-col>

    <v-col cols="12" sm="8" class="px-12">
      <div class="my-6">
        <div class="title font-weight-medium mb-6">
          Technology Readiness Level
        </div>
        <technology-readiness-level
          :current-trl-step="research.trlStep"
          @changeCurrentTrlStep="changeCurrentTrlStep"
        />
      </div>
    </v-col>

    <v-col cols="12" sm="8" class="px-12">
      <div class="my-6">
        <div class="title font-weight-medium mb-6">
          Partners
        </div>
        <research-partners :partners="research.partners" />
      </div>
    </v-col>

    <v-col cols="12" class="flex-grow-0 align-self-end">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>Back
        </v-btn>
        <v-btn
          :loading="isLoading"
          :disabled="isLoading || isEmptyFields"
          color="primary"
          @click.native="nextStep()"
        >
          Create project
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'CreateResearchSettings',
    props: {
      research: { type: Object, required: true },
      isLoading: { type: Boolean, required: false }
    },
    data() {
      return {
        isPublic: !this.research.isPrivate,
        currentTrlStep: undefined
      };
    },
    computed: {
      isEmptyFields() {
        return this.research.partners.length ? !!this.research.partners.find((item) => item.title == '' || item.type == '') : false;
      }
    },
    methods: {
      nextStep() {
        this.$emit('finish');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setPrivateFlag() {
        this.$emit('setPrivateFlag', this.isPublic);
      },
      changeCurrentTrlStep(step) {
        this.currentTrlStep = step;
        this.$emit('setTrlStep', this.currentTrlStep);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
