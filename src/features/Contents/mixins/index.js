import { ResearchService } from '@deip/research-service';

const researchService = ResearchService.getInstance();

export const contentCommon = {
  name: 'contentCommon',

  methods: {
    $$contentType(type) {
      return researchService.getResearchContentType(type);
    },

    $$hasReviews(content) {
      return content.reviews.length;
    },

    $$hasPositiveReviews(content) {
      return content.reviews.some((r) => r.is_positive);
    },

    $$hasNegativeReviews(content) {
      return content.reviews.some((r) => !r.is_positive);
    },

    $$countReviews(content, isPositive) {
      return content.reviews.reduce(
        (acc, review) => ((review.is_positive && isPositive)
        || (!review.is_positive && !isPositive)
          ? acc + 1
          : acc),
        0
      );
    }
  }
};
