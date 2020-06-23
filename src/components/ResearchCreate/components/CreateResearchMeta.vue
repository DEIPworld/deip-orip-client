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
            filled
            @keyup="setTitle"
          />
        </div>

        <div>
          <v-textarea
            v-model="description"
            name="Description"
            label="Description"
            filled
            @keyup="setDescription"
          />
        </div>

        <div>
          <v-text-field
            v-model="videoSrc"
            prepend-inner-icon="link"
            label="Link to a video presentation"
            filled
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
        rules: {
          link: (value) => !value || this.isValidLink || 'Invalid http(s) link'
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
          || !this.research.description
          || !this.videoSrcIsValidOrAbsent
          || this.isLoading
        );
      }
    },
    methods: {
      nextStep() {
        // temporary it is the last step
        // this.$emit('finish');
        this.$emit('incStep');
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
