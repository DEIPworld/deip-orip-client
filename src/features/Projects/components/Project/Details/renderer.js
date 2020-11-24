import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';

import { researchAttributeFileUrl } from '@/utils/helpers';
import ContentsList from '@/features/Contents/components/List/ContentsList';
import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
import DraftsList from '@/components/DraftsList/DraftsList';

import ReviewsList from '@/features/Reviews/components/List/ReviewsList';

import EciStats from '@/components/EciMetrics/EciStats/EciStats';
import FundraisingStats from '@/components/Fundraising/FundraisingWidget/FundraisingStats';

import ProjectDetailsEditCta from '@/features/Projects/components/Project/Details/ProjectDetailsEditCta';
import ProjectDetailsFollowCta
  from '@/features/Projects/components/Project/Details/ProjectDetailsFollowCta';
import ProjectDetailsContents
  from '@/features/Projects/components/Project/Details/ProjectDetailsContents';
import ProjectDetailsReviews
  from '@/features/Projects/components/Project/Details/ProjectDetailsReviews';

import ExpressLicensingLicensee from '@/components/Licensing/Express/ExpressLicensingLicensee';
import ExpressLicensingPurchase from '@/components/Licensing/Express/ExpressLicensingPurchase';
import ExpressLicensingPurchased from '@/components/Licensing/Express/ExpressLicensingPurchased';
import { ATTR_TYPES } from '@/variables';
import { projectDetails } from '@/features/Projects/mixins/projectDetails';

export default {
  name: 'ProjectDetailsRenderer',
  components: {
    ProjectDetailsEditCta,
    ProjectDetailsFollowCta,
    ProjectDetailsContents,
    ProjectDetailsReviews,

    EciStats,
    AttributesRead,

    FundraisingStats,

    // Licensing
    ExpressLicensingLicensee,
    ExpressLicensingPurchase,
    ExpressLicensingPurchased
  },
  mixins: [
    componentsRenderer,
    projectDetails // TODO: replace 'research' with 'project'
  ],
  props: {
    research: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    hasMaterials() {
      return !!this.research.numberOfResearchContents || this.isMember;
    },

    hasReviews() {
      return !!(this.research.numberOfPositiveReviews + this.research.numberOfNegativeReviews);
    },
  },

  methods: {
    getImageUrl(id) {
      const attr = this.getAttribute(id);

      return attr
        ? researchAttributeFileUrl(
          this.research.externalId,
          attr.researchAttributeId,
          attr.value,
          true
        )
        : false;
    }
  }
};
