<template>
  <v-container class="fill-height pa-0 full-height" fluid>
    <v-stepper
      v-model="currentStep"
      alt-labels
      class="display-flex flex-column full-width fill-height full-height elevation-0"
    >
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="text-uppercase">
            {{ $t('createResearch.domainBlock.title') }}
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="text-uppercase text-center">
            {{ $t('createResearch.teamBlock.title') }}
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="text-uppercase">
            {{ $t('createResearch.metaBlock.title') }}
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="4" :complete="currentStep > 4">
          <div class="text-uppercase">
            {{ $t('createResearch.roadmapBlock.title') }}
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="5" :complete="currentStep > 5">
          <div class="text-uppercase">
            {{ $t('createResearch.settingsBlock.title') }}
          </div>
        </v-stepper-step>

        <!-- <v-divider></v-divider>

        <v-stepper-step step="5">
          <div class="text-uppercase">
            {{ $t('createResearch.sharesBlock.title') }}
          </div>
        </v-stepper-step>-->
      </v-stepper-header>

      <v-stepper-items class="full-height">
        <v-stepper-content step="1" class="full-height">
          <v-card>
            <create-research-pick-discipline
              :research="research"
              @incStep="incStep"
              @setDisciplines="setDisciplines"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card>
            <create-research-pick-group
              :research="research"
              @incStep="incStep"
              @decStep="decStep"
              @setGroup="setGroup"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card>
            <create-research-meta
              :research="research"
              :is-loading="isLoading"
              @setTitle="setTitle"
              @setDescription="setDescription"
              @setVideo="setVideo"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card>
            <create-research-roadmap
              :research="research"
              :is-loading="isLoading"
              @decStep="decStep"
              @incStep="incStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-card>
            <create-research-settings
              :research="research"
              :is-loading="isLoading"
              @finish="finish"
              @decStep="decStep"
              @setPrivateFlag="setPrivateFlag"
            />
          </v-card>
        </v-stepper-content>

        <!-- <v-stepper-content step="5">
          <v-card>
            <create-research-share
              @finish="finish" @decStep="decStep"
              @setReviewShare="setReviewShare"
              :research="research"
              :isLoading="isLoading"
            />
          </v-card>
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
          attributes: {}
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
          if (this.$route.query.externalId) {
            const newGroup = this.userGroups.find((item) => item.external_id === this.$route.query.externalId);
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
          { privKey: this.user.privKey, username: this.user.username },
          false,
          {
            researchGroup: this.research.group.account.name,
            title: this.research.title,
            abstract: this.research.description,
            disciplines: this.research.disciplines.map((d) => d.id),
            isPrivate: this.research.isPrivate,
            members: undefined,
            reviewShare: undefined,
            compensationShare: undefined,
            extensions: []
          },
          {
            attributes: Object.keys(this.research.attributes)
              .map((attribute) => ({
                researchAttributeId: attribute,
                value: this.research.attributes[attribute]
              }))
          }
        )
          .then((research) => {
            this.isLoading = false;
            this.$notifier.showSuccess(this.$t('createResearch.success', { title: research.title }));

            if (research) { // if not proposal
              this.$router.push({
                name: 'research.details',
                params: {
                  researchExternalId: research.external_id
                }
              });
            } else {
              this.$router.push({ name: 'ResearchFeed' });
            }
          })
          .catch((err) => {
            console.error(err);
            this.isLoading = false;
            this.$notifier.showError(this.$t('createResearch.success'));
          });
      }
    }
  };
</script>

<style lang="less">

</style>
