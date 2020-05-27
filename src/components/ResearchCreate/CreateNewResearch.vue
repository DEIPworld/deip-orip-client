<template>
  <v-container class="fill-height pa-0" fluid>
    <v-stepper
      v-model="currentStep"
      alt-labels
      class="display-flex flex-column w-100 fill-height stepper-page"
    >
      <v-stepper-header class="flex-grow-0">
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="text-uppercase">
            Discipline
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="text-uppercase text-center">
            Research group
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="text-uppercase">
            Title
          </div>
        </v-stepper-step>

        <v-divider />

        <!-- <v-stepper-step step="4" :complete="currentStep > 4">
                      <div class="text-uppercase">Video</div>
                  </v-stepper-step>

        <v-divider></v-divider>-->

        <v-stepper-step step="4" :complete="currentStep > 4">
          <div class="text-uppercase">
            Roadmap
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="5" :complete="currentStep > 5">
          <div class="text-uppercase">
            Settings
          </div>
        </v-stepper-step>

        <!-- <v-divider></v-divider>

                  <v-stepper-step step="5">
                      <div class="text-uppercase">Reward shares</div>
        </v-stepper-step>-->
      </v-stepper-header>

      <v-stepper-items class="flex-grow-1">
        <v-stepper-content step="1">
          <div class="fill-height">
            <create-research-pick-discipline
              :research="research"
              @incStep="incStep"
              @setDisciplines="setDisciplines"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="fill-height">
            <create-research-pick-group
              :research="research"
              @incStep="incStep"
              @decStep="decStep"
              @setGroup="setGroup"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="fill-height">
            <create-research-meta
              :research="research"
              :is-loading="isLoading"
              @setTitle="setTitle"
              @setDescription="setDescription"
              @setVideo="setVideo"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <!-- <v-stepper-content step="4">
                      <div class="fill-height">
                          <create-research-video
                              @setVideo="setVideo"
                              @incStep="incStep" @decStep="decStep"
                              :research="research"
                              :isLoading="isLoading"
                          ></create-research-video>
                      </div>
        </v-stepper-content>-->

        <v-stepper-content step="4">
          <div class="fill-height">
            <create-research-roadmap
              :research="research"
              :is-loading="isLoading"
              @decStep="decStep"
              @incStep="incStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="5">
          <div class="fill-height">
            <create-research-settings
              :research="research"
              :is-loading="isLoading"
              @finish="finish"
              @decStep="decStep"
              @setPrivateFlag="setPrivateFlag"
            />
          </div>
        </v-stepper-content>

        <!-- <v-stepper-content step="5">
                      <div class="fill-height">
                          <create-research-share
                              @finish="finish" @decStep="decStep"
                              @setReviewShare="setReviewShare"
                              :research="research"
                              :isLoading="isLoading"
                          ></create-research-share>
                      </div>
        </v-stepper-content>-->
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  // import Vue from 'vue';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import { mapGetters } from 'vuex';

  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchService } from '@deip/research-service';

  import * as disciplineTreeService from '../common/disciplines/DisciplineTreeService';

  const researchGroupService = ResearchGroupService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'CreateNewResearch',

    data() {
      return {
        currentStep: 1,
        isLoading: false,
        research: {
          disciplines: [],
          group: undefined,
          title: '',
          description: '',
          videoSrc: '',
          review_share_in_percent: 5,
          milestones: [],
          isPrivate: false,
          partners: [],
          tenantCriterias: []
        }
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        userCoworkers: 'auth/userCoworkers'
      })
    },

    created() {
      if (
        this.$route.query.disciplineIds
        && _.isArray(this.$route.query.disciplineIds)
      ) {
        try {
          this.research.disciplines = disciplineTreeService.getNodesByIdList(
            this.$route.query.disciplineIds.map((disciplineId) => parseInt(disciplineId))
          );
          if (this.$route.query.groupPermlink) {
            const newGroup = this.userGroups.find(
              (item) => item.permlink === this.$route.query.groupPermlink
            );
            this.setGroup(newGroup);
            this.currentStep = 3;
          } else {
            this.currentStep = 2;
          }
        } catch (e) {
          console.error('Invalid url params');
        }
      }
    },

    methods: {
      incStep() {
        this.currentStep++;
      },
      decStep() {
        this.currentStep--;
      },

      setDisciplines(disciplines) {
        this.research.disciplines = disciplines;
      },

      setGroup(group) {
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

      setPrivateFlag(isPublic) {
        this.research.isPrivate = !isPublic;
      },

      finish() {
        this.isLoading = true;

        const isProposal = !this.research.group.is_personal;
        return researchService.createResearchViaOffchain(
          this.user.privKey,
          isProposal,
          {
            researchGroup: this.research.group.account.name,
            title: this.research.title,
            abstract: this.research.description,
            disciplines: this.research.disciplines.map((d) => d.id),
            isPrivate: this.research.isPrivate,
            members: undefined,
            reviewShare: '0.00 %',
            compensationShare: undefined,
            extensions: []
          },
          {
            videoSrc: this.research.videoSrc,
            milestones: this.research.milestones.map((m, i) => ({
              goal: m.goal,
              budget: m.budget,
              purpose: m.purpose,
              details: m.details,
              eta: moment(m.eta).toDate(),
              isActive: i === 0
            })),
            partners: this.research.partners,
            tenantCriterias: this.research.tenantCriterias.map(criteria => {
              return criteria.value.index != null ? { ...criteria } : { ...criteria, value: null };
            })
          }
        )
          .then(({ rm }) => {
            this.isLoading = false;
            this.$store.dispatch('layout/setSuccess', {
              message: `Project "${this.research.title}" has been created successfully`
            });
            return deipRpc.api.getResearchAsync(rm._id);
          })
          .then((research) => {
            if (research) { // if not proposal
              this.$router.push({
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(research.research_group.permlink),
                  research_permlink: encodeURIComponent(research.permlink)
                }
              });
            } else {
              this.$router.push({ name: 'ResearchFeed' });
            }
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating project, please try again later'
            });
          })
      }
    }
  };
</script>

<style lang="less">
  .flex-column {
    flex-direction: column;
  }

  .flex-grow-0 {
    flex-grow: 0 !important;
  }

  .flex-grow-1 {
    flex-grow: 1 !important;
  }

  .w-100 {
    width: 100%;
  }

  .flex-basis-0 {
    flex-basis: 0 !important;
  }
</style>
