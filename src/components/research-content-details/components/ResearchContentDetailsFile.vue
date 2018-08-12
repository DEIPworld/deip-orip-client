<template>
    <div fluid fill-height class="pa-0">
        <div class="file-content-container">
            <iframe v-if="content && content.research_id !== undefined && content.content !== undefined" 
                id="file-iframe" frameborder="0" height="100%" width="100%" 
                :src="`${fileStorageBaseUrl}/public/files/research/${content.research_id}/${content.content.slice(5)}`">
            </iframe>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import axios from 'axios'

    export default {
        name: "ResearchContentDetailsFile",
        props: {
        },
        data() { 
            return {
                isLoadingResearchContentPage: false,
                isLoadingResearchContentDetails: false,
                fileStorageBaseUrl: process.env.DEIP_SERVER_URL,
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                content: 'rcd/content',
                research: 'rcd/research'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
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
        margin-bottom: 50px; 
    }
</style>
