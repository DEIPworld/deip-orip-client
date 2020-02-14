<template>
  <v-layout row wrap full-width fill-height overflow-auto justify-center>
    <v-flex xs12 sm8 display-flex flex-column mb-3 px-5>
      <div class="mb-5 font-weight-bold display-1 text-align-center">Project settings</div>
      <div class="font-weight-bold title text-align-left mb-4">Visibility</div>
      <v-layout row shrink>
        <v-flex shrink :class="{'grey--text':isPublic}">Private project</v-flex>
				<v-flex shrink>
        	<v-switch class="my-0 ml-2 py-0" v-model="isPublic" @change="setPrivateFlag" color="primary"></v-switch>
				</v-flex>
        <v-flex shrink :class="{'grey--text':!isPublic}">Public project</v-flex>
      </v-layout>
			<v-divider></v-divider>
    </v-flex>

    <v-flex xs12 flex-grow-0 align-self-end>
      <v-layout row justify-center align-center>
        <v-btn flat small @click.native="prevStep()">
          <v-icon dark class="pr-1">keyboard_arrow_left</v-icon>Back
        </v-btn>
        <v-btn
          :loading="isLoading"
          :disabled="isLoading"
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
      isPublic: !this.research.isPrivate
    };
  },
  methods: {
    nextStep() {
        this.$emit("finish");
    },
    prevStep() {
      this.$emit("decStep");
    },
		setPrivateFlag(){
			this.$emit('setPrivateFlag', this.isPublic)
		}
	},
};
</script>

<style lang="less" scoped>
</style>
