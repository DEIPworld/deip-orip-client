<template>
  <div fluid fill-height class="pa-0">
    <div class="file-content-container">
      <iframe
        v-if="applicationRef"
        id="file-iframe"
        frameborder="0"
        height="100%"
        width="100%"
        :src="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.hash}`"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import axios from 'axios';

  export default {
    name: 'ResearchApplicationDetailsFile',
    props: {
    },
    data() {
      return {
        fileStorageBaseUrl: window.env.DEIP_SERVER_URL
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        application: 'rad/application',
        research: 'rad/research',
        applicationRef: 'rad/applicationRef'
      }),
      isResearchGroupMember() {
        return this.research != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id)
          : false;
      }
    }
  };
</script>

<style lang="less" scoped>
	#file-iframe {
			min-height: 800px;
	}
	.file-content-container {
			text-align: center;
	}
</style>
