<template>
  <v-card flat height="100%">
    <v-row
      v-if="selectedInvestment"
      no-gutters
      style="flex: 0 0 auto;"
      class="py-6 full-width"
    >
      <div class="px-6 full-width">
        <router-link
          class="text-subtitle-1 half-bold investment-title"
          :to="{ name: 'ResearchDetails', params: {
              research_group_permlink: encodeURIComponent(selectedInvestment.group.permlink),
              research_permlink: encodeURIComponent(selectedInvestment.research.permlink)
            }}"
        >
          {{ selectedInvestment.research.title }}
        </router-link>
      </div>

      <div class="py-2 full-width">
        <v-divider />
        <div class="display-flex justify-space-between pa-2 align-middle">
            <span>
              <v-icon small>event</v-icon>
              <span class="caption grey--text px-1">Created {{ moment(selectedInvestment.research.created_at).format('DD MMM YYYY') }} by {{ selectedInvestment.research.owner | fullname }}</span>
            </span>
          <span>
              <span class="icon-btn" @click="showUnderDevelopmentAlert()"><v-icon>attachment</v-icon></span>
              <span class="icon-btn" @click="showUnderDevelopmentAlert()"><v-icon>compare</v-icon></span>
              <span class="icon-btn" @click="showUnderDevelopmentAlert()"><v-icon>delete</v-icon></span>
            </span>
        </div>
        <v-divider />
      </div>


      <div v-if="currentPhase" class="px-6 py-2 full-width">
        <div class="text-subtitle-1 half-bold">
          Current Phase
        </div>
        <div class="text-body-2 py-1">
          {{ currentPhase.goal }}
        </div>
        <div class="py-2">
          <v-chip class="ma-0 text-body-1" color="amber" text-color="white">
            Deadline on {{ moment(currentPhase.eta).format('MMM D, YYYY') }}
          </v-chip>
          <!-- <v-chip v-if="currentPhaseDeadlineLabel.isOverdue" class="ma-0 text-body-1" color="amber" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip>
          <v-chip v-else class="ma-0 text-body-1" color="#8BC34A" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip> -->
        </div>
        <div class="text-body-1 py-2">
          <toggle-text :text="currentPhase.details" />
        </div>
      </div>

      <div class="full-width">
        <v-divider class="mb-2" />
        <div>
          <div class="text-subtitle-1 half-bold px-6">
            Team: {{ selectedInvestment.group.name }}
          </div>
          <div class="display-flex px-6 py-2">
            <platform-avatar
              v-for="(member, i) in selectedInvestment.team"
              :key="'member-' + i"
              :size="40"
              :user="member"
              class="pr-1"
            />
          </div>
        </div>
        <v-divider class="mt-2" />
      </div>

      <div class="px-6 py-2 full-width">
        <div class="text-subtitle-1 half-bold">
          Top investors
        </div>
        <div class="py-2">
          <GChart
            type="PieChart"
            :settings="{ packages: ['corechart'] }"
            :data="investorsDistributionChart.data"
            :options="investorsDistributionChart.options"
          />
        </div>
      </div>

      <div class="py-2 full-width">
        <v-divider class="mb-2" />
        <div class="display-flex justify-space-between px-6">
          <div class="text-subtitle-1 half-bold">
            My memo
          </div>
          <!-- <div class="text--right"><span class="icon-btn" @click="editMemo()"><v-icon small>edit</v-icon></span></div> -->
          <v-btn
            v-if="!isEditingMemo"
            class="ma-0 pa-0 text--right"
            text
            icon
            @click="editMemo()"
          >
            <v-icon small>
              edit
            </v-icon>
          </v-btn>
          <v-btn
            v-else
            class="ma-0 pa-0 text--right"
            text
            icon
            @click="updateMemo()"
          >
            <v-icon small>
              reply
            </v-icon>
          </v-btn>
        </div>
        <div class="text-body-1 px-6 py-2">
          <toggle-text v-if="!isEditingMemo" :text="selectedInvestment.portfolioRef.memo" />
          <v-textarea
            v-else
            v-model="memo"
            filled
            auto-grow
            :rows="4"
          />
        </div>
        <v-divider class="mt-2" />
      </div>

      <div class="full-width">
        <div v-if="hasCustomLists">
          <div class="display-flex justify-space-between px-6">
            <div v-if="hasCustomLabels">
              <div v-for="(tag, i) in selectedInvestment.portfolioRef.tags" :key="'investment-tag-'+ i">
                <v-chip
                  small
                  class="mx-0 investment-tag caption"
                  :color="tag.color"
                  text-color="black"
                >
                  {{ tag.name }}
                </v-chip>
              </div>
            </div>
            <div v-else class="text-subtitle-1 pa-6 grey--text">
              No attached labels
            </div>
            <div>
              <!-- <span class="icon-btn"><v-icon>playlist_add</v-icon></span>
              <span class="icon-btn"><v-icon>delete</v-icon></span> -->
              <v-btn
                class="ma-0 pa-0 text--right"
                text
                icon
                @click="openAddTagsDialog()"
              >
                <v-icon small>
                  playlist_add
                </v-icon>
              </v-btn>
            </div>
          </div>
          <v-dialog v-model="updateTagsDialog.isOpened" max-width="600px">
            <v-card class="pa-6">
              <v-card-title>
                <div class="text-h6">
                  Attach to list
                </div>
                <div class="right-top-angle">
                  <v-btn icon class="pa-0 ma-0" @click="closeAddTagsDialog()">
                    <v-icon color="black">
                      close
                    </v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="updateTagsDialog.list"
                  :items="customLists"
                  filled
                  dense
                  item-text="name"
                  return-object
                />
                <v-combobox
                  v-if="updateTagsDialog.list"
                  v-model="updateTagsDialog.tagNames"
                  multiple
                  label="Labels"
                  append-icon
                  chips
                  deletable-chips
                >
                  <template v-slot:selection="data">
                    <v-chip close :color="updateTagsDialog.list.color" @input="removeTagName(data.item)">
                      <strong>{{ data.item }}</strong>
                    </v-chip>
                  </template>
                </v-combobox>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col class="py-2" cols="12">
                    <v-btn
                      :loading="updateTagsDialog.isSaving"
                      :disabled="updateTagsDialog.isSaving"
                      block
                      color="primary"
                      @click="updateTags()"
                    >
                      Save
                    </v-btn>
                  </v-col>
                  <v-col class="py-2" cols="12">
                    <v-btn
                      text
                      block
                      color="primary"
                      @click="closeAddTagsDialog()"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-else>
          <div class="text-subtitle-1 pa-6 grey--text">
            Please add a list to attach labels
          </div>
        </div>
        <v-divider class="mt-2" />
      </div>

      <div v-if="selectedInvestment.research.comments.length" class="px-6 full-width">
        <div class="text-subtitle-1 half-bold py-2">
          Comments
        </div>
        <div v-for="(comment, i) in selectedInvestment.research.comments" :key="'investment-comment-'+ i" class="py-1">
          <div class="display-flex">
            <platform-avatar :size="40" :user="comment.author" class="pr-1" />
            <span class="text-body-2 px-2">{{ comment.author | fullname }}</span>
            <span class="caption grey--text">{{ moment(comment.timestamp).format('DD MMM YYYY') }}</span>
          </div>
          <div class="text-body-1 py-2">
            <toggle-text :text="comment.text" />
          </div>
        </div>
      </div>
    </v-row>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  export default {
    name: 'InvestorPortfolioInboxRightSidebar',
    components: { LayoutSidebar },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        selectedInvestment: 'investorPortfolio/selectedInvestment',
        investmentPortfolio: 'investorPortfolio/investmentPortfolio'
      }),

      currentPhase() {
        if (this.selectedInvestment) {
          const { milestones } = this.selectedInvestment.research.ref;
          const activeMilestone = milestones.find((m) => m.isActive);
          return activeMilestone || milestones[0] || null;
        }
        return null;
      },

      currentPhaseDeadlineLabel() {
        if (this.currentPhase) {
          const daysDiff = moment(this.currentPhase.eta)
            .diff(moment(), 'days');
          const isOverdue = daysDiff < 0;

          const text = isOverdue
            ? `Deadline overdue ${daysDiff < 7 ? `${daysDiff} days` : `${Math.floor(daysDiff / 7)} weeks`}`
            : `Deadline on ${moment(this.currentPhase.eta)
              .local()
              .format('MMM DD, YYYY')}`;

          return {
            daysDiff,
            isOverdue,
            text
          };
        }
        return null;
      },
      customLists() {
        return this.investmentPortfolio.lists.filter((l) => l.id != 'all');
      },
      hasCustomLists() {
        return this.customLists.length != 0;
      },
      hasCustomLabels() {
        return this.selectedInvestment.portfolioRef.tags.length != 0;
      },

      investorsDistributionChart() {
        if (this.selectedInvestment) {
          return {
            data: [
              ['Distribution', ''],
              ...this.selectedInvestment.shareHolders.map((shareHolder) => [
                this.$options.filters.fullname(shareHolder),
                this.convertToPercent(shareHolder.share.amount)
              ]),
              [this.selectedInvestment.group.name, this.convertToPercent(this.selectedInvestment.research.owned_tokens)]
              // ['Microsoft', 15]
            ],

            options: {
              title: '',
              legend: { position: 'left' },
              colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
              chartArea: {
                right: 0,
                width: '100%',
                height: '100%'
              },
              // sliceVisibilityThreshold: .01,

              width: '100%',
              height: '100%',
              pieSliceTextStyle: {
                // color: "#ffffff",
                color: '#000000',
                fontSize: 10
              },
              pieHole: 0.6
            }
          };
        }
      }
    },

    data() {
      return {
        isEditingMemo: false,
        memo: '',
        updateTagsDialog: {
          list: null,
          tagNames: [],

          isOpened: false,
          isSaving: false
        }
      };
    },
    watch: {
      selectedInvestment(newVal, oldVal) {
        if (this.selectedInvestment) {
          this.memo = newVal.portfolioRef.memo;
        }
      },
      'updateTagsDialog.list': function (newVal, oldVal) {
        const currentTags = this.selectedInvestment.portfolioRef.tags;
        const currentListTags = currentTags.filter((t) => t.list == this.updateTagsDialog.list.id);
        this.updateTagsDialog.tagNames = [...currentListTags.map((tag) => tag.name)];
      }
    },
    mounted() {
      if (this.selectedInvestment) {
        this.memo = this.selectedInvestment.portfolioRef.memo;
      }
    },

    methods: {
      editMemo() {
        this.isEditingMemo = true;
      },
      updateMemo() {
        const investmentId = this.selectedInvestment.research.external_id;
        const { memo } = this;
        if (memo != this.selectedInvestment.portfolioRef.memo) {
          this.$store.dispatch('investorPortfolio/updateInvestmentMemo', {
            investmentId,
            memo
          })
            .finally(() => {
              this.isEditingMemo = false;
            });
        } else {
          this.isEditingMemo = false;
        }
      },

      openAddTagsDialog() {
        this.updateTagsDialog.isOpened = true;
        this.updateTagsDialog.list = this.customLists[0];
        const currentTags = this.selectedInvestment.portfolioRef.tags;
        const currentListTags = currentTags.filter((tag) => tag.list == this.updateTagsDialog.list.id);
        this.updateTagsDialog.tagNames = [...currentListTags.map((tag) => tag.name)];
      },

      closeAddTagsDialog() {
        this.updateTagsDialog.isOpened = false;
      },

      updateTags() {
        setTimeout(() => { // delay action to catch input text without pressing the 'enter'
          const investmentId = this.selectedInvestment.research.external_id;
          const listTags = this.updateTagsDialog.tagNames.map((t) => t.toLowerCase());
          const listId = this.updateTagsDialog.list.id;
          this.updateTagsDialog.isSaving = true;
          this.$store.dispatch('investorPortfolio/updateInvestmentListTags', {
            investmentId,
            listId,
            listTags
          })
            .finally(() => {
              this.updateTagsDialog.isSaving = false;
              this.updateTagsDialog.isOpened = false;
            });
        }, 100);
      },

      removeTagName(item) {
        this.updateTagsDialog.tagNames.splice(this.updateTagsDialog.tagNames.indexOf(item), 1);
      },

      showUnderDevelopmentAlert() {
        alert('This feature is under development');
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "./../../../styles/colors.less";

  .investment-title {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .investment-tag {
    text-transform: uppercase;
  }

  .icon-btn {
    i:hover {
      cursor: pointer;
      color: @grey-darken-4;
    }
  }

</style>
