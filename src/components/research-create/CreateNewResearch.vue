<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>

            <v-stepper v-model="currentStep" alt-labels class="legacy-column full-width full-height stepper-page">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Discipline</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Research group</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Title</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="4" :complete="currentStep > 4">
                        <div class="uppercase">Roadmap</div>
                    </v-stepper-step>
                    
                    <!-- <v-divider></v-divider> -->

                    <!-- <v-stepper-step step="6">
                        <div class="uppercase">Reward shares</div>
                    </v-stepper-step> -->
                </v-stepper-header>

                <v-stepper-items class="legacy-col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <create-research-pick-discipline
                                @incStep="incStep"
                                @setDisciplines="setDisciplines"
                                :research="research"
                            ></create-research-pick-discipline>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <create-research-pick-group
                                @incStep="incStep" @decStep="decStep"
                                @setGroup="setGroup"
                                @nextStepAfterCreated="incStep"
                                :currentStep="+currentStep"
                                :research="research"
                            ></create-research-pick-group>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <create-research-meta
                                @setTitle="setTitle"
                                @setDescription="setDescription"
                                @setVideo="setVideo"
                                @incStep="incStep" @decStep="decStep"
                                :research="research"
                                :isLoading="isLoading"
                            ></create-research-meta>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-roadmap
                                @finish="finish"
                                @decStep="decStep"
                                :research="research"
                                :isLoading="isLoading"
                            ></create-research-roadmap>
                        </div>
                    </v-stepper-content>

                    <!-- temporary commented -->
                    <!-- <v-stepper-content step="4">
                        <div class="full-height">
                            <create-research-share 
                                @finish="finish" @decStep="decStep"
                                @setReviewShare="setReviewShare"
                                :research="research"
                                :isLoading="isLoading"
                            ></create-research-share>
                        </div>
                    </v-stepper-content> -->
                </v-stepper-items>
            </v-stepper>
        </v-layout>
    </v-container>   
</template>

<script>
import moment from 'moment';
import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';
import { createResearchProposal } from "./../../services/ProposalService"; 
import * as disciplineTreeService from "./../common/disciplines/DisciplineTreeService"; 
import { mapGetters } from 'vuex';

export default {
  name: "CreateNewResearch",
  data() {
    return {
      currentStep: 0,
      isLoading: false,
      research: {
        disciplines: [],
        group: undefined,
        title: '',
        description: '',
        videoSrc: "",
        review_share_in_percent: 5,
        milestones: []
      }
    } 
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      userGroups: 'auth/userGroups',
      userCoworkers: 'auth/userCoworkers'
    })
  },

  methods: {
    incStep() {
      this.currentStep++;
    },
    decStep() {
      this.currentStep--;
    },

    setDisciplines(disciplines){
      this.research.disciplines = disciplines;
    },

    setGroup(group){
      this.research.group = group;
    },

    setTitle(title) {
      this.research.title = title;
    },

    setDescription(description) {
      this.research.description = description;
    },

    setVideo(videoSrc) {
      this.research.videoSrc = videoSrc;
    },

    setReviewShare(share) {
      this.research.review_share_in_percent = share;
    },

    finish() {
      const self = this;
      this.isLoading = true;

      createResearchProposal(
        this.research.group.id, 
        this.research.title, 
        this.research.description, 
        this.research.title.replace(/ /g, "-").replace(/_/g, "-").toLowerCase(), 
        500, // this.research.review_share_in_percent * this.DEIP_1_PERCENT,
        this.research.disciplines.map(d => d.id),
        this.research.milestones.map((m, i) => {
          return {
            goal: m.goal,
            details: m.details,
            eta: moment(m.eta).toDate(),
            is_active: i === 0
          }
        }),
        this.research.videoSrc
      )
      .then(() => {
        this.isLoading = false;
        this.$store.dispatch('layout/setSuccess', {
            message: `Proposal for "${this.research.title}" research is created !`
        });
      }, (err) => {
        console.log(err);
        this.isLoading = false;
        this.$store.dispatch('layout/setError', {
            message: "An error occurred while creating proposal, please try again later"
        });
      })
      .finally(() => {
        setTimeout(() => {
          self.$router.push({ name: 'ResearchFeed' });
        }, 1500);
      });
    }
  },

  created() {
    if (this.$route.query['disciplineIds'] && _.isArray(this.$route.query['disciplineIds'])) {
      try {
        this.research.disciplines = disciplineTreeService.getNodesByIdList(
          this.$route.query['disciplineIds'].map(disciplineId => parseInt(disciplineId))
        );
        this.currentStep = 2;
      } catch (e) {
        console.error('Invalid url params');
      }
    }
  }
};
</script>

<style lang="less">
</style>
