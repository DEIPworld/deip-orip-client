<template>
  <base-page-layout>
    <div slot="content" class="full-width full-height">
      <v-layout row class="rd-header full-height pa-5" :style="{background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 70%, transparent), url('+researchLogoSrc+'), 100%, 100%, no-repeat'}">
        <v-flex lg8>
          <div style="width: 95%">
            <div class="rd-header__title">{{research.title}}</div>
            <div class="rd-header__created pt-4">
              <v-layout row align-baseline>
                <span>
                  <v-icon small color="white">today</v-icon>
                  &nbsp;Created {{research.created_at | dateFormat('D MMM YYYY', true)}}
                </span>
                <span v-if="isResearchGroupMember" class="pl-4">
                  <v-btn class="ma-0 pa-0" small outline color="white"
                    :to="{  
                      name: 'ResearchEdit',
                      params: {
                        research_group_permlink: encodeURIComponent(research.group_permlink),
                        research_permlink: encodeURIComponent(research.permlink)
                      } 
                    }">
                    Edit
                  </v-btn>
                </span>
              </v-layout>
            </div>
            <div class="rd-header__abstract">
              <toggle-text class="py-3" :text="$options.filters.researchAbstract(research.abstract)"></toggle-text>
            </div>
          </div>
        </v-flex>
        <v-flex lg4 text-xs-right class="align-start">
          <div v-if="researchPresentationSrc">
            <video class="presentation-video" controls>
              <source :src="researchPresentationSrc" type="video/mp4">>
              Your browser does not support the video tag.
            </video>
          </div>
        </v-flex> 
      </v-layout>
      <v-layout row wrap>
        <v-flex lg12>
          <div v-if="!isResearchGroupMember" class="text-xs-right pa-3">
            <v-btn
              v-if="!bookmarkId"
              class="ma-0 pa-0"
              color="primary"
              outline
              small
              @click="addToBookmarks()"
              :loading="isBookmarkActionInProgress"
            >
              Follow
            </v-btn>

            <v-btn
              v-else
              class="ma-0 pa-0"
              color="grey"
              outline
              small
              @click="removeFromBookmarks()"
              :loading="isBookmarkActionInProgress"
            >
              Unfollow
            </v-btn>
          </div>
        </v-flex> 
        <v-flex lg8>
          <v-layout v-if="isTokenSaleSectionAvailable" class="my-5">
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout wrap>
                <v-flex lg12 class="rd-block-header">Fundrising</v-flex>
                <v-flex lg12 v-if="isActiveTokenSale || isInactiveTokenSale">
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Start:</v-flex>
                    <v-flex lg9 class="pl-2">
                      <span>{{tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                      <v-chip v-if="hasInactiveTokenSale" class="my-0 mx-2 caption" style="height: 1.4em" color="primary lighten-3">{{tokenSaleStartLeft}} left</v-chip>
                    </v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">End:</v-flex>
                    <v-flex lg9 class="pl-2">
                      <span>{{tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                      <v-chip v-if="hasActiveTokenSale" class="my-0 mx-2 caption" style="height: 1.4em" color="amber lighten-1">{{tokenSaleEndLeft}} left</v-chip>
                    </v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Tokens On sale:</v-flex>
                    <v-flex lg9 class="pl-2">{{tokenSale.balance_tokens}} ({{convertToPercent(tokenSale.balance_tokens)}}%)</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Remaining Tokens:</v-flex>
                    <v-flex lg9 class="pl-2">{{research.owned_tokens}} ({{convertToPercent(research.owned_tokens)}}%)</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Soft Cap:</v-flex>
                    <v-flex lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.soft_cap)}}</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Hard Cap:</v-flex>
                    <v-flex lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex lg12 v-if="isMissingTokenSale && isResearchGroupMember && research" class="pt-3">
                  <v-btn round outline color="primary"
                    class="ma-0"
                    :to="{
                      name: 'CreateTokenSale',
                      params: { research_group_permlink: research.group_permlink, research_permlink: research.permlink }
                    }"
                  >Start fundraise</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg5 v-if="isActiveTokenSale">
              <v-layout justify-end class="rd-cap-value">${{currentCap}}</v-layout>
              <v-layout justify-end align-center class="py-2">
                <div class="rd-cap-chip" v-if="currentCap >= fromAssetsToFloat(tokenSale.soft_cap)">Soft cap reached!</div>
                <div class="pl-4">Raised of ${{fromAssetsToFloat(tokenSale.hard_cap)}} Goal</div>
              </v-layout>
              <v-layout align-center justify-end class="py-2">
                <v-flex shrink class="rd-cap-progress-bound mr-2">0</v-flex>
                <v-flex grow class="rd-cap-progress-bar">
                  <div class="progress-line" />
                  <div class="progress-current" :style="{ width: `${currentCapPercent}%` }" />
                </v-flex>
                <v-flex shrink class="rd-cap-progress-bound ml-2">{{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
              </v-layout>

              <v-layout column v-if="isActiveTokenSale && !isResearchGroupMember">
                <v-layout justify-end class="pt-2">
                  <v-text-field
                    ref="amountToContribute"
                    v-model="amountToContribute"
                    placeholder="Amount" suffix="USD"
                    :rules="[deipTokenValidator]"
                    :disabled="areTokensBuying"
                  />
                </v-layout>
                <v-layout justify-end class="pt-2">
                  <v-btn
                    :disabled="isContributionToTokenSaleDisabled"
                    :loading="areTokensBuying"
                    @click="onContributeToTokenSaleClick()"
                    class="btn--gradient-pb"
                    block
                  >Invest</v-btn>
                </v-layout>
                <v-dialog v-model="investmentConfirmDialog.isShown" persistent max-width="800px">
                  <v-card class="px-4 py-2">
                    <v-card-title>
                      <span class="headline bold">SAFT (Simple Agreement for Future Tokens)</span>
                    </v-card-title>
                    <v-card-text style="height: 50vh">
                      <iframe height="100%" width="100%" :src="'./../../../static/form-of-SAFT-for-token-pre-sale.pdf'"></iframe>
                    </v-card-text>
                    <v-card-actions class="pa-0">
                      <v-layout column>
                        <v-btn class="mx-0 pa-0 my-2" color="primary" @click="agreeSaft()">Agree</v-btn>
                        <v-btn class="mx-0 pa-0" color="primary" flat @click="disagreeSaft()">Disagree</v-btn>
                      </v-layout>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-if="investors.length || isActiveTokenSale" class="my-5">
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-account-box</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout wrap>
                <v-flex lg12 class="rd-block-header">Investors - {{investors.length}}</v-flex>
                <v-flex lg12>
                  <v-layout justify-start class="mt-2">
                    <div class="rd-investment-info">
                      <span class="rd-investment-info__value">${{investmentsAmount}}</span><br/>
                      <span class="rd-investment-info__value-text">Total investments</span>
                    </div>
                    <div class="rd-investment-info">
                      <span class="rd-investment-info__value">${{averageInvestmentAmount}}</span><br/>
                      <span class="rd-investment-info__value-text">Average investment</span>
                    </div>
                    <div class="rd-investment-info" v-if="!isResearchGroupMember">
                      <span class="rd-investment-info__value">${{userInvestment}}</span><br/>
                      <span class="rd-investment-info__value-text">Your investment</span>
                    </div>
                  </v-layout>
                  <v-layout justify-start class="mt-2">
                    <platform-avatar :size="40" v-for="(investor, i) in investors" :key="'investor-' + i" :user="investor" class="mr-1"></platform-avatar>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider v-if="isTokenSaleSectionAvailable || investors.length" />
          <v-layout v-if="timeline.length" class="my-5">
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-flag</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout wrap>
                <v-flex lg12 class="rd-block-header">Project Timeline</v-flex>
                <v-flex lg12 class="pt-3">
                  {{selectedTimelineItem.description}}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg5>
              <v-layout justify-center>
                <ul :class="{
                  'rd-timeline': true,
                  'rd-timeline--full': timelineItemsToShow === timeline.length
                }">
                  <li
                    v-for="(item, index) of timeline.slice(0, timelineItemsToShow)"
                    :key="`timeline_item_${item.id}`"
                    class="rd-timeline-item"
                  >
                    <div
                      :class="{
                        'rd-timeline-item__marker': true,
                        'rd-timeline-item__marker--clickable': true,
                        'rd-timeline-item__marker--active': item === selectedTimelineItem,
                      }"
                      :style="{
                        backgroundColor: getTimelineItemColor(index)
                      }"
                      @click="onTimelineMarkerClick(item)"
                    />
                    <div
                      v-if="timelineItemsToShow !== timeline.length || index !== (timeline.length - 1)"
                      class="rd-timeline-item__line"
                      :style="{
                        background: `linear-gradient(${getTimelineItemColor(index)}, ${getTimelineItemColor(index + 1)})`
                      }"
                    />
                    <div class="rd-timeline-item__date">{{item.date}}</div>
                    <div class="rd-timeline-item__label pt-1">{{item.label}}</div>
                  </li>
                  <li
                    v-if="timelineItemsToShow < timeline.length"
                    class="rd-timeline-item"
                  >
                    <div
                      class="rd-timeline-item__marker"
                      :style="{
                        backgroundColor: '#E0E0E0'
                      }"
                    />
                    <div
                      class="rd-timeline-item__line"
                      :style="{
                        background: `#E0E0E0`
                      }"
                    />
                    <v-btn
                      outline class="ma-0"
                      @click="onShowMoreTimelineClick()"
                    >Show more events</v-btn>
                  </li>
                </ul>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout class="my-5" v-if="contentList.length">
            <v-flex lg11 offset-lg1>
              <v-expansion-panel>
                <v-expansion-panel-content
                  v-for="content of contentList"
                  :key="content.id"
                >
                  <template slot="header">
                    <v-layout align-center v-on:click.stop>
                      <v-flex lg2 class="text-capitalize bold">{{getContentType(content.content_type).text}}</v-flex>
                      <v-flex lg9 class="deip-blue-color bold">
                        <router-link class="a"
                          :to="{
                            name: 'ResearchContentDetails',
                            params: {
                              research_group_permlink: encodeURIComponent(research.group_permlink),
                              research_permlink: encodeURIComponent(research.permlink),
                              content_permlink: encodeURIComponent(content.permlink)
                            }
                          }"
                      >{{content.title}}</router-link>
                      </v-flex>
                      <v-flex lg1 text-lg-center v-show="doesContentHaveReviews(content)">
                        <v-icon size="14px">chat_bubble</v-icon>
                        <span v-show="doesContentHavePositiveReviews(content)" class="green--text medium">{{countContentReviews(content, true)}}</span>
                        <span v-show="doesContentHavePositiveReviews(content) && doesContentHaveNegativeReviews(content)">/</span>
                        <span v-show="doesContentHaveNegativeReviews(content)" class="red--text medium">{{countContentReviews(content, false)}}</span>
                      </v-flex>
                    </v-layout>
                  </template>
                  <div class="ml-4 py-2">
                    <div class="grey--text">{{createContentAuthorsString(content.authors)}}</div>
                    <div>
                      <span
                        v-for="eci of getContentEciList(content)"
                        :key="eci.disciplineName"
                        class="grey--text"
                      >
                        <span class="mr-1">{{eci.disciplineName}}</span>
                        <span class="mr-4 bold">{{eci.value}}</span>
                      </span>
                    </div>
                    <div class="mt-2">
                      <v-icon size="18px">event</v-icon>
                      <span>{{content.created_at | dateFormat('D MMM YYYY', true)}}</span>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
          <v-layout class="my-5" row wrap v-if="isResearchGroupMember && !research.is_finished">
            <v-flex lg11 offset-lg1>
              <v-expansion-panel>
                <v-expansion-panel-content
                  v-for="(draft, index) of contentRefsList.filter(d => !isDraftApproved(d))"
                  :key="draft._id"
                >
                  <template slot="header">
                    <v-layout align-center v-on:click.stop>
                      <v-flex lg2 class="text-capitalize bold">Draft {{index + 1}}</v-flex>
                      <v-flex lg10>
                        <span class="deip-blue-color bold">
                          <a @click="openDarDraft(draft)" class="a">
                            {{draft.title || draft._id}}
                          </a>
                        </span>
                        <span v-if="isDraftProposed(draft)" class="ml-2 orange--text">(proposed)</span>
                      </v-flex>
                    </v-layout>
                  </template>
                  <v-card>
                    <v-card-text class="pl-4 pa-0">
                      <v-layout justify-space-between>
                        <div>
                          <span>
                            <v-icon size="18px">date_range</v-icon>
                            <span>{{draft.updated_at | dateFormat('D MMM YYYY HH:mm', true)}}</span>
                          </span>
                          <span class="ml-2">
                            <v-icon size="18px">note_add</v-icon>
                            <span>{{draft.type}}</span>
                          </span>
                        </div>
                        <div>
                          <v-btn
                            v-if="isDraftInProgress(draft)"
                            @click="deleteDraft(draft)"
                            :loading="isDeletingDraft"
                            :disabled="isDeletingDraft"
                            outline small depressed
                            color="red lighten-1"
                          >Delete</v-btn>
                          <v-btn
                            @click="openDarDraft(draft)"
                            outline
                            small
                            depressed
                            color="primary lighten-1"
                          >View</v-btn>
                        </div>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
            <v-flex lg11 offset-lg1 class="mt-4">
              <upload-research-content-file-dialog />
              <v-btn
                @click="createDarDraft()"
                :loading="isCreatingDraft"
                :disabled="isCreatingDraft"
                block outline color="primary" dark
              >Use Editor</v-btn>
            </v-flex>
          </v-layout>
          <v-divider v-if="contentList.length || (isResearchGroupMember && !research.is_finished)"/>
          <template v-if="eciChart">
            <v-layout class="my-5">
              <v-flex lg1>
                <v-layout justify-end class="pr-3">
                  <v-icon large color="grey lighten-2">mdi-poll-box</v-icon>
                </v-layout>
              </v-flex>
              <v-flex lg11>
                <v-layout wrap>
                  <v-flex lg12 class="rd-block-header">Expertise Contribution Index</v-flex>
                  <v-flex lg12>
                    <v-layout row wrap class="mt-2">
                      <v-flex
                        v-for="(eci, index) of eciList"
                        :key="eci.disciplineName"
                        justify-space-between
                        class="px-3 py-2 rd-eci-item clickable"
                        :class="{
                          'px-3 py-2 rd-eci-item clickable': true,
                          'elevation-2 grey lighten-5': index === activeEciChartTabIndex
                        }"
                        lg3
                        @click="activeEciChartTabIndex = index"
                      >
                        <v-layout justify-space-between>
                          <span>{{eci.disciplineName}}</span>
                          <span class="bold">{{eci.value}}</span>
                        </v-layout>
                      </v-flex>
                      <v-flex lg12>
                        <GChart
                          type="LineChart"
                          :settings="{ packages: ['corechart'] }"
                          :data="eciChart.data"
                          :options="eciChart.options"
                        />
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider />
          </template>
          <v-layout class="my-5" v-if="reviews.length">
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-message-reply-text</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg11>
              <v-layout wrap>
                <v-flex lg12>
                  <v-layout row justify-space-between>
                    <div class="rd-block-header">Reviews: {{reviewsList.length}}</div>
                    <div class="half-bold subheading">
                      Total reviews score:
                      <span class="bold">{{totalReviewsScore}}</span>
                      <v-tooltip bottom>
                        <v-icon slot="activator" small>help</v-icon>
                        <span>Total score is the result of these 3 scores which has been rounded to the nearest whole value.</span>
                      </v-tooltip>
                    </div>
                  </v-layout>
                </v-flex>
                <v-flex lg12>
                  <template v-for="(review, index) of reviews">
                    <v-layout
                      :key="`r_${review.id}`"
                      class="my-4"
                    >
                      <v-flex lg4 class="right-bordered">
                        <v-layout column fill-height justify-space-between>
                          <v-layout row>
                            <platform-avatar :user="review.author" :size="80"></platform-avatar>
                            <div class="pl-4">
                              <router-link class="a rd-reviewer__title" :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}">
                                {{ review.author | fullname }}
                              </router-link>
                              <div v-if="review.author.profile" class="rd-reviewer__subtitle py-2">
                                <span>{{review.author | employmentOrEducation}}</span>
                                <span v-if="doesUserHaveLocation(review.author.profile)">, {{review.author | userLocation}}</span>
                              </div>
                            </div>
                          </v-layout>
                          <v-btn small @click="goToReviewPage(review)" outline>See review</v-btn>
                        </v-layout>
                      </v-flex>
                      <v-flex lg4 class="px-4 right-bordered">
                        <div v-if="review.research_content" v-on:click.stop class="bold">
                          <div>Review to</div>
                          <router-link tag="div" class="a py-2" 
                            :to="{
                              name: 'ResearchContentDetails',
                              params: {
                                research_group_permlink: encodeURIComponent(research.group_permlink),
                                research_permlink: encodeURIComponent(research.permlink),
                                content_permlink: encodeURIComponent(review.research_content.permlink)
                              }
                            }"
                          >{{review.research_content.title}}</router-link>
                        </div>
                        <v-layout row wrap>
                          <v-flex
                            v-for="wod of review.weights_of_disciplines"
                            :key="wod.disciplineName"
                            class="rd-review-eci mt-1"
                            lg12
                          >{{wod.disciplineName}}: {{wod.totalWeight}}</v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex lg4>
                        <v-layout column fill-height justify-space-between pl-4>
                          <div>
                            <div class="bold">Approve bar</div>
                            <div class="py-2">
                              <v-layout row justify-space-between align-center class="mb-2">
                                <span class="pr-2">Novelty:</span>
                                <squared-rating readonly v-model="review.ratings.novelty" />
                              </v-layout>
                              <v-layout row justify-space-between align-center class="mb-2">
                                <span class="pr-2">Technical Quality:</span>
                                <squared-rating readonly v-model="review.ratings.technicalQuality" />
                              </v-layout>
                              <v-layout row justify-space-between align-center>
                                <span class="pr-2">Methodology:</span>
                                <squared-rating readonly v-model="review.ratings.methodology" />
                              </v-layout>
                            </div>
                          </div>
                          <div class="grey--text text-xs-right pt-2">
                            <v-icon small>event</v-icon>
                            {{moment(review.created_at).format("MMM D, YYYY")}}
                          </div>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                    <v-divider
                      v-if="index !== reviews.length - 1"
                      :key="`d_${index}`"
                      class="my-2"
                    />
                  </template>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout class="my-5">
            <v-flex lg1>
              <v-layout justify-end class="pr-3">
                <v-icon large color="grey lighten-2">mdi-file-document</v-icon>
              </v-layout>
            </v-flex>
            <v-flex lg11>
              <div class="rd-block-header pb-2">References: {{ researchReferencesList.length }}</div>
              <template v-for="(ref, i) of researchReferencesList">
                <v-layout :key="`ref_${i}`" class="py-1">
                  <v-flex shrink class="pr-3">{{i + 1}}.</v-flex>
                  <v-flex grow>
                    <div>{{ref.title}}</div>
                    <div class="grey--text">{{ref.source}}</div>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex lg3 offset-lg1>
          <v-layout column class="mt-5 mb-4 mx-4">
            <div class="rd-sidebar-block-title">
              <router-link class="research-group-link" :to="{ name: 'ResearchGroupDetails', params: {  research_group_permlink: encodeURIComponent(groupLink) } }">
                {{group.name}}
              </router-link>
            </div>
            <v-layout
              v-for="(member, i) in researchMembersList"
              :key="member.account.id"
              class="mt-3"
              justify-space-between
              align-center
            >
              <div><platform-avatar :size="40" :key="'member-' + i" :user="member" link-to-profile link-to-profile-class="pl-3"></platform-avatar></div>
              <div class="grey--text">{{convertToPercent(member.rgt.amount)}}%</div>
            </v-layout>
            <div v-if="isJoinRequestSectionAvailable">
              <v-btn
                v-if="canJoinResearchGroup"
                outline round
                color="primary"
                class="px-3 ma-0 mt-3"
                @click="onJoinResearchGroupClick()"
              >
                <v-icon small>add</v-icon>
                <span class="pl-2 medium text-none">Join Research group</span>
              </v-btn>
              <v-dialog v-if="research" v-model="isJoinGroupDialogOpen" persistent transition="scale-transition" max-width="800px">
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="isJoinGroupDialogOpen = false">
                      <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Please provide a cover letter to your join request</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <page-container>
                    <contentbar>
                      <v-textarea v-model="coverLetter" :rows="8" name="Cover letter" label="Cover letter"></v-textarea>
                      <v-layout justify-center>
                        <v-btn
                          color="primary"
                          :disabled="!coverLetter || isSendingJoinGroupRequest"
                          :loading="isSendingJoinGroupRequest"
                          @click="sendJoinGroupRequest()">
                          Send
                        </v-btn>
                      </v-layout>
                    </contentbar>
                </page-container>
                </v-card>
              </v-dialog>
              <div v-if="isActiveJoinRequest" class="mt-3">You have sent a join request on {{new Date(currentJoinRequest.created).toDateString()}}, please wait for approval</div>
              <div v-if="isActiveInvite" class="mt-3">
                Please accept invite on
                <router-link :to="{ name: 'UserDetails', params: { account_name: user.username}}" style="text-decoration: none">your profile page</router-link>
                to join the research group
              </div>
            </div>
          </v-layout>
          <v-divider />
          <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title">Expertise Contribution Index</div>
            <v-layout
              v-for="eci of eciList"
              :key="eci.disciplineName"
              justify-space-between
              class="mt-2 px-3 py-2 rd-eci-item"
            >
              <div>{{eci.disciplineName}}</div>
              <div class="bold">{{eci.value}}</div>
            </v-layout>
          </v-layout>
          <v-divider />
          <div class="rd-sidebar-block-title my-4 px-4">Citations: {{researchReferencesList.length + research.id}}</div>
          <v-divider />
          <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title">Tokenization</div>
            <div v-if="isResearchTokenized" class="mt-3">10000 research tokens issued</div>
            <v-btn
              v-else-if="isResearchGroupMember"
              class="mx-0 mt-3"
              :loading="isResearchTokenization"
              @click="onTokenizeResearchClick()"
            >Tokenize research</v-btn>
            <div v-else class="mt-3">Research has not been tokenized yet</div>
            <confirm-action-dialog
              :meta="tokenizationConfirmDialog"
              :title="``"
              :text="`This project will be tokenized instantly. This action is irreversible. Continue?`"
              @confirmed="tokenizeResearch($event); tokenizationConfirmDialog.isShown = false;" 
              @canceled="tokenizationConfirmDialog.isShown = false">
            </confirm-action-dialog>
          </v-layout>
          <template v-if="contentList.length">
            <v-divider />
            <v-layout column class="my-4 mx-4">
              <div class="rd-sidebar-block-title">Request review from expert</div>
              <v-autocomplete
                label="Find an expert to request a review"
                hide-no-data
                :append-icon="null"
                :loading="isExpertsLoading"
                :items="foundExperts"
                item-text="name"
                item-value="user"
                :search-input.sync="expertsSearch"
                v-on:keyup="queryExperts()"
                v-model="selectedExpert"
              />
              <div v-if="!selectedExpert">
                <v-layout row>
                  <platform-avatar :size="40" v-for="(expert, i) in experts.slice(0, 6)" :key="'expert-' + i" :user="expert" class="expert-avatar mr-2" ></platform-avatar>
                </v-layout>
              </div>
              <template v-else>
                <platform-avatar :user="selectedExpert" :size="40" link-to-profile link-to-profile-class="pl-3"></platform-avatar>
                <div v-if="$options.filters.employmentOrEducation(selectedExpert)">
                  <div class="py-2 body-2">{{selectedExpert | employmentOrEducation}}</div>
                </div>
              </template>
              <v-select
                v-if="contentListToReview.length"
                class="mt-3"
                label="Select a content to request review"
                item-text="title"
                item-value="id"
                :disabled="!selectedExpert"
                :items="contentListToReview"
                v-model="selectedContentId"
              />
              <span v-else>There are no content to review for selected expert</span>
              <v-btn
                @click="requestReview()"
                :loading="isRequestingReview"
                :disabled="isRequestingReviewDisabled"
                color="primary"
                outline
                class="mx-0 mt-3"
              >Request Review</v-btn>
            </v-layout>
          </template>
        </v-flex>
      </v-layout>
    </div>
  </base-page-layout>
</template>

<script>
  import deipRpc from '@deip/deip-oa-rpc-client';
  import * as d3 from "d3";
  import { mapGetters } from 'vuex';

  import bookmarksService from '@/services/http/bookmarks';
  import contentHttpService from '@/services/http/content';
  import joinRequestsService from '@/services/http/joinRequests';
  import reviewRequestsService from '@/services/http/reviewRequests';
  import { getContentType } from '@/services/ResearchService';

  // import references from './references.json';
  // import timeline from './timeline.json';
  import moment from 'moment';

  export default {
    name: "ResearchDetails",

    data() {
      return {
        tokenizationConfirmDialog: { isShown: false, isConfirming: false },
        investmentConfirmDialog: { isShown: false, isConfirming: false },

        groupLink: this.$route.params.research_group_permlink,

        isJoinGroupDialogOpen: false,
        coverLetter: '',
        isSendingJoinGroupRequest: false,

        amountToContribute: '',
        areTokensBuying: false,
        isResearchTokenization: false,

        isDeletingDraft: false,
        isCreatingDraft: false,

        selectedTimelineItemId: 1,
        timelineItemsToShow: 3,
        bookmarkId: null,
        isBookmarkActionInProgress: false,

        researchLogoSrc: "",

        activeEciChartTabIndex: 0,

        selectedExpert: null,
        selectedContentId: null,
        isExpertsLoading: false,
        expertsSearch: '',
        foundExperts: [],
        isRequestingReview: false,
      }
    },

    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        contentRefsList: 'rd/contentRefsList',
        contributionsList: 'rd/contributionsList',
        group: 'rd/group',
        disciplinesList: 'rd/disciplinesList',
        expertsList: 'rd/expertsList',
        groupInvitesList: 'rd/groupInvitesList',
        researchReferencesList: 'rd/researchReferencesList',
        researchMembersList: 'rd/researchMembersList',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        reviewsList: 'rd/reviewsList',
        tokenHoldersList: 'rd/tokenHoldersList',
        tokenSale: 'rd/tokenSale',
        tokenSalesList: 'rd/tokenSalesList',
        user: 'auth/user',
        userContributionsList: 'rd/userContributionsList',
        userJoinRequests: 'auth/userJoinRequests',
      }),

      contentListToReview() {
        let expert = this.selectedExpert;
        if (!expert) return this.contentList;
        let expertReviews = this.reviewsList.filter(r => r.author.account.name == expert.account.name);
        return this.contentList.filter(content => !expertReviews.some(r => r.research_content_id == content.id));
      },

      isRequestingReviewDisabled() {
        return !this.selectedExpert || this.selectedContentId == null;
      },

      timeline() {
        let milestones = this.$options.filters.researchMilestones(this.research.abstract);
        let timeline = milestones.map((milestone, i) => {
          return {
            "id": i + 1,
            "date": moment.utc(milestone.eta).local().format("MMM DD, YYYY"),
            "label": milestone.goal,
            "description": milestone.details
          }
        });
        return timeline;
      },
      selectedTimelineItem() {
        return this.timeline.find(m => m.id == this.selectedTimelineItemId);
      },
      averageInvestmentAmount() {
        return this.round2DigitsAfterComma(this.investmentsAmount / (this.investors.length || 1));
      },
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 1;
      },
      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 4;
      },
      tokenSaleEndLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc().local();
        let end = moment.utc(this.tokenSale.end_time).local();

        let months = Math.floor(moment.duration(end.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(end.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(end.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(end.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(end.diff(now)).asSeconds());
        return `${seconds} secs`;
      },
      tokenSaleStartLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc().local();
        let start = moment.utc(this.tokenSale.start_time).local();

        let months = Math.floor(moment.duration(start.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(start.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(start.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
        return `${seconds} secs`;
      },
      isContributionToTokenSaleDisabled() {
        let balance = this.fromAssetsToFloat(this.user.account.balance);
        let notEnoughFunds = (this.amountToContribute || 0) > balance;
        return notEnoughFunds || !this.amountToContribute || this.areTokensBuying;
      },
      canJoinResearchGroup() {
        if (this.research) {
          if (this.researchGroupMembersList.some(m => m.account.name === this.user.username)) {
            return false;
          }
          if (this.userJoinRequests.some(r => r.groupId === this.research.research_group_id)) {
            return false;
          }

          return !this.isActiveInvite;
        }
        return false;
      },
      currentCap() {
        return this.contributionsList
          .map(c => this.fromAssetsToFloat(c.amount))
          .reduce((acc, val) => acc + val, 0);
      },
      currentCapPercent() {
        return this.tokenSale
          ? this.currentCap * 100 / this.fromAssetsToFloat(this.tokenSale.hard_cap)
          : 0;
      },
      currentJoinRequest() {
        return this.research
          ? this.userJoinRequests.find(r => r.groupId == this.research.research_group_id)
          : undefined;
      },
      eciChart() {
        if (!this.eciChartCache) {
          this.eciChartCache = {};
        }
        if (this.eciChartCache[this.activeEciChartTabIndex]) {
          return this.eciChartCache[this.activeEciChartTabIndex];
        }

        const eci = this.eciList[this.activeEciChartTabIndex];
        if (!eci) {
          return null;
        }
        const startDate = this.moment(this.research.created_at);
        const endDate = this.moment();
        if (!endDate.diff(startDate, 'days')) {
          return null;
        }
        const timeDiff = endDate - startDate;

        const getPointTooltipHtml = (value,reviewerName, isPositive) => {
          let feedbackType;
          let feedbackClass;
          if (isPositive) {
            feedbackType = 'Approved';
            feedbackClass = 'green--text text--lighten-4'
          } else {
            feedbackType = 'Rejected';
            feedbackClass = 'red--text text--lighten-4'
          }

          return `
            <div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text">${reviewerName}</div>
              <div class="${feedbackClass} bold">${feedbackType}</div>
              <div class="white--text">${value}</div>
            </div>
          `;
        };

        const chartData = [
          ['Date', 'Value', { type: 'string', role: 'tooltip', p: { html: true } }]
        ];

        const influencers = [
          'Charles Darwin',
          'René Descartes',
          'Albert Einstein',
          'Leonhard Euler',
          'Michael Faraday',
          'Pierre de Fermat',
          'Alexander Fleming',
          'Galileo Galilei',
          'Carl Friedrich Gauss',
          'Willard Gibbs',
          'Edwin Hubble',
          'Ada Lovelace',
          'Dmitri Mendeleev',
          'Isaac Newton',
          'Alfred Nobel'
        ];

        const timeStep = timeDiff / influencers.length;
        new Array(influencers.length)
          .fill(0)
          .map((e, i) => endDate - (timeStep * i))
          .sort()
          .map(ms => new Date(ms))
          .forEach((timePoint, i, arr) => {
            let eciValue;
            if (i === arr.length - 1) {
              eciValue = eci.value;
            } else {
              eciValue = this.getRandomInt(-10000, 10000);
            }
            let isPositiveChange;
            if (i === 0) {
              isPositiveChange = eciValue > 0;
            } else {
              isPositiveChange = eciValue > chartData[i][1];
            }
            chartData.push([timePoint, eciValue, getPointTooltipHtml(eciValue, influencers[i], isPositiveChange)]);
          });

        const _eciChart = {
          data: chartData,
          options: {
            title: '',
            backgroundColor: {
              fill: '#fafafa'
            },
            legend: {
              position: 'none'
            },
            chartArea: {
              top: '15%',
              width: '90%',
            },
            tooltip: { isHtml: true },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset'],
              axis: 'horizontal',
              keepInBounds: true,
              maxZoomIn: 4.0
            },
          },
        };
        this.eciChartCache[this.activeEciChartTabIndex] = _eciChart;
        return _eciChart;
      },
      eciList() {
        return this.disciplinesList.map((discipline) => {
          const eciObj = this.research.eci_per_discipline.find(item => item[0] === discipline.id);

          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0,
          }
        });
      },
      experts() {
        const blackList = [
          'regacc', 'hermes', this.user.username,
          ...this.researchGroupMembersList.map(m => m.account.name)
        ];
        return this.expertsList.filter(e => !blackList.includes(e.account.name));
      },
      investmentsAmount () {
        return this.tokenSalesList.filter(e => [1, 2].includes(e.status))
          .map((e) => this.fromAssetsToFloat(e.total_amount))
          .reduce((acc, curr) => acc += curr, 0);
      },
      investors () {
        const investorsSet = {};

        [...this.tokenHoldersList, ...this.contributionsList].forEach((e) => {
          investorsSet[e.user.account.name] = e.user;
        });

        return Object.values(investorsSet);
      },
      isActiveInvite() {
        return this.groupInvitesList.some(invite => invite.account_name == this.user.username);
      },
      isActiveJoinRequest() {
        return this.currentJoinRequest && this.currentJoinRequest.status === 'pending';
      },
      isActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 1;
      },
      isFinishedResearch() {
        return this.research && this.research.is_finished;
      },
      isInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status === 4;
      },
      isJoinRequestSectionAvailable() {
        return this.isProfileAvailable && (this.canJoinResearchGroup || this.isActiveJoinRequest || this.isActiveInvite) && !this.group.is_personal;
      },
      isMissingTokenSale() {
        return this.tokenSale === undefined;
      },
      isProfileAvailable() {
        return !!this.user.profile;
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
          : false;
      },
      isResearchTokenized() {
        return this.$options.filters.researchTokenized(this.research.abstract) || this.tokenSalesList.length > 0;
      },
      isTokenSaleSectionAvailable() {
        if (!this.isResearchTokenized) return false;

        return (this.isMissingTokenSale && this.isResearchGroupMember && !this.isFinishedResearch) || this.isActiveTokenSale || this.isInactiveTokenSale;
      },
      reviews() {
        return this.reviewsList.map((review) => {
          const weights_of_disciplines = [];
          review.disciplines.forEach((discipline) => {
            const weight = review.weight_per_discipline.find(arr => arr[0] === discipline.id);
            weights_of_disciplines.push({
              disciplineName: discipline.name,
              totalWeight: weight ? weight[1] : 0,
            })
          });

          const _review = {
            ...review,
            content: this.$options.filters.reviewContent(review.content),
            ratings: this.$options.filters.reviewRatings(review.content),
            research_content: this.contentList.find(c => c.id === review.research_content_id),
            weights_of_disciplines,
          };
          _review.preview_html = this.extractReviewPreview(_review);
          return _review;
        });
      },
      totalReviewsScore() {
        let totalScore = 0;
        this.reviews.forEach((r) => {
          Object.values(r.ratings).forEach(rating => totalScore += rating);
        });
        return (totalScore / ((this.reviews.length || 1) * 3)).toFixed(1);
      },

      researchPresentationSrc() {
        return this.$options.filters.researchVideoSrc(this.research.abstract);
      },
      userInvestment() {
        const legitTokenSalesIds = this.tokenSalesList.filter(e => [1, 2].includes(e.status)).map(e => e.id);
        let amount = 0;
        this.userContributionsList.forEach((c) => {
          if (legitTokenSalesIds.includes(c.tokenSaleId)) {
            amount += this.fromAssetsToFloat(c.amount);
          }
        });
        return amount;
      }
    },

    methods: {
      onContributeToTokenSaleClick() {
        this.investmentConfirmDialog.isShown = true;
      },
      
      contributeToTokenSale() {
        this.areTokensBuying = true;

        return deipRpc.broadcast.contributeToTokenSaleAsync(
          this.user.privKey,
          this.tokenSale.id,
          this.user.username,
          this.toAssetUnits(this.amountToContribute)
        ).then((data) => {
          this.$store.dispatch('rd/loadResearchTokenSale', {researchId: this.research.id});
          this.$store.dispatch('rd/loadResearchTokenSales', {researchId: this.research.id});
          this.$store.dispatch('rd/loadResearchTokenHolders', {researchId: this.research.id});
          this.$store.dispatch('rd/loadUserContributions', {researchId: this.research.id});
          this.$store.dispatch('auth/loadAccount');

          this.areTokensBuying = false;
          this.$refs.amountToContribute.reset();
          this.amountToContribute = '';

          this.$store.dispatch('layout/setSuccess', {
            message: `You have contributed to "${this.research.title}" fundraise successfully !`
          });
        }).catch((err) => {
          console.log(err)
          this.areTokensBuying = false;
          this.$store.dispatch('layout/setError', {
            message: "An error occurred while contributing to fundraise, please try again later"
          });
        });
      },
      countContentReviews(content, isPositive) {
        return content.reviews.reduce(
          (acc, review) => review.is_positive && isPositive || !review.is_positive && !isPositive ? acc + 1 : acc,
          0
        );
      },
      createContentAuthorsString(authors) {
        return this.researchGroupMembersList
          .filter(m => authors.some(a => a === m.account.name))
          .map(m => this.$options.filters.fullname(m))
          .join('  ·  ');
      },
      createDarDraft() {
        this.isCreatingDraft = true;
        contentHttpService.createDarContent(this.research.id)
          .then((res) => {
            // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
            // and doesn't persist new changes for several instances during the current session
            window.location.replace(`${window.location.href}/!draft?ref=${res.draft._id}`);
            location.reload()
          }).catch((err) => {
            console.log(err)
          }).finally(()=> {
            this.isCreatingDraft = false;
          })
      },
      deleteDraft(draft) {
        this.isDeletingDraft = true;
        contentHttpService.deleteContentDraft(draft._id)
          .then(() => {
            this.$store.dispatch('rd/loadResearchContentRefs', { researchId: draft.researchId });
          })
          .finally(() => {
            this.isDeletingDraft = false;
          })
      },
      doesContentHaveReviews(content) {
        return content.reviews.length;
      },
      doesContentHavePositiveReviews(content) {
        return content.reviews.some(r => r.is_positive);
      },
      doesContentHaveNegativeReviews(content) {
        return content.reviews.some(r => !r.is_positive);
      },
      doesUserHaveLocation(userProfile) {
        return userProfile.location && 
          (userProfile.location.country || userProfile.location.city);
      },
      extractReviewPreview(review) {
        const temp = document.createElement('span');
        temp.innerHTML = review.content;
        if (temp.children.length) {
          const paragraphs = [...temp.children].filter((child) => isParagraph(child) && child.innerText);
          const paragraphText = paragraphs[0] 
            ? paragraphs[0].innerText
            : ``;

          return paragraphText.length > 300 ? `${paragraphText.substring(0, 300)}...` : paragraphText;
        }

        function isHeader(el) {
          return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some(h => h === el.nodeName);
        }
        function isParagraph(el) {
          return el.nodeName === 'P';
        }
      },
      getContentEciList(content) {
        return this.disciplinesList.map((discipline) => {
          const eciObj = content.eci_per_discipline.find(item => item[0] === discipline.id);

          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          }
        });
      },
      getTimelineItemColor(index) {
        const isIndexValid = index % 1 === 0 && index >= 0;
        if (!isIndexValid) {
          throw new Error('invalid index');
        }

        const colors = [
          '#8901EF',
          '#7558F2',
          '#2962FF',
          '#60B3F4',
          '#54E4F5'
        ];

        const periodicity = (colors.length - 1) * 2;

        const reducedIndex = index % periodicity;
        const maxIndex = colors.length - 1;

        let colorIndex;
        if (reducedIndex <= maxIndex) {
          colorIndex = reducedIndex;
        } else {
          colorIndex = maxIndex - (reducedIndex % maxIndex);
        }
        return colors[colorIndex];
      },
      goToReviewPage(review) {
        const params = { review_id: review.id };
        
        deipRpc.api.getResearchContentByIdAsync(review.research_content_id)
          .then((content) => {
            params.content_permlink = encodeURIComponent(content.permlink);
            return deipRpc.api.getResearchByIdAsync(content.research_id)
          })
          .then((research) => {
            params.research_permlink = encodeURIComponent(research.permlink);
            return deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)
          })
          .then((group) => {
            params.research_group_permlink = encodeURIComponent(group.permlink);
            this.$router.push({ name: 'ResearchContentReview', params });
          });
      },
      isDraftApproved(draft) {
        return this.contentList.some(c => c.content === `${draft.type}:${draft.hash}`);
      },
      isDraftInProgress(draft) {
        return draft.status === 'in-progress';
      },
      isDraftProposed(draft) {
        return draft.status === 'proposed';
      },
      onJoinResearchGroupClick() {
        this.isJoinGroupDialogOpen = true;
        this.coverLetter = '';
      },
      onShowMoreTimelineClick() {
        this.timelineItemsToShow = Math.min(this.timelineItemsToShow + 3, this.timeline.length);
      },
      onTimelineMarkerClick(item) {
        this.selectedTimelineItemId = item.id;
      },
      onTokenizeResearchClick() {
        this.tokenizationConfirmDialog.isShown = true;
        this.tokenizationConfirmDialog.isConfirming = false;
      },
      requestReview() {
        this.isRequestingReview = true;
        return reviewRequestsService.createReviewRequest({
          contentId: this.selectedContentId,
          expert: this.selectedExpert.account.name,
        }).then(() => {
          this.$store.dispatch('layout/setSuccess', { message: 'Review has been requested' });
          this.selectedExpert = null;
          this.selectedContentId = null;
        }).catch((err) => {
          let errMsg = 'Error while requesting review. Please try again later';
          if (err.response && err.response.data) {
            errMsg = err.response.data;
          }
          this.$store.dispatch('layout/setError', {
            message: errMsg
          });
        })
        .finally(() => {
          this.isRequestingReview = false;
        });
      },
      tokenizeResearch() {
        const abstract = JSON.stringify({
          description: this.$options.filters.researchAbstract(this.research.abstract),
          milestones: this.$options.filters.researchMilestones(this.research.abstract),
          video_src: this.$options.filters.researchVideoSrc(this.research.abstract),
          is_tokenized: true,
        });

        this.isResearchTokenization = true;        
        deipRpc.broadcast.researchUpdateAsync(
          this.user.privKey,
          this.research.id,
          this.research.title,
          abstract,
          this.research.permlink,
          this.user.username
        ).then(() => {
          this.$store.dispatch('layout/setSuccess', {
            message: 'Research has been tokenized'
          });
        }).catch(() => {
          this.$store.dispatch('layout/setError', {
            message: 'An error occurred while tokenizing research, please try again later'
          });
        }).then(() => {
          this.$store.dispatch('rd/loadResearchDetails', {
            group_permlink: this.research.group_permlink,
            research_permlink: this.research.permlink,
          });
        }).finally(() => {
          this.isResearchTokenization = false;        
        });
      },
      openDarDraft(draft) {
        if (draft.type === 'dar' && draft.status === 'in-progress') {
          // we have to do it this way as Texture InMemory buffer is getting flushed after the first saving
          // and doesn't persist new changes for several instances during the current session
          window.location.replace(`${window.location.href}/!draft?ref=${draft._id}`);
          location.reload()
        } else {
          const params = {
            group_permlink: this.$route.params.research_group_permlink,
            research_permlink: this.$route.params.research_permlink,
            content_permlink: `!draft`
          };
          const query = { 'ref': draft._id };
          this.$router.push({ name: 'ResearchContentDetails', params, query });
        }
      },
      sendJoinGroupRequest() {
        this.isSendingJoinGroupRequest = true;

        joinRequestsService.createJoinRequest({
          username: this.user.username,
          groupId: this.research.research_group_id,
          coverLetter: this.coverLetter
        }).then(() => {
          this.$store.dispatch('auth/loadJoinRequests');
          this.$store.dispatch('layout/setSuccess', { message: "Join request has been sent successfully!"});
        }).catch((err) => {
          this.$store.dispatch('layout/setError', { message: "An error occurred while sending join request, please try again later!"});
          console.log(err)
        }).finally(() => {
          this.isSendingJoinGroupRequest = false;
          this.isJoinGroupDialogOpen = false;
        })
      },

      addToBookmarks() {
        this.isBookmarkActionInProgress = true;
        return bookmarksService.createResearchBookmark(this.user.username, this.research.id)
          .then((bookmark) => {
            this.$store.dispatch('auth/loadResearchBookmarks');
            this.bookmarkId = bookmark._id;
          }).catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.isBookmarkActionInProgress = false;
          })
      },

      removeFromBookmarks() {
        this.isBookmarkActionInProgress = true;
        return bookmarksService.removeResearchBookmark(this.user.username, this.bookmarkId)
          .then(() => {
            this.$store.dispatch('auth/loadResearchBookmarks');
            this.bookmarkId = null;
          }).catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.isBookmarkActionInProgress = false;
          })
      },
      queryExperts() {
        this.isExpertsLoading = true;
        this.foundExperts = this.expertsSearch ? this.experts.filter(user => {
          let name = this.$options.filters.fullname(user);
          return name.toLowerCase().indexOf((this.expertsSearch || '').toLowerCase()) > -1
            || user.account.name.toLowerCase().indexOf((this.expertsSearch || '').toLowerCase()) > -1;
        })
        .map((user => {
          const name = this.$options.filters.fullname(user);
          return { name, user };
        })) : [];

        if (!this.expertsSearch) {
          this.selectedExpert = null;
        }

        this.isExpertsLoading = false;
      },

      agreeSaft() {
        this.investmentConfirmDialog.isShown = false;
        setTimeout(() => {
          this.contributeToTokenSale();
        }, 100);
      },

      disagreeSaft() {
        this.investmentConfirmDialog.isShown = false;
      },

      getContentType,
    },

    created() {
      this.researchLogoSrc = `./static/researches/${this.research.id < 30 ? this.research.id : 'default'}_background.png`;
      const bookmark = this.user.researchBookmarks.find(b => b.researchId === this.research.id);
      if (bookmark) {
        this.bookmarkId = bookmark._id;
      }
    }
  };
</script>

<style lang="less" scoped>
  .rd-header {
    height: 300px;
    overflow: auto;

    font-style: normal;
    color: white;

    &__title {
      font-family: Muli;
      font-weight: 900;
      font-size: 36px;
      line-height: 40px;
      letter-spacing: 0.25px;
    }
    &__created {
    }
    &__abstract {
      font-family: Roboto;
      font-size: 14px;
      line-height: 16px;
    }
  }

  .rd-block-header {
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 0.25px;
    color: black;
  }

  .rd-cap-chip {
    padding: 4px 16px;
    background-color: #00D57C;
    border-radius: 20px;
    color: white;
    font-family: Roboto;
    font-weight: 500;
    font-size: 14px;
  }

  .rd-cap-value {
    font-family: Muli;
    font-weight: 900;
    font-size: 36px;
    color: #000000;
  }

  .rd-cap-progress-bound {
    font-family: Roboto;
    font-size: 14px;
    color: #9E9E9E;
  }

  .rd-cap-progress-bar {
    height: 4px;
    min-width: 250px;
    position: relative;

    .progress-line {
      height: inherit;
      width: 100%;
      background-color: #E0E0E0;
      border-radius: 4px;
      position: absolute;
      z-index: 1;
      &:after {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: block;
        content: '';
        background-color: inherit;
        position: absolute;
        top: calc(-50% - 1px);
        right: 0;
      }
    }

    .progress-current {
      height: inherit;
      min-width: 10px;
      position: absolute;
      background: linear-gradient(
        90deg,
        #EF01E5 0%,
        #8901EF 17.91%,
        #2962FF 43.25%,
        #57D8F5 74.02%,
        #60E5AD 98.85%
      );
      border-radius: 4px;
      z-index: 2;
      &:after {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: block;
        content: '';
        background-color: #60E5AD;
        position: absolute;
        top: calc(-50% - 1px);
        right: 0;
      }
    }
  }

  .rd-investment-info {
    padding-right: 48px;
    &:last-child {
      padding-right: 0px;
    }

    &__value {
      font-family: Muli;
      font-weight: 900;
      font-size: 24px;
      color: #000000;
    }

    &__value-text {
      font-family: Roboto;
      font-size: 12px;
      color: #9E9E9E;
    }
  }

  .rd-timeline {
    list-style: none;
    &--full {
      .rd-timeline-item {
        &:last-child {
          height: auto;
        }
      }
    }
    .rd-timeline-item {
      padding-left: 40px;
      position: relative;
      height: 110px;

      &__marker {
        border-radius: 50%;
        width: 12px;
        height: 12px;
        position: absolute;
        top: 10px; left: 0;
        
        &--clickable {
          &:hover {
            cursor: pointer;
            opacity: 0.8;
            box-shadow: 0px 0px 3px 0px rgba(153,153,153, 0.5);
            transform: scale(1.4, 1.4);
          }
        }
        &--active {
          transform: scale(1.4, 1.4);
        }
      }
      &__line {
        height: 92px;
        width: 2px;
        position: absolute;
        top: 25px; left: 5px;
      }
      &__date {
        font-family: Muli;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #000000;
      }
      &__label {
        font-family: Roboto;
        font-size: 12px;
        line-height: 18px;
        color: #9E9E9E;
      }
    }
  }

  .v-expansion-panel {
    box-shadow: none;
    background-color: #fafafa;
    &__container,
    &__header,
    &__body {
      background: #fafafa !important;
    }
  }

  .rd-reviewer {
    font-family: Roboto;
    font-size: 12px;
    line-height: 14px;

    &__title {
      font-weight: bold;
      color: #000000;
    }

    &__subtitle {
      color: #9E9E9E;
    }
  }

  .rd-review-eci {
    font-family: Roboto;
    font-size: 12px;
    line-height: 14px;
    color: #9E9E9E;
  }

  .rd-sidebar-block-title {
    font-family: Roboto;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
  }

  .rd-eci-item {
    border: 1px solid #BDBDBD;
    border-radius: 2px;
    font-family: Roboto;
    font-size: 12px;
    line-height: 14px;
    color: #828282;
  }

  .btn {
    &--gradient-pb {
      background: linear-gradient(165.53deg, #8900EF -32.44%, #4EFEF6 118.73%);
      box-shadow: 1px 2px 6px rgba(68, 85, 129, 0.15);
      border-radius: 2px;

      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #FFFFFF;
    }
  }

.presentation-video {
  width: auto; 
  height: 220px; 
  border: 2px solid #fafafa;
}
.right-bordered {
  border-right: 1px solid #E0E0E0;
}

.research-group-link {
  text-decoration: none;
  &:hover {
      text-decoration: underline;
  }
}

</style>
