<script>
  import { VTextField } from 'vuetify/lib/components';
  import { vuetyfyOverride } from '@/components/Deipify/DInput/vuetyfyOverride';

  export default {
    name: 'DInputText',
    mixins: [VTextField, vuetyfyOverride]
  };
</script>
