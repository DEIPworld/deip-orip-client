<template>

<div>
    <v-progress-circular v-if="isLoadingResearchContentPage" :size="100" indeterminate color="primary"></v-progress-circular>
    <div v-if="isLoadingResearchContentPage === false">

        <!-- ### START Research Content Details Section ### -->
        <div style="margin-bottom: 50px">
            <v-progress-circular v-if="isLoadingResearchContentPage" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchContentPage === false">
                <div id="deip-texture" ref='deip-texture-container' class="deip-texture"></div>
            </div> 
        </div>
        <!-- ### END Research Content Details Section ### -->
    </div>
</div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import axios from 'axios'
    import DeipTextureReaderApp from './../../../texture/DeipTextureReaderApp'
    import DeipTextureEditorApp from './../../../texture/DeipTextureEditorApp'
    import { getQueryStringParam, substanceGlobals, platform } from 'substance'
    import TextureArticleAPI from '@deip/substance-texture/src/article/TextureArticleAPI'

    import { getAccessToken, getDecodedToken } from './../../../utils/auth'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchContentDetailsDar",
        props: {
            darRef: { type: String },
            isReadOnly: { type: Boolean }
        },
        data() { 
            return {
                fileStorageBaseUrl: process.env.DEIP_SERVER_URL,
                isDarContent: false
            } 
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userGroups: 'auth/userGroups',
                content: 'rcd/content',
                research: 'rcd/research',
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
        },
        mounted () {
            const self = this;
            var research;
            deipRpc.api.getResearchByAbsolutePermlinkAsync(
                    this.$route.params.research_group_permlink, 
                    this.$route.params.research_permlink
                )
                .then((_research) => {
                    research = _research;
                    const promise = self.userGroups && self.userGroups.length 
                        ? Promise.resolve(self.userGroups.map(g => g.id))
                        : deipRpc.api.getResearchGroupTokensByAccountAsync(getDecodedToken().username)
                            .then((rgtList) => {return rgtList.map(rgt => rgt.research_group_id)});
                    return promise;
                })
                .then((groups) => {
                    substanceGlobals.DEBUG_RENDERING = platform.devtools;

                    // const isReadOnly = getQueryStringParam('readOnly') === 'true' || false;
                    const isReadOnly = !groups.some(id => id == research.research_group_id);
                    const archiveId = self.darRef
                    const storageType = 'fs';
                    const storageUrl = `${self.fileStorageBaseUrl}/dar`;

                    const container = this.$refs['deip-texture-container'];
                    const promise = new Promise((resolve, reject) => {
                    const headers = {
                        'Authorization': 'Bearer ' + getAccessToken(),
                        'DarRef': getQueryStringParam('darRef')
                    };
                    const initPromise = { resolve, reject };
                    const params = { archiveId, storageType, storageUrl, initPromise, headers };
                    const texture = self.isReadOnly
                        ? DeipTextureReaderApp.mount(params, container) 
                        : DeipTextureEditorApp.mount(params, container);
                    })

                    return promise;
                })
                .then((texture) => {
                    self.$store.dispatch('rcd/setTexture', { texture });
                    console.log(texture)
                })
        }
    };
</script>

<style lang="less">

    @import (less) '~substance/_variables.css';
   /* @import (less) '~@deip/substance-texture/dist/substance/dist/substance.next.css'; */

    #deip-texture.deip-texture {

        .sc-app {
            height: 100%;
        }

        @import (less) '~@deip/substance-texture/dist/texture.css';
        @import (less) '~@deip/substance-texture/dist/texture-reset.css';
        @import (less) '~@deip/substance-texture/dist/texture-pagestyle.css';
        @import (less) '~@deip/substance-texture/dist/katex/katex.min.css';
        @import (less) '~@deip/substance-texture/dist/font-awesome/css/font-awesome.css';
        @import (less) '~substance/dist/substance.css';
        
        height: 800px;
    }

</style>
