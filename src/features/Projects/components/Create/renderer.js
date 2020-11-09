import { componentsRenderer } from '@/mixins/renderer';
import Proxyable from 'vuetify/lib/mixins/proxyable';

import AttributesSet from '@/components/Attributes/AttributesSet';

import ContentsList from '@/components/ContentsList/ContentsList';
import DraftsList from '@/components/DraftsList/DraftsList';
import { tenantAttributesToObject } from '@/utils/helpers';

export default {
  name: 'ProjectEditRenderer',
  components: {
    AttributesSet,

    ContentsList,
    DraftsList
  },
  mixins: [componentsRenderer, Proxyable],
  computed: {
    attributes() {
      return tenantAttributesToObject(this.$tenantSettings.researchAttributes);
    }
  }
};
