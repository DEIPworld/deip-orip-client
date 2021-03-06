import { componentsRenderer } from '@/mixins/renderer';

import AttributesRead from '@/components/Attributes/AttributesRead';

import { attributesChore } from '@/mixins/chores/attributesChore';
import { attributeFileUrl } from '@/utils/helpers';

import EciStats from '@/components/EciMetrics/EciStats/EciStats';
import FundraisingStats from '@/components/Fundraising/FundraisingWidget/FundraisingStats';

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
import PortalBadge from '@/features/Tenant/components/Badge/TenantBadge';

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
    PortalBadge,

    // Licensing
    ExpressLicensingLicensee,
    ExpressLicensingPurchase,
    ExpressLicensingPurchased
  },
  mixins: [
    componentsRenderer,
    attributesChore,
    projectDetails // TODO: replace 'project' with 'project'
  ],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    hasMaterials() {
      return !!this.project.numberOfProjectContents || this.isMember;
    },

    hasReviews() {
      return !!(this.project.numberOfPositiveReviews + this.project.numberOfNegativeReviews);
    },
  },

  methods: {
    getImageUrl(id) {
      const attr = this.getAttribute(id);
      const attrInfo = this.$$getAttributeInfo(attr.attributeId);
      return attr
        ? attributeFileUrl(
          attrInfo.scope,
          this.project._id,
          attr.attributeId,
          attr.value,
          true
        )
        : false;
    }
  }
};
