<template>
	<v-layout column align-center class="full-height" style="min-width: 50%">
		<v-layout row justify-center class="full-width">
			<div style="min-width: 40%;">
				<div class="step-title text-xs-center">Video Presentation</div>
				<div class="subheading pb-5 pt-2 text-xs-center">Provide a link to video presentation of your project</div>
				<div>
					<v-text-field 
						v-on:keyup="setVideo" 
						prepend-inner-icon="link"
						label="Link to a video presentation" 
						single-line
						v-model="videoSrc" 
						:rules="[rules.link, rules.mp4]"
					></v-text-field>
				</div>
			</div>
		</v-layout>

		<div>
			<v-btn flat small @click.native="prevStep()">
				<v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
			</v-btn>
			<v-btn color="primary" :disabled="!videoSrcIsValidOrAbsent || isLoading" :loading="isLoading" @click.native="nextStep()">{{!videoSrc ? `Skip` : `Next`}}</v-btn>
		</div> 
	</v-layout>
</template>

<script>
import moment from 'moment';
import Vue from 'vue';
import { mapGetters } from 'vuex';
    
export default {
	name: "CreateResearchVideo",
	props: {
		research: { type: Object, required: true },
		isLoading: { type: Boolean, required: true }
	},
	data() { 
		return {
			videoSrc: "",
			rules: {
				link: (value) => {
					return (!value || this.isValidLink) || 'Invalid http(s) link';
				},
				mp4: (value) => {
					return (!value || this.isMp4) || 'Only .mp4 format is supported currently';
				}
			}
		} 
	},
	computed: {
		nextDisabled() {
			return this.research.milestones.some(step => step.validation.isValid === false);
		},
		isValidLink() {
			let regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
			return regexp.test(this.videoSrc || "");
		},
		isMp4() {
			return this.isValidLink && this.videoSrc.substr(this.videoSrc.length - 4) == ".mp4";
		},
		videoSrcIsValidOrAbsent() {
			return !this.videoSrc || (this.isValidLink && this.isMp4);
		},
	},
	methods: {
		setVideo() {
			this.$emit('setVideo', this.videoSrc);
		},
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
