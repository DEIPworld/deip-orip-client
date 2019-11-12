<template>
  <v-card height="100%">
    <v-layout row wrap justify-center style="flex: 0 0 auto;" class="px-4 py-5 full-width">
      <v-flex xs10>
        <v-layout column>
          <div>
            <div class="title half-bold pb-3">Tilte:</div>
            <v-text-field 
              v-model="title"
              :rules="[rules.required]"
              name="title" 
              label="Title" 
              solo
            ></v-text-field>
          </div>

          <div>
            <div class="title half-bold pb-3">Description:</div>
            <v-textarea 
              v-model="description" 
              :rules="[rules.required]"
              name="Description" 
              label="Description"
              solo
              auto-grow
            ></v-textarea>
          </div>

          <div>
            <div class="title half-bold pb-3">Video Presentation:</div>
            <v-text-field 
              prepend-inner-icon="link"
              label="Link to a video presentation" 
              single-line
              solo
              v-model="videoSrc" 
              :rules="[rules.link, rules.mp4]"
            ></v-text-field>
          </div>

          <div>
            <div class="title half-bold pb-3">Active Milestone:</div>
            <v-select 
              v-model="activeMilestone" 
              :items="milestones" 
              label="Milestone" 
              solo
              item-text="goal"
              return-object>
            </v-select>
          </div>

          <div v-if="milestones" class="py-4">
            <div class="title half-bold pb-3">Roadmap:</div>
            <milestone-stepper :isReadOnly="false" :steps="milestones"></milestone-stepper>
          </div>

          <div class="text-xs-center">
            <v-btn class="pa-0 my-0 mx-2" large 
              :to="{
                name: 'ResearchDetails', 
                params: { 
                  research_group_permlink: encodeURIComponent(research.group_permlink), 
                  research_permlink: encodeURIComponent(research.permlink) 
                } 
              }">Cancel</v-btn>
            <v-btn class="pa-0 my-0 mx-2" large :loading="isLoading" :disabled="isSavingDisabled || isLoading" color="primary"  @click="save()">Save</v-btn>
          </div>

        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex';
import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import moment from 'moment';

export default {
  name: "ResearchEditBody",
  data() {
    return {
      title: "",
      description: "",
      milestones: undefined,
      videoSrc: "",
      activeMilestone: undefined,

      isLoading: false,

      rules: {
        required: value => !!value || 'This field is required',
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
    ...mapGetters({
      user: 'auth/user',
      research: 're/research'
    }),

    isSavingDisabled() {
      return !this.title || !this.description || !this.milestones || this.milestones.some(step => !step.validation || step.validation.isValid === false) || !this.videoSrcIsValidOrAbsent;
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
    }
  },
  methods: {
    save() {
      if (this.validateMilestones()) {
        this.isLoading = true;

        let description = this.description;
        let milestones = this.milestones.map(m => { 
          return {
            goal: m.goal,
            details: m.details,
            eta: moment(m.eta).toDate(),
            is_active: this.activeMilestone ? m.goal == this.activeMilestone.goal : false
          }
        });

        let abstract = JSON.stringify({
          description,
          milestones,
          video_src: this.videoSrc,
          is_tokenized: this.$options.filters.researchTokenized(this.research.abstract),
        });

        deipRpc.broadcast.researchUpdateAsync(
          this.user.privKey, 
          this.research.id,
          this.title,
          abstract,
          this.research.permlink,
          this.user.username
        )
        .then(() => {
          this.$store.dispatch('layout/setSuccess', { message: "Research has been updated successfully!"});
          setTimeout(() => {
            this.$router.push({
              name: 'ResearchDetails',
              params: { 
                research_group_permlink: encodeURIComponent(this.research.group_permlink), 
                research_permlink: encodeURIComponent(this.research.permlink) 
              }
            });
            this.isLoading = false;
          }, 1500);
        }, (err) => {
            console.log(err);
            this.$store.dispatch('layout/setError', { message: "An error occurred while updating research, please try again later"});
            this.isLoading = false;
        });
      }
    },

    validateMilestones() {
			let milestones = this.milestones;
			for (let index = 0; index < milestones.length; index++) {
				let isValid = undefined;
        let step = milestones[index];
        
				if (step.goal == "") {
					isValid = false;
					Vue.set(step.validation, 'goalError', index === milestones.length - 1 ? "Research should have the primary Goal" : "Step Goal is required");
				}
				if (!step.eta || moment(step.eta).diff(moment(), 'days') < 0) {
					isValid = false;
					Vue.set(step.validation, 'etaError', step.eta == "" ? "Goal deadline should be specified" : "Goal deadline can not be in the Past");
				}

				Vue.set(step.validation, 'isValid', isValid !== false);
			}
      return milestones.every(step => step.validation.isValid);
		}
  },

  created() {
    this.title = this.research.title;
    this.description = this.$options.filters.researchAbstract(this.research.abstract);
    this.milestones = this.$options.filters.researchMilestones(this.research.abstract);
    this.videoSrc = this.$options.filters.researchVideoSrc(this.research.abstract);
    this.activeMilestone = this.milestones.find(m => m.is_active);
  }
};
</script>

<style lang="less">
</style>