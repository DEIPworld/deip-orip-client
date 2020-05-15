<template>
  <layout-section>
    <research-edit-body />
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import moment from 'moment';
  import ResearchEditBody from '@/components/research-edit/components/ResearchEditBody';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchEdit',
    components: { LayoutSection, ResearchEditBody },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
      };
    },

    created() {
    },

    methods: {
    }
  };
</script>

<style lang="less" scoped>

</style>
