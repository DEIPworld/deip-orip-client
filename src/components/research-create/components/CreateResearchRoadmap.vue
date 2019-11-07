<template>
	<v-layout column align-center class="full-height" style="flex: 0 0 auto; overflow: scroll">
		<div class="step-title">Roadmap</div>
		<div class="subheading c-mb-4 px-4">Let’s create a roadmap for your research. Well-presented and detailed roadmap attracts more investors to help you to get the funding</div>
		<div class="full-width pa-4">
			<milestone-stepper :is-read-only="false" :steps="research.steps"></milestone-stepper>
		</div>
		<div>
			<v-btn flat small @click.native="prevStep()">
				<v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
			</v-btn>
			<v-btn color="primary" @click.native="nextStep()">Create Research</v-btn>
		</div> 
	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
    
export default {
	name: "CreateResearchRoadmap",
	props: {
		research : { type: Object, required: true }
	},
	data() { 
		return {
		} 
	},
	methods: {
		nextStep() {
			// this.$emit('incStep');
			this.$emit('finish');
		},
		prevStep() {
			this.$emit('decStep');
		},
		// finish() {
		// 	this.$emit('finish');
		// }
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
</style>
