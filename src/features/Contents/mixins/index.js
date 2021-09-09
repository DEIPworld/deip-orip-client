import { ProjectContentService } from '@deip/project-content-service';
import { componentStoreFactory } from '@/mixins/registerStore';
import { contentListStore } from '@/features/Contents/store';
import { mapState } from 'vuex';

const projectContentService = ProjectContentService.getInstance();

export const contentCommon = {
  name: 'contentCommon',

  methods: {
    $$contentType(type) {
      return projectContentService.getProjectContentType(type);
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

export const contentList = {
  name: 'contentList',

  mixins: [
    contentCommon,
    componentStoreFactory(contentListStore),
  ],

  props: {
    projectId: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapState({
      contents(state, getters) { return getters[`${this.storeNS}/contentsList`]; }
    })
  },

  created() {
    this.updateData();
  },

  methods: {
    updateData() {
      this.$setReady(false);

      return Promise.all([
        this.$store.dispatch(`${this.storeNS}/getContents`, {
          projectId: this.projectId
        })
      ])
        .then(() => {
          this.$setReady(true);
        });
    }
  }
};
