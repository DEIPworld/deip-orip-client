<template>
  <v-layout>
    <v-flex class="px-5">
      <v-layout row wrap v-if="isTokenSaleSectionAvailable" class="my-5">
        <v-flex xs12 lg7>
          <v-layout column>
            <v-layout row>
              <v-flex grow>
                <v-layout>
                  <div class="pr-3">
                    <v-icon large color="grey lighten-2">mdi-cash-usd-outline</v-icon>
                  </div>
                  <div class="rd-block-header align-self-center">Fundrising</div>
                </v-layout>
              </v-flex>
              <v-flex shrink></v-flex>
            </v-layout>

            <div v-if="isActiveTokenSale || isInactiveTokenSale">
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">Start:</v-flex>
                <v-flex xs12 lg9 class="pl-2">
                  <span>{{tokenSale.start_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                  <v-chip
                    v-if="hasInactiveTokenSale"
                    class="my-0 mx-2 caption"
                    style="height: 1.4em"
                    color="primary lighten-3"
                  >{{tokenSaleStartLeft}} left
                  </v-chip>
                </v-flex>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">End:</v-flex>
                <v-flex xs12 lg9 class="pl-2">
                  <span>{{tokenSale.end_time | dateFormat('MMM D, YYYY HH:mm', true)}}</span>
                  <v-chip
                    v-if="hasActiveTokenSale"
                    class="my-0 mx-2 caption"
                    style="height: 1.4em"
                    color="amber lighten-1"
                  >{{tokenSaleEndLeft}} left
                  </v-chip>
                </v-flex>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">Tokens On sale:</v-flex>
                <v-flex xs12 lg9 class="pl-2">{{tokenSale.balance_tokens}} ({{convertToPercent(tokenSale.balance_tokens)}}%)
                </v-flex>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">Remaining Tokens:</v-flex>
                <v-flex xs12 lg9 class="pl-2">{{research.owned_tokens}} ({{convertToPercent(research.owned_tokens)}}%)
                </v-flex>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">Min:</v-flex>
                <v-flex xs12 lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.soft_cap)}}</v-flex>
              </v-layout>
              <v-layout row wrap class="pt-3">
                <v-flex xs12 lg3 class="bold">Max:</v-flex>
                <v-flex xs12 lg9 class="pl-2">${{fromAssetsToFloat(tokenSale.hard_cap)}}</v-flex>
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
              >Start fundraise
              </v-btn>
            </div>
          </v-layout>
        </v-flex>

        <v-flex xs12 lg5 v-if="isActiveTokenSale">
          <v-layout justify-end class="rd-cap-value">${{currentCap}}</v-layout>
          <v-layout justify-end align-center class="py-2">
            <div
              class="rd-cap-chip"
              v-if="currentCap >= fromAssetsToFloat(tokenSale.soft_cap)"
            >Min goal reached!
            </div>
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
            >{{fromAssetsToFloat(tokenSale.hard_cap)}}
            </v-flex>
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
              >Invest
              </v-btn>
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
                      <v-btn color="primary" block flat @click="disagreeSaft()">Disagree</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="investors.length || isActiveTokenSale" class="my-5">
        <v-flex xs12>
          <research-details-investors
            :investors="investors"
            :isResearchGroupMember="isResearchGroupMember"
          ></research-details-investors>
        </v-flex>
      </v-layout>

      <v-divider v-if="isTokenSaleSectionAvailable || investors.length"></v-divider>

      <v-layout row wrap v-if="timeline.length" class="my-5">
        <v-flex xs12>
          <v-layout column>
            <v-layout row>
              <v-flex grow>
                <v-layout>
                  <div class="pr-3">
                    <v-icon large color="grey lighten-2">mdi-flag</v-icon>
                  </div>
                  <div class="rd-block-header align-self-center">Project Timeline</div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <research-timeline :timeline="timeline" />
        </v-flex>
      </v-layout>

      <v-layout row wrap class="my-4" v-if="contentList.length">
        <v-flex xs12>
          <research-details-materials :isDetailsAvailable="true" />
        </v-flex>
      </v-layout>

      <v-layout row wrap class="my-4" v-if="isResearchGroupMember && !research.is_finished">
        <v-flex xs12>
          <research-details-draft-list />
        </v-flex>
        <v-flex xs12>
          <v-layout column class="mt-4">
            <div>
              <upload-research-content-file-dialog @onFinish="newContentUploaded" />
            </div>
            <div class="full-width">
              <v-btn
                @click="createDarDraft()"
                :loading="isCreatingDraft"
                :disabled="isCreatingDraft"
                block
                outline
                color="primary"
                dark
              >Use Editor
              </v-btn>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-divider v-if="contentList.length || (isResearchGroupMember && !research.is_finished)" />

      <research-details-eci ref="eci"></research-details-eci>

      <v-divider></v-divider>

      <v-layout wrap row class="my-5" v-if="reviews.length">
        <v-flex xs12>
          <v-layout row class="pb-4">
            <v-flex grow>
              <v-layout>
                <div class="pr-3">
                  <v-icon large color="grey lighten-2">mdi-poll-box</v-icon>
                </div>
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
            </v-flex>-->
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <div v-for="(review, index) of reviews" :key="`r_${review.id}`">
            <research-review-item :review="review" :research="research"></research-review-item>
            <v-divider v-if="index !== reviews.length - 1" :key="`d_${index}`" class="my-2"></v-divider>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { ResearchContentService } from '@deip/research-content-service';
  import ResearchTimeline from './ResearchTimeline';

  const researchContentService = ResearchContentService.getInstance();

  export default {
    name: 'ResearchDetailsBody',

    components: {
      ResearchTimeline
    },

    data() {
      return {
        investmentConfirmDialog: {
          isShown: false,
          isConfirming: false
        },
        amountToContribute: '',
        areTokensBuying: false,
        isCreatingDraft: false,
        
      };
    },

    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        contributionsList: 'rd/contributionsList',
        group: 'rd/group',
        researchReferencesList: 'rd/researchReferencesList',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        reviewsList: 'rd/reviewsList',
        tokenHoldersList: 'rd/tokenHoldersList',
        tokenSale: 'rd/tokenSale',
        tokenSalesList: 'rd/tokenSalesList',
        user: 'auth/user',
        userBalances: 'auth/userBalances',
        userContributionsList: 'rd/userContributionsList',
      }),

      timeline() {
        let milestones = this.researchRef.milestones;
        let timeline = milestones.map((milestone, i) => {
          return {
            id: i + 1,
            date: moment
              .utc(milestone.eta)
              .local()
              .format('MMM DD, YYYY'),
            label: milestone.goal,
            description: milestone.details,
            budget: milestone.budget,
            purpose: milestone.purpose
          };
        });
        return timeline;
      },
      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 1;
      },
      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 4;
      },
      tokenSaleEndLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc()
          .local();
        let end = moment.utc(this.tokenSale.end_time)
          .local();

        let months = Math.floor(moment.duration(end.diff(now))
          .asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(end.diff(now))
          .asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(end.diff(now))
          .asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(end.diff(now))
          .asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(end.diff(now))
          .asSeconds());
        return `${seconds} secs`;
      },
      tokenSaleStartLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc()
          .local();
        let start = moment.utc(this.tokenSale.start_time)
          .local();

        let months = Math.floor(moment.duration(start.diff(now))
          .asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(start.diff(now))
          .asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(start.diff(now))
          .asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(start.diff(now))
          .asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(start.diff(now))
          .asSeconds());
        return `${seconds} secs`;
      },
      isContributionToTokenSaleDisabled() {
        let balance = this.fromAssetsToFloat(this.userBalances[window.env.ASSET_UNIT]);
        let notEnoughFunds = (this.amountToContribute || 0) > balance;
        return notEnoughFunds || !this.amountToContribute || this.areTokensBuying;
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

      investors() {
        return [...this.tokenHoldersList, ...this.contributionsList].reduce((acc, share) => {
          return share.is_compensation ? acc : [...acc, share.user];
        }, []);
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

      isMissingTokenSale() {
        return this.tokenSale === undefined;
      },

      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      },
      isTokenSaleSectionAvailable() {
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

          const model = {
            ...review,
            scores: review.scores.reduce((acc, score) => {
              acc[score[0]] = score[1];
              return acc;
            }, {}),
            researchContent: this.contentList.find(c => c.id === review.research_content_id),
            disciplines
          };
          model.preview_html = this.extractReviewPreview(model);
          return model;
        });
      },
      totalReviewsScore() {
        let totalScore = 0;
        this.reviews.forEach(r => {
          Object.values(r.ratings)
            .forEach(rating => (totalScore += rating));
        });
        return (totalScore / ((this.reviews.length || 1) * 3)).toFixed(1);
      }
    },

    methods: {
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
            this.$store.dispatch('rd/loadResearchTokenSale', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadResearchTokenSales', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadResearchTokenHolders', {
              researchId: this.research.id
            });
            this.$store.dispatch('rd/loadUserContributions', {
              researchId: this.research.id
            });
            this.$store.dispatch('auth/loadAccount');
            this.$store.dispatch('auth/loadBalances');

            this.areTokensBuying = false;
            this.$refs.amountToContribute.reset();
            this.amountToContribute = '';

            this.$store.dispatch('layout/setSuccess', {
              message: `You have contributed to "${this.research.title}" fundraise successfully !`
            });
          })
          .catch(err => {
            console.log(err);
            this.areTokensBuying = false;
            this.$store.dispatch('layout/setError', {
              message:
                'An error occurred while contributing to fundraise, please try again later'
            });
          });
      },
      createDarDraft() {
        this.isCreatingDraft = true;
        researchContentService
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
      extractReviewPreview(review) {
        const temp = document.createElement('span');
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
          return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some(
            h => h === el.nodeName
          );
        }

        function isParagraph(el) {
          return el.nodeName === 'P';
        }
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
          this.$store.dispatch('rd/loadResearchContent', {
            researchId: this.research.id
          }),
          this.$store.dispatch('rd/loadResearchContentRefs', {
            researchId: this.research.id
          })
        ])
          .then(() => {
            this.$refs.eci.reloadDisciplineEciHistory()
          })
      },
    }
  };
</script>

<style lang="less" scoped>
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
      background: linear-gradient(90deg,
      #ef01e5 0%,
      #8901ef 17.91%,
      #2962ff 43.25%,
      #57d8f5 74.02%,
      #60e5ad 98.85%);
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

  .milestone-description {
    max-height: 500px;
    overflow-y: auto;
  }
</style>
