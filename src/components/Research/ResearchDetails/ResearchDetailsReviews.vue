<template>
  <d-block v-if="internalReviews.length" title="Reviews">
    <template v-for="(review, index) of internalReviews">
      <v-row :key="`review-${index}`" class="text-body-2">
        <v-col cols="12" md="wide">
          <v-row>
            <v-col cols="auto">
              <platform-avatar :user="review.author" :size="80" />
            </v-col>
            <v-col>
              <router-link
                class="a"
                :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}"
              >
                {{ review.author | fullname }}
              </router-link>
              <div v-if="review.author.profile" class="pt-1 text--secondary">
                <span>{{ review.author | employmentOrEducation }}</span>
                <span
                  v-if="doesUserHaveLocation(review.author.profile)"
                >, {{ review.author | userLocation }}</span>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-divider vertical class="mx-3" />

        <v-col cols="12" md="wide">
          <div v-if="review.researchContent" @click.stop>
            <div>
              Review to
              <span class="font-weight-medium">
                {{ getResearchContentType(review.researchContent.content_type).text }}
              </span>
            </div>
            <router-link
              class="a py-2"
              tag="div"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(research.research_group.permlink),
                  research_permlink: encodeURIComponent(research.permlink),
                  content_permlink: encodeURIComponent(review.researchContent.permlink)
                }
              }"
            >
              {{ review.researchContent.title }}
            </router-link>
          </div>
          <v-row>
            <v-col
              cols="12"
              lg="12"
              class="rd-review-eci mt-1"
            >
              <span
                v-for="(item, i) of review.disciplines"
                :key="`${review.id}- ${item.disciplineName}`"
              >
                {{ `${item.disciplineName}${review.disciplines.length - 1 !== i ? ', ' : ''}` }}
              </span>
            </v-col>
          </v-row>
          <div class="grey--text text--right pt-2">
            <v-icon small>
              event
            </v-icon>
            {{ moment(review.created_at).format('D, MMM YYYY') }}
          </div>
        </v-col>

        <v-divider vertical class="mx-3" />

        <v-col cols="12" md="wide">

          <div class="text-h6">
            Assessment
          </div>

          <review-assessment
            v-model="review.scores"
            :research-content-type="review.researchContent.content_type"
          />

          <div class="pt-2">
            <v-tooltip v-if="review.supporters.length" tag="div" bottom>
              <template v-slot:activator="{ on }">
                <div class="d-flex justify-end" v-on="on">
                  <span class="half-bold align-self-center pr-2">{{ review.supporters.length }}</span>
                  <v-icon>group_add</v-icon>
                </div>
              </template>

              <div
                v-if="review.supporters.length"
              >
                {{ review.supporters.length }} experts supported this review
              </div>
            </v-tooltip>
          </div>
          <div class="text-right">
            <v-btn
              small
              color="primary"
              outlined
              @click="goToReviewPage(review)"
            >
              See review
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-divider v-if="index !== reviews.length - 1" :key="`review-d-${index}`" />
    </template>
  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { ResearchService } from '@deip/research-service';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchDetailsReviewsTemp',
    components: { DBlock },
    computed: {
      ...mapGetters({
        research: 'research/data',
        contents: 'research/contents',
        reviews: 'research/reviews',
      }),

      internalReviews() {
        return this.reviews.map((review) => {
          const disciplines = [];
          review.disciplines.forEach((discipline) => {
            // const weight = 0;
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
            researchContent: this.internalContents.find(
              (c) => c.id === review.research_content_id
            ),
            disciplines
          };
          model.preview_html = this.extractReviewPreview(model);

          return model;
        });
      },

      internalContents() {
        return this.$where(this.contents, { isDraft: false })
      }
    },
    methods: {
      doesUserHaveLocation(userProfile) {
        return (
          userProfile.location
          && (userProfile.location.country || userProfile.location.city)
        );
      },
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      },

      goToReviewPage(review) {
        const params = { review_id: review.id };

        deipRpc.api
          .getResearchContentByIdAsync(review.research_content_id)
          .then((content) => {
            params.content_permlink = encodeURIComponent(content.permlink);
            return deipRpc.api.getResearchByIdAsync(content.research_id);
          })
          .then((research) => {
            params.research_permlink = encodeURIComponent(research.permlink);
            return deipRpc.api.getResearchGroupByIdAsync(
              research.research_group_id
            );
          })
          .then((group) => {
            params.research_group_permlink = encodeURIComponent(group.permlink);
            this.$router.push({
              name: 'ResearchContentReview',
              params
            });
          });
      },

      extractReviewPreview(review) {

        function isHeader(el) {
          return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some(
            (h) => h === el.nodeName
          );
        }

        function isParagraph(el) {
          return el.nodeName === 'P';
        }

        const temp = document.createElement('span');
        temp.innerHTML = review.content;

        if (temp.children.length) {
          const paragraphs = [...temp.children].filter(
            (child) => isParagraph(child) && child.innerText
          );
          const paragraphText = paragraphs[0] ? paragraphs[0].innerText : '';

          return paragraphText.length > 300
            ? `${paragraphText.substring(0, 300)}...`
            : paragraphText;
        }

        return '';
      }
    }
  };
</script>
