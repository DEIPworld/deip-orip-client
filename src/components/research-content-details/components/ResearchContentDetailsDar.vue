<template>
<div>
  <v-progress-circular v-if="isLoadingResearchContentPage" :size="100" indeterminate color="primary"></v-progress-circular>
  <div v-if="isLoadingResearchContentPage === false">
    <div>
      <div>
        <div ref='deip-texture-container' class="deip-texture" 
          :class="[{ 'read-only-texture': isReadOnly }]"
          :style="{ height: contentHeight + 'px' }">
        </div>
      </div>
      <div v-if="isContentExpansionAvailable" class="c-m-5 right">
        <a @click="expandContent()">{{ isContentExpanded ? 'Collapse chapter' : 'Expand chapter'}}</a>
      </div>
    </div>
  </div>
</div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import axios from 'axios'
    import DeipTextureReaderApp from './../../../editors/DeipTextureReaderApp'
    import DeipTextureEditorApp from './../../../editors/DeipTextureEditorApp'
    import { getAccessToken, getDecodedToken } from './../../../utils/auth'
    import deipRpc from '@deip/deip-rpc-client'

    export default {
        name: "ResearchContentDetailsDar",
        props: {
            contentRef: { type: Object }
        },
        data() { 
            return {
                fileStorageBaseUrl: process.env.DEIP_SERVER_URL,
                isReadOnly: undefined,
                isContentExpansionAvailable: undefined,
                isContentExpanded: false,
                contentHeight: window.screen.height * 0.7
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
        methods: {
            expandContent() {
                this.isContentExpanded = !this.isContentExpanded;
                if (this.isContentExpanded) {
                    let height = this.getContentHeight();
                    height = height > (window.screen.height * 0.7) ? (height + 100) : (window.screen.height * 0.7);
                    this.contentHeight = height;
                } else {
                    this.contentHeight = window.screen.height * 0.7;
                }
            },
            getContentHeight() {
                const contentEl = document.querySelector('.se-content');
                return contentEl && contentEl.offsetHeight ? contentEl.offsetHeight : 0;
            },
            setContentHeight() {
                let height = this.getContentHeight();
                let isHigherThanHalfScreen = height > window.screen.height * 0.5;
                height = isHigherThanHalfScreen ? (height + 100) : (window.screen.height * 0.7);
                this.contentHeight = height;
            },
            setDefaultContentHeight() {
                let height = this.getContentHeight();
                let isHigherThanScreen = height > window.screen.height;
                this.isContentExpansionAvailable = this.isReadOnly && isHigherThanScreen;
                height = this.isReadOnly 
                    ? (window.screen.height * 0.7)
                    : isHigherThanScreen ? (height + 100) : (window.screen.height * 0.7);
                this.contentHeight = height;
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
                    const isReadOnly = 
                        this.$route.query.isReadOnly === 'true'
                        || this.contentRef.status != "in-progress"
                        || !groups.some(id => id == research.research_group_id);

                    self.isReadOnly = isReadOnly;

                    const archiveId = self.contentRef._id;
                    const storageType = 'fs';
                    const storageUrl = `${self.fileStorageBaseUrl}/content`;

                    const container = this.$refs['deip-texture-container'];
                    const promise = new Promise((resolve, reject) => {
                        const headers = {
                            'Authorization': 'Bearer ' + getAccessToken(),
                            'DarRef': archiveId
                        };

                        const viewName = isReadOnly ? 'reader' : 'manuscript';
                        const params = { archiveId, storageType, storageUrl, headers, viewName };
                        const texture = isReadOnly
                            ? DeipTextureReaderApp.mount(params, container) 
                            : DeipTextureEditorApp.mount(params, container);
                        
                        texture.on('archive:ready', () => {
                            texture.state.archive.on('archive:changed', self.setContentHeight);
                            setTimeout(() => {
                                self.setDefaultContentHeight();
                            }, 100)
                            resolve(texture);
                        });
                    })

                    return promise;
                })
                .then((texture) => {
                    self.$store.dispatch('rcd/setTexture', { texture });
                })
        }
    };
</script>

<style lang="less">
    @import './../../../styles/texture';
</style>
