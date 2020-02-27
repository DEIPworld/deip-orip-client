<template>
  <base-page-layout>
    <v-card slot="content" class="full-width full-height">
      <!-- Header -->
      <v-layout 
        row 
        class="rd-header full-height pa-5 feed-header"
        :style="{ background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 70%, transparent), url('+ $options.filters.researchBackgroundSrc(research.id) +'), 100%, 100%, no-repeat'}"
      >
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
                  <v-btn
                    class="ma-0 pa-0"
                    small
                    outline
                    color="white"
                    :to="{  
                      name: 'ResearchEdit',
                      params: {
                        research_group_permlink: encodeURIComponent(research.group_permlink),
                        research_permlink: encodeURIComponent(research.permlink)
                      } 
                    }"
                  >Edit</v-btn>
                </span>
              </v-layout>
            </div>
            <div class="rd-header__abstract">
              <toggle-text
                class="py-3"
                :text="$options.filters.researchAbstract(research.abstract)"
              ></toggle-text>
            </div>
          </div>
        </v-flex>
        <v-flex lg4 text-xs-right class="align-start">
          <div v-if="researchPresentationSrc">
            <iframe
              class="presentation-video"
              :src="getEmbedVideoUrl(researchPresentationSrc)"
              frameborder="0"
              allowfullscreen
            />
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
            >Follow</v-btn>

            <v-btn
              v-else
              class="ma-0 pa-0"
              color="grey"
              outline
              small
              @click="removeFromBookmarks()"
              :loading="isBookmarkActionInProgress"
            >Unfollow</v-btn>
          </div>
        </v-flex>

        <!-- Body -->
        <v-flex lg9 class="px-5">
          <v-layout v-if="isTokenSaleSectionAvailable" class="my-5">
            <v-flex lg7>
              <v-layout column>
                <v-layout row>
                  <v-flex grow>
                    <v-layout>
                      <div class="pr-3"><v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon></div>
                      <div class="rd-block-header align-self-center">Fundrising</div>
                    </v-layout>
                  </v-flex>
                  <v-flex shrink>
                  </v-flex>
                </v-layout>

                <div v-if="isActiveTokenSale || isInactiveTokenSale">
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Start:</v-flex>
                    <v-flex lg9 class="pl-2">
                      <span>{{tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                      <v-chip
                        v-if="hasInactiveTokenSale"
                        class="my-0 mx-2 caption"
                        style="height: 1.4em"
                        color="primary lighten-3"
                      >{{tokenSaleStartLeft}} left</v-chip>
                    </v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">End:</v-flex>
                    <v-flex lg9 class="pl-2">
                      <span>{{tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                      <v-chip
                        v-if="hasActiveTokenSale"
                        class="my-0 mx-2 caption"
                        style="height: 1.4em"
                        color="amber lighten-1"
                      >{{tokenSaleEndLeft}} left</v-chip>
                    </v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Tokens On sale:</v-flex>
                    <v-flex
                      lg9
                      class="pl-2"
                    >{{tokenSale.balance_tokens}} ({{convertToPercent(tokenSale.balance_tokens)}}%)</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Remaining Tokens:</v-flex>
                    <v-flex
                      lg9
                      class="pl-2"
                    >{{research.owned_tokens}} ({{convertToPercent(research.owned_tokens)}}%)</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Min:</v-flex>
                    <v-flex lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.soft_cap)}}</v-flex>
                  </v-layout>
                  <v-layout class="pt-3">
                    <v-flex lg3 class="bold">Max:</v-flex>
                    <v-flex lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
                  </v-layout>
                </div>

                <div v-if="isMissingTokenSale && isResearchGroupMember && research" class="pt-3">
                  <v-btn
                    round
                    outline
                    color="primary"
                    class="ma-0"
                    :to="{
                      name: 'CreateTokenSale',
                      params: { research_group_permlink: research.group_permlink, research_permlink: research.permlink }
                    }"
                  >Start fundraise</v-btn>
                </div>
              </v-layout>
            </v-flex>

            <v-flex lg5 v-if="isActiveTokenSale">
              <v-layout justify-end class="rd-cap-value">${{currentCap}}</v-layout>
              <v-layout justify-end align-center class="py-2">
                <div
                  class="rd-cap-chip"
                  v-if="currentCap >= fromAssetsToFloat(tokenSale.soft_cap)"
                >Min goal reached!</div>
                <div class="pl-4">Raised of ${{fromAssetsToFloat(tokenSale.hard_cap)}} Goal</div>
              </v-layout>
              <v-layout align-center justify-end class="py-2">
                <v-flex shrink class="rd-cap-progress-bound mr-2">0</v-flex>
                <v-flex grow class="rd-cap-progress-bar">
                  <div class="progress-line" />
                  <div class="progress-current" :style="{ width: `${currentCapPercent}%` }" />
                </v-flex>
                <v-flex
                  shrink
                  class="rd-cap-progress-bound ml-2"
                >{{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
              </v-layout>

              <v-layout column v-if="isActiveTokenSale && !isResearchGroupMember">
                <v-layout justify-end class="pt-2">
                  <v-text-field
                    ref="amountToContribute"
                    v-model="amountToContribute"
                    placeholder="Amount"
                    suffix="USD"
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
                  <v-card class="pa-4">
                    <v-card-title>
                      <v-layout align-center>
                        <v-flex grow headline font-weight-bold>SAFT (Simple Agreement for Future Tokens)</v-flex>
                        <v-flex shrink right-top-angle>
                          <v-btn @click="disagreeSaft()" icon class="pa-0 ma-0">
                            <v-icon color="black">close</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-card-title>
                    <v-card-text style="height: 50vh">
                      <iframe
                        height="100%"
                        width="100%"
                        src="/assets/img/form-of-SAFT-for-token-pre-sale.pdf"
                      ></iframe>
                    </v-card-text>
                    <v-card-actions class="pa-0">
                      <v-layout row wrap>
                        <v-flex xs12 py-2>
                          <v-btn block color="primary" @click="agreeSaft()">Agree</v-btn>
                        </v-flex>
                        <v-flex xs12 py-2>
                          <v-btn
                            color="primary"
                            block
                            flat
                            @click="disagreeSaft()"
                          >Disagree</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout v-if="investors.length || isActiveTokenSale" class="my-5">
            <v-flex lg7>
              <v-layout column>
                <v-layout row class="pb-4">
                  <v-flex grow>
                    <v-layout>
                      <div class="pr-3"><v-icon large color="grey lighten-2">mdi-account-box</v-icon></div>
                      <div class="rd-block-header align-self-center">Investors: {{investors.length}}</div>
                    </v-layout>
                  </v-flex>
                  <v-flex shrink>
                  </v-flex>
                </v-layout>

                <div>
                  <v-layout justify-start class="mt-2">
                    <div class="rd-investment-info">
                      <span class="rd-investment-info__value">${{investmentsAmount}}</span>
                      <br />
                      <span class="rd-investment-info__value-text">Total investments</span>
                    </div>
                    <div class="rd-investment-info">
                      <span class="rd-investment-info__value">${{averageInvestmentAmount}}</span>
                      <br />
                      <span class="rd-investment-info__value-text">Average investment</span>
                    </div>
                    <div class="rd-investment-info" v-if="!isResearchGroupMember">
                      <span class="rd-investment-info__value">${{userInvestment}}</span>
                      <br />
                      <span class="rd-investment-info__value-text">Your investment</span>
                    </div>
                  </v-layout>
                  <v-layout justify-start class="mt-2">
                    <platform-avatar
                      :size="40"
                      v-for="(investor, i) in investors"
                      :key="'investor-' + i"
                      :user="investor"
                      class="mr-1"
                    ></platform-avatar>
                  </v-layout>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-divider v-if="isTokenSaleSectionAvailable || investors.length"></v-divider>
          
          <v-layout row v-if="timeline.length" class="my-5">
            <v-flex lg8>
              <v-layout column>
                <v-layout row>
                  <v-flex grow>
                    <v-layout>
                      <div class="pr-3"><v-icon large color="grey lighten-2">mdi-flag</v-icon></div>
                      <div class="rd-block-header align-self-center">Project Timeline</div>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-flex>
            <v-flex lg12>
              <research-timeline :timeline="timeline" />
            </v-flex>
          </v-layout>
          
          <v-layout column class="my-4" v-if="contentList.length">
            <div>
              <v-expansion-panel class="elevation-0">
                <v-expansion-panel-content v-for="content of contentList" :key="content.id">
                  <template slot="header">
                    <v-layout align-center v-on:click.stop>
                      <v-flex lg2 class="text-capitalize bold">{{getResearchContentType(content.content_type).text}}</v-flex>
                      <v-flex lg8 class="bold">
                        <router-link
                          class="a"
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
                      <v-flex lg1 text-lg-center class="text-xs-center">
                        <v-tooltip top>
                          <template slot="activator">
                            <router-link class="a" style="text-decoration: none;"
                              :to="{
                                name: 'ResearchContentReferences',
                                params: {
                                  research_group_permlink: encodeURIComponent(research.group_permlink),
                                  research_permlink: encodeURIComponent(research.permlink),
                                  content_permlink: encodeURIComponent(content.permlink)
                                }
                              }">
                              <v-icon small>device_hub</v-icon>
                            </router-link>
                          </template>
                          <span>Browse references</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex lg1 text-lg-center v-show="doesContentHaveReviews(content)">
                        <v-icon size="14px">chat_bubble</v-icon>
                        <span
                          v-show="doesContentHavePositiveReviews(content)"
                          class="green--text medium"
                        >{{countContentReviews(content, true)}}</span>
                        <span
                          v-show="doesContentHavePositiveReviews(content) && doesContentHaveNegativeReviews(content)"
                        >/</span>
                        <span
                          v-show="doesContentHaveNegativeReviews(content)"
                          class="red--text medium"
                        >{{countContentReviews(content, false)}}</span>
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
            </div>
          </v-layout>

          <v-layout column class="my-4" v-if="isResearchGroupMember && !research.is_finished">
            <div>
              <v-expansion-panel class="elevation-0">
                <v-expansion-panel-content
                  v-for="(draft, index) of contentRefsList.filter(d => !isDraftApproved(d))"
                  :key="draft._id">
                  <template slot="header">
                    <v-layout align-center v-on:click.stop>
                      <v-flex lg2 class="text-capitalize bold">Draft {{index + 1}}</v-flex>
                      <v-flex lg10>
                        <span class="bold">
                          <a @click="openDarDraft(draft)" class="a">{{draft.title || draft._id}}</a>
                        </span>
                        <span v-if="isDraftProposed(draft)" class="ml-2 orange--text">(proposed)</span>
                      </v-flex>
                    </v-layout>
                  </template>
                  <v-card class="elevation-0">
                    <v-card-text class="pl-4 pa-0">
                      <v-layout align-baseline justify-space-between>
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
                            outline
                            small
                            depressed
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
            </div>

            <v-layout column class="mt-4">
              <div><upload-research-content-file-dialog @onFinish="newContentUploaded" /></div>
              <div class="full-width">
                <v-btn
                  @click="createDarDraft()"
                  :loading="isCreatingDraft"
                  :disabled="isCreatingDraft"
                  block
                  outline
                  color="primary"
                  dark
                >Use Editor</v-btn>
              </div>
            </v-layout>
          </v-layout>

          <v-divider v-if="contentList.length || (isResearchGroupMember && !research.is_finished)" />
          
          <v-layout column class="my-5">
            <v-layout row align-baseline>
              <v-flex grow>
                <v-layout>
                  <div class="pr-3"><v-icon large color="grey lighten-2">mdi-poll-box</v-icon></div>
                  <div class="rd-block-header align-self-center">Expertise Contribution Index</div>
                </v-layout>
              </v-flex>
              <v-flex shrink>
                <v-select
                  class="my-0 py-0"
                  v-model="selectedEciDisciplineId"
                  :items="research.disciplines"
                  item-text="name"
                  item-value="id"
                  label="Discipline"
                  outline
                  dense
                  @change="selectEciDiscipline()"
                  :disabled="eciHistoryRecordsTable.loading"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row>
              <div class="full-width" v-if="eciDisciplineHistoryRecordsChart">
                <GChart
                  type="LineChart"
                  :settings="{ packages: ['corechart'] }"
                  :data="eciDisciplineHistoryRecordsChart.data"
                  :options="eciDisciplineHistoryRecordsChart.options"
                />
              </div>
            </v-layout>

            <v-layout row v-if="hasEciDisciplineHistoryRecords">
              <div class="full-width">
                <v-data-table
                  :headers="eciHistoryRecordsTable.headers"
                  :items="eciHistoryRecordsTable.items"
                  class="elevation-0 mt-3"
                  disable-initial-sort
                  :loading="eciHistoryRecordsTable.loading"
                  :rows-per-page-items="[5, 10]"
                  :pagination.sync="eciHistoryRecordsTable.pagination"
                  :total-items="eciHistoryRecordsTable.totalItems"
                >
                  <template v-slot:items="props">
                    <td>
                      <v-chip :color="eciHistoryRecordsTable.actionsColorMap[props.item.action]" text-color="white">
                        <span class="bold">{{ props.item.actionText.toUpperCase() }}</span>
                      </v-chip>
                    </td>
                    <td>
                      <router-link v-if="props.item.meta.link" class="a" :to="props.item.meta.link">{{props.item.meta.title}}</router-link>
                      <span v-else class="body-2">{{props.item.meta.title}}</span>
                    </td>
                    <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
                    <td class="text-xs-center">
                      <div class="half-bold" :class="{ 'eci-up': props.item.delta > 0, 'eci-down': props.item.delta < 0 }">{{ props.item.delta }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.newAmount }}</div>
                    </td>
                  </template>
                </v-data-table>
              </div>
            </v-layout>
          </v-layout>

          <v-divider></v-divider>

          <v-layout column class="my-5" v-if="reviews.length">
            <v-layout row class="pb-4">
              <v-flex grow>
                <v-layout>
                  <div class="pr-3"><v-icon large color="grey lighten-2">mdi-poll-box</v-icon></div>
                  <div class="rd-block-header align-self-center">Reviews</div>
                </v-layout>
              </v-flex>
              <!-- <v-flex shrink>
                <div class="half-bold subheading">
                  Total reviews score:
                  <span class="bold">{{totalReviewsScore}}</span>
                  <v-tooltip bottom>
                    <v-icon slot="activator" small>help</v-icon>
                    <span>Total score is the result of these 3 scores which has been rounded to the nearest whole number.</span>
                  </v-tooltip>
                </div>
              </v-flex> -->
            </v-layout>

            <div v-for="(review, index) of reviews" :key="`r_${review.id}`">
              <v-layout>
                <v-flex lg4 class="right-bordered">
                  <v-layout column fill-height justify-space-between>
                    <v-layout row>
                      <platform-avatar :user="review.author" :size="80"></platform-avatar>
                      <div class="px-4">
                        <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}">
                          {{ review.author | fullname }}
                        </router-link>
                        <div v-if="review.author.profile" class="rd-reviewer__subtitle pt-1">
                          <span>{{review.author | employmentOrEducation}}</span>
                          <span
                            v-if="doesUserHaveLocation(review.author.profile)"
                          >, {{review.author | userLocation}}</span>
                        </div>
                      </div>
                    </v-layout>
                    <v-btn small @click="goToReviewPage(review)" outline>See review</v-btn>
                  </v-layout>
                </v-flex>
                <v-flex lg4 class="px-4 right-bordered">
                  <v-layout column fill-height>
                    <div v-if="review.research_content" v-on:click.stop>
                      <div>
                        <span>Review to </span>
                        <span class="bold">{{ getResearchContentType(review.research_content.content_type).text }}</span>
                      </div>
                      <router-link
                        tag="div"
                        class="a py-2"
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
                        lg12
                        v-for="item of review.disciplines"
                        :key="`${review.id}- ${item.disciplineName}`"
                        class="rd-review-eci mt-1">
                          <span>{{item.disciplineName}}</span>
                      </v-flex>
                    </v-layout>
                    <div class="grey--text text-xs-right pt-2">
                      <v-icon small>event</v-icon>
                      {{moment(review.created_at).format("D, MMM YYYY")}}
                    </div>
                  </v-layout>
                </v-flex>
                <v-flex lg4>
                  <v-layout column fill-height justify-space-between pl-4>
                    <div>
                      <div class="bold">Assessment</div>
                      <review-assessment v-model="review.ratings" :researchContentType="review.researchContent.content_type"></review-assessment>
                    </div>
                    <div class="pt-2">
                      <v-tooltip tag="div" bottom v-if="review.supporters.length">
                        <v-layout slot="activator" row justify-end align-baseline>
                            <span class="half-bold align-self-center pr-2">{{review.supporters.length}}</span>
                            <v-icon>group_add</v-icon>
                        </v-layout>
                        <div v-if="review.supporters.length">{{review.supporters.length}} experts supported this review</div>
                      </v-tooltip>
                    </div>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-divider v-if="index !== reviews.length - 1" :key="`d_${index}`" class="my-2"></v-divider>
            </div>
          </v-layout>

          <v-layout column class="my-5" v-if="researchReferencesList.length">
            <v-layout row class="pb-4">
              <v-flex grow>
                <v-layout>
                  <div class="pr-3"><v-icon large color="grey lighten-2">mdi-file-document</v-icon></div>
                  <div class="rd-block-header align-self-center">References: {{ researchReferencesList.length }}</div>
                </v-layout>
              </v-flex>
              <v-flex shrink>
              </v-flex>
            </v-layout>
            <div v-for="(ref, i) of researchReferencesList" :key="`ref_${i}`">
              <v-layout class="py-1">
                <v-flex shrink class="pr-3">{{i + 1}}.</v-flex>
                <v-flex grow>
                  <div>{{ref.title}}</div>
                  <div class="grey--text">{{ref.source}}</div>
                </v-flex>
              </v-layout>
            </div>
          </v-layout>
        </v-flex>

        <!-- Right-Hand sidebar -->
        <v-flex lg3>
          <v-layout column class="mt-5 mb-4 mx-4">
            <div class="rd-sidebar-block-title">
              <router-link
                class="research-group-link"
                :to="{ name: 'ResearchGroupDetails', params: {  research_group_permlink: encodeURIComponent(groupLink) } }"
              >{{group.name}}</router-link>
            </div>
            <v-layout
              v-for="(member, i) in researchMembersList"
              :key="member.account.id"
              class="mt-3"
              justify-space-between
              align-center
            >
              <div>
                <platform-avatar
                  :size="40"
                  :key="'member-' + i"
                  :user="member"
                  link-to-profile
                  link-to-profile-class="pl-3"
                ></platform-avatar>
              </div>
              <!-- <div class="grey--text">{{convertToPercent(member.rgt.amount)}}%</div> -->
            </v-layout>
            <div v-if="isJoinRequestSectionAvailable">
              <v-btn
                v-if="canJoinResearchGroup"
                outline
                round
                color="primary"
                class="px-3 ma-0 mt-3"
                @click="onJoinResearchGroupClick()"
              >
                <v-icon small>add</v-icon>
                <span class="pl-2 medium text-none">Join Research group</span>
              </v-btn>
              <v-dialog
                v-if="research"
                v-model="isJoinGroupDialogOpen"
                persistent
                transition="scale-transition"
                max-width="600px"
              >
                <v-card class="pa-4">
                  <v-card-title>
                    <v-layout row align-center align-baseline>
                      <v-flex grow class="headline">Provide a cover letter to your Join Request</v-flex>
                      <v-flex shrink align-self-center right-top-angle>
                        <v-btn @click="isJoinGroupDialogOpen = false" icon class="pa-0 ma-0">
                          <v-icon color="black">close</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-title>

                  <v-card-text>
                    <v-textarea
                      v-model="coverLetter"
                      :rows="2"
                      auto-grow
                      name="Cover letter"
                      label="Cover letter"
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout row wrap>
                      <v-flex xs12 py-2>
                        <v-btn
                          color="primary"
                          :disabled="!coverLetter || isSendingJoinGroupRequest"
                          :loading="isSendingJoinGroupRequest"
                          @click="sendJoinGroupRequest()"
                          block
                        >Send</v-btn>
                      </v-flex>
                      <v-flex xs12 py-2>
                        <v-btn
                          @click="isJoinGroupDialogOpen = false"
                          :disabled="isSendingJoinGroupRequest"
                          color="primary"
                          flat
                          block
                        >Cancel</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div
                v-if="isActiveJoinRequest"
                class="mt-3"
              >You have sent a join request on {{new Date(currentJoinRequest.created).toDateString()}}, please wait for approval</div>
              <div v-if="isActiveInvite" class="mt-3">
                Please accept invite on
                <router-link
                  :to="{ name: 'UserDetails', params: { account_name: user.username}}"
                  style="text-decoration: none"
                >your profile page</router-link>to join the research group
              </div>
            </div>
          </v-layout>
          <v-divider />
          <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title pb-2">Expertise Contribution Index</div>
            <v-layout
              v-for="eci of eciList"
              column
              tag="div"
              :key="eci.disciplineName"
              justify-space-between
              class="expertise px-1 my-1"
            >
              <v-layout justify-space-between>
                  <div class="blue--text text--accent-4 bold">TOP <span class="font-weight-bold">{{getResearchEciPercentile(eci)}}</span>%</div>
                  <div class="grey--text">ECI {{ eci.value }}</div>
              </v-layout>
              <v-divider class="expertise__divider" />
              <div class="expertise__disc-name pt-1">{{ eci.disciplineName }}</div>
            </v-layout>
          </v-layout>
          <!-- <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title pb-2">Score</div>
            <v-tooltip top>
              <div class="mt-2" slot="activator">{{researchScorePercent}}%</div>
              <span class="bold">
                This score is calculated of Expertise<br/>
                contribution index and development stage<br/>
                of the project
              </span>
            </v-tooltip>
            <top-research-label
              v-if="research.isTop"
              :number="100"
              color-class="green--text"
              class="mt-3"
            />
          </v-layout> -->

          <v-divider />
          <v-layout column ma-4>
            <technology-readiness-level isReadOnly :currentTrlStep="researchRef.trl"></technology-readiness-level>
          </v-layout>

          <v-divider v-if="isResearchGroupMember"/>

          <v-layout column ma-4 v-if="isResearchGroupMember">
            <span class="font-weight-bold" v-if="research.is_private"><v-icon class="mr-2" small color="black">lock</v-icon>Private project</span>
            <span class="font-weight-bold" v-else><v-icon class="mr-2" small color="black">mdi-earth</v-icon>Public project</span>
          </v-layout>

          <v-divider />

          <v-layout column ma-4 v-if="researchRef.partners.length">
            <research-partners isReadOnly :partners="researchRef.partners"></research-partners>
          </v-layout>

          <v-divider />

          <v-dialog
            v-if="contentList.length"
            v-model="requestExpertReviewDialog.isShown"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on }">
              <div class="my-4 mx-4">
                <div class="rd-sidebar-block-title">Expert Review</div>
                <v-btn large block color="primary" dark v-on="on" class="mt-3">Request Review</v-btn>
              </div>
            </template>
            <v-card class="pa-4">
              <v-card-title>
                <v-layout align-center>
                  <v-flex grow class="headline">Request review from an Expert</v-flex>
                  <v-flex shrink right-top-angle>
                    <v-btn @click="requestExpertReviewDialog.isShown = false" icon class="pa-0 ma-0">
                      <v-icon color="black">close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-layout column>
                  <v-select
                    class="mt-3"
                    label="Select a content to request review"
                    item-text="title"
                    item-value="id"
                    :disabled="isRequestingReview"
                    :items="contentListToReview"
                    v-model="selectedContentId"
                  />
                  <user-autocomplete-picker
                    label="Find an expert to request a review"
                    :users="experts"
                    :isDisabled="!isSelectedContentId"
                    :displayLimit="6"
                    @onSelectUser="selectExpert"
                  />
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-layout row wrap>
                  <v-flex xs12 py-2>
                    <v-btn
                      @click="requestReview()"
                      :loading="isRequestingReview"
                      :disabled="isRequestingReviewDisabled"
                      block
                      color="primary"
                    >Request</v-btn>
                  </v-flex>
                  <v-flex xs12 py-2>
                    <v-btn
                      @click="requestExpertReviewDialog.isShown = false"
                      color="primary"
                      flat
                      block
                    >Cancel</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- <v-divider /> -->

          <!-- <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title">Tokenization</div>
            <div v-if="isResearchTokenized" class="py-2">10000 research tokens issued</div>
            <v-btn
              v-else-if="isResearchGroupMember"
              class="mx-0 mt-3"
              color="primary"
              large
              :loading="isResearchTokenization"
              @click="onTokenizeResearchClick()"
            >Tokenize research</v-btn>
            <div v-else class="py-2">Research has not been tokenized yet</div>
            <confirm-action-dialog
              :meta="tokenizationConfirmDialog"
              :title="``"
              :text="`This project will be tokenized instantly. This action is irreversible. Continue?`"
              @confirmed="tokenizeResearch($event); tokenizationConfirmDialog.isShown = false;"
              @canceled="tokenizationConfirmDialog.isShown = false"
            ></confirm-action-dialog>
          </v-layout> -->

          <!-- <v-divider /> -->
          <div
            class="rd-sidebar-block-title my-4 px-4"
          >Citations: {{researchReferencesList.length + research.id}}</div>
        </v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
import deipRpc from "@deip/deip-oa-rpc-client";
import * as d3 from "d3";
import { mapGetters } from "vuex";

import bookmarksService from "@/services/http/bookmarks";
import contentHttpService from "@/services/http/content";
import joinRequestsService from "@/services/http/joinRequests";
import reviewRequestsService from "@/services/http/reviewRequests";
import { getResearchContentType } from "@/services/ResearchService";
import { getResearch, updateResearch } from "@/services/ResearchExtendedService";

import moment from "moment";

import ResearchTimeline from './components/ResearchTimeline';

export default {
  name: "ResearchDetails",

  components: {
    ResearchTimeline,
  },

  data() {
    return {
      tokenizationConfirmDialog: { isShown: false, isConfirming: false },
      investmentConfirmDialog: { isShown: false, isConfirming: false },
      requestExpertReviewDialog: { isShown: false },

      groupLink: this.$route.params.research_group_permlink,

      isJoinGroupDialogOpen: false,
      coverLetter: "",
      isSendingJoinGroupRequest: false,

      amountToContribute: "",
      areTokensBuying: false,
      isResearchTokenization: false,

      isDeletingDraft: false,
      isCreatingDraft: false,

      bookmarkId: null,
      isBookmarkActionInProgress: false,

      activeEciChartTabIndex: 0,

      selectedExpert: null,
      selectedContentId: null,

      isRequestingReview: false,

      selectedEciDisciplineId: null,

      eciHistoryRecordsTable: {
        headers: [
          { text: 'Type', align: 'left', sortable: false },
          { text: 'Title', align: 'left', sortable: false },
          { text: 'Date', align: 'center', sortable: false },
          { text: 'Reward ECI', align: 'center', sortable: false },
          { text: 'Total ECI', align: 'center', sortable: false },
        ],
        actionsColorMap: {
          'review': '#161F63',
          'vote_for_review': '#5ABAD1',
          'init': '#8DDAB3',
        },
        pagination: {
          page: 1,
          rowsPerPage: 5,
        },
        items: [],
        totalItems: 0,
        loading: false,
      },
    };
  },

  computed: {
    ...mapGetters({
      contentList: "rd/contentList",
      contentRefsList: "rd/contentRefsList",
      contributionsList: "rd/contributionsList",
      group: "rd/group",
      disciplinesList: "rd/disciplinesList",
      expertsList: "rd/expertsList",
      groupInvitesList: "rd/groupInvitesList",
      researchReferencesList: "rd/researchReferencesList",
      researchMembersList: "rd/researchMembersList",
      researchGroupMembersList: "rd/researchGroupMembersList",
      research: "rd/research",
      researchRef: "rd/researchRef",
      reviewsList: "rd/reviewsList",
      tokenHoldersList: "rd/tokenHoldersList",
      tokenSale: "rd/tokenSale",
      tokenSalesList: "rd/tokenSalesList",
      user: "auth/user",
      userContributionsList: "rd/userContributionsList",
      userJoinRequests: "auth/userJoinRequests",
      eciHistoryByDisciplineMap: "rd/eciHistoryByDisciplineMap"
    }),

    isSelectedContentId(){
      return this.selectedContentId !== null
    },

    contentListToReview() {
      let expert = this.selectedExpert;
      if (!expert) return this.contentList;
      let expertReviews = this.reviewsList.filter(
        r => r.author.account.name == expert.account.name
      );
      return this.contentList.filter(
        content => !expertReviews.some(r => r.research_content_id == content.id)
      );
    },

    isRequestingReviewDisabled() {
      return !this.selectedExpert || this.selectedContentId == null;
    },

    timeline() {
      let milestones = this.researchRef.milestones
      let timeline = milestones.map((milestone, i) => {
        return {
          id: i + 1,
          date: moment
            .utc(milestone.eta)
            .local()
            .format("MMM DD, YYYY"),
          label: milestone.goal,
          description: milestone.details,
          budget: milestone.budget,
          purpose: milestone.purpose
        };
      });
      return timeline;
    },
    averageInvestmentAmount() {
      return this.round2DigitsAfterComma(
        this.investmentsAmount / (this.investors.length || 1)
      );
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
        if (
          this.researchGroupMembersList.some(
            m => m.account.name === this.user.username
          )
        ) {
          return false;
        }
        if (
          this.userJoinRequests.some(
            r => r.groupId === this.research.research_group_id
          )
        ) {
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
        ? (this.currentCap * 100) /
            this.fromAssetsToFloat(this.tokenSale.hard_cap)
        : 0;
    },
    currentJoinRequest() {
      return this.research
        ? this.userJoinRequests.find(
            r => r.groupId == this.research.research_group_id
          )
        : undefined;
    },

    hasEciDisciplineHistoryRecords() {
      let records = this.$store.getters['rd/eciHistoryByDiscipline'](this.selectedEciDisciplineId);
      return records != null && records.length != 0;
    },

    eciDisciplineHistoryRecordsChart() {
      let disciplineId = this.selectedEciDisciplineId;
      let records = this.$store.getters['rd/eciHistoryByDiscipline'](disciplineId);
      if (!records) return null;

      const getPointTooltipHtml = (eci, action, delta) => {
        let assessmentType = delta >= 0 ? "Approved" : "Rejected";
        let assessmentClass = delta >= 0 ? "green--text text--lighten-4" : "red--text text--lighten-4";
        return `
          <div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">${action}</div>
              ${eci != 0 ? `<div class="${assessmentClass} bold">${assessmentType}</div>` : ''} 
              ${delta != 0 ? `<div class="white--text">${delta > 0 ? '+' : '-'} ${delta}</div>` : ''}
          </div>
        `;
      };

      const data = records.map((record, i) => {
        let date = new Date(record.timestamp);
        let value = record.newAmount;
        let delta = record.delta;
        let actionText = record.actionText;
        let tooltip = getPointTooltipHtml(value, actionText, delta);
        return [
          date,
          value,
          tooltip
        ]
      });

      const now = moment().toDate();
      const lastEciValue = records.length ? records[records.length - 1].newAmount : 0;

      return {
        data: [
          [
            "Date",
            "Value",
            { type: "string", role: "tooltip", p: { html: true } }
          ],
          [
            moment(this.research.created_at).toDate(),
            0,
            `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">Project Created</div>
            </div>`
          ],
          ...data,
          [
            now,
            lastEciValue,
            `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">Now</div>
            </div>`
          ]
        ],

        options: {
          title: "",
          backgroundColor: {
            fill: "#ffffff"
          },
          legend: {
            position: "none"
          },
          chartArea: {
            right: 0,
            top: "10%",
            width: "90%"
          },
          tooltip: { isHtml: true },
          explorer: {
            actions: ["dragToZoom", "rightClickToReset"],
            axis: "horizontal",
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        }
      };
    },
    eciList() {
      return this.disciplinesList.map(discipline => {
        const eciObj = this.research.eci_per_discipline.find(
          item => item[0] === discipline.id
        );

        return {
          disciplineName: discipline.name,
          value: eciObj ? eciObj[1] : 0
        };
      });
    },

    experts() {
      const blackList = [
        "regacc",
        "hermes",
        "initdelegate",
        this.user.username,
        ...this.researchGroupMembersList.map(m => m.account.name)
      ];
      const existingReviewsForContent = this.reviewsList.filter(
        r => r.research_content_id === this.selectedContentId
      );
      blackList.push(
        ...existingReviewsForContent.map(r => r.author.account.name)
      );
      return this.expertsList.filter(e => !blackList.includes(e.account.name));
    },
    investmentsAmount() {
      return this.tokenSalesList
        .filter(e => [1, 2].includes(e.status))
        .map(e => this.fromAssetsToFloat(e.total_amount))
        .reduce((acc, curr) => (acc += curr), 0);
    },
    investors() {
      const investorsSet = {};

      [...this.tokenHoldersList, ...this.contributionsList].forEach(e => {
        investorsSet[e.user.account.name] = e.user;
      });

      return Object.values(investorsSet);
    },
    isActiveInvite() {
      return this.groupInvitesList.some(
        invite => invite.account_name == this.user.username
      );
    },
    isActiveJoinRequest() {
      return (
        this.currentJoinRequest && this.currentJoinRequest.status === "pending"
      );
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
      return (
        this.isProfileAvailable &&
        (this.canJoinResearchGroup ||
          this.isActiveJoinRequest ||
          this.isActiveInvite) &&
        !this.group.is_personal
      );
    },
    isMissingTokenSale() {
      return this.tokenSale === undefined;
    },
    isProfileAvailable() {
      return !!this.user.profile;
    },
    isResearchGroupMember() {
      return this.research
        ? this.$store.getters["auth/userIsResearchGroupMember"](
            this.research.research_group_id
          )
        : false;
    },
    // isResearchTokenized() {
    //   return (
    //     this.$options.filters.researchTokenized(this.research.abstract) ||
    //     this.tokenSalesList.length > 0
    //   );
    // },
    isTokenSaleSectionAvailable() {
      // if (!this.isResearchTokenized) return false;

      return (
        (this.isMissingTokenSale &&
          this.isResearchGroupMember &&
          !this.isFinishedResearch) ||
        this.isActiveTokenSale ||
        this.isInactiveTokenSale
      );
    },
    reviews() {
      return this.reviewsList.map(review => {
        const disciplines = [];
        review.disciplines.forEach(discipline => {
          const weight = 0;
          disciplines.push({
            disciplineName: discipline.name
          });
        });

        const _review = {
          ...review,
          content: this.$options.filters.reviewContent(review.content),
          ratings: this.$options.filters.reviewRatings(review.content),
          research_content: this.contentList.find(
            c => c.id === review.research_content_id
          ),
          disciplines
        };
        _review.preview_html = this.extractReviewPreview(_review);
        return _review;
      });
    },
    totalReviewsScore() {
      let totalScore = 0;
      this.reviews.forEach(r => {
        Object.values(r.ratings).forEach(rating => (totalScore += rating));
      });
      return (totalScore / ((this.reviews.length || 1) * 3)).toFixed(1);
    },

    researchPresentationSrc() {
      return this.$options.filters.researchVideoSrc(this.research.abstract);
    },
    researchScorePercent() {
      let eciSum = this.eciList.reduce((acc, curr) => acc + curr.value, 0);
      const eciSign = eciSum >= 0 ? 1 : -1;
      const eciRatio = eciSign * Math.min(+`${eciSum * eciSign}`.substring(0, 2), 50);
      const contentRatio = Math.min(this.contentList.length + 1, 50);
      return Math.max(eciRatio + contentRatio, 0);
    },
    userInvestment() {
      const legitTokenSalesIds = this.tokenSalesList
        .filter(e => [1, 2].includes(e.status))
        .map(e => e.id);
      let amount = 0;
      this.userContributionsList.forEach(c => {
        if (legitTokenSalesIds.includes(c.tokenSaleId)) {
          amount += this.fromAssetsToFloat(c.amount);
        }
      });
      return amount;
    }
  },

  methods: {
    selectExpert(expert) {
      this.selectedExpert = expert;
    },
    onContributeToTokenSaleClick() {
      this.investmentConfirmDialog.isShown = true;
    },
    contributeToTokenSale() {
      this.areTokensBuying = true;
      return deipRpc.broadcast
        .contributeToTokenSaleAsync(
          this.user.privKey,
          this.tokenSale.id,
          this.user.username,
          this.toAssetUnits(this.amountToContribute)
        )
        .then(data => {
          this.$store.dispatch("rd/loadResearchTokenSale", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadResearchTokenSales", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadResearchTokenHolders", {
            researchId: this.research.id
          });
          this.$store.dispatch("rd/loadUserContributions", {
            researchId: this.research.id
          });
          this.$store.dispatch("auth/loadAccount");

          this.areTokensBuying = false;
          this.$refs.amountToContribute.reset();
          this.amountToContribute = "";

          this.$store.dispatch("layout/setSuccess", {
            message: `You have contributed to "${this.research.title}" fundraise successfully !`
          });
        })
        .catch(err => {
          console.log(err);
          this.areTokensBuying = false;
          this.$store.dispatch("layout/setError", {
            message:
              "An error occurred while contributing to fundraise, please try again later"
          });
        });
    },
    countContentReviews(content, isPositive) {
      return content.reviews.reduce(
        (acc, review) =>
          (review.is_positive && isPositive) ||
          (!review.is_positive && !isPositive)
            ? acc + 1
            : acc,
        0
      );
    },
    createContentAuthorsString(authors) {
      return this.researchGroupMembersList
        .filter(m => authors.some(a => a === m.account.name))
        .map(m => this.$options.filters.fullname(m))
        .join("  ·  ");
    },
    createDarDraft() {
      this.isCreatingDraft = true;
      contentHttpService
        .createDarContent(this.research.id)
        .then(res => {
          // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
          // and doesn't persist new changes for several instances during the current session
          window.location.replace(
            `${window.location.href}/!draft?ref=${res.draft._id}`
          );
          location.reload();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isCreatingDraft = false;
        });
    },
    deleteDraft(draft) {
      this.isDeletingDraft = true;
      contentHttpService
        .deleteContentDraft(draft._id)
        .then(() => {
          this.$store.dispatch("rd/loadResearchContentRefs", {
            researchId: draft.researchId
          });
        })
        .finally(() => {
          this.isDeletingDraft = false;
        });
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
      return (
        userProfile.location &&
        (userProfile.location.country || userProfile.location.city)
      );
    },
    extractReviewPreview(review) {
      const temp = document.createElement("span");
      temp.innerHTML = review.content;
      if (temp.children.length) {
        const paragraphs = [...temp.children].filter(
          child => isParagraph(child) && child.innerText
        );
        const paragraphText = paragraphs[0] ? paragraphs[0].innerText : ``;

        return paragraphText.length > 300
          ? `${paragraphText.substring(0, 300)}...`
          : paragraphText;
      }

      function isHeader(el) {
        return ["H1", "H2", "H3", "H4", "H5", "H6"].some(
          h => h === el.nodeName
        );
      }
      function isParagraph(el) {
        return el.nodeName === "P";
      }
    },
    getContentEciList(content) {
      return this.disciplinesList.map(discipline => {
        const eciObj = content.eci_per_discipline.find(
          item => item[0] === discipline.id
        );

        return {
          disciplineName: discipline.name,
          value: eciObj ? eciObj[1] : 0
        };
      });
    },
    goToReviewPage(review) {
      const params = { review_id: review.id };

      deipRpc.api
        .getResearchContentByIdAsync(review.research_content_id)
        .then(content => {
          params.content_permlink = encodeURIComponent(content.permlink);
          return deipRpc.api.getResearchByIdAsync(content.research_id);
        })
        .then(research => {
          params.research_permlink = encodeURIComponent(research.permlink);
          return deipRpc.api.getResearchGroupByIdAsync(
            research.research_group_id
          );
        })
        .then(group => {
          params.research_group_permlink = encodeURIComponent(group.permlink);
          this.$router.push({ name: "ResearchContentReview", params });
        });
    },
    isDraftApproved(draft) {
      return this.contentList.some(
        c => c.content === `${draft.type}:${draft.hash}`
      );
    },
    isDraftInProgress(draft) {
      return draft.status === "in-progress";
    },
    isDraftProposed(draft) {
      return draft.status === "proposed";
    },
    onJoinResearchGroupClick() {
      this.isJoinGroupDialogOpen = true;
      this.coverLetter = "";
    },
    onTokenizeResearchClick() {
      this.tokenizationConfirmDialog.isShown = true;
      this.tokenizationConfirmDialog.isConfirming = false;
    },
    requestReview() {
      this.isRequestingReview = true;
      return reviewRequestsService
        .createReviewRequest({
          contentId: this.selectedContentId,
          expert: this.selectedExpert.account.name
        })
        .then(() => {
          this.$store.dispatch("layout/setSuccess", {
            message: "Request for the review has been sent successfully"
          });
          this.selectedExpert = null;
          this.selectedContentId = null;
        })
        .catch(err => {
          let errMsg =
            "An error occurred while requesting the review. Please try again later";
          if (err.response && err.response.data) {
            errMsg = err.response.data;
          }
          this.$store.dispatch("layout/setError", {
            message: errMsg
          });
        })
        .finally(() => {
          this.isRequestingReview = false;
          this.requestExpertReviewDialog.isShown = false;
        });
    },
    tokenizeResearch() {
      const abstract = JSON.stringify({
        description: this.$options.filters.researchAbstract(
          this.research.abstract
        ),
        milestones: this.researchRef.milestones,
        video_src: this.$options.filters.researchVideoSrc(
          this.research.abstract
        ),
        is_tokenized: true
      });

      this.isResearchTokenization = true;
      deipRpc.broadcast
        .researchUpdateAsync(
          this.user.privKey,
          this.research.id,
          this.research.title,
          abstract,
          this.research.permlink,
          this.user.username
        )
        .then(() => {
          this.$store.dispatch("layout/setSuccess", {
            message: "Research has been tokenized"
          });
        })
        .catch(() => {
          this.$store.dispatch("layout/setError", {
            message:
              "An error occurred while tokenizing research, please try again later"
          });
        })
        .then(() => {
          this.$store.dispatch("rd/loadResearchDetails", {
            group_permlink: this.research.group_permlink,
            research_permlink: this.research.permlink
          });
        })
        .finally(() => {
          this.isResearchTokenization = false;
        });
    },
    openDarDraft(draft) {
      if (draft.type === "dar" && draft.status === "in-progress") {
        // we have to do it this way as Texture InMemory buffer is getting flushed after the first saving
        // and doesn't persist new changes for several instances during the current session
        window.location.replace(
          `${window.location.href}/!draft?ref=${draft._id}`
        );
        location.reload();
      } else {
        const params = {
          group_permlink: this.$route.params.research_group_permlink,
          research_permlink: this.$route.params.research_permlink,
          content_permlink: `!draft`
        };
        const query = { ref: draft._id };
        this.$router.push({ name: "ResearchContentDetails", params, query });
      }
    },
    sendJoinGroupRequest() {
      this.isSendingJoinGroupRequest = true;

      joinRequestsService
        .createJoinRequest({
          username: this.user.username,
          groupId: this.research.research_group_id,
          coverLetter: this.coverLetter
        })
        .then(() => {
          this.$store.dispatch("auth/loadJoinRequests");
          this.$store.dispatch("layout/setSuccess", {
            message: "Join request has been sent successfully!"
          });
        })
        .catch(err => {
          this.$store.dispatch("layout/setError", {
            message:
              "An error occurred while sending join request, please try again later!"
          });
          console.log(err);
        })
        .finally(() => {
          this.isSendingJoinGroupRequest = false;
          this.isJoinGroupDialogOpen = false;
        });
    },

    addToBookmarks() {
      this.isBookmarkActionInProgress = true;
      return bookmarksService
        .createResearchBookmark(this.user.username, this.research.id)
        .then(bookmark => {
          this.$store.dispatch("auth/loadResearchBookmarks");
          this.bookmarkId = bookmark._id;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isBookmarkActionInProgress = false;
        });
    },

    removeFromBookmarks() {
      this.isBookmarkActionInProgress = true;
      return bookmarksService
        .removeResearchBookmark(this.user.username, this.bookmarkId)
        .then(() => {
          this.$store.dispatch("auth/loadResearchBookmarks");
          this.bookmarkId = null;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isBookmarkActionInProgress = false;
        });
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

    newContentUploaded() {
      Promise.all([
        this.$store.dispatch("rd/loadResearchContent", { researchId: this.research.id }),
        this.$store.dispatch("rd/loadResearchContentRefs", { researchId: this.research.id })
      ])
      .then(() => {
        this.eciHistoryRecordsTable.loading = true;
        let disciplineIds = Object.keys(this.eciHistoryByDisciplineMap);
        let promises = [];
        for (let i = 0; i < disciplineIds.length; i++) {
          let disciplineId = disciplineIds[i];
          promises.push(this.$store.dispatch("rd/loadResearchEciHistoryRecords", { researchId: this.research.id, disciplineId }));
        }
        return Promise.all(promises)
      })
      .then(() => {
        let records = this.$store.getters['rd/eciHistoryByDiscipline'](this.selectedEciDisciplineId);
        this.eciHistoryRecordsTable.items = records.reverse();
        this.eciHistoryRecordsTable.pagination.page = 1;
        this.eciHistoryRecordsTable.loading = false;
      })
    },

    selectEciDiscipline() {
      let disciplineId = this.selectedEciDisciplineId;
      let researchId = this.research.id;
      this.eciHistoryRecordsTable.loading = true;
      let cachedRecords = this.$store.getters['rd/eciHistoryByDiscipline'](disciplineId);
      if (cachedRecords == null) {
        this.$store.dispatch('rd/loadResearchEciHistoryRecords', { researchId, disciplineId })
          .then(() => {
            let records = this.$store.getters['rd/eciHistoryByDiscipline'](disciplineId);
            this.eciHistoryRecordsTable.items = records.reverse();
            this.eciHistoryRecordsTable.pagination.page = 1;
            this.eciHistoryRecordsTable.loading = false;
          });
      } else {
        this.eciHistoryRecordsTable.items = cachedRecords.reverse();
        this.eciHistoryRecordsTable.pagination.page = 1;
        this.eciHistoryRecordsTable.loading = false;
      }
    },

    getResearchEciPercentile(eci) {
      return 10;
    },

    getResearchContentType
  },

  created() {
    const bookmark = this.user.researchBookmarks.find(b => b.researchId === this.research.id);
    if (bookmark) {
      this.bookmarkId = bookmark._id;
    }

    let discipline = this.research.disciplines[0];
    this.selectedEciDisciplineId = discipline.id;
    this.selectEciDiscipline(discipline.id);
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
  background-color: #00d57c;
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
  color: #9e9e9e;
}

.rd-cap-progress-bar {
  height: 4px;
  min-width: 250px;
  position: relative;

  .progress-line {
    height: inherit;
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    &:after {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
      content: "";
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
      #ef01e5 0%,
      #8901ef 17.91%,
      #2962ff 43.25%,
      #57d8f5 74.02%,
      #60e5ad 98.85%
    );
    border-radius: 4px;
    z-index: 2;
    &:after {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
      content: "";
      background-color: #60e5ad;
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
    color: #9e9e9e;
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
    color: #9e9e9e;
  }
}

.rd-review-eci {
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #9e9e9e;
}

.rd-sidebar-block-title {
  font-family: Roboto;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
}

.rd-eci-item {
  border: 1px solid #bdbdbd;
  border-radius: 2px;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #828282;
}

.btn {
  &--gradient-pb {
    background: linear-gradient(165.53deg, #8900ef -32.44%, #4efef6 118.73%);
    box-shadow: 1px 2px 6px rgba(68, 85, 129, 0.15);
    border-radius: 2px;

    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
  }
}

.presentation-video {
  width: 390px;
  height: 220px;
  border: 2px solid #fafafa;
}
.right-bordered {
  border-right: 1px solid #e0e0e0;
}

.research-group-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.milestone-description {
  max-height: 500px; 
  overflow-y: auto;
}

.expertise {
  background: #EBF5FE;
  border: 1px solid #8FC3F7;
  box-sizing: border-box;
  border-radius: 2px;
  font-family: Muli;

  &__disc-name {
    font-weight: 600;
  }

  &__divider {
    border-color: #8FC3F7;
  }
}

.eci-up {
  background-color: #b8ddc8;
}

.eci-down {
  background-color: #ffbdbd;
}
.feed-header {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  height: 300px;
  width: 100%;
  font-style: normal;
  color: white;
}

</style>