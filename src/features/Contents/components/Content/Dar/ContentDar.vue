<template>
  <div
    ref="deip-texture-container"
    v-mutate="changeTextureHeight"
    class="deip-texture"
    :class="[{ 'read-only-texture': readonly }]"
  />
</template>

<script>
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  import DeipTextureReaderApp from '@/editors/DeipTextureReaderApp';
  import DeipTextureEditorApp from '@/editors/DeipTextureEditorApp';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ContentDar',
    props: {
      darId: {
        type: String,
        default: null,
      },
      readonly: {
        type: Boolean,
        default: false
      },
      authors: {
        type: Array,
        default: () => ([])
      }
    },

    data() {
      return {
        texture: null,
        textureContainer: null,
        loading: false,
        fileStorageBaseUrl: this.$env.DEIP_SERVER_URL
      };
    },

    mounted() {
      this.initTexture();
    },

    methods: {
      initTexture() {
        this.loading = true;

        this.textureContainer = this.$refs['deip-texture-container'];

        const archiveId = this.darId;
        const storageType = 'fs';
        const storageUrl = `${this.fileStorageBaseUrl}/content`;

        return new Promise((resolve) => {
          const headers = {
            Authorization: `Bearer ${accessService.getAccessToken()}`,
            DarRef: archiveId
          };

          const editable = !this.readonly;

          const params = {
            archiveId, storageType, storageUrl, headers, editable
          };

          const texture = this.readonly
            ? DeipTextureReaderApp.mount(params, this.textureContainer)
            : DeipTextureEditorApp.mount(params, this.textureContainer);

          texture.on('archive:ready', () => {
            texture.state.archive.on('archive:changed', this.onChange);

            setTimeout(() => {
              // this.setDefaultContentHeight();
            }, 100);
            resolve(texture);
          });
        })
          .then((texture) => {
            this.texture = texture;
            this.loading = false;
          });
      },

      changeTextureHeight() {
        const cntEl = document.querySelector('.se-content');
        const barEl = document.querySelector('.se-toolbar-wrapper');

        const viewPort = window.innerHeight
          - document.querySelector('.v-app-bar').offsetHeight
          - (48 * 2);

        const cntHeight = cntEl ? cntEl.offsetHeight : 0;
        const barHeight = barEl ? barEl.offsetHeight : 0;

        const overallHeight = cntHeight + barHeight;

        const resultHeight = !this.readonly
          ? '100%'
          : overallHeight;

        if (overallHeight) {
          this.textureContainer.style.height = convertToUnit(resultHeight + 2);
        }
      },

      onChange() {
        this.$emit('change', {
          title: this.texture.api.getArticleTitle() || '',
          authors: this.texture.api.getAuthors() || [],
          references: this.texture.api.getReferences() || []
        });
      },

      // ////////////////////////////////////////////////

      addAuthors(authors) {
        for (const author of authors) {
          const alias = author.account.name;

          const surname = author.profile && author.profile.lastName
            ? author.profile.lastName
            : '';

          const givenName = author.profile && author.profile.firstName
            ? author.profile.firstName
            : alias;

          this.texture.api.addAuthor(alias, surname, givenName);
        }
      },

      removeAuthors(authors) {
        const persons = this.texture.api.getAuthors();
        for (const author of authors) {
          this.texture.api
            .removeAuthor(persons.find((person) => author.account.name === person.alias));
        }
      },

      // ////////////////////////////////////////////////

      addReferences(references) {
        for (const reference of references) {
          const uri = `${window.env.DEIP_CLIENT_URL}/#/${encodeURIComponent(reference.group_permlink)}/research/${encodeURIComponent(reference.research_permlink)}/${encodeURIComponent(reference.permlink)}`;
          const title = `${reference.title} (${reference.research_title})`;
          const containerTitle = title;
          this.texture.api.addReference(uri, title, containerTitle);
        }
      },

      removeReferences(references) {
        for (const reference of references) {
          const uri = `${window.env.DEIP_CLIENT_URL}/#/${encodeURIComponent(reference.group_permlink)}/research/${encodeURIComponent(reference.research_permlink)}/${encodeURIComponent(reference.permlink)}`;
          const ref = this.texture.api.getReferences()
            .find((r) => r.uri === uri);
          this.texture.api.removeReference(ref);
        }
      },

      // ////////////////////////////////////////////////

      saveDocument(cb) {
        this.texture.save()
          .then(() => {
            if (typeof cb === 'function') cb();
          });
      }
    }
  };
</script>
