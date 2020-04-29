<template>
  <div v-if="reviews.length">
    <v-row>
      <v-col cols="auto" class="pr-4">
        <v-icon large color="grey lighten-2">
          mdi-poll-box
        </v-icon>
      </v-col>
      <v-col class="rd-block-header align-self-center">
        Reviews
      </v-col>
    </v-row>

    <div v-for="(review, index) of reviews" :key="`r_${review.id}`">
      <research-review-item :review="review" :research="research" />
      <v-divider v-if="index !== reviews.length - 1" :key="`d_${index}`" class="my-2" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchReviewItem from '@/components/research-details/components/ResearchReviewItem';

  export default {
    name: 'ResearchDetailsReviews',
    components: { ResearchReviewItem },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        reviewsList: 'rd/reviewsList',
        contentList: 'rd/contentList',
        research: 'rd/research'
      }),
      reviews() {
        return this.reviewsList.map((review) => {
          const disciplines = [];
          review.disciplines.forEach((discipline) => {
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
            researchContent: this.contentList.find(
              (c) => c.id === review.research_content_id
            ),
            disciplines
          };
          model.preview_html = this.extractReviewPreview(model);
          return model;
        });
      },
      totalReviewsScore() {
        let totalScore = 0;
        this.reviews.forEach((r) => {
          Object.values(r.ratings)
            .forEach((rating) => (totalScore += rating));
        });
        return (totalScore / ((this.reviews.length || 1) * 3)).toFixed(1);
      }
    },
    methods: {
      extractReviewPreview(review) {
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

        function isHeader(el) {
          return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].some(
            (h) => h === el.nodeName
          );
        }

        function isParagraph(el) {
          return el.nodeName === 'P';
        }
      }
    }
  };
</script>

<style scoped>
  .rd-block-header {
    font-family: Muli;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 0.25px;
    color: black;
  }
</style>
