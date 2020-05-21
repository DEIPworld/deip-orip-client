<template>
  <div class="full-height">
    <div class="full-height">
      <div
        ref="deip-texture-container"
        class="deip-texture full-height"
        :class="[{ 'read-only-texture': isReadOnly }]"
      />
    </div>

    <!-- <div v-if="isContentExpansionAvailable" class="pa-12">
      <a @click="expandContent()">{{ isContentExpanded ? 'Collapse chapter' : 'Expand chapter'}}</a>
    </div> -->
  </div>
</template>

<script>
  import axios from 'axios';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import DeipTextureReaderApp from '@/editors/DeipTextureReaderApp';
  import DeipTextureEditorApp from '@/editors/DeipTextureEditorApp';
  import { bus } from '@/main';

  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchContentDetailsDar',

    props: {
      contentRef: { type: Object },
      researchGroupMembers: { type: Array }
    },
    data() {
      return {
        texture: null,
        fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
        isReadOnly: undefined,
        isContentExpansionAvailable: undefined,
        isContentExpanded: false,
        contentHeight: window.screen.height
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups'
      })
    },
    mounted() {
      let research;

      deipRpc.api.getResearchByAbsolutePermlinkAsync(decodeURIComponent(this.$route.params.research_group_permlink), decodeURIComponent(this.$route.params.research_permlink))
        .then((_research) => {
          research = _research;
          const promise = this.userGroups && this.userGroups.length
            ? Promise.resolve(this.userGroups.map((g) => g.id))
            : deipRpc.api.getResearchGroupTokensByAccountAsync(accessService.getDecodedToken().username)
              .then((rgtList) => rgtList.map((rgt) => rgt.research_group_id));
          return promise;
        })
        .then((groups) => {
          const isReadOnly = this.$route.query.isReadOnly === 'true'
            || this.contentRef.status != 'in-progress'
            || !groups.some((id) => id == research.research_group_id);

          this.isReadOnly = isReadOnly;

          const archiveId = this.contentRef._id;
          const storageType = 'fs';
          const storageUrl = `${this.fileStorageBaseUrl}/content`;

          const container = this.$refs['deip-texture-container'];
          const promise = new Promise((resolve, reject) => {
            const headers = {
              Authorization: `Bearer ${accessService.getAccessToken()}`,
              DarRef: archiveId
            };

            const editable = !isReadOnly;
            const params = {
              archiveId, storageType, storageUrl, headers, editable
            };
            const texture = isReadOnly
              ? DeipTextureReaderApp.mount(params, container)
              : DeipTextureEditorApp.mount(params, container);

            texture.on('archive:ready', () => {
              texture.state.archive.on('archive:changed', this.setContentHeight);
              setTimeout(() => {
                // this.setDefaultContentHeight();
              }, 100);
              resolve(texture);
            });
          });

          return promise;
        })
        .then((texture) => {
          this.texture = texture;
        });

      bus.$on('texture:getArticleTitle', this.getArticleTitle);
      bus.$on('texture:setAuthors', this.setAuthors);
      bus.$on('texture:addReference', this.addReference);
      bus.$on('texture:removeReference', this.removeReference);
      bus.$on('texture:saveDocument', this.saveDocument);
    },

    beforeDestroy() {
      bus.$off('texture:getArticleTitle', this.getArticleTitle);
      bus.$off('texture:setAuthors', this.setAuthors);
      bus.$off('texture:addReference', this.addReference);
      bus.$off('texture:removeReference', this.removeReference);
      bus.$off('texture:saveDocument', this.saveDocument);
      this.texture.dispose();
    },

    methods: {

      expandContent() {
        this.isContentExpanded = !this.isContentExpanded;
        if (this.isContentExpanded) {
          let height = this.getContentHeight();
          height = height > (window.screen.height * 0.7) ? (height + 100) : (window.screen.height);
          this.contentHeight = height;
        } else {
          this.contentHeight = window.screen.height * 0.7;
        }
      },

      getContentHeight() {
        const contentEl = document.querySelector('.se-content');
        return contentEl && contentEl.offsetHeight ? contentEl.offsetHeight : 0;
      },

      getArticleTitle(cb) {
        const title = this.texture.api.getArticleTitle() || '';
        if (typeof cb === 'function') cb(title);
      },

      setContentHeight() {
        let height = this.getContentHeight();
        const isHigherThanHalfScreen = height > window.screen.height * 0.85;
        height = isHigherThanHalfScreen ? (height + 100) : (window.screen.height);
        this.contentHeight = height;
      },

      setDefaultContentHeight() {
        let height = this.getContentHeight();
        const isHigherThanScreen = height > window.screen.height;
        this.isContentExpansionAvailable = this.isReadOnly && isHigherThanScreen;
        height = this.isReadOnly
          ? (window.screen.height * 0.7)
          : isHigherThanScreen ? (height + 100) : (window.screen.height);
        this.contentHeight = height;
      },

      setAuthors({ authors }) {
        const persons = this.texture.api.getAuthors();
        const deletedAuthors = persons
          .filter((p) => !authors.some((a) => a.account.name == p.alias))
          // filter out authors without DEIP account
          .filter((p) => this.researchGroupMembers.some((m) => m.account.name === p.alias));

        const addedAuthors = authors.filter((a) => !persons.some((p) => a.account.name == p.alias));

        for (let i = 0; i < deletedAuthors.length; i++) {
          const person = deletedAuthors[i];
          this.texture.api.removeAuthor(person);
        }

        for (let i = 0; i < addedAuthors.length; i++) {
          const author = addedAuthors[i];
          const alias = author.account.name;
          const surname = author.profile && author.profile.lastName ? author.profile.lastName : '';
          const givenName = author.profile && author.profile.firstName ? author.profile.firstName : alias;
          this.texture.api.addAuthor(alias, surname, givenName);
        }
      },

      addReference({ reference }) {
        const uri = `${window.env.DEIP_CLIENT_URL}/#/${encodeURIComponent(reference.group_permlink)}/research/${encodeURIComponent(reference.research_permlink)}/${encodeURIComponent(reference.permlink)}`;
        const title = `${reference.title} (${reference.research_title})`;
        const containerTitle = title;
        this.texture.api.addReference(uri, title, containerTitle);
      },

      removeReference({ reference }) {
        const uri = `${window.env.DEIP_CLIENT_URL}/#/${encodeURIComponent(reference.group_permlink)}/research/${encodeURIComponent(reference.research_permlink)}/${encodeURIComponent(reference.permlink)}`;
        const ref = this.texture.api.getReferences().find((r) => r.uri == uri);
        this.texture.api.removeReference(ref);
      },

      saveDocument(cb) {
        this.texture.save()
          .then(() => {
            if (typeof cb === 'function') cb();
          });
      }
    }
  };
</script>

<style lang="less">
  @import './../../../styles/texture';
</style>
