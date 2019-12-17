<template>
	<v-layout column align-center fill-height overflow-auto>
		<v-flex>
			<div class="step-title text-xs-center">Roadmap</div>
			<div class="subheading pb-5 pt-2 text-xs-center">Let’s create a roadmap for your research</div>
			<milestone-stepper :isReadOnly="false" :steps="research.milestones"></milestone-stepper>
		</v-flex>

		<v-flex flex-grow-0>
			<v-layout>
				<v-btn flat small @click.native="prevStep()">
					<v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
				</v-btn>
				<v-btn :loading="isLoading" :disabled="nextDisabled || isLoading" color="primary" @click.native="nextStep()">Create Project</v-btn>
				</v-layout>
		</v-flex> 
	</v-layout>
</template>

<script>
import moment from 'moment';
import Vue from 'vue';
import { mapGetters } from 'vuex';
    
export default {
	name: "CreateResearchRoadmap",
	props: {
		research: { type: Object, required: true },
		isLoading: { type: Boolean, required: false },
	},
	data() { 
		return {
		} 
	},
	computed: {
		nextDisabled() {
			return this.research.milestones.some(step => step.validation.isValid === false);
		}
	},
	methods: {
		nextStep() {
			if (this.validate()) {
				this.$emit('finish');
			}
		},
		prevStep() {
			this.$emit('decStep');
		},

		validate() {
			let milestones = this.research.milestones;
			for (let index = 0; index < milestones.length; index++) {
				let isValid = undefined;
				let step = milestones[index];
				if (step.goal == "") {
					isValid = false;
					Vue.set(step.validation, 'goalError', index === milestones.length - 1 ? "Research should have the primary Goal" : "Step Goal is required");
				}
				if (!step.eta /* || moment(step.eta).diff(moment(), 'days') < 0 */) {
					isValid = false;
					Vue.set(step.validation, 'etaError', step.eta == "" ? "Goal deadline should be specified" : "Goal deadline can not be in the Past");
				}

				Vue.set(step.validation, 'isValid', isValid !== false);
			}
      return milestones.every(step => step.validation.isValid);
		}
	}
};
</script>

<style lang="less" scoped>
	.milestone-devider {
		position: absolute;
		border-right: 1px solid;
		height: 29px;
		bottom: 0;
		top: calc(100% - 6px);
		left: calc(50%);
	}
	.milestone-devider.last {
		border-color: #ddd;
		height: 50px;
	}
	.remove-milestone {
		.remove-icon {
			display: none;
		}
		&:hover {
			.number-icon {
					display: none;
			}
			.remove-icon {
					display: block;
			}
		}
	}
	.px-10{
		padding-left: 10%;
		padding-right: 10%;
	}
</style>
