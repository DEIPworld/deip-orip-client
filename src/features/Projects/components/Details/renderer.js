import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';

import { researchAttributeFileUrl } from '@/utils/helpers';

import EciStats from '@/components/EciMetrics/EciStats/EciStats';
import  FundraisingStats from '@/components/Fundraising/FundraisingWidget/FundraisingStats';

import ProjectDetailsEditCta from '@/features/Projects/components/Details/ProjectDetailsEditCta';
import ProjectDetailsFollowCta
  from '@/features/Projects/components/Details/ProjectDetailsFollowCta';
import ProjectDetailsContents
  from '@/features/Projects/components/Details/ProjectDetailsContents';
import ProjectDetailsReviews
  from '@/features/Projects/components/Details/ProjectDetailsReviews';
import ProjectDetailsAssets
  from '@/features/Projects/components/Details/ProjectDetailsAssets';

import ExpressLicensingLicensee from '@/components/Licensing/Express/ExpressLicensingLicensee';
import ExpressLicensingPurchase from '@/components/Licensing/Express/ExpressLicensingPurchase';
import ExpressLicensingPurchased from '@/components/Licensing/Express/ExpressLicensingPurchased';
import { projectDetails } from '@/features/Projects/mixins/projectDetails';

export default {
  name: 'ProjectDetailsRenderer',
  components: {
    ProjectDetailsEditCta,
    ProjectDetailsFollowCta,
    ProjectDetailsContents,
    ProjectDetailsReviews,
    ProjectDetailsAssets,

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