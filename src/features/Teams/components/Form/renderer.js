import { componentsRenderer } from '@/mixins/renderer';
import Proxyable from 'vuetify/lib/mixins/proxyable';

import AttributesSet from '@/components/Attributes/AttributesSet';

import UserSelector from '@/features/Users/components/Selector/UserSelector';
import { tenantAttributesToObject } from '@/utils/helpers';
import { attributesChore } from '@/mixins/chores/attributesChore';

export default {
  name: 'TeamFormRenderer',
  components: {
    AttributesSet,

    UserSelector
  },
  mixins: [componentsRenderer, Proxyable, attributesChore],
  computed: {
    attributes() {
      return tenantAttributesToObject(this.$$teamAttributes);
    }
  }
};
