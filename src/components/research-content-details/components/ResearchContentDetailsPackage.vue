<template>
  <div>
    <div class="text-caption text--secondary text-truncate">
      {{ contentRef.hash }}
    </div>
    <v-card v-for="file in contentRef.packageFiles" :key="file.hash">
      <v-card-text>
        <v-row>
          <v-col cols="10">
            <a
              v-if="isPreviewAvailable(file.ext)"
              target="_blank"
              class="a"
              :href="getContentUrl(file.hash)"
            >
              <v-clamp autoresize :max-lines="1">
                {{ file.filename }}
              </v-clamp>
            </a>
            <span v-else class="text-body-2">
                    {{ file.filename }}
                  </span>
          </v-col>
          <v-col class="text-align-right">
                  <span>
                    <a class="a download-content" :href="getContentUrl(file.hash, true)">
                      <v-icon small>save</v-icon>
                    </a>
                  </span>
            <span class="text-body-2 grey--text ml-2">{{ file.hash.slice(0, 8) }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchContentDetailsPackage',

    data() {
      return {};
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        contentRef: 'rcd/contentRef'
      })
    },

    methods: {
      isPreviewAvailable(ext) {
        return ['.png', '.jpg', '.jpeg', '.pdf'].some((e) => e === ext);
      },
      getContentUrl(fileHash, download = false) {
        return `${window.env.DEIP_SERVER_URL}/content/refs/research/package/${this.contentRef.researchExternalId}/${this.contentRef.hash}/${fileHash}?download=${download}&authorization=${accessService.getAccessToken()}`;
      }
    }
  };
</script>

<style lang="less" scoped>

  .download-content {
    text-decoration: none;
  }

  .download-content i:hover {
    color: #2962FF;
  }

</style>
