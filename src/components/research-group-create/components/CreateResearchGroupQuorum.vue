<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Quorum setup
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="group-quorum-max-width mx-auto">
          <div>
            Quorum shows how many votes it takes to approve a proposal (such as changing the research
            content, adding the research group members, initiating research fundraise, etc.) You can setup Quorum for
            each
            proposal individually using
            <span class="font-weight-medium clickable" @click="changeMode()">Advanced</span>
            options.
          </div>

          <v-text-field
            v-model="totalQuorum"
            :disabled="isAdvanced"
            suffix="%"
            mask="###"
            hide-details
            @keyup="onChangeTotalQuorum()"
          />

          <v-row v-show="isAdvanced" no-gutters>
            <v-col offset="2">
              <div class="py-4 font-weight-bold">
                Advanced quorum setup
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.startResearch"
                  class="width-6 pa-0 display-inline-block"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Start new project
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.createMaterial"
                  class="width-6 pa-0 display-inline-block"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Publish project results
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.changeReviewSharePercent"
                  class="width-6 display-inline-block pa-0"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Change research review award share
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.inviteMembers"
                  class="width-6 display-inline-block"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Invite new member to research group
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.dropoutMembers"
                  class="width-6 display-inline-block pa-0"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Exclude member from research group
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.startResearchTokenSale"
                  class="width-6 display-inline-block"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Schedule research fundraising campaign
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.offerResearchTokens"
                  class="width-6 display-inline-block pa-0"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Offer research shares
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.sendFunds"
                  class="width-6 display-inline-block pa-0"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Transfer research group funds
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.changeQuorum"
                  class="width-6 display-inline-block"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Change research group quorum threshold
                </div>
              </div>

              <div>
                <v-text-field
                  v-model="group.quorum.rebalanceGroupTokens"
                  class="width-6 display-inline-block pa-0"
                  suffix="%"
                  mask="###"
                  hide-details
                />
                <div class="display-inline-block ml-6 vertical-bottom">
                  Rebalance research group tokens
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>

        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  import { ResearchGroupService } from '@deip/research-group-service';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'CreateResearchGroupQuorum',

    props: {
      group: { type: Object, required: true }
    },

    data() {
      return {
        isAdvanced: false,
        totalQuorum: 50
      };
    },

    computed: {
      nextDisabled() {
        return _.some(
          this.group.quorum,
          (value) => {
            const intValue = parseInt(value);
            const isNumber = _.isFinite(intValue);

            return !isNumber || (isNumber && (intValue > 100 || intValue < 5));
          }
        );
      }
    },

    created() {
      this.onChangeTotalQuorum();
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      changeMode() {
        this.isAdvanced = !this.isAdvanced;
        this.onChangeTotalQuorum();
      },
      onChangeTotalQuorum() {
        if (!this.isAdvanced) {
          _.keys(this.group.quorum).forEach((key) => {
            this.group.quorum[key] = this.totalQuorum;
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .group-quorum-max-width {
    max-width: 510px;
  }
</style>
