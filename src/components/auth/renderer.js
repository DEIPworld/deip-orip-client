import { componentsRenderer } from '@/mixins/renderer';
import Proxyable from 'vuetify/lib/mixins/proxyable';

import AttributesSet from '@/components/Attributes/AttributesSet';

import ContentsList from '@/features/Contents/components/List/ContentsList';
import DraftsList from '@/components/DraftsList/DraftsList';
import { tenantAttributesToObject } from '@/utils/helpers';
import { attributesChore } from '@/mixins/chores/attributesChore';
import { VFileInput, VChip, VTextField, VCheckbox } from 'vuetify/lib/components';
import { extend, ValidationProvider } from 'vee-validate';
import DInput from '@/components/Deipify/DInput/DInput';
import DInputPassword from '@/components/Deipify/DInput/DInputPassword';
import PrivacyPolicyText from '@/components/auth/components/PrivacyPolicyText';

export default {
  name: 'RegistrationFormRenderer',
  components: {
    AttributesSet,
    VTextField,
    DInput,
    DInputPassword,
    VCheckbox,
    ValidationProvider,
    PrivacyPolicyText,

    ContentsList,
    DraftsList
  },
  mixins: [componentsRenderer, Proxyable, attributesChore],
  computed: {
    attributes() {
      return tenantAttributesToObject(this.$$userAttributes);
    }
  }
};
