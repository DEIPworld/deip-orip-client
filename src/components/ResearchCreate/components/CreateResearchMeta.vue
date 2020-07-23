<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="text-h5 text-center mb-3">
        Add title and description
      </div>

      <div>
        <div>
          <v-text-field
            v-model="title"
            name="title"
            label="Title"
            outlined dense
            :rules="[rules.titleLength]"
            :error-messages="isPermlinkVerifyed === false ? 'Research with the same name already exists' : ''"
            @keyup="setTitle"
          />
        </div>

        <div>
          <v-textarea
            v-model="description"
            name="Description"
            label="Description"
            outlined dense
            :rules="[rules.descriptionLength]"
            @keyup="setDescription"
          />
        </div>

        <div>
          <v-text-field
            v-model="videoSrc"
            prepend-inner-icon="link"
            label="Link to a video presentation"
            outlined dense
            :rules="[rules.link]"
            @keyup="setVideo"
          />
        </div>
      </div>

      <div class="text-center py-4">
        <v-btn text @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>

        <v-btn
          color="primary"
          :disabled="nextDisabled"
          :loading="isLoading"
          @click.native="nextStep()"
        >
          Next
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ResearchService } from '@deip/research-service';
  import { maxTitleLength, maxDescriptionLength } from '@/variables';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'CreateResearchMeta',
    props: {
      research: {
        type: Object,
        required: true
      },
      isLoading: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        title: '',
        description: '',
        videoSrc: '',
        isPermlinkVerifyed: true,
        rules: {
          link: (value) => !value || this.isValidLink || 'Invalid http(s) link',
          titleLength: (value) => value.length <= maxTitleLength || `Title max length is ${maxTitleLength} symbols`,
          descriptionLength: (value) => value.length <= maxDescriptionLength || `Description max length is ${maxDescriptionLength} symbols`
        }
      };
    },
    computed: {
      isValidLink() {
        const regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
        return regexp.test(this.videoSrc || '');
      },
      videoSrcIsValidOrAbsent() {
        return !this.videoSrc || this.isValidLink;
      },
      nextDisabled() {
        return (
          !this.research.title
          || this.research.title.length > maxTitleLength
          || !this.research.description
          || this.research.description.length > maxDescriptionLength
          || !this.videoSrcIsValidOrAbsent
          || this.isLoading
        );
      }
    },
    methods: {
      nextStep() {
        // temporary it is the last step
        // this.$emit('finish');
        researchService.checkResearchExistenceByPermlink(this.research.group.external_id, this.research.title)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            if (this.isPermlinkVerifyed) {
              this.$emit('incStep');
            }
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          });
      },
      prevStep() {
        this.$emit('decStep');
      },
      setTitle() {
        this.$emit('setTitle', this.title);
      },
      setDescription() {
        this.$emit('setDescription', this.description);
      },
      setVideo() {
        this.$emit('setVideo', this.videoSrc);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
