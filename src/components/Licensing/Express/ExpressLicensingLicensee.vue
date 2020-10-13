<template>
  <div>w</div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { expressLicensingStore } from '@/components/Licensing/Express/store';

  export default {
    name: 'ExpressLicensingLicensee',
    mixins: [
      componentStoreFactory(expressLicensingStore)
    ],
    props: {
      projectId: {
        type: String,
        default: null
      }
    }
  };
</script>
