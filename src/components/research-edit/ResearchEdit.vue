<template>
  <full-screen-view title="Edit project">
    <research-edit-body />
  </full-screen-view>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ResearchEditBody from '@/components/research-edit/components/ResearchEditBody';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  export default {
    name: 'ResearchEdit',
    components: { FullScreenView, ResearchEditBody },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    }
  };
</script>

<style lang="less" scoped>

</style>
