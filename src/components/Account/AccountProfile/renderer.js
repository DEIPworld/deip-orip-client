import { componentsRenderer } from '@/mixins/renderer';
import Proxyable from 'vuetify/lib/mixins/proxyable';

import AttributesSet from '@/components/Attributes/AttributesSet';

import ContentsList from '@/features/Contents/components/List/ContentsList';
import DraftsList from '@/components/DraftsList/DraftsList';
import { portalAttributesToObject } from '@/utils/helpers';
import { attributesChore } from '@/mixins/chores/attributesChore';
import { VFileInput, VChip, VTextField } from 'vuetify/lib/components';
import DInput from '@/components/Deipify/DInput/DInput';


export default {
  name: 'AccountFormRenderer',
  components: {
    AttributesSet,
    VTextField,
    DInput,

    ContentsList,
    DraftsList
  },
  mixins: [componentsRenderer, Proxyable, attributesChore],
  computed: {
    attributes() {
      return portalAttributesToObject(this.$$userAttributes);
    }
  }
};
