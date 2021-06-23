<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/" :items="breadcrumbs" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="9">
        <v-divider />
        <v-card class="pa-6 full-height">
          <div>
            <div class="text-h4 py-6">
              {{ program.additional_info.funding_opportunity_title }}
              ({{ program.funding_opportunity_number }})
            </div>
            <v-divider />
          </div>

          <div>
            <div class="text-h5 pt-6">
              Award Receivers
            </div>
            <div v-for="(funding, fundingIdx) in fundings" :key="`${fundingIdx}-funding`">
              <div v-if="fundingIdx != 0">
                <v-btn
                  v-if="fundingIdx != 0"
                  class="ma-0"
                  outlined
                  color="primary"
                  @click="removeReceiver(fundingIdx)"
                >
                  <v-icon>remove</v-icon>
                  <!-- Receiver #{{fundingIdx + 1}} -->
                  Subawardee #{{ fundingIdx + 1 }}
                </v-btn>
              </div>

              <v-row no-gutters class="pt-12">
                <v-col cols="8">
                  <div class="text-subtitle-1 font-weight-bold">
                    Award number
                  </div>
                  <v-text-field
                    v-model="funding.awardNumber"
                    placeholder="Award number"
                    outlined
                    :rules="[rules.required, rules.awardNumber]"
                    validate-on-blur
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="8">
                  <div class="text-subtitle-1 font-weight-bold">
                    Researcher Name
                  </div>
                  <v-autocomplete
                    v-model="funding.researcher"
                    label="Full Name"
                    :loading="funding.isResearchersLoading"
                    :items="funding.foundResearchers"
                    item-text="name"
                    outlined
                    return-object
                    :rules="[() => funding.researcher && funding.researcher.name.length > 0 || 'Researcher name is required']"
                    :search-input.sync="funding.researcherSearch"
                    @keyup="queryResearchers(funding)"
                    @input="setResearchGroupsList(funding); setAwardSourcesList(funding);"
                  />
                </v-col>
                <v-col v-if="fundingIdx != 0" cols="3" offset="1">
                  <!-- <div class="text-subtitle-1 font-weight-bold">Organization</div>
                  <div class="v-input v-text-field theme--light">
                    <div class="v-input__control">
                      <div><label>{{funding.researchGroup ? funding.researchGroup.name : ""}}</label></div>
                    </div>
                  </div> -->
                  <div class="text-subtitle-1 font-weight-bold">
                    PI
                  </div>
                  <v-select
                    v-model="funding.awardSource"
                    class="pa-0 ma-0"
                    outlined
                    :items="funding.foundAwardSources"
                    item-text="name"
                    return-object
                    :loading="funding.isAwardSourceLoading"
                    hide-details
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="pt-2">
                <v-col cols="12">
                  <div class="text-subtitle-1 font-weight-bold">
                    Research Group
                  </div>
                  <v-select
                    v-model="funding.researchGroup"
                    outlined
                    :items="funding.foundResearchGroups"
                    :disabled="!funding.researcher"
                    item-text="name"
                    return-object
                    :loading="funding.isResearchGroupsLoading"
                    label="Group name"
                    @input="setResearchList(funding)"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="pt-2">
                <v-col cols="12">
                  <div class="text-subtitle-1 font-weight-bold">
                    Research
                  </div>
                  <v-select
                    v-model="funding.research"
                    :items="funding.foundResearch"
                    outlined
                    :disabled="!funding.researchGroup"
                    item-text="title"
                    return-object
                    :loading="funding.isResearchLoading"
                    label="Title"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="pt-4">
                <v-col cols="8">
                  <div class="text-subtitle-1 font-weight-bold">
                    Purpose
                  </div>
                  <div
                    class="v-input v-text-field theme--light"
                    @click="focusInputByRef($event, 'funding-awardAmount-' + fundingIdx)"
                  >
                    <div class="v-input__control">
                      <div class="v-input__slot">
                        <label>Award amount</label>
                      </div>
                      <div class="v-text-field__details" />
                    </div>
                  </div>
                </v-col>
                <v-col cols="3" offset="1" class="pt-4">
                  <div class="text-subtitle-1 font-weight-bold">
&nbsp;
                  </div>
                  <v-text-field
                    :ref="'funding-awardAmount-' + fundingIdx"
                    v-model.number="funding.purpose.awardAmount"
                    v-mask="'##############'"
                    :rules=" fundingIdx == 0 ? [rules.required, rules.totalAwardValidator, rules.balanceIsSufficient ] : [ rules.required, rules.totalAwardValidator ]"
                    class="right-input"
                    outlined
                    suffix="$"
                  />
                </v-col>
              </v-row>

              <!-- <v-row no-gutters>
                <v-col cols="8">
                  <div @click="focusInputByRef($event, 'funding-equipment-' + fundingIdx)" class="v-input v-text-field theme--light">
                    <div class="v-input__control">
                      <div class="v-input__slot"><label>Equipment</label></div>
                      <div class="v-text-field__details"></div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="3" offset="1" class="pt-4">
                    <v-text-field outlined v-model.number="funding.purpose.equipment" class="right-input" :ref="'funding-equipment-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                </v-col>
              </v-row> -->

              <!-- <v-row no-gutters>
                <v-col cols="8">
                  <div @click="focusInputByRef($event, 'funding-businessTravel-' + fundingIdx)" class="v-input v-text-field theme--light">
                    <div class="v-input__control">
                      <div class="v-input__slot"><label>Business travel</label></div>
                      <div class="v-text-field__details"></div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="3" offset="1" class="pt-4">
                    <v-text-field outlined v-model.number="funding.purpose.businessTravel" class="right-input" :ref="'funding-businessTravel-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                </v-col>
              </v-row> -->

              <v-row no-gutters>
                <!-- <v-col cols="8">
                  <div v-if="fundingIdx == 0">
                    <div class="text-subtitle-1 font-weight-bold">
                      University overhead cap
                    </div>
                    <v-text-field
                      v-model="funding.overhead"
                      v-mask="'##'"
                      :rules="[rules.allowedOverhead]"
                      outlined
                      suffix="%"
                    />
                  </div>
                </v-col> -->
                <v-col cols="3" offset="9">
                  <div class="text-subtitle-1 font-weight-bold">
&nbsp;
                  </div>
                  <div class="total-row">
                    <div class="text-subtitle-1 font-weight-bold">
                      Total amount
                    </div>
                    <div class="text-h5">
                      $ {{ calculateTotalExpenses(funding) }}
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- <div>
                <v-row no-gutters class="py-4">
                  <v-col cols="12">
                    <div class="text-subtitle-1 font-weight-bold">Milestones</div>
                  </v-col>
                </v-row>
                <div v-for="(milestone, milestoneIdx) in funding.milestones" :key="`${milestoneIdx}-milestone`">
                  <div>
                    <v-row no-gutters>
                      <v-col cols="5">
                        <div class="text-subtitle-1 font-weight-bold">Description</div>
                        <v-text-field outlined v-model="milestone.description" :prefix="milestoneIdx + 1 + '.'"></v-text-field>
                      </v-col>
                      <v-col cols="2" offset="1">
                        <div class="text-subtitle-1 font-weight-bold">Deadline</div>
                          <datetime-picker
                              :datetime="milestone.deadline"
                              :available-from-now="true"
                              :dateOnly="true"
                              @input="(val) => {
                                milestone.deadline = val;
                                milestone.deadlineDate = new Date(val);
                              }"
                          ></datetime-picker>
                      </v-col>
                      <v-col cols="3" offset="1">
                        <div class="text-subtitle-1 font-weight-bold">Amount</div>
                        <div class="right-input">
                          <v-text-field outlined v-model="milestone.amount" suffix="%" mask="###"></v-text-field>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <v-row no-gutters v-if="(funding.milestones.length - 1) == milestoneIdx" class="pb-2">
                    <v-col cols="2" offset="10">
                      <v-btn class="ma-0" block color="primary" @click="addMilestone(funding)">
                        <v-icon>add</v-icon>
                        Milestone
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row no-gutters v-if="funding.milestones.length > 1 && (funding.milestones.length - 1) != milestoneIdx" class="pb-4">
                    <v-col cols="2" offset="10">
                      <v-btn class="ma-0" outlined block color="primary" @click="removeMilestone(funding, milestoneIdx)">
                        <v-icon>remove</v-icon>
                        Milestone #{{milestoneIdx + 2}}
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div> -->
              <v-divider class="mt-12" />
              <v-divider class="mb-12" />
            </div>

            <div class="py-4 display-flex justify-space-between">
              <div>
                <v-btn
                  class="ma-0"
                  block
                  color="primary"
                  @click="addReceiver()"
                >
                  <v-icon>add</v-icon>
                  <!-- Receiver -->
                  Add Subawardee
                </v-btn>
              </div>
              <div>
                <v-btn
                  class="ma-0"
                  block
                  color="primary"
                  :disabled="saveIsDisabled || isSaving"
                  :loading="isSaving"
                  @click="save()"
                >
                  Save
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-divider />
        <v-card class="full-height">
          <div class="py-4 text-center">
            <v-avatar size="120px">
              <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.external_id, 120, 120, true)">
            </v-avatar>
          </div>
          <v-divider />

          <div class="py-4 pl-4">
            <div class="sm-title pb-2 font-weight-bold">
              Program Officers
            </div>
            <div v-for="(officer, i) in program.officers" :key="`${i}-funding-officer`">
              <div class="pt-2">
                <v-avatar size="40px">
                  <img v-if="officer.profile" :src="officer.profile | avatarSrc(40, 40, false)">
                  <v-gravatar v-else :email="officer.account.name + '@deip.world'" />
                </v-avatar>
                <router-link
                  class="a text-body-1 pl-2 pt-2"
                  :to="{ name: 'UserDetails', params: { account_name: officer.account.name } }"
                >
                  {{ officer | fullname }}
                </router-link>
              </div>
            </div>
          </div>
          <v-divider />

          <div class="py-4 pl-4">
            <v-icon color="primary">
              email
            </v-icon>
            <span
              class="pl-1 font-weight-bold"
            >{{ program.additional_info.grantor_email || organizationProfile.email }}</span>
          </div>
          <v-divider />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ProjectService } from '@deip/project-service';
  import { GrantsService } from '@deip/grants-service';
  import { BlockchainService } from '@deip/blockchain-service';
  import { TeamService } from '@deip/team-service';

  const teamService = TeamService.getInstance();
  const projectService = ProjectService.getInstance();
  const grantsService = GrantsService.getInstance();
  const blockchainService = BlockchainService.getInstance();

  export default {
    name: 'CreateFoaAgencyAward',

    data() {
      return {
        fundings: [],
        isSaving: false,
        MIN_FOA_NUMBER_LENGTH: 3,
        MAX_FOA_NUMBER_LENGTH: 15,
        MIN_UNIVERSITY_OVERHEAD: 1,
        MAX_UNIVERSITY_OVERHEAD: 50,

        rules: {
          required: (v) => !!v || this.$t('defaultNaming.fieldRules.required'),

          balanceIsSufficient: (v) => {
            const amount = parseInt(v);
            if (!isNaN(amount) && amount > this.fromAssetsToFloat(this.program.current_supply)) {
              return 'Funding opportunity current supply is insufficient';
            }
            return true;
          },

          allowedOverhead: (v) => {
            if (!v) return 'Unibersity overhead is required';
            const val = parseInt(v);
            if (val < this.MIN_UNIVERSITY_OVERHEAD) {
              return `University overhead should be greater/equal than ${this.MIN_UNIVERSITY_OVERHEAD}`;
            } if (val > this.MAX_UNIVERSITY_OVERHEAD) {
              return `University overhead should be less/equal than ${this.MAX_UNIVERSITY_OVERHEAD}`;
            }
            return true;
          },

          awardNumber: (v) => {
            if (v.length < this.MIN_FOA_NUMBER_LENGTH) {
              return `Award number length should be greater/equal than ${this.MIN_FOA_NUMBER_LENGTH}`;
            } if (v.length > this.MAX_FOA_NUMBER_LENGTH) {
              return `Award number length should be less/equal than ${this.MAX_FOA_NUMBER_LENGTH}`;
            }
            return /^[0-9]*$/.test(v) || 'Numbers are only allowed';
          },

          totalAwardValidator: () => {
            if (!this.awardIsValid) {
              return 'Sum of others awardee award can\'t be greater/equal than the main PI award amount';
            }
            return true;
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        organizationProfile: 'agencyGrantProgramAwardCreate/organization',
        universityProfile: 'agencyGrantProgramAwardCreate/university',
        program: 'agencyGrantProgramAwardCreate/program',
        allUsers: 'agencyGrantProgramAwardCreate/allUsers',
        awardee: 'agencyGrantProgramAwardCreate/awardee',
      }),

      breadcrumbs() {
        return [
          {
            text: this.organizationProfile.name,
            disabled: false,
            href: `/#/g/${this.organizationProfile.external_id}`
          },
          {
            text: 'Programs',
            disabled: false,
            href: `/#/${this.organizationProfile.external_id}/programs`
          },
          // { text: this.program.area.abbreviation, disabled: true },
          // { text: this.program.subArea.abbreviation, disabled: true },
          {
            text: this.program.additional_info.funding_opportunity_title,
            disabled: false,
            href: `/#/${this.organizationProfile.external_id}/programs/${this.program.funding_opportunity_number}`
          },
          {
            text: 'Award Receivers',
            disabled: true
          }
        ];
      },

      awardIsValid() {
        const totalAward = this.fundings[0].purpose.awardAmount;
        let awardeesAwardSum = 0;

        this.fundings.forEach(({ purpose: { awardAmount } }, i) => {
          if (i != 0) awardeesAwardSum += awardAmount;
        });

        return !(awardeesAwardSum >= totalAward);
      },

      saveIsDisabled() {
        if (!this.fundings.length) return true;
        const totalAward = this.fundings[0].purpose.awardAmount;
        return this.fundings.some((f, i) => {
          const isInvalid = !f.researcher || !f.research || (i == 0 ? f.overhead == null : false)
            || f.purpose.awardAmount == null || !this.awardIsValid || !f.awardNumber
            || f.awardNumber.length < this.MIN_FOA_NUMBER_LENGTH || f.awardNumber.length > this.MAX_FOA_NUMBER_LENGTH
            || (i != 0 && !f.awardSource);
          // || f.purpose.equipment == null || f.purpose.businessTravel == null
          // ||
          // f.milestones.some(m => {
          //   return !m.description || m.amount == null || !m.deadlineDate;
          // });
          return isInvalid;
        });
      }
    },

    created() {
      this.addReceiver();

      if (this.awardee) {
        const funding = this.fundings[0];

        this.queryResearchers(funding);
        const researcher = funding.foundResearchers.find(({ user }) => user.account.name == this.awardee.research_group.creator);
        funding.researcher = researcher;

        this.setResearchGroupsList(funding)
          .then(() => {
            const researchGroup = funding.foundResearchGroups.find((rg) => rg.external_id == this.awardee.research_group.external_id);
            funding.researchGroup = researchGroup;
            return this.setResearchList(funding);
          })
          .then(() => {
            const research = funding.foundResearch.find((r) => r.external_id == this.awardee.external_id);
            funding.research = research;
          });
      }
    },

    methods: {
      focusInputByRef($event, ref) {
        $event.stopPropagation();
        $event.preventDefault();
        const input = this.$refs[ref][0];
        input.focus();
      },

      calculateTotalExpenses(funding) {
        const { awardAmount } = funding.purpose;
        // let equipment = funding.purpose.equipment;
        // let businessTravel = funding.purpose.businessTravel;
        return (awardAmount || 0);
        // + (equipment || 0) + (businessTravel || 0);
      },

      queryResearchers(funding) {
        funding.isResearchersLoading = true;
        funding.foundResearchers = this.allUsers.filter((user) => {
          const name = this.$options.filters.fullname(user);
          return name.toLowerCase()
            .indexOf((funding.researcherSearch || '').toLowerCase()) > -1
            || user.account.name.toLowerCase()
              .indexOf((funding.researcherSearch || '').toLowerCase()) > -1;
        })
          .map(((user) => {
            const name = this.$options.filters.fullname(user);
            return {
              name,
              user
            };
          }));
        funding.isResearchersLoading = false;
      },

      addReceiver() {
        const funding = {
          isResearchersLoading: false,
          isResearchGroupsLoading: false,
          isResearchLoading: false,

          awardNumber: '',
          researcherSearch: '',
          researcher: null,
          foundResearchers: [],
          foundResearch: [],
          foundResearchGroups: [],
          foundAwardSources: [],

          researchGroup: null,
          research: null,
          overhead: "10.00 %",
          purpose: {
            // businessTravel: null,
            // equipment: null,
            awardAmount: null
          },
          // milestones: [],
          awardSource: null
        };
        // this.addMilestone(funding);
        this.fundings.push(funding);
      },

      removeReceiver(idx) {
        const a = this.fundings.splice(idx, 1);
      },

      // addMilestone(funding) {
      //   funding.milestones.push({
      //     description: null,
      //     deadline: undefined,
      //     amount: null
      //   });
      // },

      // removeMilestone(funding, idx) {
      //   funding.milestones.splice(idx, 1);
      // },

      setResearchGroupsList(funding) {
        funding.foundResearchGroups = [];
        funding.foundResearch = [];
        funding.isResearchGroupsLoading = true;

        return teamService.getTeamsByUser(funding.researcher.user.account.name)
          .then((groups) => {
            funding.foundResearchGroups.push(...groups);
            return Promise.all(groups.map((group) => projectService.getTeamProjectListing(group.external_id)));
          })
          .finally(() => {
            funding.isResearchGroupsLoading = false;
          });
      },

      setResearchList(funding) {
        funding.foundResearch = [];
        funding.isResearchLoading = true;

        return projectService.getTeamProjectListing(funding.researchGroup.external_id)
          .then((groupsResearchList) => {
            const researches = [].concat.apply([], groupsResearchList);
            funding.foundResearch.push(...researches);
          })
          .finally(() => {
            funding.isResearchLoading = false;
          });
      },

      setAwardSourcesList(funding) {
        this.isAwardSourceLoading = true;
        const foundAwardSources = this.fundings
          .filter((f) => f.researcher.user.account.name != funding.researcher.user.account.name)
          .filter((f) => !f.awardSource || f.awardSource != funding.researcher.user.account.name)
          .map(((f) => {
            const name = this.$options.filters.fullname(f.researcher.user);
            return {
              name,
              user: f.researcher.user
            };
          }));

        funding.foundAwardSources = foundAwardSources;
        this.isAwardSourceLoading = false;
      },

      save() {
        let total_amount = 0;
        const subawardees = [];

        const granAssetSymbol = blockchainService.getAssetSymbol(this.program.amount);
        const grantAssetPrecision = blockchainService.getAssetPrecision(this.program.amount);

        this.isSaving = true;
        for (let i = 1; i < this.fundings.length; i++) {
          const funding = this.fundings[i];
          const source = funding.awardSource.user.account.name;
          const awardAmount = funding.purpose.awardAmount || 0;
          // let equipment = funding.purpose.equipment || 0;
          // let businessTravel = funding.purpose.businessTravel || 0;
          total_amount += awardAmount;
          // total_amount += equipment;
          // total_amount += businessTravel;

          const awardInfo = {
            subaward_number: funding.awardNumber,
            subaward: this.toAssetUnits(funding.purpose.awardAmount, grantAssetPrecision, granAssetSymbol),
            subawardee: funding.researcher.user.account.name,
            source,
            research_external_id: funding.research.external_id

            // milestones: funding.milestones
            //   .map((milestone) => {
            //     return {
            //       description: milestone.description,
            //       deadline: milestone.deadlineDate.toISOString().split('.')[0],
            //       amount: (parseInt(milestone.amount) || 0) * this.DEIP_1_PERCENT
            //     }
            //   })
          };

          subawardees.push(awardInfo);
        }

        return grantsService.createFundingOpportunityAward(
          this.$currentUser.privKey, {
            awardNumber: this.fundings[0].awardNumber,
            fundingOpportunityNumber: this.program.funding_opportunity_number,
            award: this.toAssetUnits(this.fundings[0].purpose.awardAmount, grantAssetPrecision, granAssetSymbol),
            awardee: this.fundings[0].researcher.user.account.name,
            researchExternalId: this.fundings[0].research.external_id,
            universityExternalId: this.universityProfile.external_id,
            universityOverhead: `10.00 %`, //`${this.fundings[0].overhead}.00 %`,
            subawardees,
            creator: this.$currentUser.username,
            extensions: []
          }
        )
          .then(() => {
            this.$notifier.showSuccess('Funding proposal has been created succesfully!');
            this.$router.push({
              name: 'GrantProgramsAwardsDashboard'
            });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occurred while contributing to fundraise, please try again later');
          })
          .finally(() => {
            this.isSaving = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>

  .sub-area-list-item {
    cursor: pointer;
  }

  .sub-area-list-item:hover {
    background: #f1f8fe;
  }

  .sub-area-list-item.active {
    background: #f1f8fe;
  }

  .sub-area-list-item-content {
    padding-left: 20%;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-right: 5%;
    min-height: 45px;
  }

  .sort-option {
    cursor: pointer;
  }

  .sort-icon {
    min-width: 24px;
    min-height: 24px;
  }

  .total-row {
    text-align: right;
    background-color: var(--v-secondary-lighten2);
    padding: 5px;
    padding-right: 10px
  }

</style>
