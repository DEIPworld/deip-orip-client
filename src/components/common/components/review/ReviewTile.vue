<template>
  <v-card class="pa-6 elevation-0">
    <v-row no-gutters>
      <v-col class="text--center" cols="2">
        <div class="fill-height">
          <div @click="goToReviewerProfilePage($event, reviewModel.author.account.name)">
            <platform-avatar
              :user="review.author"
              :size="90"
            />
            <router-link
              :to="{ name: 'UserDetails', params: { account_name: review.author.account.name } }"
              class="a pa-1"
            >
              {{ review.author | fullname }}
            </router-link>
          </div>

          <v-btn
            color="primary"
            small
            outlined
            @click="goToReviewPage()"
          >
            See Review
          </v-btn>
        </div>
      </v-col>

      <v-col cols="6">
        <div class="pl-6">
          <div>
            <span class="grey--text">{{ reviewModel.created_at | dateFormat('D MMM YYYY', true) }}</span>
          </div>

          <div class="py-2">
            <span v-html="extractPreview(reviewModel)" />
          </div>

          <div>
            <span class="grey--text half-bold pr-2">{{ disciplines.map(d => d.disciplineName).join(", ") }}</span>
          </div>
        </div>
      </v-col>

      <v-col class="px-2" cols="4">
        <div>
          <review-assessment v-model="reviewModel.scores" :research-content-type="researchContentType" />
          <div v-if="reviewModel.votes.length" class="pt-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div class="display-flex" v-on="on">
                  <span class="half-bold align-self-center pr-2">{{ reviewModel.votes.length }}</span>
                  <v-icon>group_add</v-icon>
                </div>
              </template>
              <div>{{ reviewModel.votes.length }} experts supported this review</div>
            </v-tooltip>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ReviewTile',
    props: {
      review: { required: true },
      researchContentType: { required: true }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise'
      }),
      reviewModel() {
        return {
          ...this.review,
          scores: this.review.scores.reduce((acc, score) => {
            acc[score[0]] = score[1];
            return acc;
          }, {})
        };
      },
      disciplines() {
        const out = [];
        const review = this.reviewModel;
        const tvoList = [];

        for (let i = 0; i < review.disciplines.length; i++) {
          const discipline = review.disciplines[i];
          const tvo = {
            disciplineName: discipline.name
          };
          out.push(tvo);
        }
        return out;
      }
    },
    data() {
      return {};
    },

    created() {
    },

    methods: {
      extractPreview() {
        const temp = document.createElement('span');
        temp.innerHTML = this.reviewModel.content;
        if (temp.children.length) {
          const headers = [...temp.children].filter((child) => isHeader(child) && child.innerText);
          const headerText = headers[0]
            ? headers[0].innerText
            : `Reviewed by ${this.$options.filters.fullname(this.reviewModel.author)}`;

          const paragraphs = [...temp.children].filter((child) => isParagraph(child) && child.innerText);
          const paragraphText = paragraphs[0]
            ? paragraphs[0].innerText
            : '';

          const titleText = headerText.length > 100 ? `${headerText.substring(0, 100)}...` : headerText;
          const bodyText = paragraphText.length > 300 ? `${paragraphText.substring(0, 300)}...` : paragraphText;
          return `<div><h3>${titleText}</h3><p>${bodyText}</p></div>`;
        }

        function isHeader(el) {
          return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some((h) => h === el.nodeName);
        }
        function isParagraph(el) {
          return el.nodeName === 'P';
        }
      },

      goToReviewerProfilePage($event, reviewer) {
        $event.preventDefault();
        $event.stopPropagation();
        this.$router.push({ name: 'UserDetails', params: { account_name: reviewer } });
      },

      goToReviewPage() {
        const params = { review_id: this.reviewModel.id };

        deipRpc.api.getResearchContentByIdAsync(this.reviewModel.research_content_id)
          .then((content) => {
            params.content_permlink = encodeURIComponent(content.permlink);
            return deipRpc.api.getResearchByIdAsync(content.research_id);
          })
          .then((research) => {
            params.research_permlink = encodeURIComponent(research.permlink);
            return deipRpc.api.getResearchGroupByIdAsync(research.research_group_id);
          })
          .then((group) => {
            params.research_group_permlink = encodeURIComponent(group.permlink);
            this.$router.push({ name: 'ResearchContentReview', params });
          });
      }
    }
  };
</script>

<style lang="less" scoped>
    .expand-btn {
        right: 24px;
        bottom: 12px;
    }
    .review-container {
        margin-bottom: 5px;
    }
    .review-preview {
        cursor: pointer;
    }
</style>
