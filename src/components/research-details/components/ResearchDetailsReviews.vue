<template>
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
                  <div class="font-weight-medium subheading">
                    Total reviews score:
                    <span class="font-weight-bold">{{totalReviewsScore}}</span>
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ResearchDetailsReviews",

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      reviewsList: "rd/reviewsList",
      contentList: "rd/contentList",
      research: "rd/research"
    }),
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
          researchContent: this.contentList.find(
            c => c.id === review.research_content_id
          ),
          disciplines
        };
        model.preview_html = this.extractReviewPreview(model);
        return model;
      });
    },
    totalReviewsScore() {
      let totalScore = 0;
      this.reviews.forEach(r => {
        Object.values(r.ratings).forEach(rating => (totalScore += rating));
      });
      return (totalScore / ((this.reviews.length || 1) * 3)).toFixed(1);
    }
  },
  methods: {
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