<template>
  <v-layout row wrap full-width fill-height overflow-auto justify-center>
    <v-flex xs12 sm8 display-flex flex-column mb-3 px-5>
      <div class="mb-5 font-weight-bold display-1 text-align-center">Project settings</div>
      <div class="font-weight-bold title text-align-left mb-4">Visibility</div>
      <v-layout row shrink>
        <v-flex shrink :class="{'grey--text':isPublic}">Private project</v-flex>
        <v-flex shrink>
          <v-switch
            class="my-0 ml-2 py-0"
            v-model="isPublic"
            @change="setPrivateFlag"
            color="primary"
          ></v-switch>
        </v-flex>
        <v-flex shrink :class="{'grey--text':!isPublic}">Public project</v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-flex>

    <v-flex xs12 sm8 px-5>
      <div class="my-4">
        <div class="title font-weight-medium mb-4">Technology Readiness Level</div>
        <technology-readiness-level
          :currentTrlStep="research.trlStep"
          @changeCurrentTrlStep="changeCurrentTrlStep"
        ></technology-readiness-level>
      </div>
    </v-flex>

    <v-flex xs12 sm8 px-5>
      <div class="my-4">
        <div class="title font-weight-medium mb-4">Partners</div>
        <research-partners :partners="research.partners"></research-partners>
      </div>
    </v-flex>

    <v-flex xs12 flex-grow-0 align-self-end>
      <v-layout row justify-center align-center>
        <v-btn flat small @click.native="prevStep()">
          <v-icon dark class="pr-1">keyboard_arrow_left</v-icon>Back
        </v-btn>
        <v-btn
          :loading="isLoading"
          :disabled="isLoading || isEmptyFields"
          color="primary"
          @click.native="nextStep()"
        >Create project</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from "vue";

export default {
  name: "CreateResearchSettings",
  props: {
    research: { type: Object, required: true },
    isLoading: { type: Boolean, required: false }
  },
  data() {
    return {
      isPublic: !this.research.isPrivate,
      currentTrlStep: undefined,
    };
  },
  computed: {
    isEmptyFields(){
      return this.research.partners.length ? !!this.research.partners.find(item => item.title == '' || item.type == '') : false
    }
  },
  methods: {
    nextStep() {
      this.$emit("finish");
    },
    prevStep() {
      this.$emit("decStep");
    },
    setPrivateFlag() {
      this.$emit("setPrivateFlag", this.isPublic);
    },
    changeCurrentTrlStep(step) {
      this.currentTrlStep = step;
      this.$emit("setTrlStep", this.currentTrlStep);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
