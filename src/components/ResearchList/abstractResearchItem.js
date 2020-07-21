import ResearchListCriterias from '@/components/ResearchList/ResearchListItem/ResearchListItemPartials/ResearchListCriterias';
import ResearchListTokenSale from '@/components/ResearchList/ResearchListItem/ResearchListItemPartials/ResearchListTokenSale';
import ResearchListAuthor from '@/components/ResearchList/ResearchListItem/ResearchListItemPartials/ResearchListAuthor';
import ResearchListStatus from '@/components/ResearchList/ResearchListItem/ResearchListItemPartials/ResearchListStatus';
import ResearchListTitle from '@/components/ResearchList/ResearchListItem/ResearchListItemPartials/ResearchListTitle';

import DMetaList from '@/components/Deipify/DMeta/DMetaList';

export const abstractResearchItem = {
  components: {
    ResearchListCriterias,
    ResearchListTokenSale,
    ResearchListTitle,
    ResearchListStatus,
    ResearchListAuthor,
    DMetaList
  },
  props: {
    research: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    reviewsCount() {
      // todo: there is an odd bug in chain api which doubles this numbers
      return this.research.number_of_negative_reviews + this.research.number_of_positive_reviews;
    },
    itemRoute() {
      return {
        name: this.$isUser ? 'ResearchDetails' : 'ResearchDetailsPublic',
        params: {
          research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
          research_permlink: encodeURIComponent(this.research.permlink)
        }
      };
    }
  }
};
