<template>
  <v-card height="100%">
    <v-layout v-if="selectedInvestment" row wrap style="flex: 0 0 auto;" class="py-4 full-width">

      <v-layout column class="px-4 full-width">
        <router-link class="subheading half-bold investment-title"
          :to="{ name: 'ResearchDetails', params: {
            research_group_permlink: encodeURIComponent(selectedInvestment.group.permlink),
            research_permlink: encodeURIComponent(selectedInvestment.research.permlink)
          }}">
          {{ selectedInvestment.research.title }}
        </router-link>
      </v-layout>

      <v-layout column class="py-2 full-width">
        <v-divider></v-divider>
        <v-layout row justify-space-between align-middle class="pa-2">
          <span>
            <v-icon small>event</v-icon>
            <span class="caption grey--text px-1">Created {{moment(selectedInvestment.research.created_at).format("DD MMM YYYY")}} by {{selectedInvestment.research.owner | fullname}}</span>
          </span>
          <span>
            <span @click="showUnderDevelopmentAlert()" class="icon-btn"><v-icon>attachment</v-icon></span>
            <span @click="showUnderDevelopmentAlert()" class="icon-btn"><v-icon>compare</v-icon></span>
            <span @click="showUnderDevelopmentAlert()" class="icon-btn"><v-icon>delete</v-icon></span>
          </span>
        </v-layout>
        <v-divider></v-divider>
      </v-layout>


      <v-layout v-if="currentPhase" column class="px-4 py-2 full-width">
        <div class="subheading half-bold">Current Phase</div>
        <div class="body-2 py-1">{{currentPhase.goal}}</div>
        <div class="py-2">
          <v-chip class="ma-0 body-1" color="amber" text-color="white">Deadline on {{moment(currentPhase.eta).format("MMM D, YYYY")}}</v-chip>
          <!-- <v-chip v-if="currentPhaseDeadlineLabel.isOverdue" class="ma-0 body-1" color="amber" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip>
          <v-chip v-else class="ma-0 body-1" color="#8BC34A" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip> -->
        </div>
        <div class="body-1 py-2">
          <toggle-text :text="currentPhase.details"></toggle-text>
        </div>
      </v-layout>

      <v-layout column class="full-width">
        <v-divider class="mb-2"></v-divider>
        <div>
          <div class="subheading half-bold px-4">Team: {{selectedInvestment.group.name}}</div>
          <v-layout row justify-start class="px-4 py-2">
            <platform-avatar :size="40" v-for="(member, i) in selectedInvestment.team" :key="'member-' + i" :user="member" class="pr-1" ></platform-avatar>
          </v-layout>
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout column class="px-4 py-2 full-width">
        <div class="subheading half-bold">Top investors</div>
        <div class="py-2">
          <GChart
            type="PieChart"
            :settings="{ packages: ['corechart'] }"
            :data="investorsDistributionChart.data"
            :options="investorsDistributionChart.options"
          />
        </div>
      </v-layout>

      <v-layout column class="py-2 full-width">
        <v-divider class="mb-2"></v-divider>
        <v-layout row justify-space-between class="px-4">
          <div class="subheading half-bold">My memo</div>
          <!-- <div class="text-xs-right"><span class="icon-btn" @click="editMemo()"><v-icon small>edit</v-icon></span></div> -->
          <v-btn v-if="!isEditingMemo" class="ma-0 pa-0 text-xs-right" flat icon @click="editMemo()">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn v-else class="ma-0 pa-0 text-xs-right" flat icon @click="updateMemo()">
            <v-icon small>reply</v-icon>
          </v-btn>
        </v-layout>
        <div class="body-1 px-4 py-2">
          <toggle-text v-if="!isEditingMemo" :text="selectedInvestment.portfolioRef.memo"></toggle-text>
          <v-textarea 
            v-else
            v-model="memo"
            auto-grow
            :rows="4"
          ></v-textarea>
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout column class="full-width">
        <v-layout v-if="hasCustomLists">
          <v-layout row justify-space-between class="px-4">
            <div v-if="hasCustomLabels">
              <div v-for="(tag, i) in selectedInvestment.portfolioRef.tags" :key="'investment-tag-'+ i">
                <v-chip small class="mx-0 investment-tag caption" :color="tag.color" text-color="black">{{tag.name}}</v-chip>
              </div>
            </div>
            <div v-else class="subheading pa-4 grey--text">No attached labels</div>
            <div>
              <!-- <span class="icon-btn"><v-icon>playlist_add</v-icon></span>
              <span class="icon-btn"><v-icon>delete</v-icon></span> -->
              <v-btn class="ma-0 pa-0 text-xs-right" flat icon @click="openAddTagsDialog()">
                <v-icon small>playlist_add</v-icon>
              </v-btn>
            </div>
          </v-layout>
          <v-dialog v-model="updateTagsDialog.isOpened" max-width="600px">
            <v-card>
              <v-card-title>
                <v-layout align-center>
                  <v-flex grow>Attach to list</v-flex>
                  <v-flex shrink>
                    <v-btn @click="closeAddTagsDialog()" icon class="pa-0 ma-0">
                      <v-icon color="black">close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-layout column>
                  <v-select
                    v-model="updateTagsDialog.list" 
                    :items="customLists"
                    solo
                    dense
                    item-text="name"
                    return-object>
                  </v-select>
                  <v-combobox v-if="updateTagsDialog.list"
                    v-model="updateTagsDialog.tagNames" 
                    multiple
                    label="Labels" 
                    append-icon
                    chips
                    deletable-chips>
                    <template v-slot:selection="data">
                      <v-chip close @input="removeTagName(data.item)" :color="updateTagsDialog.list.color">
                        <strong>{{ data.item }}</strong>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-layout row justify-end>
                  <v-btn flat @click="closeAddTagsDialog()">Cancel</v-btn>
                  <v-btn @click="updateTags()" :loading="updateTagsDialog.isSaving" :disabled="updateTagsDialog.isSaving" color="primary">Save</v-btn>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
        <v-layout v-else><div class="subheading pa-4 grey--text">Please add a list to attach labels</div></v-layout>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout v-if="selectedInvestment.research.comments.length" column class="px-4 full-width">
        <div class="subheading half-bold py-2">Comments</div>
        <div v-for="(comment, i) in selectedInvestment.research.comments" :key="'investment-comment-'+ i" class="py-1">
          <v-layout row wrap align-baseline>
            <platform-avatar :size="40" :user="comment.author" class="pr-1" ></platform-avatar>
            <span class="body-2 px-2">{{comment.author | fullname}}</span>
            <span class="caption grey--text">{{moment(comment.timestamp).format("DD MMM YYYY")}}</span>
          </v-layout>
          <div class="body-1 py-2">
            <toggle-text :text="comment.text"></toggle-text>
          </div>
        </div>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: 'InvestorDashboardInboxRightSidebar',
    computed: {
      ...mapGetters({
        user: "auth/user",
        selectedInvestment: "investorDashboard/selectedInvestment",
        investmentPortfolio: "investorDashboard/investmentPortfolio"
      }),

      currentPhase() {
        if (this.selectedInvestment) {
          let milestones = this.$options.filters.researchMilestones(this.selectedInvestment.research.abstract);
          let activeMilestone = milestones.find(m => m.is_active);
          return activeMilestone || milestones[0] || null;
        }
        return null;
      },

      currentPhaseDeadlineLabel() {
        if (this.currentPhase) {
          let daysDiff = moment(this.currentPhase.eta).diff(moment(), 'days');
          let isOverdue = daysDiff < 0;

          let text = isOverdue 
            ? `Deadline overdue ${daysDiff < 7 ? daysDiff + ' days' : Math.floor(daysDiff / 7) + ' weeks'}`
            : `Deadline on ${moment(this.currentPhase.eta).local().format("MMM DD, YYYY")}`;

          return { daysDiff, isOverdue, text };
        }
        return null;
      },
      customLists() {
        return this.investmentPortfolio.lists.filter(l => l.id != "all");
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
              title: "",
              legend: { position: 'left' },
              colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
              chartArea: { 
                right: 0,
                width: "100%",
                height: "100%"
              },
              // sliceVisibilityThreshold: .01,

              width: "100%",
              height: "100%",
              pieSliceTextStyle: {
                // color: "#ffffff", 
                color: "#000000",
                fontSize: 10
              },
              pieHole: 0.6
            }
          }
        }
      },
    },

    data() {
      return {
        isEditingMemo: false,
        memo: "",
        updateTagsDialog: {
          list: null,
          tagNames: [],

          isOpened: false,
          isSaving: false
        }
      }
    },

    methods: {
      editMemo() {
        this.isEditingMemo = true;
      },
      updateMemo() {
        let investmentId = this.selectedInvestment.research.id;
        let memo = this.memo;
        if (memo != this.selectedInvestment.portfolioRef.memo) {
          this.$store.dispatch('investorDashboard/updateInvestmentMemo', { investmentId, memo })
            .finally(() => {
              this.isEditingMemo = false;
            })
        } else {
          this.isEditingMemo = false;
        }
      },

      openAddTagsDialog() {
        this.updateTagsDialog.isOpened = true;
        this.updateTagsDialog.list = this.customLists[0];
        let currentTags = this.selectedInvestment.portfolioRef.tags;
        let currentListTags = currentTags.filter(tag => tag.list == this.updateTagsDialog.list.id);
        this.updateTagsDialog.tagNames = [...currentListTags.map(tag => tag.name)];
      },

      closeAddTagsDialog() {
        this.updateTagsDialog.isOpened = false; 
      },

      updateTags() {
        setTimeout(() => { // delay action to catch input text without pressing the 'enter'
          let investmentId = this.selectedInvestment.research.id;
          let listTags = this.updateTagsDialog.tagNames.map(t => t.toLowerCase());
          let listId = this.updateTagsDialog.list.id;
          this.updateTagsDialog.isSaving = true;
          this.$store.dispatch('investorDashboard/updateInvestmentListTags', { investmentId, listId, listTags })
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
    },
    watch: {
      selectedInvestment(newVal, oldVal) {
        if (this.selectedInvestment) {
          this.memo = newVal.portfolioRef.memo;
        }
      },
      'updateTagsDialog.list': function(newVal, oldVal) {
        let currentTags = this.selectedInvestment.portfolioRef.tags;
        let currentListTags = currentTags.filter(t => t.list == this.updateTagsDialog.list.id);
        this.updateTagsDialog.tagNames = [...currentListTags.map(tag => tag.name)];
      }
    },
    mounted() {
      if (this.selectedInvestment) {
        this.memo = this.selectedInvestment.portfolioRef.memo;
      }
    }
  }
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
