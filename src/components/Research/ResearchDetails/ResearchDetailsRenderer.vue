<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  import { hasValue, researchAttributeFileUrl } from '@/utils/helpers';
  import ContentsList from '@/components/ContentsList/ContentsList';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import DraftsList from '@/components/DraftsList/DraftsList';

  import ReviewsList from '@/components/ReviewsList/ReviewsList';

  import EciStats from '@/components/EciMetrics/EciStats/EciStats';
  import FundraisingStats from '@/components/Fundraising/FundraisingWidget/FundraisingStats';

  import ResearchDetailsEditCta from '@/components/Research/ResearchDetails/_partials/ResearchDetailsEditCta';
  import ResearchDetailsFollowCta from '@/components/Research/ResearchDetails/_partials/ResearchDetailsFollowCta';

  import ExpressLicensingLicensee from '@/components/Licensing/Express/ExpressLicensingLicensee';
  import ExpressLicensingPurchase from '@/components/Licensing/Express/ExpressLicensingPurchase';
  import ExpressLicensingPurchased from '@/components/Licensing/Express/ExpressLicensingPurchased';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      ResearchDetailsFollowCta,
      ResearchDetailsEditCta,
      EciStats,
      AttributesRead,

      ReviewsList,

      ContentUpload,
      ContentsList,
      DraftsList,
      FundraisingStats,

      // Licensing
      ExpressLicensingLicensee,
      ExpressLicensingPurchase,
      ExpressLicensingPurchased
    },
    mixins: [componentsRenderer],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      isMember() {
        return this.research.members.includes(this.$currentUserName);
      },

      limitedAccess() {
        const owners = this.research.researchRef.expressLicenses.map((lic) => lic.owner);
        return ![...this.research.members, ...owners].includes(this.$currentUserName);
      }
    },

    methods: {
      getAttribute(id) {
        const attr = this.research.researchRef.attributes[id];
        if (!attr || !hasValue(attr.value)) return false;
        return attr;
      },

      ifAttribute(id) {
        const attr = this.getAttribute(id);

        return attr ? hasValue(attr.value) : false;
      },

      attributeValue(id) {
        const attr = this.research.researchRef.attributes[id];

        return attr ? attr.value : false;
      },

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
</script>
