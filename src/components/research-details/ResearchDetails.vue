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
                    <v-flex lg9 class="pl-2">{{tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true)}}</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">End:</v-flex>
                    <v-flex lg9 class="pl-2">{{tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true)}} <v-chip class="my-0 mx-2 caption" style="height: 1.4em" color="amber lighten-1">{{tokenSaleDaysLeft}} days left</v-chip></v-flex>
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
                <confirm-action-dialog
                  :meta="investmentConfirmDialog"
                  :width="500"
                  confirm-text="Agree"
                  cancel-text="Disagree"
                  title="SAFT Text"
                  text="Miusov, as a man man of breeding and deilcacy, could not but feel some inwrd qualms, when he reached the Father Superior's with Ivan: he felt ashamed of havin lost his temper. He felt that he ought to have disdaimed that despicable wretch, Fyodor Pavlovitch, too much to have been upset by him in Father Zossima's cell, and so to have forgotten himself. Teh monks were not to blame, in any case, he reflceted, on the steps. And if theyre decent people here (and the Father Superior, I understand, is a nobleman) why not be friendly and courteous withthem? I wont argue, Ill fall in with everything, Ill win them by politness, and show them that Ive nothing to do with that Aesop, thta buffoon, that Pierrot, and have merely been takken in over this affair, just as they have. He determined to drop his litigation with the monastry, and relinguish his claims to the wood-cuting and fishery rihgts at once. He was the more ready to do this becuase the rights had becom much less valuable, and he had indeed the vaguest idea where the wood and river in quedtion were. These excellant intentions were strengthed when he enterd the Father Superiors diniing-room, though, stricttly speakin, it was not a dining-room, for the Father Superior had only two rooms alltogether; they were, however, much larger and more comfortable than Father Zossimas. But tehre was was no great luxury about the furnishng of these rooms eithar. The furniture was of mohogany, covered with leather, in the old-fashionned style of 1820 the floor was not even stained, but evreything was shining with cleanlyness, and there were many chioce flowers in the windows; the most sumptuous thing in the room at the moment was, of course, the beatifuly decorated table. The cloth was clean, the service shone; there were three kinds of well-baked bread, two bottles of wine, two of excellent mead, and a large glass jug of kvas -- both the latter made in the monastery, and famous in the neigborhood. There was no vodka. Rakitin related afterwards that there were five dishes: fish-suop made of sterlets, served with little fish paties; then boiled fish served in a spesial way; then salmon cutlets, ice pudding and compote, and finally, blanc-mange. Rakitin found out about all these good things, for he could not resist peeping into the kitchen, where he already had a footing. He had a footting everywhere, and got informaiton about everything. He was of an uneasy and envious temper. He was well aware of his own considerable abilities, and nervously exaggerated them in his self-conceit. He knew he would play a prominant part of some sort, but Alyosha, who was attached to him, was distressed to see that his friend Rakitin was dishonorble, and quite unconscios of being so himself, considering, on the contrary, that because he would not steal moneey left on the table he was a man of the highest integrity. Neither Alyosha nor anyone else could have infleunced him in that. Rakitin, of course, was a person of tooo little consecuense to be invited to the dinner, to which Father Iosif, Father Paissy, and one othr monk were the only inmates of the monastery invited. They were alraedy waiting when Miusov, Kalganov, and Ivan arrived. The other guest, Maximov, stood a little aside, waiting also. The Father Superior stepped into the middle of the room to receive his guests. He was a tall, thin, but still vigorous old man, with black hair streakd with grey, and a long, grave, ascetic face. He bowed to his guests in silence. But this time they approaced to receive his blessing. Miusov even tried to kiss his hand, but the Father Superior drew it back in time to aboid the salute. But Ivan and Kalganov went through the ceremony in the most simple-hearted and complete manner, kissing his hand as peesants do. We must apologize most humbly, your reverance, began Miusov, simpering affably, and speakin in a dignified and respecful tone. Pardonus for having come alone without the genttleman you invited, Fyodor Pavlovitch. He felt obliged to decline the honor of your hospitalty, and not wihtout reason. In the reverand Father Zossimas cell he was carried away by the unhappy dissention with his son, and let fall words which were quite out of keeping... in fact, quite unseamly... asyour reverance is, no doubt, already aware. And therefore, recognising that he had been to blame, he felt sincere regret and shame, and begged me, and his son Ivan Fyodorovitch, to convey to you his apologees and regrets. In brief, he hopes and desires to make amends later. He asks your blessinq, and begs you to forget what has takn place."
                  @confirmed="contributeToTokenSale($event); investmentConfirmDialog.isShown = false;" 
                  @canceled="investmentConfirmDialog.isShown = false">
                </confirm-action-dialog>
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
                      <v-flex lg1 v-show="doesContentHaveReviews(content)">
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
                <v-flex lg12 class="rd-block-header">Reviews: {{reviewsList.length}}</v-flex>
                <v-flex lg12>
                  <template v-for="(review, index) of reviews">
                    <v-layout
                      :key="`r_${review.id}`"
                      class="mt-3"
                      @click="goToReviewPage(review)"
                    >
                      <v-flex lg2 class="rd-reviewer" v-on:click.stop>
                        <v-avatar size="80px">
                          <img v-if="review.author.profile" v-bind:src="review.author.profile.avatar | avatarSrc(160, 160, false)" />
                          <v-gravatar v-else :title="review.author.account.name" :email="review.author.account.name + '@deip.world'" />
                        </v-avatar>
                        <div class="mt-2">
                          <router-link class="a rd-reviewer__title" :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}">
                            {{ review.author | fullname }}
                          </router-link>
                        </div>
                        <div v-if="review.author.profile" class="rd-reviewer__subtitle mt-2">
                          <span>{{review.author | employmentOrEducation}}</span>
                          <span v-if="doesUserHaveLocation(review.author.profile)">, {{review.author | userLocation}}</span>
                        </div>
                      </v-flex>
                      <v-flex lg10 class="clickable">
                        <v-layout>
                          <div class="pr-2 grey--text">{{review.created_at | dateFormat('D MMM YYYY', true)}}</div>
                          <div v-if="review.is_positive" class="green--text bold">Approveed</div>
                          <div v-else class="red--text bold">Rejected</div>
                        </v-layout>
                        <v-layout v-if="review.research_content" v-on:click.stop class="bold py-1">
                          Review to:&nbsp;
                          <router-link class="a" 
                            :to="{
                              name: 'ResearchContentDetails',
                              params: {
                                research_group_permlink: encodeURIComponent(research.group_permlink),
                                research_permlink: encodeURIComponent(research.permlink),
                                content_permlink: encodeURIComponent(review.research_content.permlink)
                              }
                            }"
                          >{{review.research_content.title}}</router-link>
                        </v-layout>
                        <div class="black--text" v-html="review.preview_html" />
                        <v-layout class="pt-1">
                          <div
                            v-for="wod of review.weights_of_disciplines"
                            :key="wod.disciplineName"
                            class="rd-review-eci"
                          >{{wod.disciplineName}} {{wod.totalWeight}}</div>
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
              <div class="rd-block-header">References: {{ references.length }}</div>
              <template v-for="(ref, i) of references">
                <v-layout :key="`ref_${i}`">
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
              Members:&nbsp;
              <router-link :to="{ name: 'ResearchGroupDetails', params: {  research_group_permlink: encodeURIComponent(groupLink) } }" style="text-decoration: none;">
                {{membersList.length}}
              </router-link>
            </div>
            <v-layout
              v-for="(member, i) in membersList"
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
          <div class="rd-sidebar-block-title my-4 px-4">Citations: 12</div>
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
  import { getContentType } from '@/services/ResearchService';

  import references from './references.json';
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
        references,
        bookmarkId: null,
        isBookmarkActionInProgress: false,

        researchLogoSrc: "",

        activeEciChartTabIndex: 0,
      }
    },

    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        contentRefsList: 'rd/contentRefsList',
        contributionsList: 'rd/contributionsList',
        group: 'rd/group',
        disciplinesList: 'rd/disciplinesList',
        groupInvitesList: 'rd/groupInvitesList',
        membersList: 'rd/membersList',
        research: 'rd/research',
        reviewsList: 'rd/reviewsList',
        tokenHoldersList: 'rd/tokenHoldersList',
        tokenSale: 'rd/tokenSale',
        tokenSalesList: 'rd/tokenSalesList',
        user: 'auth/user',
        userContributionsList: 'rd/userContributionsList',
        userJoinRequests: 'auth/userJoinRequests',
      }),

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
      tokenSaleDaysLeft() {
        if (this.tokenSale) {
          let now = moment.utc().local();
          let end = moment.utc(this.tokenSale.end_time).local();
          return Math.floor(moment.duration(end.diff(now)).asDays());
        }
      },
      isContributionToTokenSaleDisabled() {
        let balance = this.fromAssetsToFloat(this.user.account.balance);
        let notEnoughFunds = (this.amountToContribute || 0) > balance;
        return notEnoughFunds || !this.amountToContribute || this.areTokensBuying;
      },
      canJoinResearchGroup() {
        if (this.research) {
          if (this.membersList.some(m => m.account.name === this.user.username)) {
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
              eciValue = this.getRandomInt(-1000, 1000);
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

          return {
            ...review,
            research_content: this.contentList.find(c => c.id === review.research_content_id),
            preview_html: this.extractReviewPreview(review),
            weights_of_disciplines,
          };
        });
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
        return this.membersList
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
    margin-right: 8px;
    padding-right: 8px;
    border-right: 1px solid #9E9E9E;
    &:last-child {
      border-right: none;
    }
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
  
</style>
